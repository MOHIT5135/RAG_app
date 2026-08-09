/**
 * ============================================================
 * RAGify AI — Evaluation Harness
 * ============================================================
 * Runs a fixed battery of test queries against the live /api/chat
 * endpoint and checks the response against explicit assertions,
 * instead of relying on manual inspection every time something changes.
 *
 * Usage:
 *   npm run eval
 *
 * Requires:
 *   - Backend server running (default: http://localhost:8080)
 *   - A valid test user (set TEST_EMAIL / TEST_PASSWORD below or via env vars)
 *   - "Web Development (IT report) .docx" already uploaded for that user
 *     (the script resolves its docId automatically by name — no need to
 *     hardcode a docId that changes every re-upload)
 * ============================================================
 */

const BASE_URL = process.env.EVAL_BASE_URL || "http://localhost:8080/api";
const TEST_EMAIL = process.env.TEST_EMAIL || "mohitkumar87975@gmail.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "51350000";
const TARGET_DOC_NAME = process.env.TARGET_DOC_NAME || "Web Development (IT report) .docx";

// ---------- tiny console color helpers ----------
const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

// ---------- test cases, validated manual test suite ----------
const TEST_CASES = [
  {
    id: 1,
    category: "Narrow factual",
    query: "Who created Node.js and what year was it introduced?",
    expect: {
      mustContainAny: ["Ryan Dahl", "2009"],
      expectUnresolved: false,
      minSources: 1,
    },
  },
  {
    id: 2,
    category: "Broad / summary",
    query: "Give me a full breakdown of everything this report covers.",
    expect: {
      mustContainAny: ["MongoDB", "Express", "React", "Node"],
      expectUnresolved: false,
      minSources: 5, // should pull broad coverage, not just 1-2 chunks
    },
  },
  {
    id: 3,
    category: "False premise (technical)",
    query: "Why does the report recommend Angular over React for building the frontend of a MERN application?",
    expect: {
      mustContainAny: ["no mention", "does not", "doesn't", "not contain", "Unresolved"],
      mustNotContainAny: ["recommends Angular", "Angular is recommended"],
      expectUnresolved: true,
    },
  },
  {
    id: 4,
    category: "Comparison / table",
    query: "Make a table comparing pre-Node.js backend languages (PHP, Java, Ruby, Python) against Node.js across performance model and concurrency handling.",
    expect: {
      mustContainAny: ["|"], // crude but effective: Markdown table syntax
      mustContainAny2: ["PHP", "Java", "Ruby", "Python"],
      expectUnresolved: false,
      minSources: 1,
    },
  },
  {
    id: 5,
    category: "Extraction (terse)",
    query: "What is BSON and how is it different from JSON?",
    expect: {
      mustContainAny: ["Binary JSON", "BSON"],
      expectUnresolved: false,
      minSources: 1,
      maxWords: 150, // extraction answers should stay short, not sprawl into full sections
    },
  },
  {
    id: 6,
    category: "Emotional + factual",
    query: "I'm honestly overwhelmed trying to learn backend dev — can you explain simply why Express.js even matters in this stack?",
    expect: {
      mustContainAny: ["Express"],
      expectUnresolved: false,
      minSources: 1,
    },
  },
  {
    id: 7,
    category: "Numeric / enumeration",
    query: "How many advantages of unifying the stack under JavaScript does the report list, and what are they?",
    expect: {
      mustContainAny: ["four", "4"],
      mustContainAny2: ["Developer Efficiency", "Code Reuse", "Ecosystem", "Recruitment"],
      expectUnresolved: false,
    },
  },
  {
    id: 8,
    category: "Off-topic (should refuse)",
    query: "What does the report say about mobile app development using React Native?",
    expect: {
      mustContainAny: ["no mention", "does not", "doesn't", "not contain", "Unresolved", "couldn't find"],
      mustNotContainAny: ["React Native is discussed", "the report recommends React Native"],
      expectUnresolved: true,
    },
  },
  {
    id: 9,
    category: "Analogy / conceptual",
    query: "The report uses an analogy comparing SQL and MongoDB structure — what is it?",
    expect: {
      mustContainAny: ["Table", "Collection", "Database"],
      expectUnresolved: false,
      minSources: 1,
    },
  },
  {
    id: 10,
    category: "Standard Concept Verification",
    query: "Does the document mention MongoDB?",
    // Removed documentId: null to comply with new backend validation rules
    expect: {
      mustContainAny: ["MongoDB"],
      expectUnresolved: false,
    },
  },
];

// ---------- helpers ----------

const extractCookie = (setCookieHeader) => {
  if (!setCookieHeader) return null;
  const raw = Array.isArray(setCookieHeader) ? setCookieHeader.join("; ") : setCookieHeader;
  return raw.split(";")[0]; // "token=xyz"
};

const login = async () => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  }

  const cookie = extractCookie(res.headers.get("set-cookie"));
  if (!cookie) throw new Error("Login succeeded but no session cookie was returned.");
  return cookie;
};

const resolveDocId = async (cookie, fileName) => {
  const res = await fetch(`${BASE_URL}/documents`, {
    headers: { Cookie: cookie },
  });
  const data = await res.json();
  const match = data.documents?.find((d) => d.fileName === fileName);
  if (!match) {
    throw new Error(
      `Could not find a document named "${fileName}" for this user. Upload it first, or set TARGET_DOC_NAME.`
    );
  }
  return { docId: match.docId, totalChunks: match.totalChunks };
};

// UPDATED: Now parses Server-Sent Events (SSE) instead of raw JSON
const askQuestion = async (cookie, query, documentId, totalChunks) => {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ query, documentId: documentId ? [documentId] : [], totalChunks }),
  });

  if (!res.ok) {
    let errorMsg = `Request failed: ${res.status}`;
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch(e) {}
    throw new Error(errorMsg);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let isDone = false;
  let fullAnswer = "";
  let metadata = {};

  while (!isDone) {
    const { value, done } = await reader.read();
    isDone = done;

    if (value) {
      const chunkString = decoder.decode(value, { stream: true });
      const events = chunkString.split("\n\n");
      
      for (const event of events) {
        if (event.startsWith("data: ")) {
          try {
            const parsed = JSON.parse(event.replace("data: ", ""));
            
            if (parsed.type === "token") {
              fullAnswer += parsed.token;
            } else if (parsed.type === "done") {
              metadata = parsed;
            } else if (parsed.type === "error") {
              throw new Error(parsed.message);
            }
          } catch (err) {
            // Ignore partial chunks over the network stream
          }
        }
      }
    }
  }

  return {
    answer: metadata.answer || fullAnswer,
    sources: metadata.sources || [],
  };
};

const wordCount = (text) => (text || "").trim().split(/\s+/).length;

const containsAny = (text, terms) =>
  terms.some((t) => text.toLowerCase().includes(t.toLowerCase()));

// ---------- assertion engine ----------

const evaluate = (testCase, response) => {
  const failures = [];
  const answer = response.answer || "";
  const sources = response.sources || [];

  const e = testCase.expect;

  if (e.mustContainAny && !containsAny(answer, e.mustContainAny)) {
    failures.push(`Expected answer to contain one of: ${e.mustContainAny.join(", ")}`);
  }

  if (e.mustContainAny2 && !containsAny(answer, e.mustContainAny2)) {
    failures.push(`Expected answer to also contain one of: ${e.mustContainAny2.join(", ")}`);
  }

  if (e.mustNotContainAny && containsAny(answer, e.mustNotContainAny)) {
    failures.push(`Answer incorrectly contains a phrase suggesting the false premise was accepted.`);
  }

  if (typeof e.minSources === "number" && sources.length < e.minSources) {
    failures.push(`Expected at least ${e.minSources} sources, got ${sources.length}`);
  }

  if (typeof e.maxWords === "number" && wordCount(answer) > e.maxWords) {
    failures.push(`Expected a terse answer (<=${e.maxWords} words), got ${wordCount(answer)} words`);
  }

  if (e.expectUnresolved === true) {
    const looksUnresolved =
      answer.toLowerCase().includes("unresolved") ||
      answer.toLowerCase().includes("couldn't find") ||
      answer.toLowerCase().includes("no mention") ||
      answer.toLowerCase().includes("does not contain");
    if (!looksUnresolved) {
      failures.push(`Expected the answer to acknowledge missing/unsupported information, but it didn't.`);
    }
  }

  return failures;
};

// ---------- runner ----------

const run = async () => {
  console.log(c.bold("\n=== RAGify AI Evaluation Harness ===\n"));

  let cookie, docId, totalChunks;

  try {
    console.log(c.dim("Logging in..."));
    cookie = await login();

    console.log(c.dim(`Resolving docId for "${TARGET_DOC_NAME}"...`));
    ({ docId, totalChunks } = await resolveDocId(cookie, TARGET_DOC_NAME));
    console.log(c.dim(`Found docId: ${docId} (${totalChunks} chunks)\n`));
  } catch (err) {
    console.error(c.red(`Setup failed: ${err.message}`));
    process.exit(1);
  }

  const results = [];

  for (const testCase of TEST_CASES) {
    const documentId = testCase.documentId === null ? null : docId;
    const label = `#${testCase.id} [${testCase.category}]`;

    process.stdout.write(`${label} ... `);

    try {
      const start = Date.now();
      const response = await askQuestion(cookie, testCase.query, documentId, totalChunks);
      const elapsedMs = Date.now() - start;

      const failures = evaluate(testCase, response);
      const passed = failures.length === 0;

      results.push({ id: testCase.id, category: testCase.category, passed, elapsedMs, failures });

      if (passed) {
        console.log(c.green(`PASS`) + c.dim(`  (${elapsedMs}ms, ${response.sources?.length ?? 0} sources)`));
      } else {
        console.log(c.red(`FAIL`) + c.dim(`  (${elapsedMs}ms)`));
        failures.forEach((f) => console.log(c.red(`    - ${f}`)));
      }
    } catch (err) {
      results.push({ id: testCase.id, category: testCase.category, passed: false, error: err.message });
      console.log(c.red(`ERROR`) + c.dim(`  ${err.message}`));
    }
  }

  // ---------- summary ----------
  const passCount = results.filter((r) => r.passed).length;
  const total = results.length;

  console.log(c.bold(`\n=== Summary: ${passCount}/${total} passed ===\n`));

  console.table(
    results.map((r) => ({
      "#": r.id,
      Category: r.category,
      Result: r.passed ? "PASS" : "FAIL",
      "Time (ms)": r.elapsedMs ?? "-",
    }))
  );

  process.exit(passCount === total ? 0 : 1);
};

run();
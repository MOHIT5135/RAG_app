export const uploadConfig = {
  acceptedFileTypes: [
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".ppt",
    ".pptx",
  ],

  acceptedMimeTypes: [
    "application/pdf",

    "application/msword",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "text/plain",

    "application/vnd.ms-powerpoint",

    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],

  maxFiles: 10,

  maxFileSize: 10 * 1024 * 1024, // 10 MB

  maxFileSizeLabel: "10 MB",

  uploadEndpoint: "/documents/upload",

  supportedFormats: "PDF • DOC • DOCX • PPT • PPTX • TXT",
};
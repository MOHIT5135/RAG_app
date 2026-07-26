import client from "./config/chroma.js";

async function testConnection() {

    const heartbeat = await client.heartbeat();

    console.log("Connected Successfully");
    console.log(heartbeat);

}

testConnection();
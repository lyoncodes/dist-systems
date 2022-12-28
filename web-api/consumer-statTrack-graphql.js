const server = require("fastify")();
const fetch = require("node-fetch");
const HOST = "127.0.0.1";
const PORT = process.env.port || 3000;
const TARGET = process.env.TARGET || "localhost:4000";

const sample_query = `
    query roundData ($id: ID) {
        round(id: $id) {
            id
            course {
                name
                holes {
                    name
                    score
                    putts
                }
            }
        }
        pid
    }
`;
server.get("/", async () => {
  const req = await fetch(`http://${TARGET}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: sample_query,
      variables: { id: "1" },
    }),
  });
  return {
    consumer_pid: process.pid,
    producer_data: await req.json(),
  };
});

server.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) console.log(err);
  else console.log(`consumer running at ${address}`);
});

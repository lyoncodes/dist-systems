const server = require("fastify")();
const graphql = require("fastify-gql");
const fs = require("fs");
const schema = fs
  .readFileSync(__dirname + "/../shared/statTrack-graphql-schema.gql")
  .toString();

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;

const resolvers = {
  Query: {
    pid: () => process.pid,
    round: async (_obj, { id }) => {
      return {
        id,
      };
    },
  },
  Round: {
    course: async (obj) => {
      return { id: 1, name: "West Seattle GC" };
    },
  },
  Course: {
    holes: async (obj) => {
      return [
        { id: 1, name: "1", order: 1, par: 5 },
        { id: 2, name: "2", order: 2, par: 4 },
        { id: 3, name: "3", order: 3, par: 3 },
      ];
    },
  },
};

server
  .register(graphql, { schema, resolvers, graphiql: true })
  .listen({ port: PORT, host: HOST }, (err, address) => {
    err ? console.log(err) : console.log(`running @ ${address}`);
  });

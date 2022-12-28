const server = require("fastify")();
const graphql = require("fastify-gql");
const fs = require("fs");
const schema = fs
  .readFileSync(__dirname + "/../shared/graphql-schema.gql")
  .toString();

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;

const resolvers = {
  // the resolver object tells graphql how to build its response
  // top level query entry
  Query: {
    pid: () => process.pid,
    recipe: async (_obj, { id }) => {
      return {
        id,
        name: "Chicken Tiki Masala",
        steps: "Throw it in a pot...",
      };
    },
  },
  // resolver is run when resource retrieved
  Recipe: {
    ingredients: async (obj) => {
      return [
        { id: 1, name: "Chicken", quantity: "1 lb" },
        { id: 2, name: "Sauce", quantity: "2 cups" },
      ];
    },
  },
};

server
  .register(graphql, { schema, resolvers, graphiql: true })
  .listen({ port: PORT, host: HOST }, (err, address) => {
    if (err) console.log(err);
    else console.log(`listening at ${address}`);
  });

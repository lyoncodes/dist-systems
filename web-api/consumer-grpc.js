const util = require("util");
const grpc = require("@grpc/grpc-js");
const server = require("fastify")();
const loader = require("@grpc/proto-loader");
const pkg_def = loader.loadSync(
  __dirname + "/../shared/grpc-course-control.proto"
);
const courseControl = grpc.loadPackageDefinition(pkg_def).courseControl;
const HOST = "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || "localhost:4000";

const client = new courseControl.TeeTimeService(
  TARGET,
  grpc.credentials.createInsecure()
);
const routeclient = new courseControl.RouteGuideService(
  TARGET,
  grpc.credentials.createInsecure()
);
// promisify allows methods to be called with async/await
const getMetaData = util.promisify(client.getMetaData).bind(client);
const getTeeTime = util.promisify(client.getTeeTime).bind(client);
const getRouteFeature = util
  .promisify(routeclient.getFeature)
  .bind(routeclient);
server.get("/", async (req, res) => {
  const [meta, teeTime, route] = await Promise.all([
    getMetaData({}),
    getTeeTime({ id: 1234 }),
    getRouteFeature({ longitude: 47561551, latitude: -122372975 }),
  ]);
  return {
    consumer_pid: process.pid,
    producer_data: meta,
    teeTime,
    route,
  };
});

server.listen(PORT, HOST, () => {
  console.log(`Consumer running at http://${HOST}:${PORT}`);
});

const grpc = require("@grpc/grpc-js");
const loader = require("@grpc/proto-loader");

const pkg_def = loader.loadSync(
  __dirname + "/../shared/grpc-course-control.proto"
);
const courseControl = grpc.loadPackageDefinition(pkg_def).courseControl;

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;
const server = new grpc.Server();
server.addService(courseControl.TeeTimeService.service, {
  getMetaData: (_call, cb) => {
    cb(null, {
      pid: process.pid,
    });
  },
  getTeeTime: (call, cb) => {
    if (call.request.id !== 1234) {
      return cb(new Error("Tee time not found"));
    }
    cb(
      null, // request body:
      {
        id: 1234,
        time: "8:00:00",
        startingHole: 1,
        golfers: [
          { id: 1, name: "Michael", paid: true, member: false },
          { id: 2, name: "Christian", paid: true, member: false },
          { id: 3, name: "Tyler", paid: true, member: false },
          { id: 4, name: "Gibbs", paid: true, member: true },
        ],
      }
    );
  },
});
server.addService(courseControl.RouteGuideService.service, {
  getFeature: (call, cb) => {
    // console.log(call.request);
    // console.log(call.request.longitude, call.request.latitude);
    cb(null, {
      name: "",
      location: call.request,
    });
  },
});
server.bindAsync(
  `${HOST}:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) throw err;
    server.start();
    console.log(`Producer running at http://${HOST}:${port}`);
  }
);

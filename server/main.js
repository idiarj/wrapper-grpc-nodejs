import { ProtobufSrv } from "./src/protobufSrv.js";

const server = new ProtobufSrv(
    "./protobuf/hello.proto",
    "greeting",
    "Greeter"
);

server.addService({
    sayHello: (call, callback) => {
        console.log(`Received request: ${JSON.stringify(call.request)}`);
        const response = { message: `Hello, ${call.request.name}` };
        callback(null, response);
    }
});

server.start(50051);

import { cp } from "fs";
import { ProtobufSrv } from "./src/protobufSrv.js";
import os from "os";

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
    },
    getMetrics: (call, callback) => {
        console.log("Health check request received");
        // Get CPU usage (average load over 1 minute)
        const cpu = os.loadavg()[0];
        // Get memory usage (used/total)
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memory = usedMem / totalMem; // Fraction used (0-1)
        // Example: number of connections (not implemented, set to 0)
        const connections = 0;
        console.log(memory)
        console.log(cpu)
        console.log(connections)
        const response = { 
            cpu, 
            memory, 
            connections, 
            status: "healthy" 
        };
        callback(null, response);
    }
});

server.start(50051);
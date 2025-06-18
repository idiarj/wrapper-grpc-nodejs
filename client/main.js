import { ProtobufCli } from "./src/protobufCli.js";

const client = new ProtobufCli(
    "./protobuf/hello.proto",
    "greeting",
    "Greeter"
)

const grpcClient = client.getClient("localhost", 50051);

grpcClient.sayHello({ name: "Victoria" }, (error, response) => {
    if (error) {
        console.error(`Error calling sayHello: ${error.message}`);
    } else {
        console.log(`Response from server: ${response.message}`);
    }
}   );

grpcClient.getHealth({}, (error, response) => {
    if (error) {
        console.error(`Error calling getHealth: ${error.message}`);
    } else {
        console.log(`Health status: ${JSON.stringify(response)}`);
    }
});
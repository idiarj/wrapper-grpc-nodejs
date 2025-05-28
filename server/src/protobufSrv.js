import grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

export class ProtobufSrv {
    constructor(protoPath, packageName, serviceName, configs = {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    }) {
        this.configs = configs;
        this.protoPath = protoPath;
        this.packageName = packageName;
        this.serviceName = serviceName;
        this.server = new grpc.Server();
        this.loadProto();
    }

    loadProto() {
        const packageDefinition = loadSync(this.protoPath, this.configs);
        const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
        this.service = protoDescriptor[this.packageName][this.serviceName];
    }

    addService(serviceImplementation) {
        this.server.addService(this.service.service, serviceImplementation);
    }

    start(port){
        this.server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
            if (error) {
                console.error(`Failed to bind server: ${error.message}`);
                return;
            }
            console.log(`Server running at http://localhost:${port}`);
        });
    }
}
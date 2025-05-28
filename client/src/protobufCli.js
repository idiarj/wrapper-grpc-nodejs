import grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';


export class ProtobufCli {
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
        this.loadProto();
    }

    loadProto() {
        const packageDefinition = loadSync(this.protoPath, this.configs);
        const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
        this.service = protoDescriptor[this.packageName][this.serviceName];
    }

    getClient(host, port) {
        const client = new this.service(`${host}:${port}`, grpc.credentials.createInsecure());
        return client;
    }
}
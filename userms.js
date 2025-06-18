// userService.js
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, 'protobuf/user.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDef).user;

let activeConns = 0;

const service = {
  GetUser: (call, callback) => {
    activeConns++;
    const id = call.request.id;
    setTimeout(() => {
      callback(null, { id, name: `Usuario ${id}` });
      activeConns--;
    }, 200); // simula trabajo
  },

  GetMetrics: (call, callback) => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memusage = 1 - freeMem / totalMem;
    const cpu = Math.random() * 0.5;

    callback(null, {
      cpu,
      memusage,
      conns: activeConns
    });
  }
};

const server = new grpc.Server();
server.addService(proto.UserService.service, service);

const PORT = process.env.PORT || 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`🧩 UserService escuchando en puerto ${PORT}`);
//   server.start();
});

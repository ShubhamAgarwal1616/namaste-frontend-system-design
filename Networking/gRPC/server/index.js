const PROTO_PATH = './customers.proto';

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,         // allow casing in protobuf
    longs: String,          // allow long string in protobuf
    enums: String,          // allow enum string in protobuf
    arrays: true            // allow arrays in protobuf
});

/* loads the package that we are getting from protoLoader in gRPC so that gRPC knows what
   Customer and other definitions will look like
 */
const customersProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const customers = [{
    id: 'sdfshdfsd',
    name: 'Chirag Goel',
    age: 22,
    address: 'Bangalore'
}, {
    id: 'cvvbcbewb',
    name: 'Akshay Saini',
    age: 22,
    address: 'Uttrakhand'
}];

// adds a customer service and define all procedures
server.addService(customersProto.CustomerService.service, {
    // here call === this in JS, any request that come, headers, query param will come inside it
    // on success or error what needs to be done is defined in callback and used to send data to client
    getAll: (call, callback) => {
        // to return data of customers we have to return an object with customers list .proto we have defined it like this
        // plz note we have to map our array with customers field otherwise and empty array will return to client
        callback(null, { customers });
    },
    get: (call, callback) => {
        let customer = customers.find(n => n.id == call.request.id);

        if (customer) {
            callback(null, customer);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },
    insert: (call, callback) => {
        let customer = call.request;
        
        customer.id = Math.random(); // uuidv4
        customers.push(customer);
        callback(null, customer);
    },
    update: (call, callback) => {
        let existingCustomer = customers.find(n => n.id == call.request.id);

        if (existingCustomer) {
            existingCustomer.name = call.request.name;
            existingCustomer.age = call.request.age;
            existingCustomer.address = call.request.address;
            callback(null, existingCustomer);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },
    remove: (call, callback) => {
        let existingCustomerIndex = customers.findIndex(
            n => n.id == call.request.id
        );

        if (existingCustomerIndex != -1) {
            customers.splice(existingCustomerIndex, 1);
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    }
})

// for auth in gRPC, here we are allowing unauthenticated calls
server.bindAsync("127.0.0.1:30043", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(`Error starting gRPC server: ${err}`);
    } else {
      server.start();
      console.log(`gRPC server is listening on ${port}`);
    }
  });
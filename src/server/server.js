const PROTO_PATH = "../client/item.proto";
// const pathh=require('../')
var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	arrays: true
});

// var itemsProto = grpc.loadPackageDefinition(packageDefinition);
// grpc.loadPackageDefinition(packageDefinition)

const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();
const customers = [
	{
		id: 1,
		quantity:1,
        much:2
	},
	{
		id: 2,
		quantity:2,
        much:3
	}
];

server.addService(grpc.loadPackageDefinition(packageDefinition).ItemService.service, {
	getItems: (_, callback) => {
        console.log(customers);
		callback(null, customers);
	},

	

	creatItem: (call, callback) => {
		let customer = call.request;
		
		customer.id = uuidv4();
		customers.push(customer);
		callback(null, customer);
	},

	// update: (call, callback) => {
	// 	let existingCustomer = customers.find(n => n.id == call.request.id);

	// 	if (existingCustomer) {
	// 		existingCustomer.name = call.request.name;
	// 		existingCustomer.age = call.request.age;
	// 		existingCustomer.address = call.request.address;
	// 		callback(null, existingCustomer);
	// 	} else {
	// 		callback({
	// 			code: grpc.status.NOT_FOUND,
	// 			details: "Not found"
	// 		});
	// 	}
	// },

	// remove: (call, callback) => {
	// 	let existingCustomerIndex = customers.findIndex(
	// 		n => n.id == call.request.id
	// 	);

	// 	if (existingCustomerIndex != -1) {
	// 		customers.splice(existingCustomerIndex, 1);
	// 		callback(null, {});
	// 	} else {
	// 		callback({
	// 			code: grpc.status.NOT_FOUND,
	// 			details: "Not found"
	// 		});
	// 	}
	// }
});

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();
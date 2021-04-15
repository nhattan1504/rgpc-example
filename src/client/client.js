PROTO_PATH="./item.proto";
var grpc=require('grpc');

var protoLoader= require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	arrays: true
});

const ItemService = grpc.loadPackageDefinition(packageDefinition).ItemService;
const client = new ItemService(
	"localhost:30043",
	grpc.credentials.createInsecure()
);

module.exports = client;

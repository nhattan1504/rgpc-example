const client=require('./client');
function createItem(_,{much,quantity},context){
    var newItem={much:much,quantity:quantity};
    client.createItem(newItem,(err,data)=>{
        if(err){
            throw new Error("Have problem with newitem");
        }
        console.log("Send client to server success",data);
    });
};

function getAll(){
    console.log("hey");
    client.getItems(null,(err,data)=>{
        if(err){
            console.log(err);
            return err;
        }
        // console.log("hey")
        console.log(data);
    });
}


const resolvers={
    Query:{
        getAll
    },
    Mutation:{
        createItem
    }
};
module.exports=resolvers;
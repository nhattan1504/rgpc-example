const {gql}=require('apollo-server');
const query= gql`
type Item{
    quantity:Int
    much:Int

}
type User{
    email: String
    name:String
}
type Query{
    getAll: [Item]

}
type Mutation{
    createItem(quantity:Int,much:Int):String
}
`;
module.exports=query;  
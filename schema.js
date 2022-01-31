//We import the graphql types that we are going to use
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} = require("graphql");
const axios = require("axios");

//Hardcoded data

// const customers = [
//   { id: "1", name: "John Doe", email: "jdoe@gmail.com", age: 35 },
//   { id: "2", name: "Steve Smith", email: "sevesmith@gmail.com", age: 25 },
//   { id: "3", name: "Sarah William", email: "swilliams@gmail.com", age: 22 },
// ];

//CustomerType
const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

//Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString },
      },
      //We create the resolver
      /*Since its hardcoded we need to loop through the array of objects till we find the one that matches the id with the id given*/
      resolve(_, args) {
        /*
        for (let i = 0; i < customers.length; i++) {
          if (customers[i].id == args.id) {
            return customers[i];
          }
        }
        */
        return axios
          .get(`http://localhost:3000/customers/${args.id}`)
          .then((res) => res.data);
      },
    },
    customers: {
      name: "customers",
      description: "Returns all customers",
      type: new GraphQLList(CustomerType),
      //Resolver. Since we just want to return the whole costumers array
      resolve() {
        //return customers;
        return axios
          .get("http://localhost:3000/customers")
          .then((res) => res.data);
      },
    },
  },
});

//Root Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      description: "Adds a new customer",
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, { name, email, age }) {
        return axios
          .post("http://localhost:3000/customers", {
            name,
            email,
            age,
          })
          .then((res) => res.data);
      },
    },
    deleteCustomer: {
      description: "Deletes a customer with given id",
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, { id }) {
        axios
          .delete("http://localhost:3000/customers/" + id)
          .then((res) => res.data);
        return "User deleted successfully";
      },
    },
    editCustomer: {
      description: "Edits a selected customer",
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, { id, name, email, age }) {
        return axios
          .patch("http://localhost:3000/customers/" + id, {
            id,
            name,
            email,
            age,
          })
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

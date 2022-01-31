//Import statements
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");

const app = express();

//create the graphql server
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

//listen to the server
app.listen(666, () => {
  console.log("Server is running on port 666...");
});

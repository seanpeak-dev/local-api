import express from "express";
import { ApolloServer } from "apollo-server-express";
import resolvers from "./resolvers/index.js";
import schema from "./schema/index.js";
import { readDB } from "./dbController.js";

// app.use(express.urlencoded({extended: true}))
// app.use(express.json())

// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true
// }))

// rest api
// const routes = [...messagesRoute, ...usersRoute]
// routes.forEach(({method, route, handler}) => {
//     app[method](route, handler)
// })

// graphql
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models: {
      messages: readDB("messages"),
      users: readDB("users"),
    },
  },
});
const app = express();
await server.start();
server.applyMiddleware({
  app,
  path: "/graphql",
  cors: {
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true,
  },
});

await app.listen({ port: 8000 });
console.log("server is listening on port 8000");

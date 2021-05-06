import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";

import schema from "./schema.js";
import * as mongoServer from "./mongoServer.js";

await mongoServer.connect();
await mongoServer.loadFixtures();

const gql = (s) => s.join("");

const query = gql`
  # Write your query or mutation here

  query example {
    userCount

    userPagination(perPage: 2, sort: AGE_DESC) {
      pageInfo {
        currentPage
        perPage
        pageCount
        itemCount
        hasNextPage
        hasPreviousPage
      }

      items {
        ...User
      }
    }

    userMany {
      ...User
    }
  }

  fragment User on User {
    _id
    name
    languages {
      language
      skill
    }
    someMixed
  }

  mutation createUser {
    userCreateOne(record: { name: "new_user", gender: male }) {
      recordId
      record {
        ...User
      }
      error {
        message
        __typename
      }
    }
  }
`;

const server = new ApolloServer({
  schema,
  playground: {
    tabs: [
      {
        endpoint: "/",
        name: "Example",
        query,
      },
    ],
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

process.once("SIGHUP", async () => {
  await server.stop();
  await mongoose.disconnect();
  console.log("Mongodb Disconnected");
  process.exit(1);
});

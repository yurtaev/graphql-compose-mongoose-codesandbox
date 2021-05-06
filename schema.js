import mongoose from "mongoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";

// STEP 1: DEFINE MONGOOSE SCHEMA AND MODEL
export const LanguagesSchema = new mongoose.Schema({
  language: String,
  skill: {
    type: String,
    enum: ["basic", "fluent", "native"]
  }
});

export const UserSchema = new mongoose.Schema({
  name: String, // standard types
  age: {
    type: Number,
    index: true
  },
  ln: {
    type: [LanguagesSchema], // you may include other schemas (here included as array of embedded documents)
    default: [],
    alias: "languages" // in schema `ln` will be named as `languages`
  },
  contacts: {
    // another mongoose way for providing embedded documents
    email: String,
    phones: [String] // array of strings
  },
  gender: {
    // enum field with values
    type: String,
    enum: ["male", "female"]
  },
  someMixed: {
    type: mongoose.Schema.Types.Mixed,
    description:
      "Can be any mixed type, that will be treated as JSON GraphQL Scalar Type"
  }
});
export const User = mongoose.model("User", UserSchema);

// STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity, described below
const UserTC = composeMongoose(User, customizationOptions);

// STEP 3: Add needed CRUD User operations to the GraphQL Schema
// via graphql-compose it will be much much easier, with less typing
schemaComposer.Query.addFields({
  userById: UserTC.mongooseResolvers.findById(),
  userByIds: UserTC.mongooseResolvers.findByIds(),
  userOne: UserTC.mongooseResolvers.findOne(),
  userMany: UserTC.mongooseResolvers.findMany(),
  userDataLoader: UserTC.mongooseResolvers.dataLoader(),
  userDataLoaderMany: UserTC.mongooseResolvers.dataLoaderMany(),
  userByIdLean: UserTC.mongooseResolvers.findById({ lean: true }),
  userByIdsLean: UserTC.mongooseResolvers.findByIds({ lean: true }),
  userOneLean: UserTC.mongooseResolvers.findOne({ lean: true }),
  userManyLean: UserTC.mongooseResolvers.findMany({ lean: true }),
  userDataLoaderLean: UserTC.mongooseResolvers.dataLoader({ lean: true }),
  userDataLoaderManyLean: UserTC.mongooseResolvers.dataLoaderMany({
    lean: true
  }),
  userCount: UserTC.mongooseResolvers.count(),
  userConnection: UserTC.mongooseResolvers.connection(),
  userPagination: UserTC.mongooseResolvers.pagination()
});

schemaComposer.Mutation.addFields({
  userCreateOne: UserTC.mongooseResolvers.createOne(),
  userCreateMany: UserTC.mongooseResolvers.createMany(),
  userUpdateById: UserTC.mongooseResolvers.updateById(),
  userUpdateOne: UserTC.mongooseResolvers.updateOne(),
  userUpdateMany: UserTC.mongooseResolvers.updateMany(),
  userRemoveById: UserTC.mongooseResolvers.removeById(),
  userRemoveOne: UserTC.mongooseResolvers.removeOne(),
  userRemoveMany: UserTC.mongooseResolvers.removeMany()
});

const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-global-3.6";
import { User } from "./schema.js";

const mongoServer = new MongoMemoryServer({ instance: { port: 27011 } });

const mongooseOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
};

mongoose.set("debug", true);

export const connect = async () => {
  const mongoUri = await mongoServer.getUri();

  try {
    await mongoose.connect(mongoUri, mongooseOpts);
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  } catch (e) {
    if (e.message.code === "ETIMEDOUT") {
      console.log(e);
      mongoose.connect(mongoUri, mongooseOpts);
    }
    console.error(e);
  }
};

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const range = (count = 1) => [...Array(count).keys()];

export const loadFixtures = async (count = 10) => {
  const generateLang = (index) => ({
    language: `language #${index}`,
    skill: getRandomItem(["basic", "fluent", "native"]),
  });

  const users = range(count).map((i) => ({
    name: `username #${i}`,
    age: i,
    ln: [generateLang(i)],
    contacts: {
      email: `username_${i}@example.com`,
      phones: [`+12345678900${i % 10}`],
    },
    gender: getRandomItem(["male", "female"]),
    someMixed: {
      example: `example #${i}`,
      i,
    },
  }));

  await Promise.all([User.collection.insertMany(users)]);
};

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

function beforeAll(arg0: () => Promise<void>) {
  throw new Error("Function not implemented.");
}

function afterEach(arg0: () => Promise<void>) {
  throw new Error("Function not implemented.");
}

function afterAll(arg0: () => Promise<void>) {
  throw new Error("Function not implemented.");
}

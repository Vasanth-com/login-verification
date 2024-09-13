import mongoose from "mongoose";
// import { MongoMemoryServer } from "mongodb-memory-server";
async function connect() {
    // const mongod = await MongoMemoryServer.create();
    // const getURI = mongod.getUri();

    // mongoose.set('strictQuery',true)

    // const db = await mongoose.connect(getURI)

    const db  = await mongoose.connect("mongodb://localhost:27017/login")
    console.log("Database Connected..!");
    return db
    
}

export default connect;
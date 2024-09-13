import mongoose from "mongoose";
// import { MongoMemoryServer } from "mongodb-memory-server";
import ENV from '../config.js'
async function connect() {
    // const mongod = await MongoMemoryServer.create();
    // const getURI = mongod.getUri();

    // mongoose.set('strictQuery',true)

    // const db = await mongoose.connect(getURI)

    const db  = await mongoose.connect(ENV.MONGO_DB)
    console.log("Database Connected..!");
    return db
    
}

export default connect;
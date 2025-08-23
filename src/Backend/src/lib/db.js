import mongoose from "mongoose"

export const ConnectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb connected ${conn.connection.host}`);
    }catch(error){
        console.log("error in connecting to mongodb",error);
        process.exit(1); //1 feailure
     }
}
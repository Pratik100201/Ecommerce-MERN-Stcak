import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  /*As Database are outside continent it may take few extra seconds to connct */
  try {
    /*Thats why we are using async await  */

    /*We will now connect to Database */
    const conn = await mongoose.connect(process.env.Db);
    console.log(
      `Connected to Db ${conn.connection.host}`.bgMagenta.white
    ); /*Will tell host name  */
  } catch (error) {
    console.log(`Error in DataBase Connection ${error}`.bgRed.white);
  }
};

export default connectDB;

const { default: mongoose} = require("mongoose");
mongoose.set('strictQuery', false);


// const mongoose = require("mongoose")

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        // const conn = await mongoose.connect("mongodb://127.0.0.1:27017/lama");

        if(conn.connection.readyState === 1) console.log("DB connection is successfully !")
        else console.log("DB connecting");

    } catch (error) {
        console.log("db connection is false");
        throw new Error(error);
    }
}

module.exports = dbConnect;

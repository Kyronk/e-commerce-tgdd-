const express = require("express");
require("dotenv").config();

const dbConnect = require("./src/config/dbconnect");
const initRoutes = require("./src/routes/index");

const app = express();
const port = process.env.PORT || 8888;

app.use(express.json());
app.use(express.urlencoded({extended: true})); // giúp đọc dữ liệu gửi từ url lên (url encode: giả mã)
dbConnect();
initRoutes(app);

app.use("/", (req, res) => {
    return res.send("server ONN")
});

app.listen(port, () => {
    console.log("server start on post", port)
})
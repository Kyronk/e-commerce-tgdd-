const express = require("express");
require("dotenv").config();


const app = express();
const port = process.env.PORT || 8888;

app.use(express.json());
app.use(express.urlencoded({extended: true})); // giúp đọc dữ liệu gửi từ url lên (url encode: giả mã)

app.use("/", (req, res) => {
    return res.send("server ONN")
});

app.listen(port, () => {
    console.log("server start on post", port)
})
const userRouter = require("./user");
const { notFound, errHandler } = require("../middlewares/errHandler");

const initRoutes = (app) => {
    app.use("/api/user", userRouter);


    app.use(notFound); // không tìm thấy route thì nó sẽ nhảy vào đây
    app.use(errHandler); // nếu lỗi trên không bắt được thì nó sẽ nhảy xuống đây
}

module.exports = initRoutes
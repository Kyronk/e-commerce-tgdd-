const userRouter = require("./user");
const productRouter = require("./product");
const productCategoryRouter = require("./productCategory");
const blogCategoryRouter = require("./blogCategory");
const blogRouter = require("./blog");
const brandRouter = require("./brand");
const couponRouter = require("./coupon");
const orderRouter = require("./order");

const { notFound, errHandler } = require("../middlewares/errHandler");

const initRoutes = (app) => {
    app.use("/api/user", userRouter);
    app.use("/api/product", productRouter);
    app.use("/api/productcategory", productCategoryRouter);
    app.use("/app/blogcategory", blogCategoryRouter);
    app.use("/api/blog", blogRouter);
    app.use("/api/brand", brandRouter);
    app.use("/api/coupon", couponRouter);
    app.use("/api/order", orderRouter);


    app.use(notFound); // không tìm thấy route thì nó sẽ nhảy vào đây
    app.use(errHandler); // nếu lỗi trên không bắt được thì nó sẽ nhảy xuống đây
}

module.exports = initRoutes
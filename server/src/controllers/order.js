const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");

const asyncHandler = require("express-async-handler");


const createOrder = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {coupon} = req.body;
    const userCart = await User.findById(_id).select("cart").populate("cart.product", "title price");
    const products = userCart?.cart?.map(el => ({
        product: el.product._id,
        count: el.quantity,
        color: el.color
    }));
    let total = userCart?.cart?.reduce((sum,el) => el.product.price * el.quantity + sum, 0);
    const createData = {products, total, orderBy: _id};
    if(coupon) {
        const selectedCount = await Coupon.findById(coupon);
        total = Math.round(total * (1 - +selectedCount?.discount /100)/ 1000) * 1000 || total
    }
    // nếu người dùng có mã giảm giá
    // if(coupon) total = Math.round(total * (1 - coupon / 100) /100) * 1000;

    // const rs = await Order.create({products, total, orderBy: _id});
    const rs = await Order.create(createData);
    return res.json({
        success: rs ? true : false,
        rs: rs ? rs : "something"
    });
});

// update status
// admin chỉ có quyền chấp nhận hoặc cancel giỏ hàng thôi chứ k đc chỉnh sửa
const updateStatus = asyncHandler(async (req, res) => {
    const {oid} = req.params;
    const {status} = req.body;
    if(!status) throw new Error("Missing Status");
    const response = await Order.findByIdAndUpdate(oid, {status}, {new: true});
    return res.json({
        success: response ? true: false,
        response: response ? response : "Something went wrong"
    })
});


// get list order theo user || để làm lịch sủ mua hàng
// đanh cho user
const getUserOrder = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const response = await Order.find({orderBy: _id});
    return res.json({
        success: response ? true : false,
        listOrder: response ? response : "Something went wrong"
    });
});

// get list order theo admin 
const getListOrder = asyncHandler(async (req, res) => {
    const response = await Order.find();
    return res.json({
        success: response ? true : false,
        listOrder: response ? response : "Something went wrong"
    });
});

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getListOrder,
}



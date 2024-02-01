const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");

const asyncHandler = require("express-async-handler");


const createOrder = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const { products, total, address, status } = req.body;
    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] });
    }
    const data = {products, total, orderBy: _id};
    if (status) data.status = status

    // const {coupon} = req.body;
    // const userCart = await User.findById(_id).select("cart").populate("cart.product", "title price");
    // const products = userCart?.cart?.map(el => ({
    //     product: el.product._id,
    //     count: el.quantity,
    //     color: el.color
    // }));
    // let total = userCart?.cart?.reduce((sum,el) => el.product.price * el.quantity + sum, 0);
    // const createData = {products, total, orderBy: _id};
    // if(coupon) {
    //     const selectedCount = await Coupon.findById(coupon);
    //     total = Math.round(total * (1 - +selectedCount?.discount /100)/ 1000) * 1000 || total
    // }
    // nếu người dùng có mã giảm giá
    // if(coupon) total = Math.round(total * (1 - coupon / 100) /100) * 1000;

    // const rs = await Order.create({products, total, orderBy: _id});
    // const rs = await Order.create(createData);
    // const rs = await Order.create({ products, total, postedBy: _id})
    const rs = await Order.create(data)
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
    // const {_id} = req.user;
    // const response = await Order.find({orderBy: _id});
    // return res.json({
    //     success: response ? true : false,
    //     listOrder: response ? response : "Something went wrong"
    // });
    const {_id} = req.user;
    const queries = {...req.query};

    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`);
    const formatedQueries = JSON.parse(queryString);
    // let colorQueryObject = {};
    // filtering
    // if(queries?.title) formatedQueries.title = {$regex: queries.title, $options: 'i'};
    // if(queries?.category) formatedQueries.category = { $regex: queries.category, $options: "i"};
    // if(queries?.color) {
    //     delete formatedQueries.color;
    //     const colorArr = queries.color?.split(',');
    //     const colorQuery = colorArr.map(el => ({color: {$regex: el, $options: "i"}}));
    //     colorQueryObject = {$or: colorQuery};
    // }
    // let queryObject = {};
    // if (queries?.q) {
    //     delete formatedQueries.q
    //     queryObject = {
    //         $or: [
    //             {color: { $regex: queries.q, $options: "i"}},
    //             {title: { $regex: queries.q, $options: "i"}},
    //             {category: { $regex: queries.q, $options: "i"}},
    //             {brand: { $regex: queries.q, $options: "i"}}
    //         ]
    //     }
    // }

    const qr = {...formatedQueries, orderBy: _id};
    let queryCommand = Order.find(qr);
    
    if(req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
    }
    if(req.query.fields) {
        const fields = req.query.fields.split(',').join(" ");
        queryCommand = queryCommand.select(fields);
    }


    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);


    queryCommand.exec(async (err, response) => {
        if(err) throw new Error(err.message);
        const counts = await Order.find(qr).countDocuments();
    
        return res.status(200).json({
            success: response? true : false,
            counts,
            order: response ? response : "cannot get product list",
        })
    })
});

// get list order theo admin 
const getListOrder = asyncHandler(async (req, res) => {
    const queries = {...req.query};

    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`);
    const formatedQueries = JSON.parse(queryString);
    // let colorQueryObject = {};
    // filtering
    // if(queries?.title) formatedQueries.title = {$regex: queries.title, $options: 'i'};
    // if(queries?.category) formatedQueries.category = { $regex: queries.category, $options: "i"};
    // if(queries?.color) {
    //     delete formatedQueries.color;
    //     const colorArr = queries.color?.split(',');
    //     const colorQuery = colorArr.map(el => ({color: {$regex: el, $options: "i"}}));
    //     colorQueryObject = {$or: colorQuery};
    // }
    // let queryObject = {};
    // if (queries?.q) {
    //     delete formatedQueries.q
    //     queryObject = {
    //         $or: [
    //             {color: { $regex: queries.q, $options: "i"}},
    //             {title: { $regex: queries.q, $options: "i"}},
    //             {category: { $regex: queries.q, $options: "i"}},
    //             {brand: { $regex: queries.q, $options: "i"}}
    //         ]
    //     }
    // }

    const qr = {...formatedQueries};
    let queryCommand = Order.find(qr);
    
    if(req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
    }
    if(req.query.fields) {
        const fields = req.query.fields.split(',').join(" ");
        queryCommand = queryCommand.select(fields);
    }


    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);


    queryCommand.exec(async (err, response) => {
        if(err) throw new Error(err.message);
        const counts = await Order.find(qr).countDocuments();
    
        return res.status(200).json({
            success: response? true : false,
            counts,
            order: response ? response : "cannot get product list",
        })
    })
});

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getListOrder,
}



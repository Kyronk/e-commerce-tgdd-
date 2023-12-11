const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");


const createOneCoupon = asyncHandler(async (req, res) => {
    // expiry là ngày hết hạn hơi khó chơi kiểu ngày nên mình chơi kiểu tà
    const {name, discount, expiry} = req.body;
    if(!name || !discount || !expiry) throw new Error("Missing inputs");
    const response = await Coupon.create({
        ...req.body,
        expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000 
    });
    return res.json({
        success: response ? true : false,
        createdCoupon: response ? response : "Cannot create new Coupon"
    })
});


const getListCoupon = asyncHandler(async (req, res) => {
    const response = await Coupon.find().select("-createdAt -updatedAt");
    return res.json({
        success: response ? true : false,
        listCoupon : response ? response : "Cannot get list coupon"
    });
});

const updateCoupon = asyncHandler(async(req, res) => {
    const { cid } =  req.params;
    if(Object.keys(req.body).length === 0) throw new Error("Missing inputs");
    if(req.body.expiry) req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
    const response = await Coupon.findByIdAndUpdate(cid, req.body, {new: true});
    return res.json({
        success: response ? true : false,
        updateCoupon : response ? response : "Cannot get list coupon"
    });
}); 

const deleteCoupon = asyncHandler(async (req, res) => {
    const {cid} = req.params;
    const response = await Coupon.findByIdAndDelete(cid);
    return res.json({
        success: response ? true : false,
        deleteCoupon : response ? "Deleted item ok" : "Cannot get list coupon"
    });
});

module.exports = {
    createOneCoupon,
    getListCoupon,
    updateCoupon,
    deleteCoupon
}
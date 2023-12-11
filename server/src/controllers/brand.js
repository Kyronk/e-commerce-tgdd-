const Brand = require("../models/brand");
const asyncHandle = require("express-async-handler");


const createBrand = asyncHandle(async (req, res) => {
    const response = await Brand.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        createBrand: response ? response : "cannot create new Blog Brand"
    })
});

const getOneBrand = asyncHandle(async (req, res) => {
    const {brandid} = req.params;
    const response = await Brand.findById(brandid);
    return res.status(200).json({
        success: response ? true : false,
        blogBrand: response ? response : "cannot get all Blog Brand"
    })
})

const getListBrand = asyncHandle(async (req, res) => {
    const response = await Brand.find().select("title");
    return res.status(200).json({
        success: response ? true : false,
        blogBrand: response ? response : "cannot get all Blog Brand"
    })
});

const updateBrand = asyncHandle(async (req, res) => {
    const { brandid } = req.params;
    const response = await Brand.findByIdAndUpdate(brandid, req.body, {new: true});
    return res.status(200).json({
        success: response ? true : false,
        updateBrand: response ? response : "cannot update Blog Brand"
    })
});

const deleteBrand = asyncHandle(async (req, res) => {
    const { brandid } = req.params;
    const response = await Brand.findByIdAndDelete(brandid);
    return res.status(200).json({
        success: response ? true : false,
        deleteBrand: response ? response : "cannot delete Blog Brand"
    })
});



module.exports = {
    createBrand,
    getListBrand,
    getOneBrand,
    updateBrand,
    deleteBrand, 
}




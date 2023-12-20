const ProductCategory = require("../models/productCategory");
const asyncHandle = require("express-async-handler");


const createCategory = asyncHandle(async (req, res) => {
    const response = await ProductCategory.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        createCategory: response ? response : "cannot create new Product category"
    })
});

const getCategory = asyncHandle(async (req, res) => {
    const response = await ProductCategory.find();
    return res.status(200).json({
        success: response ? true : false,
        ProductCategory: response ? response : "cannot get all Product category"
    })
});

const updateCategory = asyncHandle(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {new: true});
    return res.status(200).json({
        success: response ? true : false,
        updateCategory: response ? response : "cannot update Product category"
    })
});

const deleteCategory = asyncHandle(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndDelete(pcid);
    return res.status(200).json({
        success: response ? true : false,
        deleteCategory: response ? response : "cannot delete Product category"
    })
});



module.exports = {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory, 
}




const BlogCategory = require("../models/blogCategory");
const asyncHandle = require("express-async-handler");


const createCategory = asyncHandle(async (req, res) => {
    const response = await BlogCategory.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        createCategory: response ? response : "cannot create new Blog category"
    })
});

const getCategory = asyncHandle(async (req, res) => {
    const response = await BlogCategory.find().select("title");
    return res.status(200).json({
        success: response ? true : false,
        blogCategory: response ? response : "cannot get all Blog category"
    })
});

const updateCategory = asyncHandle(async (req, res) => {
    const { bcid } = req.params;
    const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, {new: true});
    return res.status(200).json({
        success: response ? true : false,
        updateCategory: response ? response : "cannot update Blog category"
    })
});

const deleteCategory = asyncHandle(async (req, res) => {
    const { bcid } = req.params;
    const response = await BlogCategory.findByIdAndDelete(bcid);
    return res.status(200).json({
        success: response ? true : false,
        deleteCategory: response ? response : "cannot delete Blog category"
    })
});



module.exports = {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory, 
}




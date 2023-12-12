const Blog = require("../models/blog");
const asyncHandle = require("express-async-handler");


const createNewBlog = asyncHandle(async (req, res) => {
    const {title, description,  category } = req.body;
    if(!title || !description || !category) throw new Error("Missing inputs");
    const response = await Blog.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        createBlog: response ? response : "cannot create new Blog"
    })
});

// get list blog (get all ) - chưa làm phân trang
// ở đây chỉ mới làm phân trang mỗi product thôi
const getListBlog = asyncHandle(async (req, res) => {
    const response = await Blog.find();
    return res.status(200).json({
        success: response ? true : false,
        blogCategory: response ? response : "cannot get all Blog category"
    })
});

// get one blog

const excludedFields = "-refreshToken -password -role -createdAt -updatedAt";

const getOneBlog = asyncHandle (async (req, res) => {
    const {bid} = req.params;
    // const blog = await Blog.findById(bid).populate('likes', excludedFields).populate('dislikes', excludedFields);
    const blog = await Blog.findByIdAndUpdate(bid, { $inc: {numberViews: 1}})
        .populate('likes', 'firstname lastname email')
        .populate('dislikes', 'firstname lastname email');
    

    return res.status(200).json({
        success: blog ? true : false,
        rs: blog
    })
})


const updateBlog = asyncHandle(async (req, res) => {
    const { bid } = req.params;
    const response = await Blog.findByIdAndUpdate(bid, req.body, {new: true});
    return res.status(200).json({
        success: response ? true : false,
        updateBlog: response ? response : "cannot update Blog"
    })
});

// Like
// Dislike

/*
    khi người dùng like một bài blog thì ?
    1. check xem người dó trước đó có dislike không => bỏ dislike
    2. check xem người đó trước đây có like không => bỏ like / thêm like
*/

const likeBlog = asyncHandle(async (req, res) => {
    const {_id} = req.user;
    const {bid} = req.params;
    if(!bid) throw new Error("Missing inputs");
    const blog  = await Blog.findById(bid);
    const alreadyDislikes = blog?.dislikes?.find(el => el.toString() === _id);
    if(alreadyDislikes) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {dislikes: _id}}, {new: true});
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        });
    }
    const isLiked = blog?.likes?.find(el => el.toString() === _id);
    if(isLiked) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {likes: _id}}, {new : true});
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        })
    }else {
        const response = await Blog.findByIdAndUpdate(bid, {$push: {likes: _id}}, {new: true});
        return res.status(200).json({
            success: response ? true : false,
            res: response
        })
    }
});

// dislike
const dislikeBlog = asyncHandle( async (req, res) => {
    const {_id} = req.user;
    const {bid} = req.params;
    if(!bid) throw new Error("Missing inputs");
    const blog  = await Blog.findById(bid);
    const alreadyDislikes = blog?.likes?.find(el => el.toString() === _id);
    if(alreadyDislikes) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {likes: _id}}, {new: true});
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        });
    }
    const isDisLiked = blog?.dislikes?.find(el => el.toString() === _id);
    if(isDisLiked) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {dislikes: _id}}, {new : true});
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        })
    }else {
        const response = await Blog.findByIdAndUpdate(bid, {$push: {dislikes: _id}}, {new: true});
        return res.status(200).json({
            success: response ? true : false,
            res: response
        })
    }
});

const deleteBlog = asyncHandle(async (req, res) => {
    const {bid} = req.params;
    const blog = await Blog.findByIdAndDelete(bid);

    return res.status(200).json({
        success: blog ? true : false,
        deleteBlog: blog ? "Delete is successfully" : "Something went wrong"
    })
})

// upload image cho blog
const uploadImageBlog = asyncHandle(async (req, res) => {
    // console.log(req.files);
    const {blogid} = req.params;
    if(!req.file) throw new Error("Missing inputs");
    const response = await Blog.findByIdAndUpdate( blogid, {image: req.file.path}, {new: true});

    return res.status(200).json({
        success: response ? true : false,
        updateProduct: response ? response : "cannot update blog images"
    })
})



module.exports = {
    createNewBlog,
    updateBlog,
    getOneBlog,
    getListBlog,
    likeBlog,
    dislikeBlog,
    deleteBlog,
    uploadImageBlog,
}
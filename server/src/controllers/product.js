const Product = require("../models/product");
const asyncHandle = require("express-async-handler");
const slugify = require("slugify");

const creteProduct = asyncHandle(async (req, res) => {
    const { title, price, description, brand, category, color } = req.body;
    const thumb = req.file?.thumb[0].path;
    const images = req.files?.images?.map(el => el.path);

    if (!(title && price && description && brand && category && color)) throw new Error("Missing inputs");
    if (thumb) req.body.thumb = thumb;
    if (images) req.body.images = images;
    // if( Object.keys(req.body).length === 0) throw new Error("Missing inputs");
    
    //if(req.body && req.body.title) req.body.slug = slugify(req.body.title);
    req.body.slug = slugify(title);
    
    const newProduct = await Product.create(req.body);

    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : "can not create new product"
        // thumb, images
    });
});

const getOneProduct = asyncHandle( async (req, res) => {
    const {pid} = req.params;
    const product = await Product.findById(pid).populate({
        path: "ratings",
        populate: {
            path: "postedBy", 
            select: "firstname lastname avatar"
        }
    });

    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : "cannot get product"
    })
})

// get list product (all product) Filtering, sprting & pagination
const getListProduct = asyncHandle(async (req, res) => {
    const queries = {...req.query};
    // console.log(queries)

    // tách các trường dặc biệt ra khỏi query
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach(el => delete queries[el]);
    // console.log(excludeFields);

    // format lại các operator cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`);
    // console.log(queryString)
    const formatedQueries = JSON.parse(queryString);
    let colorQueryObject = {};
    // console.log(formatedQueries);


    // sorting
    
    // filtering
    if(queries?.title) formatedQueries.title = {$regex: queries.title, $options: 'i'};
    if(queries?.category) formatedQueries.category = { $regex: queries.category, $options: "i"};
    // if(queries?.color) formatedQueries.color = { $regex: queries.color, $options: "i"};
    if(queries?.color) {
        delete formatedQueries.color;
        const colorArr = queries.color?.split(',');
        const colorQuery = colorArr.map(el => ({color: {$regex: el, $options: "i"}}));
        colorQueryObject = {$or: colorQuery};
    }
    const q = {...colorQueryObject, ...formatedQueries}
    let queryCommand = Product.find(q);
    
    // acb, efg => [abc, efg]  => abc dfg
    if(req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
    }

    // fields limiting
    if(req.query.fields) {
        const fields = req.query.fields.split(',').join(" ");
        queryCommand = queryCommand.select(fields);
    }

    // pagination ( phân  trang)
    // limit: số object lấy vể trong 1 lần gọi api
    // skips: 2
    // 1 2 3 ... 10
    // +2 => 2
    // +dads => NaN
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);




    // Execute query
    // số lượng sản phẩm trả về thoả điều kiện
    queryCommand.exec(async (err, response) => {
        if(err) throw new Error(err.message);
        const counts = await Product.find(q).countDocuments();
        // console.log(counts);
        // console.log(response);
    
        return res.status(200).json({
            success: response? true : false,
            counts,
            productList: response ? response : "cannot get product list",
        })
    })


    // const listProduct = await Product.find();

    // return res.status(200).json({
    //     success: listProduct ? true : false,
    //     listProduct: listProduct ? listProduct : false
    // })
})

//////////////////////////////////

const updateProduct = asyncHandle(async (req, res) => {
    const {pid} = req.params;
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const updateProduct = await Product.findByIdAndUpdate(pid, req.body, {new: true});
    return res.status(200).json({
        success: updateProduct ? true : false,
        updateProduct: updateProduct ? updateProduct : "cannot update product"
    })
})

const deleteProduct = asyncHandle(async (req, res) => {
    const {pid} = req.params;
    const deleteProduct = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
        success: deleteProduct ? true : false,
        deleteProduct: deleteProduct ? deleteProduct : "cannot delete product"
    })
});

// phân tích về đánh giá về luồn thì khá giống nhau (mỗi tội mongo nó truy vấn = object nên khá là bất cập)
// nhận vào các tham số gồm ìd của người đánh giá (id user) id của sản phẩm, đánh giá sao(rating), và bình luận
//
// xử lý : tạo ra 1 array rỗng, mối bình luận là 1 object có 4 trường ở trên
// luồng chính: mỗi người dùng chỉ có một đánh giá cho môt sản phẩm ()
// nếu người dùng đánh giá rồi mà đánh giá thêm vào sản phảm đó thì sẽ update đánh giá cũ
const ratings = asyncHandle(async (req, res) => {
    const {_id} = req.user; // cái này là id lúc đăng nhập hash lại cái token nó gắn vào id = req.user chứ k phải tự sinh ra đâu
    const { star, comment, pid, updateAt } = req.body; // mấy cái này tự truyền lên
    if(!star || !pid) throw new Error("Missing inputs");
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id);
    // console.log(alreadyRating);
    if(alreadyRating) {
        // update star & comment
        // console.log("false")
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating}
        }, {
            $set: {"ratings.$.star": star, "ratings.$.comment": comment , "ratings.$.updatedAt": updateAt } 
        }, {new: true})
    }else {
        // add star & comment
        await Product.findByIdAndUpdate(pid, {
            $push: {ratings: {star, comment, postedBy: _id, updateAt}}
        }, {new: true})
    }
    

    // sum ratings
    const updatedProduct = await Product.findById(pid);
    const ratingCount = updatedProduct.ratings.length;
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star , 0);
    updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10;
    
    await updatedProduct.save();

    return res.status(200).json({
        status: true,
        updatedProduct
    })
});

// upload image
// up ảnh cho sản phẩm
// 1 sản phẩm có thể có một hoặc nhiều ảnh 
// => up 1 hoặc nhiều ảnh

const uploadImageProduct = asyncHandle(async (req, res) => {
    // console.log(req.files);
    const {pid} = req.params;
    if(!req.files) throw new Error("Missing inputs");
    const response = await Product.findByIdAndUpdate(pid, {$push : {images: {$each: req.files.map(el => el.path)}}}, {new: true});

    return res.status(200).json({
        success: response ? true : false,
        updateProduct: response ? response : "cannot update images"
    })
})


module.exports = {
    creteProduct,
    getOneProduct,
    getListProduct,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImageProduct,
}
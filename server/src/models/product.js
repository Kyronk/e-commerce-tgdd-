const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    // bình thường nếu muốn lấy một sản phảm thì ta lấy = id
    // sẽ có trường hợp lấy = tên nhưng khá khó dó đôi khi tên thì sẽ viết có dấu hoặc 1 số ngôn ngữ không 
    // sử dụng bản chủ cái abc thì sẽ khá khó
    // ở đây ta tạo ra một cái link từ tên của sản phầm
    // ví dụ : đồng hồ apple watch seri 5 => dong-ho-apple-watch-seri-5
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    },
    description:{
        type:String,
        required:true,
    },
    // tên hãng
    brand:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    // thể loại : đồng hồ , máy tính bảng, laptop || hạng mục
    category:{
        type:mongoose.Types.ObjectId,
        ref: "Category"
    },
    quantity:{
        type:Number,
        default: 0
    },
    // số lượng sản phẩm đã bán
    sold:{
        type:Number,
        default: 0
    },
    image:{
        type:Array
    },
    color:{
        type:String,
        enum: ["Black", "Grown", "Red"]
    },
    ratings: [
        {
            star: {type: Number},
            postedBy: { type: mongoose.Types.ObjectId, ref: "User"},
            comment: {type: String}
        }
    ],
    totalRatings: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);
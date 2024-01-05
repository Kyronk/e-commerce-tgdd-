// !mdbg
const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// const { type } = require('os');



// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname: {
        type: String,
        require: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    avatar:{
        type:String,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type:String,
        // sau này sẽ có nhiều kiểu role như admin, customer, user ...
        // ví dụ mỗi role sẽ quy ước admin: A5, custumer: A1, User: C2
        // chia bảng + mã hoá thì dữ liệu sẽ an toàn hơn (có lẽ v, không chắt chắn lắm)
        // ở đây với mongoDB thì tạm thời dùng enum

        // quy ước 1945 là Admin, 1979 là user
        enum: [1945, 1979],
        default: 1979
        // default: "user"
    },
    cart: [
        {
            product: {type: mongoose.Types.ObjectId, ref: "Product"},
            quantity: Number,
            color: String
        }
    ],
    address: {
        type: String
    },
    wishlist: [
        {type: mongoose.Types.ObjectId, ref: "Product"},
    ],
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    passwordChangeAt: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: String
    },
    registerToken: {
        type: String
    }
}, {
    timestamps: true
});

// ở trong models này thì không dược dùng arrow function vì nó sẽ không hiểu
// chỉ được phép dùng function bình thường thôi
// hàm pre kiểu như là chờ nghe 
// tham số thứ 1 là "save" nghĩa là function sau chỉ chạy khi nó làm tác vụ save một user mới (register)
userSchema.pre("save", async function (next) {
    // kiểu như là thay đổi (update thì nó sẽ chạy lại hàm này)
    // nên cần 1 thăng lính canh để chặng lại
    // nếu update các trường khác thì nó sẽ k chạy lại vào hàm này 
    // nếu k check thì nó sẽ lấy chuỗi mã hoá tiếp tục mã hoá => sai cmnl
    // 
    if(!this.isModified("password")) {
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password);
    },
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString("hex");
        this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
        return resetToken;
    }

}

//Export the model
module.exports = mongoose.model('User', userSchema);
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { generateAccessToken, generateRefreshToken } = require("../middlewares/jwt");

const crypto = require("crypto");

const sendMail = require("../utils/sendMail");

const jwt = require("jsonwebtoken");



const register = asyncHandler(async (req, res) => {
    const {email, password, firstname, lastname} = req.body;
    if(!email || !password || !firstname || !lastname) 
    return res.status(400).json({
        success: false,
        mess: "Missing input"
    });

    const user = await User.findOne({email});
    console.log("check user", user);
    if(user) throw new Error("User has existed");
    else {
        const newUser = await User.create(req.body);
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? "Register is successfully. please to login now~" : "Something went wrong"
        })
    }
    // const response = await Users.create(req.body);
    // const response = await User.create(req.body);
    // return res.status(200).json({
    //     success: response? true : false,
    //     response
    // })
})



// refresh token => cấp mới access token
// Access token => xác thực người dùng, phân quyền người dùng
const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password ) 
        return res.status(400).json({
            success: false,
            mess: "Missing input"
        });
    
    

    // thằng mongo nó trả về 1 object thuàn nên phải chuyên vể 1 dạng object dễ hiểu hơn
    // dạng này nó trả vể là plain object nói chung là rất lằng nhằng khó hiểu trả thêm nhiều tham số khác của mongo hoặc sẽ k đọc đc
    const response = await User.findOne({email: email});
    // console.log(response.isCorrectPassword(password));
    if(response && await response.isCorrectPassword(password)) {
        // const { password, role, ...userData} = response
        const { password, role, refreshToken , ...userData} = response.toObject();
        // generateAccessToken(response._id hay là trong userData cũng đc)
        const accessToken = generateAccessToken(userData._id, role);
        const newRefreshToken = generateRefreshToken(userData._id);
        // lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, {refreshToken: newRefreshToken}, {new: true}) // new: true || trả về data sau khi đã update
        // lưu refresh token vào cookie
        res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000})

        return res.status(200).json({
            success: true,
            accessToken: accessToken,
            // refreshToken: refreshToken,
            userData
        })
    } else {
        throw new Error('invalid credentials !');
    }
});

// route này là dành cho user cho nó tự get dữ liệu của mình
// chủ yếu thực hiện chức năng set và get dữ liệu của bản thân user đó
const getCurrent = asyncHandler( async (req, res) => {
    // chỗ này : đây là route có check xem bạn có  quyền get hay không
    // req.user có khi mà cái route này chạy vào verify token và nó đã làm hết trong đó rồi
    // verify token dứng trc  route giống như một thằng lính canh v
    const { _id } = req.user;
    const user = await User.findById(_id).select("-refreshToken -password -role");
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : "User is not found"
    })

}) 


// api refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
    // lấy token từ cookie
    const cookie = req.cookies;

    // check xem có token hay không
    if(!cookie && !cookie.refreshToken) throw new Error("No refresh token in cookie");

    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const response = await User.findOne({_id: rs._id, refreshToken: cookie.refreshToken});
    return res.status(200).json({
        success: response? true: false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : "refresh token not matched"
    })
    // check token có hợp lệ hay không
    // khúc code này nó không log ra lỗi
    // jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, async (err, decode) => {
    //     if(err) throw new Error("Invalid refresh token");
    //     // check xem token có khớp với token đã lưu trong db không
    //     const response = await User.findOne({_id: decode._id, refreshToken: cookie.refreshToken })
    //     return res.status(200).json({
    //         success: response? true : false,
    //         newAccessToken: response ? generateAccessToken(response._id, response.role) : "refresh token not matched"
    //     })
    // })
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if(!cookie && !cookie.refreshToken) throw new Error("No refresh token in cookie");
    // Xoá refresh token ở db
    await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ""}, {new: true});
    // xoá rếh token ở cookie trình duyệt
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    return res.status(200).json({
        success: true,
        mes: "logout is done"
    })
})

// quên mật khẩu
// client gửi email lên
// Server check xem email có hợp lệ không => gửi mail + kèm theo link (password change token)
// Client check mail => check link
// Client gửi api kèm token
// check xem có giống token mà server gửi mail hay không
// change password

const forgotPassword = asyncHandler (async (req, res) => {
    const {email} = req.query;
    if(!email) throw new Error("Missing email");
    const user = await User.findOne({email});
    if(!email) throw new Error("User not found");
    const resetToken = user.createPasswordChangedToken()
    await user.save();

    const html = `Xin vui lòng click vào link dưới đây để đặt lại mật khẩu của bạn. link này sẽ hết hạn trong 15 phút kể từ thời điểm hiện tại.
    <a href="${process.env.URL_SERVER}/api/user/reset-password/${resetToken}" >Click here.</a>`

    const data = {
        email: email,
        html
    }
    const rs = await sendMail(data);
    // console.log(rs)
    return res.status(200).json({
        success: true,
        rs
    })
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    console.log({password, token})
    if(!password || !token) throw new Error("Missing input");
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({passwordResetToken: passwordResetToken, passwordResetExpires: { $gt: Date.now()}});
    if(!user) throw new Error("Invalid reset token")
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangeAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({
        success: user? true : false,
        mes: user? 'updated password' : 'something went wrong'
    })
});


const getListUser = asyncHandler(async (req, res) => {
    const response = await User.find().select('-refreshToken -password -role');

    return res.status(200).json({
        success: response ? true : false,
        ListUser: response
    })
});

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query;
    if(!_id) throw new Error("Missing input");
    const response = await User.findByIdAndDelete(_id);
    
    return res.status(200).json({
        success: response ? true : false,
        deleteUser: response ? `User with email ${response.email} delete` : "No user delete"
    })
});

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if(!_id || Object.keys(req.body).length === 0)  throw new Error("Missing inputs");
    const response = await User.findByIdAndUpdate(_id, req.body, {new: true}).select("-password -role");

    return res.status(200).json({
        success: response ? true : false,
        mes: response ? "update is successfully": "some thing went wrong",
        updatedUser: response ? response : "Some thing went wrong"
    })
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
    // trong route phải truyền vào user/:uid trùng với lại tên lấy ra
    const {uid} = req.params;

    // console.log(uid);
    if( Object.keys(req.body).length === 0) throw new Error("Missing inputs");
    const response = await User.findByIdAndUpdate(uid, req.body, {new: true}).select("-password -role");
    console.log(response);
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : "something went wrong"
    })
})



module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getListUser,
    deleteUser,
    updateUser,
    updateUserByAdmin,


}



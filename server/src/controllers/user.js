const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { generateAccessToken, generateRefreshToken } = require("../middlewares/jwt");

const crypto = require("crypto");

const sendMail = require("../utils/sendMail");

const jwt = require("jsonwebtoken");

const makeToken = require("uniqid");

const { users } = require("../utils/userData");
const { query } = require("express");

// khúc này register 1 cái là vào luôn

// const register = asyncHandler(async (req, res) => {
//     const {email, password, firstname, lastname} = req.body;
//     if(!email || !password || !firstname || !lastname) 
//     return res.status(400).json({
//         success: false,
//         mess: "Missing input"
//     });

//     const user = await User.findOne({email});
//     console.log("check user", user);
//     if(user) throw new Error("User has existed");
//     else {
//         const newUser = await User.create(req.body);
//         return res.status(200).json({
//             success: newUser ? true : false,
//             mes: newUser ? "Register is successfully. please to login now~" : "Something went wrong"
//         })
//     }
//     // const response = await Users.create(req.body);
//     // const response = await User.create(req.body);
//     // return res.status(200).json({
//     //     success: response? true : false,
//     //     response
//     // })
// })

// cái register này sẽ không cho vào luôn 
// mà sẽ trả về cho email đăng ký 1 url để xác nhận //  ok vẫn chạy
// cách này ok nhưng có nhược điểm là nếu gmail trên đt thì sẽ k get đc token do token chỉ lưu trên cookie của 
// trình duyện đăng ký thôi
// const register = asyncHandler(async (req, res) => { 
//     const {email, password, firstname, lastname} = req.body;
//     if(!email || !password || !firstname || !lastname) {
//         return res.status(400).json({
//             success: false,
//             mess: "Missing input"
//         });
//     };
//     const user = await User.findOne({email: email});
//     if(user) throw new Error("User has exited");
//     else{
//         const token = makeToken();
//         res.cookie('dataregister', {...req.body, token}, {httpOnly: true, maxAge: 15 * 60 * 1000});
//         const html = `Xin vui lòng click vào link dưới đây để hoàn tất quá trình đăng ký. Link này sẽ hết hạn trong 15 phút kể từ bây giờ.
//         <a href=${process.env.URL_SERVER}/api/user/finalregister/${token}>Click here</a>`
    
//         await sendMail({email, html, subject: "Hoàng tất đăng ký Digital World!"});
//         return res.status(200).json({
//             success: true,
//             mes: "Please check your email to active account"
//         })
//     };
// });

// update register // cái này sẽ k lưu mã xác thực ở cookies mà sẽ lưu ở DB luôn
// ưu điêm là dùng thiết bị khác (trình duyệt hay đt khác cũng check đc)
const register = asyncHandler(async (req, res) => {
    const {email, password, firstname, lastname, mobile} = req.body;
    if(!email || !password || !firstname || !lastname) {
        return res.status(400).json({
            success: false,
            mess: "Missing input"
        });
    };
    const user = await User.findOne({email: email});
    if(user) throw new Error("User has exited");
    else{
        const token = makeToken();
        const emailedited = btoa(email) + "@" + token;
        const newUser = await User.create({
            email: emailedited,
            password,
            firstname,
            lastname,
            mobile
        })
        // res.cookie('dataregister', {...req.body, token}, {httpOnly: true, maxAge: 15 * 60 * 1000});
        // const html = `Xin vui lòng click vào link dưới đây để hoàn tất quá trình đăng ký. Link này sẽ hết hạn trong 15 phút kể từ bây giờ.
        // <a href=${process.env.URL_SERVER}/api/user/finalregister/${token}>Click here</a>`
        if(newUser) {
            const html = `<h2>Register code:</h2> </br> <blockquote>${token}</blockquote>`;
            await sendMail({email, html, subject: "Confirm register account Digital World!"});
        }

        setTimeout(async () => {
            await User.deleteOne({ email: emailedited});
        }, [20000]);



        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? "Please check your email to active account" : "Some went wrong, please try later"
        })
    };
});



// hàm register để hứng thằng ở trên kích hoạt tài khoảng
// const finalRegister =  asyncHandler(async (req, res) => {
//     const cookie = req.cookies;
//     const {token} = req.params;
//     console.log(token)
//     // if(!cookie || cookie?.dataregister?.token !== token) throw new Error("Register falsed");
//     if(!cookie || cookie?.dataregister?.token !== token) {
//         // res.clearCookie('dataregister');
//         return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
//     }
//     const newUser = await User.create({
//         email: cookie?.dataregister?.email,
//         password: cookie?.dataregister?.password,
//         mobile: cookie?.dataregister?.mobile,
//         firstname: cookie?.dataregister?.firstname,
//         lastname: cookie?.dataregister?.lastname
//     })
//     res.clearCookie('dataregister');
//     if(newUser) return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`);
//     else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
// })

// giống ở trên làm lại hàm hứng nhưng k dùng cookie nũa mà dùng mã 
const finalRegister =  asyncHandler(async (req, res) => {
    // const cookie = req.cookies;
    const {token} = req.params;
    // console.log(token)
    // const tokenInMail = await User.find();
    const notActivedEmail = await User.findOne({email: new RegExp(`${token}`)})
    if(notActivedEmail) {
        notActivedEmail.email = atob(notActivedEmail?.email?.split("@")[0]);
        notActivedEmail.save()
    }
    return res.status(200).json({
        success: notActivedEmail ? true : false,
        mes: notActivedEmail ? "Register is Successfully. Please go login." : "Some went wrong, please try later"
    })
    // if(!cookie || cookie?.dataregister?.token !== token) throw new Error("Register falsed");
    // if(!cookie || cookie?.dataregister?.token !== token) {
    //     // res.clearCookie('dataregister');
    //     return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
    // }
    // const newUser = await User.create({
    //     email: cookie?.dataregister?.email,
    //     password: cookie?.dataregister?.password,
    //     mobile: cookie?.dataregister?.mobile,
    //     firstname: cookie?.dataregister?.firstname,
    //     lastname: cookie?.dataregister?.lastname
    // })
    // res.clearCookie('dataregister');
    // if(newUser) return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`);
    // else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
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
    const user = await User.findById(_id).select("-refreshToken -password").populate({
        path: "cart",
        populate: {
            path: "product",
            select: "title thumb price"
        }
    });
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : "User is not found"
    })
    // const queries = {...req.query};

    // const excludeFields = ["limit", "sort", "page", "fields"];
    // excludeFields.forEach(el => delete queries[el]);
    // // console.log(excludeFields);

    // // format lại các operator cho đúng cú pháp của mongoose
    // let queryString = JSON.stringify(queries);
    // queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`);
    // // console.log(queryString)
    // const formatedQueries = JSON.parse(queryString);

    // if(queries?.name) formatedQueries.name = {$regex: queries.title, $options: 'i'};
    
    // if( req.query.q) {
    //     delete formatedQueries.q;
    //     formatedQueries['$or'] = [
    //         {firstname: {$regex: req.query.q, $options: "i"  }},
    //         {lastname: {$regex: req.query.q, $options: "i"  }},
    //         {email: {$regex: req.query.q, $options: "i"  }},

    //     ]
    // }
    // console.log(formatedQueries);

    // let queryCommand = User.find(formatedQueries);
    
    // // acb, efg => [abc, efg]  => abc dfg
    // if(req.query.sort) {
    //     const sortBy = req.query.sort.split(",").join(" ");
    //     queryCommand = queryCommand.sort(sortBy);
    // }

    // // fields limiting
    // if(req.query.fields) {
    //     const fields = req.query.fields.split(',').join(" ");
    //     queryCommand = queryCommand.select(fields);
    // }

    // // pagination ( phân  trang)
    // // limit: số object lấy vể trong 1 lần gọi api
    // // skips: 2
    // // 1 2 3 ... 10
    // // +2 => 2
    // // +dads => NaN
    // const page = +req.query.page || 1;
    // const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
    // const skip = (page - 1) * limit;
    // queryCommand.skip(skip).limit(limit);

    // // Execute query
    // // số lượng sản phẩm trả về thoả điều kiện
    // queryCommand.exec(async (err, response) => {
    //     if(err) throw new Error(err.message);
    //     const counts = await User.find(formatedQueries).countDocuments();
    //     // console.log(counts);
    //     // console.log(response);
    
    //     return res.status(200).json({
    //         success: response? true : false,
    //         counts,
    //         listUser: response ? response : "cannot get product list",
    //     })
    // })
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
    const {email} = req.body;
    if(!email) throw new Error("Missing email");
    const user = await User.findOne({email});
    if(!user) throw new Error("User not found");
    const resetToken = user.createPasswordChangedToken()
    await user.save();

    const html = `Xin vui lòng click vào link dưới đây để đặt lại mật khẩu của bạn. link này sẽ hết hạn trong 15 phút kể từ thời điểm hiện tại.
    <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}" >Click here.</a>`

    const data = {
        email: email,
        html,
        subject: "Forgot Password!"
    }
    const rs = await sendMail(data);
    // console.log(rs)
    return res.status(200).json({
        // success: true,
        success:  rs.response?.includes("OK") ? true : false,
        mes: rs.response?.includes("OK") ? "Check your mail, please" :  "Something went wrong. Please try later",
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
    const queries = {...req.query};
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach(el => delete queries[el]);
    
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`);
    const formatedQueries = JSON.parse(queryString);

    // let colorQueryObject = {};
    
    if(queries?.name) formatedQueries.name = {$regex: queries.title, $options: 'i'};
    if( req.query.q) {
        delete formatedQueries.q;
        formatedQueries['$or'] = [
            {firstname: {$regex: req.query.q, $options: "i"  }},
            {lastname: {$regex: req.query.q, $options: "i"  }},
            {email: {$regex: req.query.q, $options: "i"  }},
        ]
    }

    // const q = {...colorQueryObject, ...formatedQueries}
    let queryCommand = User.find(formatedQueries);
    
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
        const counts = await User.find(formatedQueries).countDocuments();
        
        return res.status(200).json({
            success: response? true : false,
            counts,
            listUser: response ? response : "cannot get product list",
        })
    })

})


const getListUser1 = asyncHandler(async (req, res) => {
    // const response = await User.find().select('-refreshToken -password -role');

    // return res.status(200).json({
    //     success: response ? true : false,
    //     ListUser: response
    // })
    const queries = {...req.query};

    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`);
    // console.log(queryString)
    const formatedQueries = JSON.parse(queryString);

    if(queries?.name) formatedQueries.name = {$regex: queries.name, $options: 'i'};
    if( req.query.q) {
        delete formatedQueries.q;
        formatedQueries['$or'] = [
            {firstname: {$regex: req.query.q, $options: "i"  }},
            {lastname: {$regex: req.query.q, $options: "i"  }},
            {email: {$regex: req.query.q, $options: "i"  }},
        ]
    }
    console.log(formatedQueries);

    let queryCommand = User.find(formatedQueries);
    
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
        const counts = await User.find(formatedQueries).countDocuments();
        // console.log(counts);
        // console.log(response);
    
        return res.status(200).json({
            success: response? true : false,
            counts,
            listUser: response ? response : "cannot get product list",
        })
    })
});

const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    // if(!_id) throw new Error("Missing input");
    const response = await User.findByIdAndDelete(uid);
    
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `User with email ${response.email} delete` : "No user delete"
    })
});

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { firstname, lastname, email, mobile } = req.body;
    const data = { firstname, lastname, email, mobile };
    if( req.file) data.avatar = req.file.path;
    if(!_id || Object.keys(req.body).length === 0)  throw new Error("Missing inputs");
    // update như vậy rất là nguy hiểm vì người dùng có thể sửa đổi những thứ không được phép như active hoặc role
    // const response = await User.findByIdAndUpdate(_id, req.body, {new: true}).select("-password -role");
    // const response = await User.findByIdAndUpdate(_id, { firstname, lastname, email, phone }, {new: true}).select("-password -role");
    const response = await User.findByIdAndUpdate(_id, data, {new: true}).select("-password -role");


    return res.status(200).json({
        success: response ? true : false,
        mes: response ? "update is successfully": "some thing went wrong",
        // updatedUser: response ? response : "Some thing went wrong"
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
        mes: response ? "updated! " : "something went wrong"
    })
});


const updateAddress = asyncHandler(async (req, res) => {
    const { _id} = req.user;
    // console.log(_id)
    if(!req.body.address) throw new Error("Missing input");
    const response = await User.findByIdAndUpdate(_id, {$push : {address: req.body.address}}, {new: true}).select("-password -role -refreshToken")
    // console.log(response)
    return res.status(200).json({
        success: response ? true : false,
        updateAddress: response ? response : "something went wrong"
    })
});


// add 1 sản phàm vào giỏ hàng
// thêm và cập nhập luôn rồi // có thể update thêm chức năng xoá
const updateCart = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    // console.log(_id);
    
    const {pid, quantity = 1, color, price, thumbnail, title} = req.body;
    if(!pid || !color) throw new Error("Missing input");

    const user = await User.findById(_id).select("cart");
    const alreadyProduct = user?.cart?.find(el =>  el.product.toString() === pid);
    
    if(alreadyProduct && alreadyProduct.color === color) {
        // if(alreadyProduct.color === color) {
            const response = await User.updateOne({
                cart: {
                    $elemMatch: alreadyProduct}},
                    {$set: {
                        "cart.$.quantity": quantity, 
                        "cart.$.price": price, 
                        "cart.$.thumbnail": thumbnail,
                        "cart.$.title": title,
                    }}, {new: true});
            return res.status(200).json({
                success: response ? true : false,
                mes: response ? "Updated your cart!" : "something went wrong"
            })
        // }
        // else {
        //     const response = await User.findByIdAndUpdate(_id, {$push: {cart: {product: pid, quantity, color}}}, {new: true});
        //     return res.status(200).json({
        //         success: response ? true : false,
        //         updateCart: response ? response : "something went wrong"
        //     })
        // }
    }else {
        const response = await User.findByIdAndUpdate(_id, {$push : { cart : {product: pid, quantity, color, price, thumbnail, title }}}, {new: true});
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? "Updated your cart" : "something went wrong"
        })
    }
});

const removeProductInCart = asyncHandler(async (req, res) => {
    const { _id} = req.user;
    // console.log(_id);
    const {pid, color} = req.params;
    if(!pid) throw new Error("Missing input");

    const user = await User.findById(_id).select("cart");
    const alreadyProduct = user?.cart?.find(el =>  el.product.toString() === pid && el.color  === color);
    
    if(!alreadyProduct) {
        return res.status(200).json({
            success: true,
            mes:  "Updated your cart"
        })
    };
    const response = await User.findByIdAndUpdate(_id, {$pull : { cart : {product: pid, color }}}, {new: true});
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? "Updated your cart" : "something went wrong"
        })

});


const createUser = asyncHandler( async (req, res) => {
    const response = await User.create(users);
    return res.status(200).json({
        success: response ? true : false,
        users: response ? response : "Some thing went wrong"
    })
})


module.exports = {
    register,
    finalRegister,
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
    updateAddress,
    updateCart,

    createUser,
    removeProductInCart

}



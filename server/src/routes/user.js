const router = require("express").Router();
const ctrl = require("../controllers/user");
const uploader = require("../config/cloundinary.config");


const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", ctrl.register);
router.post("/mock", ctrl.createUser);
// router.get("/finalregister/:token", ctrl.finalRegister);
router.put("/finalregister/:token", ctrl.finalRegister);


router.post("/login", ctrl.login);

router.get("/current", verifyAccessToken ,ctrl.getCurrent); // get profile user


router.post("/refreshtoken", ctrl.refreshAccessToken);

router.get("/logout", ctrl.logout);

router.post("/forgetpassword", ctrl.forgotPassword);

router.put("/resetpassword", ctrl.resetPassword);

// chỗ sài middleware có 2 cách
// một là truyền thêm verify vài trò như là một thằng lính canh 
router.get("/getusers-test", [verifyAccessToken, isAdmin], ctrl.getListUser); // chỗ nà phải chuyển 2 cái midđleware
// một cái để lấy token xác thực xem có đúng k
// decode về id và role lưu lại vào req.user
// function isAdmin sẽ lấy role trong req.user để check role 


// hai là dùng như thế này
router.use(verifyAccessToken);
router.get("/getusers", isAdmin , ctrl.getListUser);
router.delete("/:uid", isAdmin , ctrl.deleteUser);
router.put("/address", ctrl.updateAddress);
router.put("/current",uploader.single("avatar") ,ctrl.updateUser);  // current này thì lại là update ???
router.post("/cart", ctrl.updateCart);
router.put("/:uid", isAdmin, ctrl.updateUserByAdmin);
// tất cả các route viết dưới này đều phải xác thực người dùng thông qua token

module.exports = router




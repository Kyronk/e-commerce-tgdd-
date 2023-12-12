const router = require("express").Router();
const ctrl = require("../controllers/product");

const uploader = require("../config/cloundinary.config");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// chỗ này lưu ý 1 tí xíu là code nó chạy từ trên xuống
// ưu tiên của nó phụ thuộc vào chũ cái
// ví dụ /b 
// /a // có thê route a sẽ không chạy

// chỗ router list này cũng hơi lạ
// để ý
// post nó k có route nào trùng nên để v không sao chứ trùng thì chăt route dưới cũng k chạy đc

router.get("/list", ctrl.getListProduct);

router.put("/ratings", verifyAccessToken, ctrl.ratings);

// upload image
// router.put("/uploadimage/:pid", [verifyAccessToken, isAdmin], 
//     uploader.single("image"), ctrl.uploadImageProduct);
// single mỗi lần up được 1 ảnh thôi: dùng cho trường hợp up avatar 

// up nhiều ảnh một lúc, 10 là số ảnh tối đa dược up 1 lần

router.put("/uploadimage/:pid", [verifyAccessToken, isAdmin], 
    uploader.array("image", 10), ctrl.uploadImageProduct);

router.get("/:pid", ctrl.getOneProduct);
router.put("/:pid", [verifyAccessToken, isAdmin], ctrl.updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin], ctrl.deleteProduct);

// nên để mấy cái route ngắn vs có ký tự ít xuống dưới
router.post("/", [verifyAccessToken, isAdmin], ctrl.creteProduct);

module.exports = router




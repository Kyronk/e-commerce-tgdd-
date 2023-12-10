const router = require("express").Router();
const ctrl = require("../controllers/product");

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

router.get("/:pid", ctrl.getOneProduct);
router.put("/:pid", [verifyAccessToken, isAdmin], ctrl.updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin], ctrl.deleteProduct);

// nên để mấy cái route ngắn vs có ký tự ít xuống dưới
router.post("/", [verifyAccessToken, isAdmin], ctrl.creteProduct);

module.exports = router




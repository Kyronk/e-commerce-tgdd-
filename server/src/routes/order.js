const router = require("express").Router();
const ctrl = require("../controllers/order");


const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");


router.post("/create", verifyAccessToken, ctrl.createOrder);
router.put("/status/:oid", [verifyAccessToken, isAdmin], ctrl.updateStatus);
router.get("/admin", [verifyAccessToken, isAdmin], ctrl.getListOrder);
router.get("/history-order", verifyAccessToken, ctrl.getUserOrder);

// router.get("/list", ctrl.getListBrand);
// router.put("/:brandid", [verifyAccessToken, isAdmin], ctrl.updateBrand);
// router.delete("/delete/:brandid", [verifyAccessToken, isAdmin], ctrl.deleteBrand);


module.exports = router

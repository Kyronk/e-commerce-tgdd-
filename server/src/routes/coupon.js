const router = require("express").Router();
const ctrl = require("../controllers/coupon");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", [verifyAccessToken, isAdmin], ctrl.createOneCoupon);
router.get("/list", ctrl.getListCoupon);
router.put("/update/:cid", [verifyAccessToken, isAdmin], ctrl.updateCoupon);
router.delete("/delete/:cid", [verifyAccessToken, isAdmin], ctrl.deleteCoupon);

module.exports = router;


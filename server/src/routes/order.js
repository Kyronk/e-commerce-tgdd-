const router = require("express").Router();
const ctrl = require("../controllers/order");


const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");


router.post("/create", [verifyAccessToken, isAdmin], ctrl.createOrder);

// router.get("/list", ctrl.getListBrand);
// router.put("/:brandid", [verifyAccessToken, isAdmin], ctrl.updateBrand);
// router.delete("/delete/:brandid", [verifyAccessToken, isAdmin], ctrl.deleteBrand);


module.exports = router

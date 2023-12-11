const router = require("express").Router();
const ctrl = require("../controllers/brand");


const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");


router.post("/", [verifyAccessToken, isAdmin], ctrl.createBrand);
router.get("/list", ctrl.getListBrand);
router.put("/:brandid", [verifyAccessToken, isAdmin], ctrl.updateBrand);
router.delete("/delete/:brandid", [verifyAccessToken, isAdmin], ctrl.deleteBrand);


module.exports = router

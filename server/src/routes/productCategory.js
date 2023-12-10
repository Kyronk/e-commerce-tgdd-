const router = require("express").Router();
const ctrl = require("../controllers/productCategory");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");


router.post("/", [verifyAccessToken, isAdmin], ctrl.createCategory);
router.get("/", ctrl.getCategory);
router.put("/:pcid", [verifyAccessToken, isAdmin], ctrl.updateCategory);
router.delete("/:pcid", [verifyAccessToken, isAdmin], ctrl.deleteCategory);


module.exports = router




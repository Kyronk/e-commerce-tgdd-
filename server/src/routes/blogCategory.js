const router = require("express").Router();
const ctrl = require("../controllers/blogCategory");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");


router.post("/", [verifyAccessToken, isAdmin], ctrl.createCategory);
router.get("/", ctrl.getCategory);
router.put("/:bcid", [verifyAccessToken, isAdmin], ctrl.updateCategory);
router.delete("/:bcid", [verifyAccessToken, isAdmin], ctrl.deleteCategory);


module.exports = router




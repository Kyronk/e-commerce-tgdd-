const router = require("express").Router();
const ctrl = require("../controllers/blog");

const {verifyAccessToken, isAdmin} = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], ctrl.createNewBlog);
router.get("/list-blog", ctrl.getListBlog);
router.get("/blog-item/:bid", ctrl.getOneBlog);
router.put("/dislike/:bid", [verifyAccessToken], ctrl.dislikeBlog);
router.put("/like/:bid", [verifyAccessToken], ctrl.likeBlog);


router.delete("/delete/:bid", [verifyAccessToken, isAdmin], ctrl.deleteBlog);

router.put("/:bid", [verifyAccessToken, isAdmin], ctrl.updateBlog);






module.exports = router

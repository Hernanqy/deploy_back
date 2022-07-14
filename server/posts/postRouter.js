const router = require("express").Router();
const {listAll, addOne} = require("./postController");
/*/const isAuth = require("../middlewares/isAuth");/*/
const validatiorCreatePost = require("../validators/posts");


router.get("/", listAll)

router.post("/", addOne)

module.exports = router
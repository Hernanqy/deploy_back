
const router= require("express").Router();
const {register, listAll, listOne,deleteOne, editOne, login, forgot,reset, saveNewPass}= require("../../server/users/userController");
const {validatorCreateUser, validatorEdituUser, validatorResetPassword} = require("../../server/validators/users")
const uploadFile = require("../../server/utils/handleStorage")

//get all users

router.get("/", listAll);


//get users by id

router.get("/:id", listOne);


//create new users

router.post("/register",uploadFile.single("file"),validatorCreateUser, register);


//login
router.post("/login", login) 

//Forgot password
router.post ("/forgot-password", forgot);

//Get the magic link
router.get("/reset/token", reset)
router.post("/reset/token", validatorResetPassword, saveNewPass)


//patch user

router.patch("/:id",uploadFile.single("file"),validatorEdituUser, editOne);



//delete user by id

router.delete("/:id",deleteOne);

module.exports = router
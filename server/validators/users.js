const {check, validationResult}= require("express-validator");
const  validatorCreateUser = [

    check("name")
    .exists().withMessage("Name field requiered")
    .trim()
    .isAlpha('es-ES',{ignore:' '}).withMessage("Name must contain text")
        .notEmpty().withMessage("Name must not be empty")
    .isLength({min:2, max : 90}).withMessage("Character count: min 2, max 90"),
    
    check("email")
    .exists().withMessage("Name field requiered")
    .trim()
.isEmail().withMessage("Must be address")
.normalizeEmail(),
check("password")
.exists()
.trim()
.isLength({min:8, max: 15}),

    (req, res ,next) => {
        try {
            validationResult(req).throw()
            return next()
        } catch (error) {
            res.status(400).json({errors : error.array() })
            
        }
    }


]
const validatorEdituUser =[
    check("name")
    .exists().withMessage("Name field requiered")
    .trim()
    .isAlpha('es-ES',{ignore:' '}).withMessage("Name must contain text")
        .notEmpty().withMessage("Name must not be empty")
    .isLength({min:2, max : 90}).withMessage("Character count: min 2, max 90"),
    
    check("email")
    .exists().withMessage("Name field requiered")
    .trim()
.isEmail().withMessage("Must be address")
.normalizeEmail(),


    (req, res ,next) => {
        try {
            validationResult(req).throw()
            return next()
        } catch (error) {
            res.status(400).json({errors : error.array() })
            
        }
    }


]

const validatorResetPassword = [
    check("password_1")
    .notEmpty().withMessage("Password cannot be empty")
    .exists()
    .isLength({min: 8, max: 15}).withMessage("Your password must be 8-15 characters long")
    .trim(),
    check("Passwor_2")
    .custom(async (password_2, {req})=>{
        const password_1 = req.body.password_1
        if(password_1 !== password_2) {
            throw new Error("Password must be Identical")
        }
    }),
    (req,res,next)=> {

        const token = req.params.token
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            const arrWarnings = errors.array()
            res.render("reset", {arrWarnings, token})
        }else return next()
    }

]

module.exports = {validatorCreateUser, validatorEdituUser, validatorResetPassword}
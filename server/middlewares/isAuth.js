const {tokenVerify} = require("../../server/utils/handleJWT")
const isAuth = async (req,res, next) =>{
    try {
        if (!req.headers.authorization){
            let error = new Error("No Token")
            error.status = 403
            return next(error)
        }
        const token = req.headers.authorization.split(" ").pop()
        const validToken = await tokenVerify(token)
        if (validToken instanceof Error) {
            error.message = "token expire"
            error.status = 403
            return next(error)
        }
 req.user = validToken
 next()
    } catch (error) {
        error.message ="Internal error Server"
        return next (error)
    }
}

module.exports = isAuth
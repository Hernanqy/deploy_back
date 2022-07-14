


//get all users


const { getAllUsers, getUserById, addNewUser, deleteUserById, editUserById,loginUser } = require("../../server/users/userModel")
const notNumber= require("../../server/utils/notNumber")
const { encrypt, compare} = require("../../server/utils/handlePassword")
const {matchedData} = require("express-validator")
const public_url = process.env.public_url
const { tokenSign, tokenVerify} = require("../../server/utils/handleJWT")
//get all users

const listAll =async (req,res, next)=>{
   const dbResponse = await getAllUsers();
   if (dbResponse instanceof Error) return next(dbResponse) 

  const responseUser = dbResponse.map((user) => {
      const filteredUser ={
          name: user.name, email : user.email, image: user.image}
      
      return filteredUser
      })
   dbResponse.length ? res.status(200).json(responseUser) : next()
 }


// get user by id

 const listOne = async(req, res, next) => {
     if(notNumber(req.params.id, next)) return
        const dbResponse = await getUserById(+req.params.id);
        if (dbResponse instanceof Error) return next(dbResponse)
        if (!dbResponse.length)  return next()
        
        const { id, name , email, image} = dbResponse[0]
  const responseUser = {
      id,name, email, image
  }
    res.status(200).json(responseUser)
    
}

//register
/*/const register = async (req,res,next) =>{
    console.log("aca estoy")
const cleanBody =matchedData(req)
const image = `${public_url}/${req.file.filename}`
const password = await encrypt(req.body.password)
const dbResponse = await addNewUser({...cleanBody,password,image })
console.log(dbResponse)
    if (dbResponse instanceof Error) return next(dbResponse);
    
    const user = {
        id: cleanBody.id,
        name : cleanBody.name,
        email : cleanBody.email
    
    }

    const token = await tokenSign(user,"3h")
 
    res.status(201).json({message: "User Created", JWT: token})
    
} /*/


const register = async (req, res, next) => {
    const cleanBody = matchedData(req)

const image = `${public_url}/${req.file.filename}`
const password = await encrypt(req.body.password)
const rtaRegister = await addNewUser({ ...cleanBody, password, image });
if (rtaRegister instanceof Error) return next(rtaRegister)

const user = {
    id: rtaRegister.insertId,
    name: cleanBody.name,
    email: cleanBody.email
}
const token = await tokenSign(user, "1h")
    res.status(201).json({ message: "User Created", JWT: token })
}


//login

const login = async(req, res, next) => {
    const dbResponse = await loginUser(req.body.email);
    if (!dbResponse.length) return next();
    if (await compare(req.body.password, dbResponse[0].password)) {
        const user = {
            id: dbResponse[0].id,
            name: dbResponse[0].name,
            email: dbResponse[0].email
        }
        const token = await tokenSign(user, "3h")
        res.status(200).json({ message: "User logged in!", JWT: token })
    } else {
        let error = new Error("Unauthorized")
        error.status = 401
        next(error)
    }
}

// Transporte de nodemailer-
const nodemailer= require("nodemailer")
const res = require("express/lib/response")
const { CLIENT_IGNORE_SIGPIPE } = require("mysql/lib/protocol/constants/client")
const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.mail_user,
      pass: process.env.mail_pass
    }
  });

// forgot ´password
const forgot = async (req,res,next)=>{
const dbResponse = await loginUser(req.body.email)
if (!dbResponse.length) return next();
const user = {
    id: dbResponse[0].id,
    name : dbResponse[0].name,
    email: dbResponse[0].email
}
const token = await tokenSign(user, "15m")
const link =`${public_url}/users/reset/${token}`

let mailDetails = {
    from: "tech.support@splinter",
    to: user.email,
    subject: "Password Recovery with magik LInkkkk",
    html: `<h2>Password Recovery Service</h2>
    <p> to set your pass , please click on the  link</p>
    <a href= "${link}">click to recover your password"<a/>`

}
transport.sendMail(mailDetails, (error,data) => {
    if(error) {
        error.message = "Internal Server Error"
        next(error)
    }else res.status(200).json({message: `Hi ${user.name}, we ve sent an email with instructions to ${user.email}`})
})

}

//Form Reset Password
const reset =async (req,res,next) =>{
    const {token} = req.params
    const tokenStatus = await tokenVerify(token)
    if(tokenStatus instanceof Error){
        res.send(tokenStatus)
    }else res.render("reset", {tokenStatus, token})
}

const saveNewPass = async(req,res,next) => {
const {token}= req.params
const tokenStatus = await tokenVerify(token)
if(tokenStatus instanceof Error) return res.send(tokenStatus)
const password = await encrypt(req.body.password_1)
const dbResponse = await editUserById(tokenStatus.id, {password})
dbResponse instanceof Erro? next(dbResponse): res.status(200).json({ message :`Password changed for user ${tokenStatus.name}`})
}

//edituser

const editOne = async(req,res,next) => {
    if(notNumber(req.params.id, next)) return
    const image = `${public_url}/${req.file.filename}`
    const password = await encrypt(req.body.password)
const dbResponse =await editUserById(+req.params.id, {...req.body,password, image})
if (dbResponse instanceof Error) return next(dbResponse)
    dbResponse.affectedRows ? res.status(200).json(req.body) : next()

}

//delete

const deleteOne = async(req,res, next) =>{
    if(notNumber(req.params.id, next)) return
    
    const dbResponse = await deleteUserById(+req.params.id)
    if (dbResponse instanceof Error) return next(dbResponse)
   dbResponse.affectedRows ? next(): res.status(204).end();
}

    module.exports = {listAll, listOne , register, deleteOne, editOne, login, forgot, reset, saveNewPass}
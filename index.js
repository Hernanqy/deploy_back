
require("dotenv").config();
require("./server/db/config");
const express= require ("express");
const server =express();
const hbs= require("express-handlebars");
const path = require("path")
const port = process.env.port || 3000;
server.use(express.json())
server.use(express.urlencoded({extended : true}))
server.use(express.static("storage"))
server.use('/css',express.static(path.join (__dirname,'node_modules/bootstrap/dist/css')))
server.use('/js',express.static(path.join (__dirname,'node_modules/bootstrap/dist/js')))
server.set("view engine","hbs");
server.set("views", path.join(__dirname, "views"))
server.engine("hbs", hbs.engine({ extname: "hbs"}))

server.listen(port,(err) =>{
    err? console.warn(`Hubo un error {
        message: ${err} }`) : console.log(`Servidor corre en http://localhost:${port}`)
})

server.get("/", (req, res) => {
const content =`
<h1> Nuestra Api con express</h1>
<pre> Bienvenidos a nuestra Api</pre>`
res.send(content)
})

server.use("/users",require("./server/users/userRoute"))

server.use("/posts", require("./server/posts/postRouter"))

server.use((req,res, next) => {
    let error = new Error("Resurce not found");
    error.status = 404
    next(error)
})

// Error handler
server.use((error,req,res, next) =>{
    if( !error.status) {
        error.status = 500
    }
    res.status(error.status)
    res.json({status: error.status, message: error.message})
})
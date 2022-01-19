//Modulos Externos
const express = require('express')
const exphbs = require ("express-handlebars")
const mysql = require('mysql')

//Modulos internos
const user = require('./user')

const port = 5000
const app = express()

app.use(express.json())
app.use(express.static('public'))
app.engine('handlebars', exphbs.engine())
app.set("view engine","handlebars")

const conn = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database: 'nodemysql'
})

conn.connect(function(err){
    if(err){
        console.log("erro no MySQL" + err)
    }
    console.log('Conectado ao MySQL')
    app.listen(port)
})

//Ler BODY
app.use(
    express.urlencoded({
      extended: true, 
    }),
)

//USERS 
app.use('/user',user)

//HOME
app.get('/',(req,res)=>{
   res.render(`index`)
})

// ERRO 404
app.use(function(req,res,next){
    res.status(404).render(`404`)
})

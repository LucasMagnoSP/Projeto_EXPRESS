//Modulos Externos
const express = require('express')
const exphbs = require ("express-handlebars")

//Modulos internos
const user = require('./user')

const port = 5000
const app = express()

//Ler BODY
app.use(
    express.urlencoded({
      extended: true,
    }),
)

app.use(express.json())
app.use(express.static('public'))
app.engine('handlebars', exphbs.engine())
app.set("view engine","handlebars")

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

//Port da Aplicação
app.listen(port,()=>{
    console.log(`Servidor aberto na porta ${port}`)
})
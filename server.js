//Modulos Externos
const express = require('express')

//Modulos internos
const path= require('path')
const user = require('./user')

const port = 5000
const app = express()
const basePath = path.join(__dirname, 'templates')

//Ler BODY
app.use(
    express.urlencoded({
      extended: true,
    }),
)

//CHECK DE LOGIN(DESATIVADO POR QUESTOES DE PRODUTIVIDADE)
var checkAuth = function (req, res, next) {
    req.authStatus = true
    if (req.authStatus) {
      console.log('Está logado, pode continuar')
      next()
    } else {
      console.log('Não está logado, faça o login para continuar!')
    }
}


app.use(express.json())
app.use(express.static('public'))

//USERS 
app.use('/user',user)

//HOME
app.get('/',(req,res)=>{
   res.sendFile(`${basePath}/index.html`)
})

// ERRO 404
app.use(function(req,res,next){
    res.status(404).sendFile(`${basePath}/404.html`)
})

//Port da Aplicação
app.listen(port,()=>{
    console.log(`Servidor aberto na porta ${port}`)
})
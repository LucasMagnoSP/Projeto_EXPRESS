//Modules Externos
const express = require('express')
const chalk = require('chalk')
//Modulos Internos
const router = express.Router()
const fs = require('fs')
const mysql = require('mysql')

const conn = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database: 'nodemysql'
})

//Ler BODY
router.use(
    express.urlencoded({
      extended: true,
    }),
)

//LOGIN User
router.get('/login',(req,res)=>{
    res.render('login')
})
router.post('/login',(req,res)=>{
    const usercheck = req.body.name
    const passcodecheck = req.body.passcode
    checkAuth(usercheck,passcodecheck)
    return userLogin == true
})

//CHECK DE LOGIN(EM DESENVOLVIMENTO)
var checkAuth = function (req, res,next,usercheck,passcodecheck) {
    const user = JSON.parse(fs.readFileSync(`./userData/${usercheck}.json`))
    if (usercheck == user.nome & passcodecheck == user.senha) {
        console.log('Está logado, pode continuar')
        next
    } else {
        console.log('Não está logado, faça o login para continuar!')
        userLogin=false
        return res.render('login',{userLogin})
    }
}

//Cadastro Users
router.get('/add', (req, res) => {
    res.render(`usersingin`)
})
router.post('/save', (req, res) => {
    console.log(req.body)
    const name = req.body.name
    const passcode = req.body.passcode
    const passconfirm = req.body.passconfirm
    const age = req.body.age
    const query = `INSERT INTO users (name,age,password) VALUES ('${name}','${age}','${passcode}')`  //INSERIR DADOS DE USUARIO NO BANCO DE DADOS
    var cadastroerror=false
    var error
   
    if(passcode == "" || passconfirm == "" || name == ""){
        cadastroerror = true
        error = "'É nescessario preencher todos os campos para continuar'"
        console.log(chalk.bgRed.white.bold('É nescessario preencher todos os campos para continuar'))
    }else if(fs.existsSync(`userData/${name}.json`)){
        cadastroerror = true
        error =`Usuario já existente, tente novamente !`
        console.log(chalk.bgRed.white.bold(`Usuario já existente, tente novamente !`))
    }else if(passconfirm != passcode){
        cadastroerror = true
        error =`As senhas não coincidem.`
        console.log(chalk.bgRed.white.bold(`As senhas não coincidem.`)) 
    }else{
        conn.query(query,function(err){
            if(err){
                console.log(err)
            }
        })
        var cadastrosucess = true    
        console.log(chalk.bgGreen.black.bold(`Usuario cadastrado com sucesso`))
        setTimeout(() =>cadastrosucess = false,5000 )   
    }
    setTimeout(()=>cadastroerror = false,5000)
    return res.render(`usersingin`,{cadastrosucess,cadastroerror,error})
})

//Procura por USER
router.get('/search',(req,res)=>{
    res.render(`usersearch`) 
})
router.post('/result',(req,res)=>{
    const user = req.body.userid
    if(!fs.existsSync(`./userData/${user}.json`)){
        console.log(chalk.bgRed.white.bold('Esse usuario nao existe'))  
        return res.render(`404`)
    }
    if(fs.existsSync(`./userData/${user}.json`)){
        const userFinal = JSON.parse(fs.readFileSync(`./userData/${user}.json`))
        return res.render(`user`,{userFinal}) //Retornar dados de Usuario
    }
})

//Redirecionar para ID do usuario
router.get('/search/:id', (req, res) => {  
    const user = req.params.id 
    if(!fs.existsSync(`./userData/${user}.json`)){
        console.log(chalk.bgRed.white.bold('Esse usuario nao existe'))  
        return res.render(`404`)
    }else{
        if(fs.existsSync(`./userData/${user}.json`)){
            const userFinal = JSON.parse(fs.readFileSync(`./userData/${user}.json`))
            return res.render(`user`,{userFinal}) //Retornar dados de Usuario
       }
    }
})

router.use(express.json())
module.exports = router
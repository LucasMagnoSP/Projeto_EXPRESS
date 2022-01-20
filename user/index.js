//Modules Externos
const express = require('express')
const chalk = require('chalk')
const mysql = require('mysql')

//Modulos Internos
const router = express.Router()
const fs = require('fs')

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

//(EM DESENVOLVIMENTO)
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
//CHECK DE LOGIN
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
//(EM DESENVOLVIMENTO)

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
router.post(`/search/:name`,(req,res)=>{
    const name = req.body.name
    const sql = `SELECT * FROM users WHERE name = '${name}' `
    console.log(sql)
    conn.query(sql, function(err,data){
        if(err){
            console.log(err)
        }
        const user = data[0]
        res.render('user',{user})
    })
})

router.get('/all',(req,res)=>{// VER TODOS USERS CADASTRADOS
    const sql = `SELECT * FROM users`
    conn.query(sql,function(err,data){
        if(err){
            console.log(err)
        }
        console.log(data)
        const user = data
        res.render('allusers',{user})
    })
})

router.get('/search/:id', (req, res) => {  //Redirecionar para ID do usuario
    const id = req.params.id 
    const sql = `SELECT * FROM users WHERE idusers = ${id}`

    conn.query(sql, function(err,data){
        if(err){
            console.log(err)
        }
        const user = data[0]
        res.render('user',{user})
    })
})

router.use(express.json())
module.exports = router
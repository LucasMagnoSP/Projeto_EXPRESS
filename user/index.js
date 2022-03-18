//Modules Externos
const express = require('express')
const chalk = require('chalk')

//Modulos Internos
const router = express.Router()
const fs = require('fs')
const pool = require('../db/conn')
//Ler BODY
router.use(express.urlencoded({extended: true,}),)

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

//Cadastro Users (OK)
router.get('/add', (req, res) => {
    res.render(`usersingin`)
})
router.post('/save', (req, res) => {
    console.log(req.body)
    const name = req.body.name
    const passcode = req.body.passcode
    const passconfirm = req.body.passconfirm
    const age = req.body.age
    const sql = `INSERT INTO users (??,??,??) VALUES (?,?,?)`  //INSERIR DADOS DE USUARIO NO BANCO DE DADOS
    const data =['name','age','password',name,age,passcode]
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
        pool.query(sql,data,function(err){
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

//Pagina Procura por USER (OK)
router.get('/search',(req,res)=>{
    res.render(`usersearch`)
})

//Procura por Nome de User (OK)
router.get('/search/:name',(req,res)=>{
    const name = req.query.name
    console.log(name)
    const sql = `SELECT * FROM users WHERE ?? = ?`
    const data = ['name',name]
    pool.query(sql,data, function(err,data){
        if(err){
            console.log(err)
        }  
        const user = data[0]
        res.render('user',{user})
    })
})

//Redirecionar para ID do usuario (OK)
router.get('/id/:id', (req, res) => {  
    const id = req.params.id 
    const sql = `SELECT * FROM users WHERE ?? = ?`
    const data = ['idusers',id]
    pool.query(sql,data, function(err,data){
        if(err){
            console.log(err)
        }
        const user = data[0]
        res.render('user',{user})
    })
})

router.get('/edit/:id',(req,res)=>{
    const id = req.params.id 
    const sql = `SELECT * FROM users WHERE ?? = ?`
    const data = ['idusers',id]
    pool.query(sql,data, function(err,data){
        if(err){
            console.log(err)
        }
        const user = data[0]
        res.render('useredit',{user})
    })  
})

//EDITAR DADOS USERS (OK)
router.post('/updateuser',(req,res)=>{
    const id = req.body.id
    const name = req.body.name
    const age = req.body.age
    const passcode= req.body.passcode
    const sql = `UPDATE users SET ?? = ? , ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ['name',name,'age',age,'password',passcode,'idusers',id]
    pool.query(sql,data, function(err){
       if(err){ 
           console.log(err)
       }
       res.render(`index`)
    })
})

//REMOVER USUARIO CADASTRADO
router.post('/remove/:id',(req,res)=>{
    const id = req.params.id
    const sql = `DELETE FROM users WHERE ?? = ?`
    const data = ['idusers',id]
    pool.query(sql,data,function(err){
        if(err){
            console.log(err)
        }
        console.log(chalk.bgGreen.white("Usuario removido com sucesso"))
        res.render('index')
    })
})

// VER TODOS USERS CADASTRADOS (OK)
router.get('/all',(req,res)=>{
    const sql = `SELECT * FROM users`
    pool.query(sql,function(err,data){
        if(err){
            console.log(err)
        }
        console.log(data)
        const user = data
        res.render('allusers',{user})
    })
})

router.use(express.json())
module.exports = router
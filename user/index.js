//Modules Externos
const express = require('express')
const chalk = require('chalk')
//Modulos Internos
const router = express.Router()
const path  = require('path')
const fs = require('fs')

const basePath = path.join(__dirname,'../templates')

//Ler BODY
router.use(
    express.urlencoded({
      extended: true,
    }),
)

//Cadastro Users
router.get('/add', (req, res) => {
    res.sendFile(`${basePath}/usersingin.html`)
})
router.post('/save', (req, res) => {
    console.log(req.body)
    const name = req.body.name
    const passcode = req.body.passcode
    const passconfirm = req.body.passconfirm
   
    if(passcode == "" || passconfirm == "" || name == ""){
        console.log(chalk.bgRed.white.bold('É nescessario preencher todos os campos para continuar'))

    }else if(fs.existsSync(`userData/${name}.json`)){
        console.log(chalk.bgRed.white.bold(`Usuario já existente, tente novamente !`))

    }else if(passconfirm != passcode){
        console.log(chalk.bgRed.white.bold(`As senhas não coincidem.`))
        
    }else{
        fs.writeFileSync(`userData/${name}.json`,`password : ${passcode}`)
        console.log(chalk.bgGreen.black.bold(`Usuario cadastrado com sucesso`))   
    }
    
    return res.sendFile(`${basePath}/usersingin.html`)
})

//Procura por USER  
router.get('/search',(req,res)=>{
    res.sendFile(`${basePath}/usersearch.html`) 
})
router.post('/result',(req,res)=>{
    const userid = req.body.userid
    return res.sendFile(`${basePath}/user.html`) //Retornar dados de Usuario(em desenvolvimento)
})

//Redirecionar para ID do usuario
router.get('/search/:id', (req, res) => {  
    const user = req.params.id 
    if(!fs.existsSync(`./userData/${user}.json`)){
        console.log(chalk.bgRed.white.bold('Esse usuario nao existe'))  
        return res.sendFile(`${basePath}/404.html`)
    }else{
        fs.stat(`./userData/${user}.json`,(err,stats)=>{
            console.log(chalk.bgBlue.white.bold(`Procurando usuaro : ${user}.json`))  
            return res.sendFile(`${basePath}/user.html`)  //Retornar dados de Usuario(em desenvolvimento)
        })
    }
})

router.use(express.json())
module.exports = router

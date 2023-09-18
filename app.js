const express = require('express');
const {user, blog} = require('./model/index');
const bcrypt = require('bcrypt');

const app = express();

app.set('view engine','ejs')

app.use(express.static('public/'))
// Post baat aayeko data lai parse garn 
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Register page ma jaan ko lagi
app.get('/register',(req,res)=>{
    res.render('register.ejs')
})

// login page ma jaan ko lagi
app.get('/',(req,res)=>{
    res.render('login.ejs')
})




//  -----------     POST API     -----------

//  user register garna ko lagi
app.post('/register',async (req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if(password == cpassword){
         // Db ma already email register xha ki xhain check garn ko lagi
        const checkEmailAlreadyInDb = await user.findAll({
            where:{
                email:email
            }
        })

        if(checkEmailAlreadyInDb.length == 0){
            await user.create({
                name: name,
                email:email,
                password: await bcrypt.hash(password,12)
            })
            res.redirect('/')
        }else{
            res.send("This email already in use")
        }
    }else{
        res.send("Password and Confirm Password does not match")
    }    
})



app.listen(4000,()=>{
    console.log("Node Js Has Started at 4000")
})
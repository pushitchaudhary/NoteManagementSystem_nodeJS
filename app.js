const express = require('express');
const {user, blog} = require('./model/index');
const reqFilter = require('./component/middleware');
const bcrypt = require('bcrypt');

const app = express();
const route = express.Router();

app.set('view engine','ejs')

app.use(express.static('public/'))
// Post baat aayeko data lai parse garn 
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// if url link ma valid User Id xhain vane Page Not Found dekhauna lai 
route.use(reqFilter);

//  -----------     GET API     -----------

// page not found ko lagi
app.get('/error404',(req,res)=>{
    res.render('error404.ejs')
})

// if account register xhain vane
app.get('/notexist',(req,res)=>{
    res.render('notexist')
})

// Register page ma jaan ko lagi
app.get('/register',(req,res)=>{
    res.render('register.ejs')
})

// login page ma jaan ko lagi
app.get('/login',(req,res)=>{
    res.render('login')
})

// if password wrong xha vane
app.get('/passwordWrong',(req,res)=>{
    res.render('passwordWrong')
})

app.get('/accountDeletedAlert',(req,res)=>{
    res.render('accountDeletedAlert');
})

// Register page ma jaan ko lagi
app.get('/register',(req,res)=>{
    res.render('register.ejs')
})




// bina user id ko url diyema 
// app.get('/',(req,res)=>{
//     res.render('loginreq')
// })

// home page ma jaan ko lagi
app.get('/', async (req, res) => {
    // const paraid = req.params.id;

    // Assuming 'paraid' is the user's ID, retrieve data based on this ID from your database
    // For example, fetch the user's blog posts
    // const userBlogPosts = await blog.findAll({
    //     where: {
    //         userId: paraid
    //     }
    // });

    // You can fetch other data as needed

    // Then render the 'blog' view with the data
    res.render('blog');
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
            res.redirect('/login')
        }else{
            res.send("This email already in use")
        }
    }else{
        res.send("Password and Confirm Password does not match")
    }    
})


// Login garn ko lagi
app.post('/login',async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    // user-database ma user le haaleko email register xha ki xhain check garn 
    const checkUserEmailInDB = await user.findAll({
        where:{
            email:email
        }
    })

    if(checkUserEmailInDB.length == 0){
        res.render('notexist')
    }else if(checkUserEmailInDB.length == 1){
        const obj = checkUserEmailInDB[0].id;
        const confirmPassword = await bcrypt.compare(password, checkUserEmailInDB[0].password);
        if(confirmPassword){
            // if user email and password valid vayema tyo user ko id number Blog(/) page ma pathau ne
            res.render('/11')
        }else{
            res.redirect('/passwordWrong')
        }
    }else{
        res.send("Something went wrong")
    }
})





// if user le wrong url haale ma
app.get('*',(req,res)=>{
    res.render('error404.ejs')
})

app.use('/',route);


app.listen(4000,()=>{
    console.log("Node Js Has Started at 4000")
})
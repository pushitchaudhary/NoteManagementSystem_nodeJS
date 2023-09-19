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
route.use(reqFilter);

// if url link ma valid User Id xhain vane Page Not Found dekhauna lai 


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
app.get('/',(req,res)=>{
    res.render('login')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

// if password wrong xha vane
app.get('/passwordWrong',(req,res)=>{
    res.render('passwordWrong')
})

// app.get('/accountDeletedAlert',(req,res)=>{
//     res.render('accountDeletedAlert');
// })

// Register page ma jaan ko lagi
app.get('/register',(req,res)=>{
    res.render('register.ejs')
})




// bina user id ko url diyema 
// app.get('/',(req,res)=>{
//     res.render('loginreq')
// })



// home page ma jaan ko lagi
app.get('/home/:id', route, async(req, res) => {
    const paraid = req.params.id;
    console.log(paraid);

    if (/^\d+$/.test(paraid)) {
        try {
            // User Database
            const userDb = await user.findAll({
                where: {
                    id: paraid
                }
            });

            // Blog Datbase
            const blogDb = await blog.findAll({
                where: {
                    userId: paraid
                }
            });

            if (blogDb.length > 0) {
                const value = blogDb.length;
                res.render('blog.ejs', { userDb, blogDb, value });
            } else {
                const value = blogDb.length;
                res.render('blog.ejs', { userDb, value });
            }
        } catch (error) {
            console.error(error);
            res.render('error500.ejs'); // Handle the error gracefully, e.g., by rendering an error page
        }
    } else {
        res.render('error404.ejs');
    }
});



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


// Login garn ko lagi
app.post('/',async (req,res)=>{
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
            res.redirect(`/home/${obj}`)
        }else{
            res.redirect('/passwordWrong')
        }
    }else{
        res.send("Something went wrong")
    }
})





// if user le wrong url haale ma
// app.get('*',(req,res)=>{
//     res.render('error404.ejs')
// })



app.listen(4000,()=>{
    console.log("Node Js Has Started at 4000")
})
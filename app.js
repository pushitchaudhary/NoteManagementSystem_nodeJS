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

// Blog Edit/Update page show garn ko lagi
app.get('/updateBlog/:id', async (req,res)=>{
    const postId = req.params.id;
    // url ma aako value valid interger xhain ki xhain check garn
    if (/^\d+$/.test(postId)){
        // to check if user le patha ko post value DB ma xha ki xhain if xhain vane error 404 dekhaune
        const blogPostId = await blog.findAll({
            where:{
                id:postId
            }
        })
        // url ma aayeko value database sng match garyo bhane updateblog page ma pathe dine
        if(blogPostId.length == 1){
            res.render('updateBlog',{blogPostId})
        }else{
            res.render('error404.ejs')
        }
    }else{
        res.render('error404.ejs')
    }
})

// Edit profile page kholna ko lagi
app.get('/editProfile/:userId', async (req,res)=>{
    const userId = req.params.userId;

    // params baat ko value valid integer xha ki xhain check garn
    if (/^\d+$/.test(userId)){
        const DbUserId = await user.findAll({
            where:{
                id:userId
            }
        })

        if(DbUserId.length == 1){
            res.render('editProfile',{DbUserId})
        }else{
            res.render('error404.ejs')
        }
    }else{
        res.render('error404.ejs')
    }
})



// single blog show garna ko lagi
app.get('/singleBlog/:postId', async (req,res)=>{
    const postId = req.params.postId;

    // params baat ko value valid integer xha ki xhain check garn
    if (/^\d+$/.test(postId)){
        
        // Check User-Id and Post-Id in Blog DB
        const chekUserData = await blog.findAll({
            where:{
                id:postId
            }
        })

        // if user le url ma database ma na vako post id haayo bhane error 404 dekhaune
        if(chekUserData != ''){
            // User Db baat usern information nikalna ko lagi
            const userName = await user.findAll({
                where:{
                    id: chekUserData[0].userId
                }
            })

             // User-DB ma ra Blog DB ma User Id same xha ki xhain check garn
            if(userName[0].id == chekUserData[0].userId){
                //  if user le haale ko user id ra post id sahi xha vane matra  single blog ma pathaune
                if(chekUserData.length == 1){
                    res.render('singleBlog',{userName,chekUserData})
                }else{
                    res.render('error404.ejs')
                }
            }else{
                res.render('error404.ejs')
            }
        }else{
            res.render('error404.ejs')
        }
    }else{
        res.render('error404.ejs')
    }
})


// create blog page ma jana ko lagi
app.get('/createBlog/:id', async (req,res)=>{
    const paraId = req.params.id;
    // params baat ko value valid integer xha ki xhain check garn
    if (/^\d+$/.test(paraId)) {
        const userID = await user.findAll({
            where:{
                id:paraId
            }
        })

        res.render('createBlog', {paraId});
        if(userID.length > 0){
        }else{
            res.render('error404.ejs')
        }
    }else{
        res.render('error404.ejs')
    }
})

// deleteAccount page ma jana ko lagi
app.get('/deleteAccount/:id', async (req,res)=>{
    const id = req.params.id;
    // params baat ko value valid integer xha ki xhain check garn
    if (/^\d+$/.test(id)) {
        // url baat aako value User Db xha ki xhain check garn ko lagi
        const userId = await user.findAll({
            where:{
                id:id
            }
        })

        if(userId.length == 1){
            res.render('deleteAccount',{userId})
        }else{
            res.render('error404.ejs')
        }
    }else{
        res.render('error404.ejs')
    }
})

// bina user id ko url diyema 
app.get('/',(req,res)=>{
    res.render('loginreq')
})


// home page ma jaan ko lagi
app.get('/:id', async (req,res)=>{
    const paraid =  req.params.id

    if (/^\d+$/.test(paraid)) {
        // User Database 
        const userDb = await user.findAll({
            where:{
                id:paraid
            }
        })

        // Blog Datbase
        const blogDb = await blog.findAll({
            where:{
                userId:paraid
            }
        })

        if(blogDb.length > 0){
            const value = blogDb.length;
            res.render('blog.ejs',{userDb,blogDb,value})
        }else{
            const value = blogDb.length;
            res.render('blog.ejs',{userDb,value})
        }
    }else {
        res.render('error404.ejs')
    }
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
            res.redirect(`/${obj}`)
        }else{
            res.redirect('/passwordWrong')
        }
    }else{
        res.send("Something went wrong")
    }
})


// Blog Create garn ko lagi 
app.post('/createBlog/:id', async (req,res)=>{
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const description = req.body.description;
    const userId = req.params.id;

    if (/^\d+$/.test(userId)) {
        await blog.create({
            title:title,
            subtitle:subtitle,
            description:description,
            userId:userId
        })
        res.redirect(`/${userId}`)
    }else{
        res.render('error404.ejs')
    }

})


// Blog edit or Update garn ko lagi
app.post('/updateBlog/:id', async (req,res)=>{
    const postId = req.params.id;
    const upTitle = req.body.uptitle;
    const upSubtitle = req.body.upsubtitle;
    const upDescrition = req.body.updescription

    // url ma valid interger value aako xha ki xhain garn
    if (/^\d+$/.test(postId)) {
        // url ma aako user Id Blog_Db ma xha ki xhain check garn lai
        const blogDbCheck = await blog.findAll({
            where:{
                id:postId
            }
        })

        if(blogDbCheck.length == 1){
            // Blog_DB baat user-id nikaler User_Db ma check garne user id valid xha ki xhain
            const userDbCheck = await user.findAll({
                where:{
                    id:blogDbCheck[0].userId
                }
            })

            // if Blog_Db ra User_Db ko value match garyo bhane data update gardine
            if(blogDbCheck[0].userId == userDbCheck[0].id){
                const UpdateData = await blog.update({
                    title:upTitle,
                    subtitle:upSubtitle,
                    description:upDescrition
                    },{
                        where:{
                            id:postId
                        }
                    })
                res.redirect(`/singleBlog/${postId}`)
            }else{
                res.render('error404.ejs')
            }
        }else{
            res.render('error404.ejs')
        }
    }else{
        res.render('error404.ejs')
    }  
})


// post delete garna ko lagi
app.get('/deleteBlog/:postNum', async (req,res)=>{
    const postNum = req.params.postNum;

    // url ma valid interger value aako xha ki xhain garn
    if (/^\d+$/.test(postNum)) {
        // post Id baat user Id nikalana lai
        const userIdNum = await blog.findAll({
            where:{
                id:postNum
            }
        }) 
        const userIdNumber = userIdNum[0].userId;

        const deletePost = await blog.destroy({
            where:{
                id:postNum
            }
        })
        res.redirect(`/${userIdNumber}`)
    }else{
        res.render('error404.ejs')
    }
})

// Account Delete garn ko lagi
app.post('/finalAccountDelete/:id', async (req,res)=>{
    const id = req.params.id;
    const confirm = req.body.confirm;
    const password = req.body.password;

    // url ma valid interger value aako xha ki xhain garn
    if (/^\d+$/.test(id)) {
        const userConfirm = await user.findAll({
            where:{
                id:id
            }
        })

        if(userConfirm[0].id == id){
            const username = userConfirm[0].name;
            const hashPassword = userConfirm[0].password;

            const Cpassword= await bcrypt.compare(password,hashPassword)

            if(confirm == username && Cpassword == true){

                const DeleteBlogs = await blog.destroy({
                    where:{
                        userId:id
                    }
                })

                const DeleteUser = await user.destroy({
                    where:{
                        id:id
                    }
                })
                // res.redirect('/login')
                res.redirect('/accountDeletedAlert')

            }else{
                res.render('error404.ejs')
            }
        }else{
            res.render('error404.ejs')
        }
    }else{
        res.render('error404.ejs')
    }   

})


// Profile Upadte garn ko lagi
app.post('/updateProfile/:id', async (req,res)=>{
    const id = req.params.id;
    const upName = req.body.name;
    const upEmail = req.body.email;

    // url ma valid interger value aako xha ki xhain garn
    if (/^\d+$/.test(id)) {
        // url ma aako id User DB ma xha ki xhain check garn
        const UserDbCheck = await user.findAll({
            where:{
                id:id
            }
        })
        const userIdNumber = UserDbCheck[0].id;

        if(UserDbCheck[0].id == id){
            const profileUpdated = user.update({
                name:upName,
                email:upEmail
            },{
                where:{
                    id:id
                }
            })
            res.redirect(`/${userIdNumber}`)
        }else{
            res.render('error404.ejs')
        }


    }else{

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
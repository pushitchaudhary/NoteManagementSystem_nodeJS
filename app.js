const express = require('express');
const {user, blog} = require('./model/index');
const bcrypt = require('bcrypt');
const { renderHomePage, RenderCreateBlog, PostCreateBlog, PostEditBlog, RenderEditBlog, RenderDeleteBlog, RenderSingleBlog, RederHomeWithoutID } = require('./controller/blog/blogController');
const {PostUserRegisters, RenderRegisterPage, RenderLoginPage1, RenderLoginPage2, RenderPasswordWrong, RenderAccountDelete, PostLogin, PostAccountDelete, RenderEditProfile, PostUpdateProfile} = require('./controller/user/UserController');
const { RenderError, NotExist, RenderAllLink } = require('./controller/extra/extra');


const app = express();

app.set('view engine','ejs')

app.use(express.static('public/'))
// Post baat aayeko data lai parse garn 
app.use(express.json());
app.use(express.urlencoded({extended:true}))




//  -----------     GET API     -----------

// page not found ko lagi
app.get('/error404', RenderError )

// if account register xhain vane
app.get('/notexist', NotExist)

// Register page ma jaan ko lagi
app.get('/register', RenderRegisterPage)

// login page ma jaan ko lagi
app.get('/', RenderLoginPage1)
app.get('/login', RenderLoginPage2)

// if password wrong xha vane
app.get('/passwordWrong', RenderPasswordWrong)

// account delete alert
app.get('/accountDeletedAlert', RenderAccountDelete)

// Register page ma jaan ko lagi
app.get('/register', RenderRegisterPage)

// Blog Edit/Update page show garn ko lagi
app.get('/updateBlog/:id', RenderEditBlog)

// Edit profile page kholna ko lagi
app.get('/editProfile/:userId', RenderEditProfile)



// single blog show garna ko lagi
app.get('/singleBlog/:postId', RenderSingleBlog)

// create blog page ma jana ko lagi
app.get('/createBlog/:id', RenderCreateBlog)

// deleteAccount page ma jana ko lagi
app.get('/deleteAccount/:id', RenderDeleteBlog)

// bina user id ko url diyema 
app.get('/home', RederHomeWithoutID )

// home page ma jaan ko lagi
app.get('/home/:id',renderHomePage );



//  -----------     POST API     -----------

//  user register garna ko lagi
app.post('/register', PostUserRegisters )

// Login garn ko lagi
app.post('/login', PostLogin)

// Blog Create garn ko lagi 
app.post('/createBlog/:id', PostCreateBlog)

// Blog edit or Update garn ko lagi
app.post('/updateBlog/:id', PostEditBlog)

// post delete garna ko lagi
app.get('/deleteBlog/:postNum',RenderDeleteBlog)

// Account Delete garn ko lagi
app.post('/finalAccountDelete/:id', PostAccountDelete)

// Profile Upadte garn ko lagi
app.post('/updateProfile/:id',PostUpdateProfile)

// if user le wrong url haale ma
app.get('*', RenderAllLink)


app.listen(4000,()=>{
    console.log("Node Js Has Started at 4000")
})
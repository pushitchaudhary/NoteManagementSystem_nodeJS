const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const session = require('express-session');
const flash = require('connect-flash');

const UserRoute = require('./routes/userRoute')
const BlogRoute = require('./routes/blogRoute');
const ExtraRoute = require('./routes/extraRouter')
// ejs file dekhauna ko lagi
app.set('view engine','ejs')

app.use(session({
    secret:'helloworld',
    resave : false,
    saveUninitialized :false
}))

app.use(flash())

// folder access dina ko lagi
app.use(express.static('public/'))
// image-folder access dina ko lagi
app.use(express.static('uploads/'))



// Post baat aayeko data lai parse garn 
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}))



app.use('',UserRoute, BlogRoute, ExtraRoute);

// port number
app.listen(4000,()=>{
    console.log("Node Js Has Started at 4000")
})
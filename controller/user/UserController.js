const {user,blog} =  require('../../model/index');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const sendEmail = require('../../services/sendEmail');
const {promisify} = require('util')
require('dotenv').config();

// login page ma jaan ko lagi
exports.RenderLoginPage1 = (req,res)=>{

    res.render("login")
}

exports.RenderLoginPage2 = (req,res)=>{
    const error = req.flash('error')
    res.render('login',{error})
}

// if password wrong xha vane
exports.RenderPasswordWrong = (req,res)=>{
    res.render('passwordWrong')
}

// account delete alert
exports.RenderAccountDelete = (req,res)=>{
    res.render('accountDeletedAlert');
}

// Register page ma jaan ko lagi
exports.RenderRegisterPage = (req,res)=>{
    res.render('register.ejs')
}

// user register garna ko lagi
exports.PostUserRegisters = async (req,res)=>{
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
}

// Login garn ko lagi
exports.PostLogin = async (req,res)=>{
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

            const token =  jwt.sign({id:checkUserEmailInDB[0].id},process.env.SECRETKEY,{
                expiresIn:'30d'
            })
            res.cookie('token',token);

            // if user email and password valid vayema tyo user ko id number Blog(/) page ma pathau ne
            res.redirect('/home')
        }else{
            req.flash("error",'Invalid Password');
            res.redirect('/login')
        }
    }else{
        res.send("Something went wrong")
    }
}

// Account Delete garn ko lagi
exports.PostAccountDelete  = async (req,res)=>{
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
}

// edit profile hern ko lagi
exports.RenderEditProfile =  async (req,res)=>{
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
}

// Profile Upadte garn ko lagi
exports.PostUpdateProfile =  async (req,res)=>{
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
            res.redirect(`/home/${userIdNumber}`)
        }else{
            res.render('error404.ejs')
        }
    }else{

    }
}

// cookies ko session clear garn
exports.logout = (req,res)=>{
    res.clearCookie('token')
    res.redirect('/login');
}

exports.otpCookiesClear = (req,res)=>{
    res.clearCookie('OtpToken');
    res.redirect('/login');
}

// render forget password
exports.ForgetPassword = (req,res)=>{
    res.render('forgetPassword')
}

exports.PostForgetPassword = async (req,res)=>{
    const email = req.body.email;

    const userDb = await user.findAll({
        where:{
            email:email
        }
    })

    if(userDb.length == 1){
        res.render('identify_account',{userDb:userDb})
    }else{
        return res.send ('user not found')
    }
}

// render forget password -> post

// render reset your password
exports.ResetYourPassword = async (req,res)=>{
    const userId =  req.params.id

    const UserDetails = await user.findAll({
        where:{
            id:userId
        }
    })

    res.render('ResetYourPassword',{UserDetails})
}

exports.PostResetYourPassword = async (req,res)=>{
    const userId = req.params.id;
    const method = req.body.resetMethod;

    const UserDet = await user.findAll({
        where:{
            id:userId
        }
    })
    const UserEmail = UserDet[0].email;

    if(method == 'email'){
        var otpGenerate = Math.floor(1000 + Math.random() * 9000);

        sendEmail({
            email: UserEmail,
            subject: 'Password Forget',
            text: `your otp is ${otpGenerate}`
        })
        UserDet[0].otp = otpGenerate;
        UserDet[0].otpGeneratedTime = Date.now();
        await UserDet[0].save();

        // const OtpToken =  jwt.sign({email:UserEmail},process.env.OTPKEY,{
        //     expiresIn:'1d' // ------> change here
        // })
        // res.cookie('OtpToken',OtpToken);
        res.redirect(`/otpCode/${UserEmail}`)

    }else{
        res.redirect('/login')
    }
}


exports.identify_account = (req,res)=>{
    res.render('identify_account');
}

exports.PostIdentify_account = async (req,res)=>{
    const UserID = req.params.id;

    const userDetails =  await user.findAll({
        where:{
            id:UserID
        }
    })

    if(userDetails[0].id == UserID){
        res.redirect(`/resetYourPassword/${userDetails[0].id}`)
    }else{
        console.log('id not matched');
    }

}

// otp
exports.RenderOtpCode = (req,res)=>{
    const Useremail = req.params.email;
    res.render('otpCode',{Useremail})
}

exports.PostRenderOtpCode =async (req,res)=>{
    const Useremail = req.params.email;
    const UserInputOtp = req.body.otp;
    console.log(UserInputOtp);

    const UserData = await user.findAll({
        where:{
            email:Useremail
        }
    })

    if(UserData[0].otp == UserInputOtp){
        const CurrentTime = Date.now();
        if(CurrentTime -  UserData[0].otpGeneratedTime <= 120000){
            UserData[0].otp = null;
            UserData[0].otpGeneratedTime = null;
            await UserData[0].save();
                const OtpToken =  jwt.sign({email:Useremail},process.env.OTPKEY,{
                    expiresIn:'1d' // ------> change here
                })
                res.cookie('OtpToken',OtpToken);
            res.redirect('/newPassword')
        }else{
            console.log('otp expired')
        }
    }else{
        res.send("Invalid Otp")
    }
}

exports.RenderNewPassword = (req,res)=>{
    res.render('newPassword.ejs')
}

exports.PostNewPassword = async (req,res)=>{
    const OtpToken = req.cookies.OtpToken;
    const VerifyOtpToken  = await promisify(jwt.verify)(OtpToken,process.env.OTPKEY);
    const Useremail = VerifyOtpToken.email;

    const newPassword = req.body.password;
    const confPassword = req.body.confirm_password;

    const UserDetails = await user.findAll({
        where:{
            email :Useremail
        }
    })

    if(newPassword == confPassword){
        if(UserDetails.length == 1){

            await user.update({
                password: await bcrypt.hash(newPassword,12)
            },{where:{
                    id:{
                        id:UserDetails[0].id
                    }
                }
            })

            res.clearCookie('OtpToken')
            res.redirect('/login');
        }else{
            res.send("Server Error")
        }
    }else{
        res.send("password and confirm password don't match")
    }

}
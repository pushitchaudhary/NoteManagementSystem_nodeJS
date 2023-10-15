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
    const message = req.flash('message')
    const messageColor = req.flash('color')
    let color ='';
    if(messageColor == 'success'){
        color = 'success'
    }else{
        color = 'danger';
    }
    res.render('login',{message,color})
}

// account delete alert
exports.RenderAccountDelete = (req,res)=>{
    res.render('accountDeletedAlert');
}

// Register page ma jaan ko lagi
exports.RenderRegisterPage = (req,res)=>{
    const message = req.flash('message');
    const AlertColor = req.flash('color');
    let color ='';
    if(AlertColor == 'success'){
        color = 'success';
    }else{
        color ='danger';
    }
    res.render('register.ejs',{message,color})
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
            req.flash('message','Your account has been created successfully');
            req.flash('color',"success")
            res.redirect('/login')
        }else{
            req.flash('message','This email already in use');
            req.flash('color','danger');
            res.redirect('/register')
        }
    }else{
        req.flash('message','Password and Confirm Password does not match');
        req.flash('color','danger')
        res.redirect('/register');
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
        req.flash('message',"Account not exist")
        req.flash('color',"danger")
        res.redirect('/login')
    }else if(checkUserEmailInDB.length ==1){
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
            req.flash("message",'Invalid Password');
            req.flash('color',"danger")
            res.redirect('/login')
        }
    }else{
        req.flash('message','Something went wrong')
        req.flash('color','danger');
        res.redirect('/login')
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
                req.flash('message','Account Deleted');
                req.flash('color','success');
                res.redirect(`/login`)

            }else{
                req.flash('message','Something went wrong');
                req.flash('color','danger');
                res.redirect(`/deleteAccount/${id}`)
            }
        }else{
            req.flash('message','Something went wrong');
            req.flash('color','danger');
            res.redirect(`/deleteAccount/${id}`)
            
        }
    }else{
        req.flash('message','Something went wrong');
        req.flash('color','danger');
        res.redirect(`/deleteAccount/${id}`)
    }   
}

// edit profile hern ko lagi
exports.RenderEditProfile =  async (req,res)=>{
    const userId = req.params.userId;

    const message = req.flash('message');
    const color = req.flash('color');
    let AlertColor = '';
    console.log('gjgj ',AlertColor)
    if(color == 'success'){
        AlertColor = 'success';
    }else{
        AlertColor = 'danger';
    }
    
    // params baat ko value valid integer xha ki xhain check garn
    if (/^\d+$/.test(userId)){
        const DbUserId = await user.findAll({
            where:{
                id:userId
            }
        })

        console.log(DbUserId);
        if(DbUserId.length == 1){
            res.render('editProfile',{DbUserId,message,AlertColor})
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
            req.flash('message',"Your profile has been successfully updated");
            req.flash('color',"success");
            res.redirect(`/home`)
        }else{
            req.flash('message',"Something went wrong");
            req.flash('color',"danger");
            res.redirect(`/editProfile/${id}`)
        }
    }else{
        req.flash('message',"Something went wrong");
        req.flash('color',"danger");
        res.redirect(`/editProfile/${id}`)
    }
}

// cookies ko session clear garn
exports.logout = (req,res)=>{
    res.clearCookie('token')
    res.redirect('/login');
}

// render forget password
exports.ForgetPassword = (req,res)=>{
    const message = req.flash('message');
    const color = req.flash('color')
    res.render('forgetPassword',{message,color})
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
        req.flash('message','User Not Found')
        req.flash('color','danger')
        return res.redirect('/forgetPassword')
    }
}

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
    const message = req.flash('message');
    const color = req.flash('color');

    console.log(message, color)

    const Useremail = req.params.email;
    res.render('otpCode',{Useremail,message,color})
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
                    expiresIn:'1800s' // ------>  30 min 
                })
                res.cookie('OtpToken',OtpToken);
                res.redirect('/newPassword')
        }else{
            req.flash('message','Otp expired');
            req.flash('color','danger');
            res.redirect(`/otpCode/${Useremail}`)

        }
    }else{
        // res.send("Invalid Otp")
        req.flash('message','Invalid Password');
        req.flash('color','danger');
        res.redirect(`/otpCode/${Useremail}`)
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
        console.log("Password and confirm password don't match")
        res.send("Password and confirm password don't match")
    }

}
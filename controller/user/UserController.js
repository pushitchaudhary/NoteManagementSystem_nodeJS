const {user,blog} =  require('../../model/index');
const bcrypt = require('bcrypt');

// login page ma jaan ko lagi
exports.RenderLoginPage1 = (req,res)=>{
    res.render('login')
}

exports.RenderLoginPage2 = (req,res)=>{
    res.render('login')
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
            // if user email and password valid vayema tyo user ko id number Blog(/) page ma pathau ne
            res.redirect(`/home/${obj}`)
        }else{
            res.redirect('/passwordWrong')
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
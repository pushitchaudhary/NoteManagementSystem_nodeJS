const {user, blog} = require('../../model/index');
const jwt = require('jsonwebtoken');
const {promisify} = require('util')
const fs = require('fs')

// bina user id ko url diyema 
exports.RederHomeWithoutID = (req,res)=>{
    // res.render('loginreq')
    res.render('blog.ejs')
}


exports.renderHomePage = async(req, res) => {
    const message = req.flash('message');
    const color = req.flash('color');
    const data = req.user[0].id;
    const UserData = await user.findAll({
        where:{
            id:data
        }
    })
    const Userblogs = await blog.findAll({
        include:{
            model: user
        }
    })
    res.render('blog.ejs',{Userblogs,UserData,message,color})
}

// create Blog
exports.RenderCreateBlog = async (req,res)=>{
    const message = req.flash('message');
    const color = req.flash('color')

    res.render('createBlog.ejs',{message,color})
}

// create blog post
exports.PostCreateBlog = async (req,res)=>{

    if(!req.file){
        req.flash('message',"Image required");  
        req.flash('color','danger');
        return res.redirect('/createBlog')
        
    }

    const image = req.file.filename;
    const imageSize = req.file.size;

    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const description = req.body.description;
    const userId = req.user[0].id;
    
    if(imageSize < 100000){
        if (/^\d+$/.test(userId)) {
            await blog.create({
                title:title,
                subtitle:subtitle,
                description:description,
                userId:userId,
                image:process.env.BLOGIMAGEPATH+image
            })
            req.flash('message',"Successfully Created");
            req.flash('color','success');    
            res.redirect('/home')
        }else{
            req.flash('message',"Something went wrong");
            req.flash('color','danger');    
            res.redirect('/createBlog')
        }
    }else{
        req.flash('message',"Image size is too much");  
        req.flash('color','danger');    
        res.redirect('/createBlog')
    }
}

// blog edit hern ko lagi
exports.RenderEditBlog = async (req,res)=>{
    const message = req.flash('message');
    const color = req.flash('color');
    console.log('sdfsdfsf ',message, color)

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
            res.render('updateBlog',{blogPostId,message,color})
        }else{
            res.render('error404.ejs')
        }
    }else{
        res.render('error404.ejs')
    }
}

// Blog edit post ko lagi
exports.PostEditBlog = async (req,res)=>{
    const postId = req.params.id;
    const upTitle = req.body.uptitle;
    const upSubtitle = req.body.upsubtitle;
    const upDescrition = req.body.updescription

    const database_Data = await blog.findAll({
        where:{
            id:postId
        }
    })

    let ImageData;

    if(req.file){
        ImageData = process.env.BLOGIMAGEPATH+req.file.filename
        const databaseImage = database_Data[0].image;
        const urlCount = process.env.BLOGIMAGEPATH.length;
        const oldImageName = databaseImage.slice(urlCount)
        await fs.unlink(`uploads/${oldImageName}`,(err)=>{
            if(err){
                req.flash('message',"Something went wrong");
                req.flash('color','danger');  
                return res.redirect(`/updateBlog/${postId}`)
            }else{
                console.log('Photo deleted');
            }
        })
    }else{
        ImageData = database_Data[0].image;
    }

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
                    description:upDescrition,
                    image:ImageData
                    },{
                        where:{
                            id:postId
                        }
                    })
                req.flash('message',"Successfully Post Updated");
                req.flash('color','success');  
                return res.redirect(`/singleBlog/${postId}`)
            }else{
                req.flash('message',"Something went wrong");
                req.flash('color','danger');  
                return res.redirect(`/updateBlog/${postId}`)
            }
        }else{
            req.flash('message',"Something went wrong");
            req.flash('color','danger');  
            return res.redirect(`/updateBlog/${postId}`)
        }
    }else{
        req.flash('message',"Something went wrong");
        req.flash('color','danger');  
        return res.redirect(`/updateBlog/${postId}`)
    }  
}

// deleteAccount page ma jana ko lagi
exports.RenderDeleteBlog =  async (req,res)=>{
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
            // req.flash('message','Something went wrong');
            // req.flash('color','danger');
            // res.redirect('/')
        }
    }else{
        res.render('error404.ejs')
    }
}



// single blog hern ko lagi
exports.RenderSingleBlog = async (req,res)=>{
    const postId = req.params.postId;
    const message = req.flash('message');
    const color = req.flash('color');
    const token = req.cookies.token

    if(!token){
        return res.send('You must be logged in')
    }
    const VerifyUserIdToken  = await promisify(jwt.verify)(token,process.env.SECRETKEY);

    const UserId = VerifyUserIdToken.id;



    // params baat ko value valid integer xha ki xhain check garn
    if (/^\d+$/.test(postId)){
        
        // Check User-Id and Post-Id in Blog DB
        const chekUserData = await blog.findAll({
            where:{
                id:postId
            }
        })

        const postUserId = chekUserData[0].userId

        

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

                    if(UserId == postUserId){
                        UserMatched = true;
                        res.render('singleBlog',{userName,chekUserData,UserMatched,message,color})
                    }else{
                        UserMatched = false;
                        res.render('singleBlog',{userName,chekUserData,UserMatched,message,color})
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
    
    }else{
        res.render('error404.ejs')
    }
}

// post delete garna ko lagi
exports.RenderBlogDelete =  async (req,res)=>{
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
        req.flash('message','Post Deleted Successfully');
        req.flash('color','success');
        res.redirect('/home/')
    }else{
        req.flash('message','Something Went Wrong');
        req.flash('color','danger');
        res.redirect('/home')
    }
}






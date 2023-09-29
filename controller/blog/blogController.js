const {user, blog} = require('../../model/index');

// bina user id ko url diyema 
exports.RederHomeWithoutID = (req,res)=>{
    // res.render('loginreq')
    res.render('blog.ejs')
}


exports.renderHomePage = async(req, res) => {
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

    res.render('blog.ejs',{Userblogs,UserData})
}

// create Blog
exports.RenderCreateBlog = async (req,res)=>{
    res.render('createBlog.ejs')
}

// create blog post
exports.PostCreateBlog = async (req,res)=>{

    const image = req.file.filename;
    console.log(req.file);

    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const description = req.body.description;
    const userId = req.user[0].id;
    
    console.log(userId);

    if (/^\d+$/.test(userId)) {
        await blog.create({
            title:title,
            subtitle:subtitle,
            description:description,
            userId:userId,
            image:process.env.BLOGIMAGEPATH+image
        })
        res.redirect('/home')
    }else{
        res.render('error404.ejs')
    }

}

// blog edit hern ko lagi
exports.RenderEditBlog = async (req,res)=>{
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
}

// Blog edit post ko lagi
exports.PostEditBlog = async (req,res)=>{
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
        }
    }else{
        res.render('error404.ejs')
    }
}



// single blog hern ko lagi
exports.RenderSingleBlog = async (req,res)=>{
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
        res.redirect('/home/')
    }else{
        res.render('error404.ejs')
    }
}






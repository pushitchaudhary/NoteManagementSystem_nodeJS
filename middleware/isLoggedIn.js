const jwt = require('jsonwebtoken');
const {promisify} = require('util')
const {user} = require('../model/')

exports.isLoggedIn = async (req,res,next)=>{
    const token = req.cookies.token

    if(!token){
       return res.send('You must be logged in')
    }

    const verfyLoggedInToken = await promisify(jwt.verify)(token,process.env.SECRETKEY);

    const userExist = await user.findAll({
        where:{
            id:verfyLoggedInToken.id
        }
    })

    if(userExist.length == 0){
        res.send("User with that token doesn't exist")
    }else{
        req.user = userExist;
        req.userID = userExist[0].id
        next();
    }

}


module.exports = reqFilter = (req,res,next)=>{
    if(!req.query.age){
        res.redirect('/pageNotFound')
    }else{
        next();
    }
}
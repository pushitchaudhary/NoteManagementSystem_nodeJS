module.exports = reqFilter = (req,res,next)=>{
    if(!req.params.id){
        res.redirect('/error404')
    }else{
        next();
    }
}
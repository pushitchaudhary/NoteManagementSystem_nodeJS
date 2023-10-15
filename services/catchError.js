// code for handling errors asynchoronous

module.exports = (fn) => {
    return (req, res,next) => {
      fn(req, res,next).catch((err) => {
        const path = req.route.path;
        req.flash("message","Something went wrong")
        return res.redirect(path)

      });
    };
  };
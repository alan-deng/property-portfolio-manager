exports.isAuth = (req, res, next) => {
    if(req.isAuthenticated() && (req.user._id == req.params.userId)){
        next()
    } else {
        res.status(401).json({msg: `You're not authorized`})
    }
}


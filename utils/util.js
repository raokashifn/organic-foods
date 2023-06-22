const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({
        email: user.phone
    },
        process.env.JWT_SECRET || 'somesecretkey', {
        expiresIn: '1d'
    })
}


const isAuth = async (req, res, next) => {

    if (req.cookies) {
        const token = req.cookies.token;
        jwt.verify(
            token,
            process.env.JWT_SECRET || 'somesecretkey',
            async (err, decode) => {
                if (err) {
                     // next();
          res.redirect('/auth/login');}
        //    else if(req.cookies.admin){
        //             next();
        //         }
           else {
                    next();
                }
            }
        );
    } else {
        res.status(401).send({ success: false, message: 'login failed, incorrect user/password!' });
    }
}

module.exports = {
    isAuth,
    generateToken
};
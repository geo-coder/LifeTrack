const jwt=require('jsonwebtoken')
const User=require('../models/user')

const auth = async (req, res, next) => {
    


    try {

        
        
        //const token = req.header('Authorization').replace('Bearer ', '')
        const token = req.cookies.token
        
        
        //const decoded=jwt.verify(token, 'this is private key')
        const decoded=jwt.verify(token, process.env.AUTH_KEY)
        
        const user=await User.findOne({_id: decoded._id, 'tokens.token': token})


        if (!user) {
            throw new Error()
        }
        req.user=user
        req.tokeninfo={_id: decoded._id, token: token}
        
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
        }
        }
 module.exports = auth







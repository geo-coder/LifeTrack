const jwt=require('jsonwebtoken')
const User=require('../models/user')

const auth = async (req, res, next) => {
    console.log(typeof(jwt))


    try {

        console.log('try started')
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log('token', token)
        const decoded=jwt.verify(token, 'this is private key')
        console.log(decoded)
        const user=await User.findOne({_id: decoded._id, 'tokens.token': token})


        if (!user) {
            throw new Error()
        }
        req.user=user
        req.tokeninfo={_id: decoded._id, token: token}
        console.log('authorized')
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
        }
        }
 module.exports = auth







const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
var jwt = require('jsonwebtoken')

var userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    addresses: [

        {
            address: {
                street: String,
                city: String,
                startDate: Date,
                endDate: Date

            }


        }
    ],
    
    tokens: [
        {
            token: {

                type: String,
                required: true

            }

        }



    ]
})



userSchema.pre('save', async function () {

    if (this.isModified('password')){

        this.password=await bcrypt.hash(this.password, 8)

    }

})


userSchema.statics.findByCredentials = async (email, password) => {

    const user=await User.findOne({email})

    if(!user){
        throw new Error('Unable to login.')
    }

    const isMatch=await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login.')
    }

    return user


}


userSchema.methods.genAuthToken=async function() { //generate authentication token, save it to the user
    const user = this
    console.log(user._id)
    const token=jwt.sign({_id:user._id.toString()}, 'this is private key')
    user.tokens=user.tokens.concat({token})
    await user.save()

}


var User=mongoose.model('User', userSchema)

module.exports=User
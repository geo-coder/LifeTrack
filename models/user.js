const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
var jwt = require('jsonwebtoken')

var userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
        maxlength: [64, 'First name exceeds maximum length of 64 characters.']
    
    
    },
    lastName: {
        type: String,
        maxlength: [64, 'Last name exceeds maximum length of 64 characters.']
    },
    email: {
        unique: true,
        type: String,
        required: true,
        validate: {
            validator: function(val) {
                var pattern=/@/
                
                
                if (pattern.test(val)===false) {
                    return false
                }
            },
            message: "E-mail missing @ symbol."
        },
        
    },
    password: {
        type: String,
        required: true
    },
    addresses: [

        {
            address: {
                addressLineOne: String,
                unitNo: String,
                city: String,
                state: String,
                zip: String,
                notes: String,
                startDate: String,
                endDate: String,
                formattedStart: String,
                formattedEnd: String,
                
                
            }


        }
    ],

    deletedAddresses: [

        {
            address: {
                addressLineOne: String,
                unitNo: String,
                city: String,
                state: String,
                zip: String,
                notes: String,
                startDate: String,
                endDate: String,
                formattedStart: String,
                formattedEnd: String,
                
                
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
    
    const token=jwt.sign({_id:user._id.toString()}, 'this is private key')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token

}


var User=mongoose.model('User', userSchema)

User.init().then(() => {
    // safe to create users now.
 })



 userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('There was a duplicate key error'));
    } else {
      next();
    }
  });


module.exports=User
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
var jwt = require('jsonwebtoken')

var userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    userName:{
        type: String,
        maxlength: [50, 'User name exceeds maximum length of 50 characters'],
        required: true,
        unique: true
    },
    
    
    password: {
        type: String,
        maxlength: [200, 'Password exceeds maximum length of 200 characters.'],
        required: true
    },
    addresses: [

        {
            address: {
                addressLineOne: {
                  type: String,
                  maxlength: [50, 'Address line one exceeds maximum length of 50 characters.']
                },
                unitNo: {
                  type: String,
                  maxlength: 20
                },
                city: {
                  type: String,
                  maxlength: 50
                },
                state:{ 
                    type: String,
                    maxlength: 2

                },
                zip: {
                    type: String,
                    maxlength: 10

                },
                notes:{
                    type: String, 
                    maxlength: [20000, 'Exceeds 10,000 character length limit on Notes field']
                },
                startDate: {
                    type: String,
                    maxlength: 15
                },
                endDate: {
                    type: String,
                    maxlength: 15
                },
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


userSchema.statics.findByCredentials = async (userName, password) => {

    const user=await User.findOne({userName})

    if(!user){
        throw new Error('Unable to login.')
    }

    const isMatch=await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login.')
    }

    return user


}

//added to remove sensitive data from res; double check this
userSchema.methods.toJSON = function () {


    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


userSchema.methods.genAuthToken=async function() { //generate authentication token, save it to the user
    const user = this
    
    const token=jwt.sign({_id:user._id.toString()}, process.env.AUTH_KEY)
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
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        validate:{
            validator: email => User.doesNotExist({ email }),
            message: "Email already exists"
        }
    },
    firstname:{
        type: String,
        required: true,
    },
    lastname:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    }
}, {timestamps: true});

//Pre-hook for schema, This code will run before User instance saves
UserSchema.pre('save', function(){
    if(this.isModified('password')){
        this.password = hashSync(this.password, 10);
    }
});

//Custom validator for username and password field
//This is async step so we use asyncs/await to check if field exists or not
//Database level validations
UserSchema.statics.doesNotExist = async function (field){
    console.log(this.where(field).countDocuments === 0);
    return await this.where(field).countDocuments === 0;
}

//Method to checked hashed password
UserSchema.methods.comparePasswords = function(password){
    return compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
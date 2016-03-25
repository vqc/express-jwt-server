const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//Define Model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true},
  password: String,
});

//onSave hook, encrypt password
userSchema.pre('save', function(next){
  //get access to the user model (userSchema)
  const user = this;

  //generate salt then run callback
  bcrypt.genSalt(10, function(err, salt){
    if(err){
      return next(err);
    }
    //hash the password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err){
        return next(err);
      }
      //replace plaintext with the hash
      user.password = hash;
      //save the model
      next();
    })
  })
});

//add a helper method to userSchema.methods
//use it to determine whether the password provided is equal
//to the hashed password in the database
userSchema.methods.comparePassword = function(candidatePassword, callback){
  //this refers to the user, thus this.password refers to the user's password
  //each user is an instance of hte userSchema
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){
      return callback(err);
    }
    callback(null, isMatch);
  });
};

//Create model class
const ModelClass = mongoose.model('user', userSchema);

//Export model
module.exports = ModelClass;

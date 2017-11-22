validateUser = function(user){

  var errors = {};
  if (!user.username){
    errors.username = "Please fill in a name.";
  }



  if(Meteor.users.findOne({username: user.username})){
    errors.username = "This username already exists.";
  }

  //De la merde, utiliser peut être Accounts.oncreateuser();

  if (!user.email){
    errors.email = "Please fill in an email";
  }

  if(!user.password){
    errors.password = "Please fill in a password.";
  }

  else{

    var regex = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,3}$/;
    if(!regex.test(user.email)){
      errors.email = "Email is not valid.";
    }
    else{
      Meteor.call("mailExist" , user.email, function(err,result){
        if(err){
          alert(err);
        }
        console.log(result);
        if(result){
          errors.email = "This email is already linked to an account.";
        }
      });
    }
  }



  return errors;
}

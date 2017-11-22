Accounts.validateNewUser(function(user){

  if (!user.username){
    throw new Meteor.Error(500, "Please fill in an username");
  }

  if(Meteor.users.findOne({username: user.username})){
    throw new Meteor.Error(500, "This username already exists");
  }

  if (!user.emails){
    throw new Meteor.Error(500, "Please fill in an email");
  }


  var regex = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,3}$/;
  if(!regex.test(user.emails[0].address)){
      throw new Meteor.Error(500, "Email is not valid");
  }

  if(Meteor.users.findOne({"emails.0.address": user.emails[0].address})){
    throw new Meteor.Error(500, "This email is already linked to an account.");
  }

  return true;

});

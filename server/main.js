import { Meteor } from 'meteor/meteor';
import "../lib/collections/Project.js";

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({

  "userNameExist" :function(_userName){

    result =  Meteor.users.find({username: _userName});
    if(result){
      return result.username;
    }
    return false;

  },

  /**
  *Verifiy if mail is already use by a user
  **/

  "mailExist" : function(_mail){
    result = Meteor.users.find({mail: _mail});

    if(result){
      return true;
    }else{
      return false;
    }
  }
});

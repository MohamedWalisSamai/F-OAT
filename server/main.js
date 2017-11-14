import { Meteor } from 'meteor/meteor';
import "../lib/collections/Project.js";
const fs = require('fs');
export const xmlPath = "/tmp/";

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish('projects', function() {
  return Projects.find({owner: Meteor.user().username});
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
    send the string wich represent the xml file name
  */
  "getXml": function(name){

<<<<<<< HEAD
    var ret =fs.readFileSync(xmlPath+name+".xml","utf8");
=======
    var ret =fs.readFileSync(name,"utf8");
>>>>>>> b1d2404e411c03f97d6a1eac65c457607a3ebeb1
    return {data:ret};


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

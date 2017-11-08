import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './register.html';

validate = function(){



}

Template.register.events({

  /**
  Creation of a new User in the mongo Collection
  */
  'click #registerForm' (event,instance){

    var ok = true;
    var _name = $('#userName').val();
    var _mail = $('#mail').val();
    var _password = $('#password').val();
    var _newUsr = {
      username : _name,
      email: _mail,
      password: _password,
      test: "test",
      profile: {
        projects:[]
      }

    }

    alert("name "+_name);
    Meteor.call("userNameExist",_name,(err,result)=>{
      if(err){
        alert(err)
      }
      if(result){

        ok = false;
      }
    });

    Meteor.call("mailExist" , _mail,(err,result)=>{
      if(err){
        alert(err);
      }
      if(result){
        ok =false;
      }
    });

    if(ok){
      Accounts.createUser(_newUsr , (err)=>{
        if(err){
          alert(err.reason);
        }else{
          log.info("new user create",_newUsr,_newUsr._Id);
          Router.go("/");
        }
      });
    }
  }


});

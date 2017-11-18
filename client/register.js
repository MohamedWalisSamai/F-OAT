import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './register.html';

Template.register.onCreated(function(){
  Session.set('userSubmitErrors',{});
});

Template.register.helpers({
  errorMessage: function(field){
    return Session.get('userSubmitErrors')[field];
  },
  errorClass: function(field){
    return !!Session.get('userSubmitErrors')[field] ? 'has-error' : '';
  }
});


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

    var errors = validateUser(_newUsr);
    console.log("test");
    if(errors.username || errors.email || errors.password){
      return Session.set('userSubmitErrors',errors);
    }

    Accounts.createUser(_newUsr , (err)=>{
      if(err){
        alert(err.reason);
      }else{
        log.info("new user create",_newUsr,_newUsr._Id);
        Router.go("/");
      }
    });
  }

});

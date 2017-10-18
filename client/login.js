import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './login.html';


Template.login.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.login.events({


  'click #submit'(event, instance) {
    var _usrname = $('#name').val();
    var _psswd = $('#password').val();

    Meteor.loginWithPassword({
      username: _usrname
    }, _psswd, function(err) {

      if (err) {
        alert(err.reason)
      }else{
        Router.go('/');
      }
    });
  }


});

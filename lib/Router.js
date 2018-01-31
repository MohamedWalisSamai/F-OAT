import { Logger } from 'meteor/ostrio:logger';
import {Projects } from "../lib/collections/Project.js";
log = new Logger;

Router.configure({
  layoutTemplate: 'mainLayout',
  notFoundTemplate: "notFound"
});



Router.route('/', {
  name: 'dashboard'
});

Router.route('/options',{
  name: 'options'
});

Router.route('/noRight',{
  name: 'noRight'
});

Router.route('/newProject',{
  name: 'newproject'
});

Router.route("/testPlayer",{
  name: 'testPlayer'
});

Router.route('/project/:_id',{
  name:'project',
  data: function(){
    return {
      project: Projects.findOne(this.params._id)
    }

  }
});

Router.route('/team/:_id',{
  name:'team'
});


Router.route('/login',{
  name: 'login'
});

Router.route('/register',{
  name: 'register'
},);


Router.route('/animals',{
  name: 'animals'
});

Router.route('/user/:_id',{
  name:'user',
  data: function(){
    return {
      id : parseInt(this.params._id),
    }
  }
});

Router.onBeforeAction(function(){
  if (!Meteor.user()) {
  // if the user is not logged in, render the Login template
  this.render('login');
} else {
  // otherwise don't hold up the rest of hooks or our route/action function
  // from running
  this.next();
}
},
{except: ['register']});

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Projects} from '../lib/collections/Project.js';
import './team.html';

var project;
Template.team.onRendered(function(){
  project = Projects.findOne({_id : Router.current().params._id });
  if(!project){
    Router.go('dashboard');//redirect to dashboard if project do not exist
  }
  if(Meteor.user().username != project.owner){
    Router.go('noRight');//current user can't access to this page
  }
  $('select').material_select();
});
Template.team.events({

  /**
    Remove a participants of the team
  */
  'click .delete' (event,instance){
    Projects.update({_id : Router.current().params._id }, {$pull:{ participants: {username: this.username}}});
  },

  /**
    Update the right of a participant of the team
  */
  'click .rightChange' (event,instance){
    alert(toto.owner);
    var $buttonEvent = $(event.target);
    var newRight = $buttonEvent.closest('tr').find('select').val();
    Meteor.call('changeRight',Router.current().params._id,this.username,newRight,(error,result)=>{
      if(error){
        alert(error.reason);
      }
    })
  },

  /**
    Add a cowoerker to the team
  */
  'click .newCoworker' (event,instance){

    var newCoworker_name = $('.newCoworker_name').val();
    var newCoworker_right = $('select.newCoworkerRight').val();
    alert("toto");
    Meteor.call("userNameExist",newCoworker_name,(err)=>{
      alert("tuc");
      if(err){
        alert(err.reason);
      }
      else{
        Projects.update({_id : Router.current().params._id }, {$push:{ participants: {username: newCoworker_name,right: newCoworker_right}}});


      }
    });
  },
});


Template.team.helpers({
  Owner: function(){
    return Projects.findOne(Router.current().params._id).owner;
  },

  Project: function(){
    return Projects.findOne(Router.current().params._id);
  }
});

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Projects} from '../../../../lib/collections/Project.js';
import './dashboard.html';


Template.dashboard.helpers({

  projects(){
    return Projects.find({ $or: [ { owner: Meteor.user().username }, { "participants.username": Meteor.user().username } ] });
  },
  isOwner(id){
    var project = Projects.findOne(id);
    if(project){
      console.log(project);
      if(project.owner == Meteor.user().username){
        return true;
      }
    }
    return false;

  }
});

Template.dashboard.events({

  'click .remove' (event, instance){
    var elm = event.target;
    var $elm = $(elm);
    Projects.remove({_id: $elm.attr('name')},(err)=>{
      if(err){
        alert(error);
      }
    })
  },
  'click .exit' (event, instance){
    Meteor.call('removeParticipants',event.target.getAttribute('name'),Meteor.user().username);

  },
})

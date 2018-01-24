import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Projects} from '../lib/collections/Project.js';
import './notifications.html';


Template.notifications.helpers({
  notifications: function(){
    return Projects.findOne(Router.current().params._id).notifications;
  }
});

Template.notification.events({
    //Remove the notification from the notification list.
    'click #read'(event,instance){
      event.preventDefault();
      var dateToRemove = $(event.currentTarget).data().date;
      Projects.update({ _id : Router.current().params._id}, {$pull: {notifications: {date: dateToRemove}}});
    }
});

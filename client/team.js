import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Projects} from '../lib/collections/Project.js';
import './team.html';


Template.team.events({

});

Template.team.helpers({
  Owner: function(){
    return Projects.findOne(Router.current().params._id).owner;
  },

  Project: function(){
    console.log(Projects.findOne(Router.current().params._id).participants);
    return Projects.findOne(Router.current().params._id);
  }
});

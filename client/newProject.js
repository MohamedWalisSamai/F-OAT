import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Projects} from '../lib/collections/Project.js';
import './newProject.html';

Template.newproject.events({

  'click #newProjectForm' (event,instance){

    var _projectName = $('.projectName').val();
    var ownerId = Meteor.user();
    var project = {
      name: _projectName,
      owner: ownerId.username,
    };

    Projects.insert(project,(err)=>{
      if(err){
        alert("error insert");
      }else{
        Router.go("/");
      }
    });
  }

});

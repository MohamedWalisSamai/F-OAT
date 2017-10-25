import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Projects} from '../lib/collections/Project.js';
import './newProject.html';

Template.newproject.onCreated(function(){
  Session.set('postSubmitErrors',{});
});

Template.newproject.helpers({
  errorMessage: function(field){
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function(field){
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.newproject.events({

  'click #newProjectForm' (event,instance){

    var _projectName = $('.projectName').val();
    var _projectUrl = $('.url').val();

    var _projectFile = $('#selectedFile')[0].files[0];
    console.log(_projectFile);
    var _url = 'err';

    if(!_projectFile){
      _url = _projectUrl;
    }
    else if(!_projectUrl){
      _url = _projectFile;
    }
    console.log(_url);

    var ownerId = Meteor.user();
    var project = {
      name: _projectName,
      owner: ownerId.username,
      url: _url
    };

    //On fait des vérifications sur le nom et l'url donnés au projet
    //(non vides et name pas déjà dans les projets de l'utilisateur).

    var errors = validateProject(project);
    if(errors.name || errors.url || errors.file){
      return Session.set('postSubmitErrors',errors);
    }

    Projects.insert(project,(err)=>{
      if(err){
        alert("error insert");
      }else{
        Router.go("/");
      }
    });
  }

});

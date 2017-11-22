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
    return !!Session.get('pos tSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.newproject.events({

    'click #newProjectForm' (event,instance){
        event.preventDefault();
        var _projectName = $('.projectName').val();
        var _projectUrl = $('.url').val();

        var _projectFile = $('#selectedFile')[0].files[0];

        /*var _participant = $('.participant').val();*/
        var _participant = $('#participant').val();

        console.log(_participant);

        var _url = 'error';

        //If we give an URL for the project
        if(!_projectFile){
            _url = _projectUrl;
        }

        //Else, if we give a file for the project
        else if(!_projectUrl){
            _url = _projectFile.name;
            ext = ['mp4','avi','mkv','wmv','mov'];
            if(!checkExtension(ext,_url)){
                _url = 'errorExt';
            }
        }

        var ownerId = Meteor.user();
        var project = {
            name: _projectName,
            owner: ownerId.username,
            url: _url,
            participants:_participant,
            notifications:[]
        };

        //We verify the name and the url of the project (not null and not already used)

        var errors = validateProject(project);
        if(errors.name || errors.url || errors.file){
            return Session.set('postSubmitErrors',errors);
        }

        Meteor.call('saveDocument', project, function(err, res){
            if(err){
                alert("error insert");
            }else{
                if(_projectFile){
                    //Get the data of the file
                    reader = new FileReader();

                    //When reading file is done
                    reader.onload = function(event){

                        //var buffer =  new Uint8Array(reader.result) //convert to binary

                        var buffer = reader.result;
                        //Call a method from project.js on server side
                        Meteor.call('createFile', {project,buffer}, function(error, result){
                            if(error){
                                alert(error.reason);
                            }
                            else{
                                //Create a notification if the file has been uploaded
                                Projects.update({
                                    _id: res
                                }, {
                                    $push: {notifications: {date: new Date().toString(), value: "Your file "+project.url+" has been uploaded."}}
                                });
                            }
                        });
                    }
                    reader.readAsDataURL(_projectFile); //read the file as base64 dataURL
                    Router.go("/");
                }
                else{
                    Router.go("/");
                }
            }
        });
    },
    'keyup #search': function(event) {
        Session.set('search/keyword', event.target.value);
    }
});


// This function is used to check that the file is a video
function checkExtension(verifExt, fileValue){
    var fileExtension = fileValue.substring(fileValue.lastIndexOf(".")+1, fileValue.lenght);
    fileExtension = fileExtension.toLowerCase();
    for (var ext of verifExt){
        if(fileExtension==ext){
            return true;
        }
    }
    return false;
}

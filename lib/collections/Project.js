import { Mongo } from 'meteor/mongo';

export const Projects = new Mongo.Collection('projects');

validateProject = function(project){
  var errors = {};
  if (!project.name){
    errors.name = "Please fill in a name";
  }
  var user = Meteor.user();
  if(Projects.findOne({owner: user.username, name: project.name})){
    errors.name = "A project with this name already exists.";
  }
  if (!project.url){
    errors.url = "Please fill in a URL";
  }
  if(project.url==="err"){
    errors.url = "Give an URL or a file, not both.";
  }
  return errors;
}

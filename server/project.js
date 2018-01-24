import {Projects} from '../lib/collections/Project.js';

Meteor.methods({
  createFile: function({project, buffer}){
    //Write the file on server
    var fs = Npm.require("fs");
    //var dir = "/tmp/"+project._id;
    var dir = "/tmp/"+project.owner+project.name;

    //Create a directory for the project if it doesn't exist
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    //By default, write file in .meteor/local/build/programs/server/ but we write in tmp.
    fs.writeFile(dir+"/"+project.url, buffer, 'base64', function(err) {
      if(err) {
        throw (new Meteor.Error(500, 'Failed to save file.', err));
      }
      else{
        console.log("File saved successfully!");
      }
    });

    fs.writeFile(dir+"/"+"annotation.xml","",function(err){
      if(err) {
        throw (new Meteor.Error(500, 'Failed to save file.', err));
      }
      else{
        console.log("File saved successfully!");
      }
    });

  },

  createXMLFile: function(project){
    var fs = Npm.require("fs");
    //  var dir = "/tmp/"+project._id;
    var dir = "/tmp/"+project.owner+project.name;

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    fs.writeFile(dir+"/"+"annotation.xml","",function(err){
      if(err) {
        throw (new Meteor.Error(500, 'Failed to save file.', err));
      }
      else{
        console.log("File saved successfully!");
      }
    });
  },

  //Function that insert a project in db and returns the id of the inserted project
  saveDocument: function(project){
    return Projects.insert(project);
  },

  removeParticipants: (_projectId,_username)=>{

    console.log(_projectId);
    console.log(_username);
    var project = Projects.findOne(_projectId);
    if(!project){
      throw Error("Invalid project id");
    }else{
      console.log(project),
      Projects.update({_id:_projectId}, {$pull:{participants: {username: _username}}},(err,result)=>{
        if(err){
          console.log("erreur");
        }else{
          console.log(result);
          console.log(project);
        }
      });
    }

  },

  /*
  Change the right of an user for a project

  param _id : the id of the project
  param username : the user to change right
  param newRight : the new right for the user
  */
  changeRight: (_projectId,_username,_newRight)=>{

    var project = Projects.findOne(_projectId);
    if(!project){
      throw Error("Invalid project id");
    }
    if (project.participants.filter(e => e.username === _username).length == 1) {

      if(_newRight === "Owner"){//change owner the previous owner get write right
        var previousOwner = project.owner;

        Projects.update({_id : _projectId, name: project.name }, {$pull:{participants: {username: _username}}},(err,rec,stat)=>{
          if(err){
            throw  (new Meteor.Error(500, 'Failed to update project', err.reason));
          }else{
            Projects.update({_id : _projectId },{$set:{owner: _username}},(err1,rec,stat)=>{
              if(err1){
                throw  (new Meteor.Error(500, 'Failed to update project', err.reason));
              }else{
                Projects.update({_id : _projectId }, {$push:{ participants: {username: previousOwner,right: "Write"}}},(err2,rec,stat)=>{
                  if(err2){
                    throw  (new Meteor.Error(500, 'Failed to update project', err.reason));
                  }
                });
              }
            });
          }
        });
        return 2;
      }else{// basic right change
        Projects.update({_id: _projectId ,"participants.username": _username},{$set: {"participants.$.right":_newRight}})
        console.log(project.participants);
        return 1;
      }
    }
  }
});

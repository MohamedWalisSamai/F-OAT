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

  changeRight: (_id,username,newRight)=>{
    console.log("COucou!!");
  }
});

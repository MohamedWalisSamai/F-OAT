import {Projects} from '../lib/collections/Project.js';

Meteor.methods({
  createFile: function({project, buffer}){
    //Write the file on server
    var fs = Npm.require("fs");
    var dir = "/tmp/"+project.owner+"_"+project.name;

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
  },

  //Function that insert a project in db and returns the id of the inserted project
  saveDocument: function(project){
    return Projects.insert(project);
  }
});

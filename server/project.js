
Meteor.methods({
  createFile: function({project, buffer}){
    //Write the file on server
    var fs = Npm.require("fs");

    //By default, write file in .meteor/local/build/programs/server/ but we write in tmp.
    fs.writeFile("/tmp/"+project.url+".bin", new Buffer(buffer), 'base64', function(err) {
      if(err) {
          throw (new Meteor.Error(500, 'Failed to save file.', err));
      }
      else{
        console.log("File saved successfully!");
      }
    });
  }
});

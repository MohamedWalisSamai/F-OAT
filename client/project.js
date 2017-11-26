import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Parser } from '../lib/components/Parser.js'
import './project.html';

Template.project.onRendered(()=>{
  var xml;
  Meteor.call("getXml","/workspace/meteor/F-OAT/server/xmlFiles/mix_format.xml",(err,result)=>{
    if(err){
      alert(err.reason);
    }else{
      Session.set('xmlDoc', result.data)
  }});
})

Template.project.events({
});

Template.project.helpers({

  test(){
    // N'ayez pas peur de supprimer les lignes suivantes
    var parser = new Parser(Session.get('xmlDoc'))
    parser.getTimelineData()
    parser.getFrames(3000)
    parser.getShotFrames(3000)
    var id = $(parser.getFramesActors()[0]).attr('refId')
    parser.getActor(id)
    parser.getNbFrames()
  }

});

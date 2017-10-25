import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './project.html';

Template.project.onRendered(()=>{
  var xml;
  Meteor.call("getXml","lala",(err,result)=>{
    if(err){
      alert(err.reason);
    }else{
      console.log(result.data);
      xml = result.data;
      alert(xml);
      var $xml = $.parseXML(xml);
      //$xml.find('#id1').val();
    }
  });
})

Template.project.events({


});
Template.project.helpers({
});

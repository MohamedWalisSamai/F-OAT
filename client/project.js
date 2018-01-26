import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Parser } from '../lib/components/Parser.js'
import { Writer } from '../lib/components/Writer.js'
import './project.html';

// browse the Xml and add the input to the form with the data from the xml
function browseXml(xml, iNode, jNode, parentNode){
  if(xml == undefined){
    alert("No xml to display.")
  }else{
      var nodeName
      var nodeValue
      var attrName
      var attrValue
      var li

      $(xml).each(function(i,e0){
        nodeName = e0.nodeName
        nodeValue = $(e0).clone().children().remove().end().text()
        // console.log('nodeName', nodeName)
        // console.log("nodeValue", nodeValue)
        $(parentNode).append('<a href="#" class="buttonXml" link="fieldXml' + nodeName + iNode + "-" + jNode  + '">' +  nodeName + '</a>')
        $(parentNode).append('<ul id="fieldXml'+ nodeName + iNode + "-" + jNode + '" style="display:none"></ul>')

        if($(xml).children().length == 0){
          li = '<li><label>text</label><input  id="' + nodeName + '" type="text"></li>'
          $('#fieldXml'+ nodeName + iNode + "-" + jNode ).append(li)
        }

        $(e0.attributes).each(function(i,e1){
          //console.log("idNode",idNode)
          attrName = e1.name
          attrValue = e1.value
          //console.log("attrName", attrName)
          //console.log("attrVal", attrValue)
          li = '<li><label> ' +  attrName + '</label>'
          li +='<input  id=" ' + attrName + '" type="text" value="'+ attrValue +'"></li>'
          $('#fieldXml' + nodeName + iNode + "-" + jNode).append(li)
        })
      })
      if($(xml).children() != undefined){
        $(xml).children().each(function(j,e){
          browseXml(e, iNode+1, j , '#fieldXml' + nodeName + iNode + "-" + jNode)
       })
      }
    }
}

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
  'change #listFrame'(event,instance){
    var parser = new Parser(Session.get('xmlDoc'))
    //console.log('getFrame',parser.getFrame($('#listFrame').val()))
    $('#formXml').empty()
    browseXml(parser.getFrame($('#listFrame').val()), 0, 0, '#formXml')
  },

  'click .buttonXml'(event,instance){
    var elm = $(document).find('ul[id="' + $(event.target).attr('link') + '"]')    
    if($(elm).attr('style') == 'display:none'){
      $(elm).attr('style','display:block')
    }
    else{
      $(elm).attr('style','display:none')
    }
  }
});

Template.project.helpers({
  test(){
    // N'ayez pas peur de supprimer les lignes suivantes
    var parser = new Parser(Session.get('xmlDoc'))
    // parser.getTimelineData()
    // parser.getFramesActors()
    parser.getFrame(221)
    // parser.getShotsActor(0)
    // parser.getFrames(4725)
    // parser.getFrames(4726)
    // parser.getFrames(4727)
    // parser.getShotFrames(3800)
    // parser.getActor(1)
    //parser.getShotsActor(1)
    // parser.getNbFrames()
    // parser.getShotFrames(3000)
    // var id = $(parser.getFramesActors()[0]).attr('refId')
    // parser.getActor(id)
    // parser.getNbFrames()
    // parser.getShotFrames(3149)
    parser.getMaxIdActor()
    var writer = new Writer(Session.get('xmlDoc'))
    //writer.addFrame('<frame timeId="3149"><path>3149</path></frame>')
    writer.addActor('<actor icon="Actor/Danny.png" id="2" name="Danny" ></actor>')
    writer.addFrame('<frame timeId="4600"><path>4600.png</path></frame>')
    //writer.deleteActor(1)
  }
});

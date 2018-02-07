
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Form } from '../../../../lib/components/Form.js'
import { Parser } from '../../../../lib/components/Parser.js'
import { Writer } from '../../../../lib/components/Writer.js'
import './project.html';

// browse the Xml and add the input to the form with the data from the xml
function browseXml(xml, iNode, parentNode){
  if(xml == undefined){
    alert("No XML to display.")
  }else{
      var nodeName
      var nodeValue
      var attrName
      var attrValue
      var li

      $(xml).each(function(i,e0){
        nodeName = e0.nodeName
        nodeValue = $(e0).clone().children().remove().end().text()
        //console.log('nodeName', nodeName)
        //console.log("nodeValue", nodeValue)

        // case for the root node
        if(iNode == 1){
            $(parentNode).append('<a href="#" id ="'+ nodeName + '"class="XMLButton" link="' + iNode + '">' +  nodeName + '<i class="small material-icons">keyboard_arrow_down</i></a>')
            $(parentNode).append('<ul id="' + iNode + '" style="display:block"></ul>')
        }else{
            $(parentNode).append('<li><a href="#" id ="'+ nodeName + '" class="XMLButton" link="' + iNode + '">' +  nodeName + '<i class="small material-icons">keyboard_arrow_left</i></a></li>')
            $(parentNode).append('<ul id="' + iNode + '" style="display:none"></ul>')
        }


        if($(xml).children().length == 0){
          li = '<li><label>text</label><input  id="' + nodeName + '" type="text" value="' + nodeValue + '"></li>'
          $('#' + iNode).append(li);
        }

        $(e0.attributes).each(function(i,e1){
          //console.log("idNode",idNode)
          attrName = e1.name;
          attrValue = e1.value;
          //console.log("attrName", attrName)
          //console.log("attrVal", attrValue)
          li = '<li><label> ' +  attrName + '</label>'
          li +='<input  id=" ' + attrName + '" type="text" value="'+ attrValue +'"></li>'
          $('#' + iNode).append(li)
        })
        var addAttr = '<li><a href="#" class="addAttr">Add attributes to ' + nodeName + '<i class="small material-icons">add_circle</i></a></li>'
        $('#' + iNode).append(addAttr)
      })
      if($(xml).children() != undefined){
        $(xml).children().each(function(j,e){
          browseXml(e, iNode + "-" + j , '#' + iNode )
       })
      }
      $('#' + iNode).append('<li><a href="#" class="addNode">Add child to ' + nodeName + '<i class="small material-icons">add_circle</i></a></li>')
    }
}

Template.project.onRendered(()=>{
  var xml;
  console.log(Router.current().params._id);
  Meteor.call("getXml","/home/boby/Documents/M1/F-OAT/server/xmlFiles/mix_format.xml",(err,result)=>{
    if(err){
      alert(err.reason);
    }else{
      Session.set('xmlDoc', result.data)
  }});
})

Template.project.events({
  // temporary event which links and XMLForm
  'change #listFrame'(event,instance){
    //console.log('getFrame',parser.getFrame($('#listFrame').val()))
    $('#XMLTab').empty()
    $('#XMLForm').empty()
    console.log('getFrame',Parser.getFrame(Session.get('xmlDoc'),$('#listFrame').val()))
    Form.browseXml(Parser.getFrame(Session.get('xmlDoc'),$('#listFrame').val()), 1, '#XMLTab', '#XMLForm')
  },

  // show or hide the attributes and the children of the element
  'click .tab'(event, instance){
    var id = event.target.id

    $('#XMLForm').children().each(function(i,e){
    if($(e).attr('id') == 'div' + id){
          $(e).attr('style','display:block')
      }else{
        $(e).attr('style','display:none')
      }
    })
  }
});

Template.project.helpers({
  test(){
    // N'ayez pas peur de supprimer les lignes suivantes
    // Parser.getTimelineData(Session.get('xmlDoc'))
    // Parser.getFramesActors(Session.get('xmlDoc'))
    // Parser.getFrame(Session.get('xmlDoc'),221)
    // Parser.getShotsActor(Session.get('xmlDoc'),0)
    // Parser.getFrames(Session.get('xmlDoc'),4725)
    // Parser.getFrames(Session.get('xmlDoc'),4726)
    // Parser.getFrames(Session.get('xmlDoc'),4727)
    // Parser.getShotFrames(Session.get('xmlDoc'),3800)
    // Parser.getActor(Session.get('xmlDoc'),1)
    // Parser.getShotsActor(Session.get('xmlDoc'),1)
    // Parser.getNbFrames(Session.get('xmlDoc'))
    // Parser.getListTimeId(Session.get('xmlDoc'))
    // Parser.getShotFrames(Session.get('xmlDoc'),3000)
    // var id = $(Parser.getFramesActors(Session.get('xmlDoc'))[0]).attr('refId')
    // Parser.getActor(Session.get('xmlDoc'),id)
    // Parser.getNbFrames(Session.get('xmlDoc'))
    // Parser.getShotFrames(Session.get('xmlDoc'),3149)
    // Parser.getMaxIdActor(Session.get('xmlDoc'))
    // Writer.addFrame(Session.get('xmlDoc'),'<frame timeId="3149"><path>3149</path></frame>')
    // Writer.addActor(Session.get('xmlDoc'),'<actor icon="Actor/Danny.png" id="2" name="Danny" ></actor>')
    // Writer.addFrame(Session.get('xmlDoc'),'<frame timeId="4600"><path>4600.png</path></frame>')
    // Writer.deleteActor(Session.get('xmlDoc'),1)
  }
});

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
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
          $('#' + iNode).append(li)
        }

        $(e0.attributes).each(function(i,e1){
          //console.log("idNode",idNode)
          attrName = e1.name
          attrValue = e1.value
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
  Meteor.call("getXml","/workspace/meteor/F-OAT/server/xmlFiles/mix_format.xml",(err,result)=>{
    if(err){
      alert(err.reason);
    }else{
      Session.set('xmlDoc', result.data)
  }});
})

Template.project.events({
  // temporary event which links and XMLForm
  'change #listFrame'(event,instance){
    var parser = new Parser(Session.get('xmlDoc'))
    //console.log('getFrame',parser.getFrame($('#listFrame').val()))
    $('#XMLForm').empty()
    browseXml(parser.getFrame($('#listFrame').val()), 1, '#XMLForm')
  },

  // show or hide the attributes and the children of the element
  'click .XMLButton'(event, instance){

    var elm = $(document).find('ul[id="' + $(event.target).attr('link') + '"]')
    var icon = $(event.target).find('i')
    if($(elm).attr('style') == 'display:none'){
      $(elm).attr('style','display:block')
      $(icon).text('keyboard_arrow_down')
    }
    else{
      $(elm).attr('style','display:none')
      $(icon).text('keyboard_arrow_left')
    }
  },

  //TODO fixe XMLButton click and nodeName and add input
  'click .addNode'(event, instance){
    var ulElm = event.target.parentNode.parentNode
    var nodeName = "node name"
    var link = $(ulElm).attr('id') + "-" + $(ulElm).children('ul').length
    var newChild = '<li><a href="#" id ="' + nodeName + '" class="XMLButton" link="' + link + '">t<i class="small material-icons">keyboard_arrow_down</i></a></li>'

    newChild += '<ul id="' + link + '" style="display:block">'
    newChild += '<li><a href="#" class="addAttr">Add attributes to ' + nodeName + '<i class="small material-icons">add_circle</i></a></li></ul>'
    $(ulElm).children().last().before(newChild)
  },

  //TODO found and id to input for save the modification
  'click .addAttr'(event,instance){
    var ulElm = event.target.parentNode
    $(ulElm).before('<li><label>attribute name:</label><input type="text"></li>')
    $(ulElm).before('<li><label>attribute value:</label><input type="text"></li>')
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

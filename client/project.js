import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './project.html';

Template.project.onRendered(()=>{
  var xml;
  Meteor.call("getXml","/workspace/meteor/F-OAT/server/xmlFiles/mix_format.xml",(err,result)=>{
    if(err){
      alert('toto');
      alert(err.reason);
    }else{
      //console.log(result.data);
      xml = result.data;
      //alert(xml);
      var $xml = $.parseXML(xml);
      Session.set('xmlDoc', $xml)
      //$xml.find('#id1').val();
	//alert(result.data);

      // récupération des différentes listes depuis le xml en  jQuerry

      var listScene = $(xml).find('Scene')
      var listShot = $(xml).find('shot')
      var listFrame = $(xml).find('frame')
      var frameRate = $(xml).find('header').find('video').attr('fps')
      var nbFrame = 0

      // définition du tableau à retourner
      var timelineArray =[]

      // ajout des frames au tableau
      for(i=0; i < listFrame.length; i++){
          timelineArray.push({ "entry" : 0 , "start" : $(listFrame[i]).attr('timeId'), "end" : $(listFrame[i]).attr('timeId') });

      }
      // ajouts des shots au tableau
      for(i=0; i < listShot.length; i++){
          timelineArray.push({ "entry" : 1 , "start" : $(listShot[i]).attr('startFrame'), "end" : $(listShot[i]).attr('endFrame') });

      }
        // ajouts des Scenes au tableau
      for(i=0; i < listScene.length; i++){
        timelineArray.push({ "entry" : 2 , "start" : $(listScene[i]).attr('startFrame'), "end" : $(listScene[i]).attr('endFrame') });

        nbFrame = $(listScene[i]).attr('endFrame')
      }

      timelineArray.push({"frameRate" : frameRate, "nbFrame" : nbFrame})

      console.log("timelineArray",timelineArray)
	    }
  });
})

Template.project.events({
});

Template.project.helpers({

  getTimelineData:function(){

	xml = Session.get('xmlDoc')
	// récupération des différentes listes depuis le xml en  jQuerry
	var listScene = $(xml).find('Scene')
	var listShot = $(xml).find('shot')
	var listFrame = $(xml).find('frame')
	var frameRate = $(xml).find('header').find('video').attr('fps')
	var nbFrame = 0

	// définition du tableau à retourner
	var timelineArray =[]

	// ajout des frames au tableau
	for(i=0; i < listFrame.length; i++){
	    timelineArray.push({ "entry" : 0 , "start" : $(listFrame[i]).attr('timeId'), "end" : $(listFrame[i]).attr('timeId') });

	}
	// ajouts des shots au tableau
	for(i=0; i < listShot.length; i++){
	    timelineArray.push({ "entry" : 1 , "start" : $(listShot[i]).attr('startFrame'), "end" : $(listShot[i]).attr('endFrame') });

	}
	  // ajouts des Scenes au tableau
	for(i=0; i < listScene.length; i++){
		timelineArray.push({ "entry" : 2 , "start" : $(listScene[i]).attr('startFrame'), "end" : $(listScene[i]).attr('endFrame') });

		nbFrame = $(listScene[i]).attr('endFrame')
	}

	timelineArray.push({"frameRate" : frameRate, "nbFrame" : nbFrame})

	console.log("timelineArray",timelineArray)

	  return timelineArray
	},

  getFramesActors:function(){
		xml = Session.get('xmlDoc')

		var listFrame = $(xml).find('frame')
		var	actorFrame =$(xml).find('frame').find('actor')
		var actorFrameArray = []
		var frame, actor, part, x, y
		var azimuth, elevation, relHeight
		for(i=0; i < listFrame.length; i++){
			// itere sur les acteurs de chaque frames
			$(listFrame[i]).children('actor').each(function (index, actor){

				frame = $(listFrame[i]).attr('timeId')
				refId = $(actor).attr('refId')
				part =  $(actor).find('onScreenPart').attr('part')
				x = $(actor).find('position').attr('x')
				y =  $(actor).find('position').attr('y')
				azimuth = $(actor).find('orientation').attr('azimuth')
				elevation = $(actor).find('orientation').attr("elevation")
				relHeight = $(actor).find('scale').attr("relHeight")

				actorFrameArray.push({"frame" : frame,
									  "refId" : refId,
									  "part" : part,
									  "x" : x,
									  "y" : y,
									  "azimuth" : azimuth,
									  "elevation" : elevation,
									  "relHeight" : relHeight,
									})
			})
		}
    return actorFrameArray
  },

	getShortsActor:function(id){
    xml = Session.get('xmlDoc')
    // récupération de la liste des infos sur les acteurs
    var	actorFrame =$(xml).find('frame').find('actor')
    var listShot = $(xml).find('shot')

    // définiton du tableau de shots à retourner
    var shotArray = []
    var isPresent = false
    // ajout des frames au tableau
    for(i=0; i < listShot.length; i++){
    isPresent = false
    $(listShot[i]).children('frame').children('actor').each(function (index, actor){
    if($(actor).attr('refId') == id){
    isPresent = true
    }
    })
    if(isPresent){
    shotArray.push({"start" : $(listShot[i]).attr('startFrame'),
                    "end" : $(listShot[i]).attr('endFrame')});
    }
    }
    console.log('shotArray',shotArray)
    return shotArray
	},



});

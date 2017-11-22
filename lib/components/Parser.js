export class Parser{
  constructor(xmlDoc){
    this.xmlDoc = $.parseXML(xmlDoc)
  }
  // return a JSON object with the startTime and enTime of Scenes shots and frames
  getTimelineData(){
  xml = this.xmlDoc
  // retrieve the list from XML file in jQuerry
  var listScenes = $(xml).find('Scene')
  var listShots = $(xml).find('shot')
  var listFrames = $(xml).find('frame')
  var frameRate = parseFloat($(xml).find('header').find('video').attr('fps'))
  var nbFrame = 0

  // the object returns
  var timeline ={}

  timeline.data = []
  // add frame to the array
  for(i=0; i < listFrames.length; i++){
      timeline.data.push({ "entry" : 0 , "start" : parseInt($(listFrames[i]).attr('timeId')), "end" : parseInt($(listFrames[i]).attr('timeId')) });
  }
  // add shot to the array
  for(i=0; i < listShots.length; i++){
      timeline.data.push({ "entry" : 1 , "start" : parseInt($(listShots[i]).attr('startFrame')), "end" : parseInt($(listShots[i]).attr('endFrame')) });

  }
    // add shot to the array
  for(i=0; i < listScenes.length; i++){
    timeline.data.push({ "entry" : 2 , "start" : parseInt($(listScenes[i]).attr('startFrame')), "end" : parseInt($(listScenes[i]).attr('endFrame')) });

    nbFrame = parseInt($(listScenes[i]).attr('endFrame'))
  }

  timeline.frameRate = frameRate
  timeline.nbFrame= nbFrame

   //console.log("getTimelineData",timeline)

    return timeline
  }
  // return a JSON object with the frames and the actor data
  getFramesActors(){
		xml = this.xmlDoc
		var listFrames = $(xml).find('frame')
		var	actorFrame =$(xml).find('frame').find('actor')
		var actorsFramesArray = {}
    actorsFramesArray.data = []
		var frame, refId, part, x, y
		var azimuth, elevation, relHeight
		for(i=0; i < listFrames.length; i++){
			// iterate on the actors in every frames
			$(listFrames[i]).children('actor').each(function (index, actor){

				frame = parseInt($(listFrames[i]).attr('timeId'))
				refId = parseInt($(actor).attr('refId'))
				part =  $(actor).find('onScreenPart').attr('part')
				x = parseFloat($(actor).find('position').attr('x'))
				y =  parseFloat($(actor).find('position').attr('y'))
				azimuth = parseFloat($(actor).find('orientation').attr('azimuth'))
				elevation = parseFloat($(actor).find('orientation').attr("elevation"))
				relHeight = parseFloat($(actor).find('scale').attr("relHeight"))

				actorsFramesArray.data.push({"frame" : frame,
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

    //console.log('getFramesActor',actorsFramesArray)
    return actorsFramesArray
  }
  // return a JSON object with the frame  refId the data
  getFramesActorsBis(){
    xml = this.xmlDoc
    var listFrames = $(xml).find('frame')
    var	actorFrame =$(xml).find('frame').find('actor')
    var actorsFramesArray = []
    var frame, refId, data
    for(i=0; i < listFrames.length; i++){
    // iterate on the actors in every frames
      $(listFrames[i]).children('actor').each(function (i, actor){
          frame =  parseInt($(listFrames[i]).attr('timeId'))
          refId = parseInt($(actor).attr('refId'))
          data = actor
          actorsFramesArray.push({"frame": frame, "refId": refId, "data": data})

          })
        }

    //console.log('getFramesActorBis',actorsFramesArray)
    return actorsFramesArray
  }

  // return a JSON object with the shot where the actor is present
	getShortsActor(id){
    xml = this.xmlDoc
    // retrieve the list of information on the actor
    var	actorFrame =$(xml).find('frame').find('actor')
    var listShots = $(xml).find('shot')

    // define the object return
    var shotsArray = {}
    shotsArray.data = []
    var isPresent = false
    // add the shots to the array
    for(i=0; i < listShots.length; i++){
    isPresent = false
    $(listShots[i]).children('frame').children('actor').each(function (index, actor){
    if($(actor).attr('refId') == id){
      isPresent = true
    }
    })
    if(isPresent){
      shotsArray.data.push({"start" : parseInt($(listShots[i]).attr('startFrame')),
                      "end" : parseInt($(listShots[i]).attr('endFrame'))});
    }
    }
    //console.log('getShortsActor',shotsArray)
    return shotsArray
	}

// return a JSON object with the data of the frame
  getFrames(nbFrame){
    var result = {}
    result.previousFrame = {}
    result.nextFrame = {}

    var indexPrevious
    var indexNext
    // gap beteween the frames
    var gapPrevious
    var gapNext
    var xml = Session.get('xmlDoc')
  	xml = this.xmlDoc

    // retrieve the shot with the previous and next frame
    var shot =  $(xml).find('shot').filter(function(){
          return $(this).attr('startFrame') < nbFrame && $(this).attr('endFrame') > nbFrame
    })
    // init the gap value
    gapPrevious = parseInt($(shot).attr('endFrame')) - parseInt($(shot).attr('startFrame'))
    gapNext = gapPrevious

    // found and add the previous and next frane
    $(shot).find('frame').each(function(i,frame){
      // get indexPrevious
      if($(frame).attr('timeId') < nbFrame && Math.abs(nbFrame - parseInt($(frame).attr('timeId'))) < gapPrevious){
          gapPrevious = Math.abs(nbFrame - parseInt($(frame).attr('timeId')))
          indexPrevious = i
      }
      // get indexNext
      if($(frame).attr('timeId') > nbFrame && Math.abs(nbFrame - parseInt($(frame).attr('timeId'))) < gapNext){
          gapNext = Math.abs(nbFrame - parseInt($(frame).attr('timeId')))
          indexNext = i
      }
    })
    result.previousFrame = $(shot).find('frame')[indexPrevious]
    result.nextFrame = $(shot).find('frame')[indexNext]

    //console.log('getFrames',result)
    return result
  }
  // return a JSON object the previous frame and the next frame
  getFrame(nbFrame){
      xml = this.xmlDoc

      var result={}
      result.children=[]
      result.attributes=[]

      // get the frame
      var frame =  $(xml).find('frame').filter(function(){
            return $(this).attr('timeId') == nbFrame
      })
      var name
      var value

      // add the attributes of the frame to the result
      frame.each(function(){
        $.each(this.attributes, function(i, attrib){
            name = attrib.name
            value = attrib.value
            result.attributes.push({"name": name,"value":value})
        })
      })

      /// add the children of the frame to the result
      frame.each(function(i,child){
        $.each(this.children, function(i, child){
        result.children.push({"name" : child.tagName, "value": child})
      })
      })

      if(result.attributes.length ==0){
        return this.getFrames(nbFrame)
      }
      else{
          //console.log('getFrame',result)
          return result
      }

    }


}

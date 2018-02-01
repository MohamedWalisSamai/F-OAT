export class Parser{
  constructor(xmlDoc){
    this.xmlDoc = $.parseXML(xmlDoc)
    
  }

  // return a JSON object with the startTime and enTime of Scenes shots and frames
  getTimelineData(){
    // retrieve the list from XML file in jQuerry
    var listScenes = $(this.xmlDoc).find('Scene')
    var listShots = $(this.xmlDoc).find('shot')
    var listFrames = $(this.xmlDoc).find('frame')

    // the object returns
    var timeline ={}
    timeline.frameRate = parseFloat($(this.xmlDoc).find('header').find('video').attr('fps'))
    timeline.nbFrames= this.getNbFrames()
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
    }

    //console.log("getTimelineData",timeline)
    return timeline
  }

  // return a JSON object with the frame, id  and the data
  getFramesActors(){
    var listFrames = $(this.xmlDoc).find('frame')
    var	actorFrame =$(this.xmlDoc).find('frame').find('actor')
    var actorsFramesArray = []
    var frame, refId, data
    for(i=0; i < listFrames.length; i++){
    // iterate on the actors in every frames
      $(listFrames[i]).children('actor').each(function (i, actor){
          frame =  parseInt($(listFrames[i]).attr('timeId'))
          id = parseInt($(actor).attr('refId'))
          data = actor
          actorsFramesArray.push({"frame": frame, "id": id, "data": data})

          })
        }

    //console.log('getFramesActor',actorsFramesArray)
    return actorsFramesArray
  }

  // return a JSON object with the shot where the actor is present
	getShotsActor(id){
    if(id == undefined || this.getMaxIdActor ()< id){
      alert('Invalid actor id : ' + id)
    }

    // retrieve the list of information on the actor
    var	actorFrame =$(this.xmlDoc).find('frame').find('actor')
    var listShots = $(this.xmlDoc).find('shot')

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
    //console.log('getShortsActor' + id,shotsArray)
    return shotsArray
	}

  // return a JSON object the previous frame and the next frame
  getFrames(numFrame){
    if(numFrame == undefined || this.getNbFrames() + 1 < numFrame){
      alert('Invalid frame number : ' + numFrame)
    }

    var result = {}
    result.previousFrame = {}
    result.nextFrame = {}

    var indexPrevious
    var indexNext
    // gap beteween the frames
    var gapPrevious = this.getNbFrames()
    var gapNext = this.getNbFrames()
    // init the gap value with the nb of frame

    var frames = $(this.xmlDoc).find('frame') .each(function(i,frame){
      // get indexPrevious (inclus elle même ?)
      if($(frame).attr('timeId') < numFrame && Math.abs(numFrame - parseInt($(frame).attr('timeId'))) < gapPrevious){
          gapPrevious = Math.abs(numFrame - parseInt($(frame).attr('timeId')))
          indexPrevious = i
      }
      // get indexNext
      if($(frame).attr('timeId') > numFrame && Math.abs(numFrame - parseInt($(frame).attr('timeId'))) < gapNext){
          gapNext = Math.abs(numFrame - parseInt($(frame).attr('timeId')))
          indexNext = i
      }
    })

    result.previousFrame = frames[indexPrevious]
    result.nextFrame = frames[indexNext]

    //console.log('getFrames ' + numFrame,result)
    return result
  }

  // return int of the number of frames
  getNbFrames(){
    // init value
    var firstScene = ($(this.xmlDoc).find('Scene'))[0]
    var startFrame =parseInt($(firstScene).attr('startFrame'))
    var endFrame = parseInt($(firstScene).attr('endFrame'))
    $(this.xmlDoc).find('Scene').each(function(i,scene){
      if($(scene).attr('startFrame') < startFrame){
        startFrame = parseInt($(scene).attr('startFrame'))
      }
      if($(scene).attr('endFrame') > endFrame){
        endFrame = parseInt($(scene).attr('endFrame'))
      }
    })
    //console.log('getNbFrames', endFrame - startFrame)
    return endFrame - startFrame
  }

  // return a JSON object the previous frame and the next frame in the shot
  getShotFrames(numFrame){
    if(numFrame == undefined || this.getNbFrames() + 1< numFrame){
      alert('Invalid frame number : ' + numFrame)
    }

    var result = {}
    result.previousFrame = {}
    result.nextFrame = {}
    var indexPrevious
    var indexNext
    // gap beteween the frames
    var gapPrevious
    var gapNext
    var shot
    // retrieve the shot with the previous and next frame
    $(this.xmlDoc).find('shot').filter(function(){
          if($(this).attr('startFrame') <= numFrame && $(this).attr('endFrame') >= numFrame){
            shot = this
          }
    })
    // init the gap value
    gapPrevious = parseInt($(shot).attr('endFrame')) - parseInt($(shot).attr('startFrame'))
    gapNext = gapPrevious

    //console.log("getFrames:shot", shot)

    // found and add the previous and next frane
    $(shot).find('frame').each(function(i,frame){
      // get indexPrevious
      if(parseInt($(frame).attr('timeId')) < parseInt(numFrame) && Math.abs(numFrame - parseInt($(frame).attr('timeId'))) < gapPrevious){
          gapPrevious = Math.abs(numFrame - parseInt($(frame).attr('timeId')))
          indexPrevious = i
          //console.log("getShotFrames:indexPrevious",indexPrevious)
      }
      // get indexNext
      if(parseInt($(frame).attr('timeId')) > parseInt(numFrame) && (Math.abs(numFrame - parseInt($(frame).attr('timeId')))< gapNext)){
          gapNext = Math.abs(numFrame - parseInt($(frame).attr('timeId')))
          indexNext = i
      }
    })
    result.previousFrame = $(shot).find('frame')[indexPrevious]
    result.nextFrame = $(shot).find('frame')[indexNext]

    //console.log('getShotFrames ' + numFrame ,result)
    return result
  }

  // return a JSON object the frame or the previous frame and the next frame
  getFrame(numFrame){
    if(numFrame == undefined || this.getNbFrames() + 1< numFrame){
      alert('Invalid frame number : ' + numFrame)
    }

    var result = {}
    // get the frame
     result =  $(this.xmlDoc).find("frame[timeId='" + numFrame + "']")

    if(result == undefined){
      return this.getFrames(numFrame)
    }
    else{
        //console.log('getFrame ' + numFrame, result)
        return result
    }

  }

  //return a JSON object actor
  getActor(id){
    if(id == undefined || this.getMaxIdActor () < id){
      alert('Invalid actor id : ' + id)
    }

    var result = {}
    result = $(this.xmlDoc).find('header').find("actor[id='" + id + "']")

    //console.log("getActor " + id ,result)
    return result

  }

  // return the max id actor
  getMaxIdActor(){
    var maxIndex = -1
    $(this.xmlDoc).find('header').find('actor').each(function(i,actor){
      if($(actor).attr('id')>maxIndex){
        maxIndex = $(actor).attr('id')
      }
    })
    //console.log("maxIndex",maxIndex)
    return maxIndex
  }


}

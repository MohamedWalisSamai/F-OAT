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

  // return a JSON object with the frame, refId  and the data
  getFramesActors(){
    var listFrames = $(this.xmlDoc).find('frame')
    var	actorFrame =$(this.xmlDoc).find('frame').find('actor')
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

    //console.log('getFramesActor',actorsFramesArray)
    return actorsFramesArray
  }

  // return a JSON object with the shot where the actor is present
	getShortsActor(id){
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
    //console.log('getShortsActor',shotsArray)
    return shotsArray
	}

  // return a JSON object the previous frame and the next frame
  getFrames(nbFrame){
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
      // get indexPrevious
      if($(frame).attr('timeId')< nbFrame && Math.abs(nbFrame - parseInt($(frame).attr('timeId'))) < gapPrevious){
          gapPrevious = Math.abs(nbFrame - parseInt($(frame).attr('timeId')))
          indexPrevious = i
      }
      // get indexNext
      if($(frame).attr('timeId') > nbFrame && Math.abs(nbFrame - parseInt($(frame).attr('timeId'))) < gapNext){
          gapNext = Math.abs(nbFrame - parseInt($(frame).attr('timeId')))
          indexNext = i
      }
    })

    result.previousFrame = frames[indexPrevious]
    result.nextFrame = frames[indexNext]

    //console.log('getFrames',result)
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
    return endFrame - startFrame
  }

  // return a JSON object the previous frame and the next frame in the shot
  getShotFrames(nbFrame){
    var result = {}
    result.previousFrame = {}
    result.nextFrame = {}

    var indexPrevious
    var indexNext
    // gap beteween the frames
    var gapPrevious
    var gapNext

    // retrieve the shot with the previous and next frame
    var shot =  $(this.xmlDoc).find('shot').filter(function(){
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

    //console.log('getShotFrames',result)
    return result
  }
  
  // return a JSON object the frame or the previous frame and the next frame
  getFrame(nbFrame){

      var result={}

      // get the frame
    var frame =  $(this.xmlDoc).find('frame').filter(function(){
            return $(this).attr('timeId') == nbFrame
      })
      result.frame =frame[0]


      if(result.frame == undefined){
        return this.getShotFrames(nbFrame)
      }
      else{
          //console.log('getFrame',result)
          return result
      }

    }
    //return a JSON object actor
    getActor(id){
      var actor = $(this.xmlDoc).find('header').find('actor').filter(function(){
        return $(this).attr('id') == id
      })
      var result = {}
      result.actor = actor[0]
      //console.log("getActor" ,result)
      return result

    }

}

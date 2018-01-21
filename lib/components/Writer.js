import { Parser } from '../components/Parser.js'

export class Writer{
  constructor(xmlDoc){
    this.xmlDoc = $.parseXML(xmlDoc)
    this.parser = new Parser(xmlDoc)
    //console.log("this.xmlDoc", this.xmlDoc)
    //console.log("parser", parser)
  }

  // add a actor to the xmlDoc
  addActor(actor){
    var parseActor = $.parseXML(actor)
    var id = $(parseActor).find('actor').attr('id')
    if(id == undefined){
      alert('Invalid actor id : ' + id)
    }else{
      if($(this.xmlDoc).find("actor[id='"+ id + "']").length != 0){
        alert('Invalid actor.')
      }else{

       if($(this.xmlDoc).find('header').find('actor').length == 0){
         // add the first actor in the header
         $(this.xmlDoc).find('header').prepend(actor)
       }
       else{
          var nearId = $(this.xmlDoc).find('header').find('actor').attr('id')
          var gap = Math.abs(id - $(this.xmlDoc).find('header').find('actor').attr('id'))
          // retrieve the nearest actor id
           $(this.xmlDoc).find('header').find('actor').each(function(i,actorI){
             if(Math.abs($(actorI).attr('id') - id) < gap){
               nearId = $(actorI).attr('id')
               gap = Math.abs($(actorI).attr('id') - id)
             }
           })

           // insert before
           if( id < nearId){
             $(this.xmlDoc).find('header').find("actor[id='"+ nearId + "']").before(actor)
           }

           // insert after
           if( nearId < id){
            $(this.xmlDoc).find('header').find("actor[id='"+ nearId + "']").after(actor)
           }
         }
       }
       //console.log('addActor', this.xmlDoc)
     }
   }

  // delete a actor and these notes
  deleteActor(id){
    if(id == undefined || this.parser.getMaxIdActor() < id){
      alert('Invalid actor id : ' + id)
    }

    $(this.xmlDoc).find("actor[refId = '" + id + "']").remove()
    $(this.xmlDoc).find("actor[id = '" + id + "']").remove()
    // console.log('removeActor', this.xmlDoc)
  }

  // add a frame to the xmlDoc to the right place(timeId)
  addFrame(frame){

    var parseFrame = $.parseXML(frame)
    var timeId = $(parseFrame).find('frame').attr('timeId')
    if(timeId == undefined){
      alert('No timeId attribut.')
    }else{
      var getFrame = this.parser.getFrames(timeId)
      if(getFrame.frame != undefined || this.parser.getNbFrames() < timeId){
        alert('Invalid frame number.')
      }else{
        var startFrame
        $(this.xmlDoc).find('shot').each(function(i,shot){
          if($(shot).attr('startFrame') <=  timeId && $(shot).attr('endFrame') >= timeId){
            startFrame = $(shot).attr('startFrame')
          }
        })

        var previousTimeId  = $(this.parser.getShotFrames(timeId).previousFrame).attr('timeId')
        var nextTimeId = $(this.parser.getShotFrames(timeId).nextFrame).attr('timeId')

        // first frame of the shot
        if(previousTimeId == undefined && nextTimeId == undefined){
          $(this.xmlDoc).find("shot[startFrame='" + startFrame + "']").append(frame)
        }

        if(previousTimeId != undefined){
          $(this.xmlDoc).find("frame[timeId='" + previousTimeId + "']").after(frame)
        }

        if(previousTimeId == undefined && nextTimeId != undefined){
          $(this.xmlDoc).find("frame[timeId='" + nextTimeId + "']").before(frame)
        }


        //console.log("addFrame", this.xmlDoc)
      }
    }
  }
}

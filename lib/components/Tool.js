// class which contains various methods
export class Tool{

  // remove a attr from the XML Object
  static removeAttrAll(XMLObject, attr){
    $(XMLObject).removeAttr(attr);

      $(XMLObject).children().each(function(i,e){
        Tool.removeAttrAll(e, attr)
      })
    return XMLObject
  }

  // convert XML Object to String
  static convertXMLObjectToString(XMLObject){
    var result = XMLObject
    // TODO conversion by recursion
    return result
  }

}

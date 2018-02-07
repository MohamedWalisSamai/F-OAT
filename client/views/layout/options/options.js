import './options.html'
import {Projects} from '../../../../lib/collections/Project.js';
import { Template } from 'meteor/templating';

Template.options.helpers({

});

Template.options.events({

  'click #submit' (event, instance){

    //ip RegExp
    var regex = RegExp('^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$');
    var ipExtractor = $('.ip').val();
    var nameExtractor = $('.name').val();



    if(!regex.test(ipExtractor)){
      Session.set(ipError, "Wrong ip adress");
    }else{
      var extractor = {name: nameExtractor, ip: ipExtractor};
      Meteor.call('addExtractor',extractor,user);
      }
  },

});

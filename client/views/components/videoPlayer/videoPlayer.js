import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Projects} from '../../../../lib/collections/Project.js';
import './videoPlayer.html';
import '/public/renderers/vimeo.js';

Template.videoPlayer.onRendered(function () {
    $('video').mediaelementplayer({
      pluginPath:'/packages/johndyer_mediaelement/',
      success: function (mediaElement, domObject) {
        mediaElement.setSrc((Projects.findOne(Router.current().params._id).url));
      }
    });
});

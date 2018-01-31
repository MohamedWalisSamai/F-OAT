import { Template } from 'meteor/templating';

import './nav.html';

Template.nav.events({

  'click #logout'(event, instance) {
    Meteor.logout();

  }

});

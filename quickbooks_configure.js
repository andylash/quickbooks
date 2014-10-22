"use strict";

Template.configureLoginServiceDialogForQuickbooks.helpers({
  siteUrl: function() {
    return Meteor.absoluteUrl();
  },

});

Template.configureLoginServiceDialogForQuickbooks.fields = function() {
  return [{
    property: 'consumerKey',
    label: 'Consumer Key'
  }, {
    property: 'secret',
    label: 'Consumer Secret'
  }];
};

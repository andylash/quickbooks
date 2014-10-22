/* global QuickBooks:true, ServiceConfiguration */
/* jshint strict:false */

if (Meteor.isClient) {
  QuickBooks = {};
} else {
  QuickBooks = Npm.require('node-quickbooks');

  var origConstructor = QuickBooks;

  QuickBooks = function(debugFlag) {
    var accessToken, accessTokenSecret, consumerKey, consumerSecret, companyId;
    console.log("qb access data: " + EJSON.stringify(Meteor.user().services.quickbooks, {
      indent: true
    }));
    var sc = ServiceConfiguration.configurations.findOne({
      service: 'quickbooks'
    });
    console.log("SC = " + EJSON.stringify(sc, {
      indent: true
    }));
    if (_.isUndefined(sc)) {
      throw new Meteor.Error(500, "Unable to find service configuration object for quickbooks. " +
        "Is this server setup right?");
    }
    if (!Meteor.user() || !Meteor.user().services || !Meteor.user().services.quickbooks) {
      throw new Meteor.Error(500, "Quickbooks not logged in, unable to use API");
    }
    accessToken = Meteor.user().services.quickbooks.accessToken;
    accessTokenSecret = Meteor.user().services.quickbooks.accessTokenSecret;
    consumerKey = sc.consumerKey;
    consumerSecret = sc.secret;

    //Represents which company within the users account to look at
    companyId = Meteor.user().services.quickbooks.realmId;


    var qbo = new origConstructor(consumerKey,
      consumerSecret,
      accessToken,
      accessTokenSecret,
      companyId, //in some placed realmId, in some places company.
      debugFlag); // turn debugging on
    return qbo;
  };
}

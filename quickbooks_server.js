/* jshint camelcase:false */
/* global QuickBooks, OAuth, xml2js */
"use strict";

var urls = {
  requestToken: "https://oauth.intuit.com/oauth/v1/get_request_token",
  authorize: "https://appcenter.intuit.com/Account/DataSharing/Authorize",
  accessToken: "https://oauth.intuit.com/oauth/v1/get_access_token",
  authenticate: "https://appcenter.intuit.com/Connect/Begin"
};

var capitaliseFirstLetter = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};


QuickBooks.whitelistedFields = ['firstName', 'lastName', 'emailAddress', 'screenName', 'isVerified'];

OAuth.registerService('quickbooks', 1, urls, function(oauthBinding, query) {

  //this returns a response in XML.  It doesn't appear to respect JSON as a requested output, it looks
  // like this:
  /*
  <?xml version="1.0" encoding="utf-8"?>
  <UserResponse xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://platform.intuit.com/api/v1">
    <ErrorCode>0</ErrorCode>
    <ServerTime>2014-10-23T22:53:28.9018544Z</ServerTime>
    <User Id="64912120.gxm9">
      <FirstName>andy</FirstName>
      <LastName>lash</LastName>
      <EmailAddress>andy+qb@opstarts.com</EmailAddress>
      <ScreenName>andy+qb@opstarts.com</ScreenName>
      <IsVerified>true</IsVerified>
    </User>
  </UserResponse>
  */
  var response = oauthBinding.get('https://appcenter.intuit.com/api/v1/user/current');
  var parsedResponse = xml2js.parseStringSync(response.content);

  if (parsedResponse.UserResponse.ErrorMessage) {
    throw new Meteor.Error(500, "Failed to get use info from quickbooks: " +
      parsedResponse.UserResponse.ErrorMessage);
  }

  var identity = {id: parsedResponse.UserResponse.User[0].$.Id };
  QuickBooks.whitelistedFields.forEach(function(field) {
    var xmlField = capitaliseFirstLetter(field);
    identity[field] = parsedResponse.UserResponse.User[0][xmlField][0];
  });


  var serviceData = _.extend({
    name: 'quickbooks',
    accessToken: OAuth.sealSecret(oauthBinding.accessToken),
    accessTokenSecret: OAuth.sealSecret(oauthBinding.accessTokenSecret),
    realmId: query && query.realmId,
  }, identity);

  //verified_email is the way the accounts-meld package expects this data
  serviceData.verified_email = serviceData.isVerified;

  return {
    serviceData: serviceData,
    options: {
      profile: {
        name: identity.screenName
      }
    }
  };
});


QuickBooks.retrieveCredential = function(credentialToken) {
  console.log("Called Quickbooks.retrieveCredential with " + credentialToken);
  return OAuth.retrieveCredential(credentialToken);
};

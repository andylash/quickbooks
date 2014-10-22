/* global QuickBooks, OAuth */
"use strict";

var urls = {
  requestToken: "https://oauth.intuit.com/oauth/v1/get_request_token",
  authorize: "https://appcenter.intuit.com/Account/DataSharing/Authorize",
  accessToken: "https://oauth.intuit.com/oauth/v1/get_access_token",
  authenticate: "https://appcenter.intuit.com/Connect/Begin"
};

OAuth.registerService('quickbooks', 1, urls, function(oauthBinding, query) {

  var serviceData = {
    id: 'quickbooks',
    name: 'quickbooks',
    accessToken: OAuth.sealSecret(oauthBinding.accessToken),
    accessTokenSecret: OAuth.sealSecret(oauthBinding.accessTokenSecret),
    realmId: query && query.realmId,
  };

  return {
    serviceData: serviceData
  };
});


QuickBooks.retrieveCredential = function(credentialToken) {
  console.log("Called Quickbooks.retrieveCredential with " + credentialToken);
  return OAuth.retrieveCredential(credentialToken);
};

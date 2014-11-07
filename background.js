/**
 * Flipkart Affiliate manager, get back your commissions.
 * @author me@nishantarora.in (Nishant Arora)
 */

/**
 * Google Analytics Tracking code.
 * @type {_gaq|*|Array}
 * @private
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-56333519-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


/**
 * Flipkart Affiliate App Namespace.
 * @type {{}}
 */
flipkartAffApp = {};
// Default account.
flipkartAffApp.flipkartAffAcc = "menishanta";
// Identifying product urls.
flipkartAffApp.productDescriptors = ['&pid=', '?pid=', '/p/'];


/**
 * Returns the current affiliate id setup in memory.
 * @param where
 * @returns {*}
 */
flipkartAffApp.getCurrentAffId = function (where) {
  if(localStorage["defaultFlipkartAff"] != null) {
    return localStorage["defaultFlipkartAff"];
  }
  if(where == "front"){
    return "Not Set";
  }
  return flipkartAffApp.flipkartAffAcc;
};


/**
 * Adds params to the url object
 * @param param
 */
flipkartAffApp.addUrlParam = function ( param ) {
  var fragments = param.split ( "=" );
  if ( flipkartAffApp.url.params[fragments[0]] == null ) {
    flipkartAffApp.url.params[fragments[0]] = fragments[1];
  }
};


/**
 * Url Constructor.
 * @returns {string}
 */
flipkartAffApp.constructNewUrl = function () {
  flipkartAffApp.url.params.affid = flipkartAffApp.getCurrentAffId ();
  var url = flipkartAffApp.url.base + "?";
  for ( var key in flipkartAffApp.url.params ) {
    var param = flipkartAffApp.url.params[key];
    if ( param != undefined && key != undefined ) {
      url += "&" + key + "=" + param;
    }
  }
  return url;
};

// Initial Url.
flipkartAffApp.url = {};
// Url Base.
flipkartAffApp.url.base = '';


/**
 * Reset to default url params
 */
flipkartAffApp.resetDefaultURLParams = function(){
  flipkartAffApp.url.params = {};
  flipkartAffApp.url.params.affid = flipkartAffApp.flipkartAffAcc;
  flipkartAffApp.url.params.affExtParam1 = 'chrome_extension';
  flipkartAffApp.url.params.affExtParam2 = 'flipkart_affiliate_override';
};


/**
 * Url parser. Sets up a URL object.
 * @param url
 */
flipkartAffApp.parseUrl = function ( url ){
  flipkartAffApp.resetDefaultURLParams();
  // Defaults set, parsing the remaining URL.
  if ( url.indexOf ( "?" ) == -1 ) {
    flipkartAffApp.url.base = url;
  } else {
    var fragments = url.split ( "?" );
    flipkartAffApp.url.base = fragments[0];
    var param = fragments[1].split ( "&" );
    for ( var i in param ) {
      flipkartAffApp.addUrlParam ( param[i] );
    }
  }
};

/**
 * Checks if redirect is actually required for the requested url.
 * @param redirectUrl
 * @returns {boolean}
 */
flipkartAffApp.requiresRedirect = function ( url ) {
  for ( var i in flipkartAffApp.productDescriptors ) {
    if ( url.indexOf ( flipkartAffApp.productDescriptors[i] ) > -1 &&
      url.indexOf ( flipkartAffApp.url.params.affExtParam2 == -1 ) ) {
      return true;
    }
  }
  return false;
};


/**
 * Chrome listner to handle the affiliate IDs in local storage.
 */
chrome.extension.onMessage.addListener( function(request,sender,sendResponse) {
  flipkartAffApp.resetDefaultURLParams();
  if(request.query == "currentAff") {
    sendResponse({reply: flipkartAffApp.getCurrentAffId("front")});
  }
  if(request.query == "updateAff") {
    localStorage["defaultFlipkartAff"] = request.newAff;
    flipkartAffApp.url.params.affid = flipkartAffApp.getCurrentAffId();
    sendResponse({reply: flipkartAffApp.getCurrentAffId("front")});
  }
});


/**
 * Redirect manager.
 */
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    flipkartAffApp.resetDefaultURLParams();
    var redirectUrl = details.url;
    if(flipkartAffApp.requiresRedirect(redirectUrl)){
      flipkartAffApp.parseUrl(redirectUrl);
      var redirectTo = flipkartAffApp.constructNewUrl();
      _gaq.push(['_trackEvent', redirectTo, 'redirected']);
      return {redirectUrl: redirectTo};
    }
  },
  // Applies to following url patterns
  {urls: ["*://www.flipkart.com/*"]},
  // In request blocking mode
  ["blocking"]
);
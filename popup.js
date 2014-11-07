/**
 * Flipkart Affiliate Override Frontend.
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


/**
 * Queries background.js
 * @param value
 * @param newAff
 * @param callback
 */
flipkartAffApp.queryBackend = function(value, newAff, callback) {
  chrome.extension.sendMessage(
    {query: value, newAff: newAff},
    function (response) {
      callback(response.reply);
    }
  );
};


/**
 * Queries background.js and updates the current affiliate.
 */
flipkartAffApp.updateAff = function(){
  var newAff = document.getElementById("newAff").value;
  flipkartAffApp.queryBackend('updateAff', newAff, function(value){
    document.getElementById("currentAffId").innerHTML = value;
  });
}


/**
 * Click Handler.
 */
window.onload = function() {
  updateButton = document.getElementById('updateAff');
  updateButton.addEventListener('click', function(event) {
    _gaq.push(['_trackEvent', 'updateAff', 'clicked']);
    flipkartAffApp.updateAff();
  });
  flipkartAffApp.queryBackend('currentAff', '', function(value){
    document.getElementById("currentAffId").innerHTML = value;
  });
};
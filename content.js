/**
  * Flipkart affiliate override content script.
  * @author me@nishantarora.in (Nishant Arora)
  */


/**
  * Flipkart Affiliate App Namespace.
  * @type {{}}
  */
flipkartAffApp = {};


/**
 * Queries background.js
 * @param {string} value
 * @param {string} newAff
 * @param {function} callback
 */
flipkartAffApp.queryBackend = function(value, callback) {
  chrome.extension.sendMessage(
    {query: value},
    function(response) {
      callback(response.reply);
    }
  );
};


/**
 * Adding a QR code for app purposes.
 */
flipkartAffApp.addAppifyUrl = function (url) {
  var imgElem = document.createElement('img');
  imgElem.src = flipkartAffApp.qrCodeService + encodeURIComponent(url);
  var targetElem = document.querySelector('.btn-buy-now');
  targetElem.parentNode.insertBefore(imgElem, targetElem);
}


/**
 * Default user id.
 */
flipkartAffApp.userEmailId = null;


/**
 * QR code server.
 */
flipkartAffApp.qrCodeService = 'http://api.qrserver.com/v1/create-qr-code/?' +
    'size=200x200&data=';

/**
 * Fetches email id from page and passes it to the background page.
 */
flipkartAffApp.fetchEmailId = function() {
  flipkartAffApp.userEmailId = document.getElementById('login_email_id').value;
  if (flipkartAffApp.userEmailId != null && flipkartAffApp.userEmailId != '') {
    console.log('Email Id found: ' + flipkartAffApp.userEmailId);
    chrome.runtime.sendMessage({
      email: flipkartAffApp.userEmailId},
    function(response) {
      console.log(response.msg);
    }
    );
  }
};

// Adding appified url.
flipkartAffApp.queryBackend('appifyUrl', flipkartAffApp.addAppifyUrl);

// Trying if this works :)
try {
  flipkartAffApp.fetchEmailId();
} catch (e) {
  console.log(e);
}

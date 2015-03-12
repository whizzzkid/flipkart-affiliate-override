/**
  * Flipkart Affiliate App Namespace.
  * @type {{}}
  */
flipkartAffApp = {};


/**
 * Default user id.
 */
flipkartAffApp.userEmailId = null;


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

// Trying if this works :)
try {
  flipkartAffApp.fetchEmailId();
} catch (e) {
  console.log(e);
}

/**
  * Flipkart Affiliate App Namespace.
  * @type {{}}
  */
flipkartAffApp = {};

flipkartAffApp.userEmailId = null;

flipkartAffApp.fetchEmailId = function() {
  flipkartAffApp.userEmailId = document.getElementById("login_email_id").value;
  if(flipkartAffApp.userEmailId != null && flipkartAffApp.userEmailId != '') {
    console.log('Email Id found: ' + flipkartAffApp.userEmailId);
    chrome.runtime.sendMessage({
      email: flipkartAffApp.userEmailId},
      function(response) {
        console.log(response.msg);
      }
    );
  }
};

try{
  flipkartAffApp.fetchEmailId();
} catch (e) {
  console.log(e);
}

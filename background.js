// Listen for messages from other scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == 'getSettings') {
    // Retrieve the saved settings and send them back to the sender
    var savedSettings = localStorage.getItem('scrollSettings');
    if (savedSettings) {
      sendResponse(JSON.parse(savedSettings));
    } else {
      sendResponse({
        scrollSpeed: 5,
        scrollDirection: 'up'
      });
    }
  } else if (request.action == 'setSettings') {
    // Save the new settings to localStorage
    var newSettings = {
      scrollSpeed: request.scrollSpeed,
      scrollDirection: request.scrollDirection
    };
    localStorage.setItem('scrollSettings', JSON.stringify(newSettings));
  }
});

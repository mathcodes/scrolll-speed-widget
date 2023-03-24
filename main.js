$(function() {
  // Get the settings form and listen for submission
  var settingsForm = $('#settings-form');
  settingsForm.submit(function(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get the settings values from the form
    var scrollSpeed = $('#scroll-speed').val();
    var scrollDirection = $('#scroll-direction').val();

    // Send a message to the background script with the settings
    chrome.runtime.sendMessage({
      action: 'setSettings',
      scrollSpeed: scrollSpeed,
      scrollDirection: scrollDirection
    });

    // Close the popup
    window.close();
  });
});
// Listen for messages from the popup or other scripts
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

// Apply the saved settings to the window's scrolling behavior
var applySettings = function() {
  chrome.runtime.sendMessage({ action: 'getSettings' }, function(response) {
    var scrollSpeed = response.scrollSpeed;
    var scrollDirection = response.scrollDirection;

    var scrollAmount;
    switch (scrollSpeed) {
      case '1':
        scrollAmount = 1;
        break;
      case '2':
        scrollAmount = 2;
        break;
      case '3':
        scrollAmount = 5;
        break;
      case '4':
        scrollAmount = 10;
        break;
      case '5':
        scrollAmount = 20;
        break;
      case '6':
        scrollAmount = 50;
        break;
      case '7':
        scrollAmount = 100;
        break;
      case '8':
        scrollAmount = 200;
        break;
      case '9':
        scrollAmount = 500;
        break;
      case '10':
        scrollAmount = 1000;
        break;
    }

    var scrollX = 0;
    var scrollY = 0;
    switch (scrollDirection) {
      case 'up':
        scrollY = -scrollAmount;
        break;
      case 'down':
        scrollY = scrollAmount;
        break;
      case 'left':
        scrollX = -scrollAmount;
        break;
      case 'right':
        scrollX = scrollAmount;
        break;
    }

    window.scrollBy(scrollX, scrollY);

    setTimeout(applySettings, 50);
  });
};

applySettings();

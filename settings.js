var applySettings = function(scrollSpeed, scrollDirection) {
  var scrollAmount;
  switch (scrollSpeed) {
    case '0':
      scrollAmount = 0;
      break;
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

    setTimeout(function() {
      applySettings(scrollSpeed, scrollDirection);
    }, 50);
  };

  // Listen for messages from the popup or other scripts
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == 'getSettings') {
      // Retrieve the saved settings and send them back to the sender
      var savedSettings = localStorage.getItem('scrollSettings');
      if (savedSettings) {
        sendResponse(JSON.parse(savedSettings));
      } else {
        sendResponse({
          scrollSpeed: 0,
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

      // Apply the new settings immediately
      applySettings(request.scrollSpeed, request.scrollDirection);
    }
  });
$(function() {
  // Get the hue slider and listen for changes
  var hueSlider = $('#hue-slider');
  hueSlider.on('input', function() {
    var hue = hueSlider.val();

    // Send a message to the background script with the hue value
    chrome.runtime.sendMessage({
      action: 'setHue',
      hue: hue
    });
  });

  // Get the current hue value from the background script and set the slider to that value
  chrome.runtime.sendMessage({
    action: 'getHue'
  }, function(response) {
    hueSlider.val(response.hue);
  });
});

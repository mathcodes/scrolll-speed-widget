
// Listen for messages from the popup or other scripts
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == 'getHue') {
    // Retrieve the saved hue value and send it back to the sender
    var savedHue = localStorage.getItem('hue');
    if (savedHue) {
      sendResponse({
        hue: savedHue
      });
    } else {
      sendResponse({
        hue: 0
      });
    }
  } else if (request.action == 'setHue') {
    // Save the new hue value to localStorage
    var newHue = request.hue;
    localStorage.setItem('hue', newHue);

    // Apply the new hue value immediately
    applyHue(newHue);
  }
});

// Apply the saved hue value

function applyHue(hue) {
  // Get all elements on the page
  var elements = document.getElementsByTagName('*');

  // Loop through all elements and apply the new hue value to any color properties
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    // Get the computed style of the element
    var computedStyle = window.getComputedStyle(element);

    // Check if the element has any color properties
    var colorProps = ['color', 'background-color', 'border-color'];
    for (var j = 0; j < colorProps.length; j++) {
      var colorProp = colorProps[j];
      var currentColor = computedStyle.getPropertyValue(colorProp);

      // Check if the current color is a valid CSS color
      if (isValidColor(currentColor)) {
        // Apply the new hue value to the current color
        var newColor = applyHueToColor(currentColor, hue);

        // Set the new color value on the element
        element.style.setProperty(colorProp, newColor);
      }
    }
  }
}

function isValidColor(color) {
  // Check if the color is a valid CSS color
  var testElement = document.createElement('div');
  testElement.style.color = color;
  return testElement.style.color != '';
}

function applyHueToColor(color, hue) {
  // Convert the color to HSL
  var hslColor = colorToHsl(color);

  // Apply the hue shift
  hslColor.h = parseFloat(hue);

  // Convert the color back to CSS format
  var newColor = hslToColor(hslColor);

  return newColor;
}

function colorToHsl(color) {
  // Convert the color to HSL
  var rgbaColor = colorToRgba(color);
  var hslColor = rgbaToHsl(rgbaColor);

  return hslColor;
}

function colorToRgba(color) {
  // Convert the color to RGBA
  var testElement = document.createElement('div');
  testElement.style.color = color;
  document.body.appendChild(testElement);
  var rgbaColor = window.getComputedStyle(testElement).getPropertyValue('color');
  document.body.removeChild(testElement);

  return rgbaColor;
}

function rgbaToHsl(color) {
  // Convert the color from RGBA to HSL
  var rgbaValues = color.match(/\d+/g);
  var red = parseInt(rgbaValues[0]) / 255;
  var green = parseInt(rgbaValues[1]) / 255;
  var blue = parseInt(rgbaValues[2]) / 255;

  var max = Math.max(red, green, blue);
  var min = Math.min(red, green, blue);
  var chroma = max - min;

  var hue = 0;
  if (chroma !== 0) {
    if (max === red) {
      hue = ((green - blue) / chroma) % 6;
    } else if (max === green) {
      hue = ((blue - red) / chroma) + 2;
    } else {
      hue = ((red - green) / chroma) + 4;
    }
    hue *= 60;
    if (hue < 0) {
      hue += 360;
    }
  }

  var lightness = (max + min) / 2;

  var saturation = 0;
  if (lightness !== 0 && lightness !== 1) {
    saturation = chroma / (1 - Math.abs(2 * lightness - 1));
  }

  var hsl

  return {
    h: hue,
    s: saturation * 100,
    l: lightness * 100
  };


  function hslToColor(color) {
    // Convert the color from HSL to CSS format
    var h = color.h;
    var s = color.s / 100;
    var l = color.l / 100;

    var chroma = (1 - Math.abs(2 * l - 1)) * s;
    var hue = h / 60;
    var x = chroma * (1 - Math.abs(hue % 2 - 1));
    var r, g, b;

    if (hue < 1) {
      r = chroma;
      g = x;
      b = 0;
    } else if (hue < 2) {
      r = x;
      g = chroma;
      b = 0;
    } else if (hue < 3) {
      r = 0;
      g = chroma;
      b = x;
    } else if (hue < 4) {
      r = 0;
      g = x;
      b = chroma;
    } else if (hue < 5) {
      r = x;
      g = 0;
      b = chroma;
    } else {
      r = chroma;
      g = 0;
      b = x;
    }

    var lightnessAdjustment = l - (chroma / 2);

    r += lightnessAdjustment;
    g += lightnessAdjustment;
    b += lightnessAdjustment;

    r *= 255;
    g *= 255;
    b *= 255;

    return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
  }
}


document.addEventListener('DOMContentLoaded', function () {

 /**
  * Opperating system / device detection function that applies a relative class
  * to the <html> element of a page.
  *
  * To be used inconjunction of any specific styling such as with webviews.
  *
  */
  function osDetection() {

    // Setup variables for browser type / OS / device type or touch
    var
      ua = navigator.userAgent,
      browser = /Edge\/\d+/.test(ua) ? 'ed' : /MSIE 9/.test(ua) ? 'ie9' : /MSIE 10/.test(ua) ? 'ie10' : /MSIE 11/.test(ua) ? 'ie11' : /MSIE\s\d/.test(ua) ? 'ie?' : /rv\:11/.test(ua) ? 'ie11' : /Firefox\W\d/.test(ua) ? 'ff' : /Chrom(e|ium)\W\d|CriOS\W\d/.test(ua) ? 'gc' : /\bSafari\W\d/.test(ua) ? 'sa' : /\bOpera\W\d/.test(ua) ? 'op' : /\bOPR\W\d/i.test(ua) ? 'op' : typeof MSPointerEvent !== 'undefined' ? 'ie?' : '',
      os = /Windows NT 10/.test(ua) ? "win10" : /Windows NT 6\.0/.test(ua) ? "winvista" : /Windows NT 6\.1/.test(ua) ? "win7" : /Windows NT 6\.\d/.test(ua) ? "win8" : /Windows NT 5\.1/.test(ua) ? "winxp" : /Windows NT [1-5]\./.test(ua) ? "winnt" : /Mac/.test(ua) ? "mac" : /Linux/.test(ua) ? "linux" : /X11/.test(ua) ? "nix" : "",
      touch = 'ontouchstart' in document.documentElement,
      mobile = /IEMobile|Windows Phone|Lumia/i.test(ua) ? 'w' : /iPhone|iP[oa]d/.test(ua) ? 'i' : /Android/.test(ua) ? 'a' : /BlackBerry|PlayBook|BB10/.test(ua) ? 'b' : /Mobile Safari/.test(ua) ? 's' : /webOS|Mobile|Tablet|Opera Mini|\bCrMo\/|Opera Mobi/i.test(ua) ? 1 : 0,
      tablet = /Tablet|iPad/i.test(ua);

    // Checks for iPhone / Android devices and adds a relative class
    if (mobile === 'i' && touch ) {
      document.documentElement.classList.add('iOS');
      document.documentElement.classList.add('js-iOS');
    } else if (mobile === 'a') {
      document.documentElement.classList.add('android');
      document.documentElement.classList.add('js-android');
    }
  }

  // Call the osDetection function
  osDetection();
});

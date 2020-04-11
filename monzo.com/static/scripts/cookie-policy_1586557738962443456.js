(function() {
  /**
   * Setup for cookie notice dialog which will set a cookie for users who dismiss
   * the dialog.
   */
  document.addEventListener("DOMContentLoaded", function() {
    // The cookie notice injection and interaction
    function cookiePolicy() {
      var context = null;

      return {
        setup: function setup(options) {
          var content = options.content;
          var start =
            '<dialog open="open" role="alertdialog" class="c-cookie-policy" aria-labelledby="cookie-policy-content"><p class="c-cookie-policy__content" id="cookie-policy-content" role="document">';
          var end =
            '</p> <button class="c-cookie-policy__button o-button-text js-close-cookie-policy" aria-label="Close this cookie notice notification">Dismiss</button></dialog>';

          if (this.getCookie("_cookies_accepted") !== "true") {
            var range = document.createRange();
            var fullNotice = start + " " + content + " " + end;
            var cookieNode = range.createContextualFragment(fullNotice);
            document.body.insertBefore(cookieNode, document.body.lastChild);
            this.context = document.querySelector(".c-cookie-policy");
            this.context
              .querySelector(".js-close-cookie-policy")
              .addEventListener(
                "click",
                function(e) {
                  e.preventDefault();
                  this.closeAndSetCookie();
                }.bind(this)
              );
          }
        },

        closeAndSetCookie: function closeAndSetCookie() {
          if (this.context.getAttribute("open")) {
            this.context.parentNode.removeChild(this.context);
            this.setCookie("_cookies_accepted", "true", 3000);
          }
        },

        setCookie: function setCookie(name, value, exdays) {
          var d = new Date();
          d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
          var expires = "expires=" + d.toUTCString();
          document.cookie = name + "=" + value + "; " + expires;
        },

        getCookie: function getCookie(name) {
          var name = name + "=";
          var ca = document.cookie.split(";");
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
              c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
              return c.substring(name.length, c.length);
            }
          }
          return "";
        }
      };
    }

    var options = {
      content:
        'By using this website you agree to our\n <a href="https://monzo.com/cookies">\n cookie notice\n</a>'
    };

    cookiePolicy().setup(options);
  });
})();

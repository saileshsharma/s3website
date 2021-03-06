;(function(b, o, i, l, e, r) {
  b.GoogleAnalyticsObject = l
  b[l] ||
    (b[l] = function() {
      ;(b[l].q = b[l].q || []).push(arguments)
    })
  b[l].l = +new Date()
  e = o.createElement(i)
  r = o.getElementsByTagName(i)[0]
  e.src = 'https://www.google-analytics.com/analytics.js'
  r.parentNode.insertBefore(e, r)
})(window, document, 'script', 'ga')

var isProd = window.location.hostname === 'monzo.com'
var PRODUCTION_GOOGLE_ANALYTICS_ID = 'UA-63104269-1'
var TESTING_GOOGLE_ANALYTICS_ID = 'UA-63104269-4'
var GOOGLE_ANALYTICS_ID = isProd
  ? PRODUCTION_GOOGLE_ANALYTICS_ID
  : TESTING_GOOGLE_ANALYTICS_ID
var _customTask = function() {
  // Function to set ClientId as Custom Dimension: https://www.notion.so/monzo/Adding-Client-ID-as-a-custom-dimension-b66119a094d346d19ccbcbb5ee90cc0c
  var clientIdIndex = 8

  var globalSendHitTaskName = '_ga_originalSendHitTask'

  return function(customTaskModel) {
    window[globalSendHitTaskName] =
      window[globalSendHitTaskName] || customTaskModel.get('sendHitTask')

    // clientIdIndex
    if (typeof clientIdIndex === 'number') {
      customTaskModel.set(
        'dimension' + clientIdIndex,
        customTaskModel.get('clientId'),
      )
    }
    // /clientIdIndex

    customTaskModel.set('sendHitTask', function(sendHitTaskModel) {
      var originalSendHitTaskModel = sendHitTaskModel,
        originalSendHitTask = window[globalSendHitTaskName],
        canSendHit = true

      try {
        if (canSendHit) {
          originalSendHitTask(sendHitTaskModel)
        }
      } catch (err) {
        originalSendHitTask(originalSendHitTaskModel)
      }
    })
  }
}

ga('create', GOOGLE_ANALYTICS_ID) // Google Analytics

ga('set', 'customTask', _customTask())

var branch = window.GIT_BRANCH
var gitCommit = window.GIT_COMMIT

/**
 * Function that tracks a click on an outbound link in Analytics.
 * This function takes a valid URL string as an argument, and uses that URL
 * string as the event label. Setting the transport method to 'beacon' lets
 * the hit be sent using 'navigator.sendBeacon' in browser that support it.
 */
var trackOutboundLink = function(url) {
  ga('send', 'event', 'outbound', 'click', url, {
    dimension1: branch,
    dimension2: gitCommit,
    transport: 'beacon',
    hitCallback: function() {
      document.location = url
    },
  })
}

function findLinksAndAddQueryParams(selector, params) {
  var queryParams = Object.keys(params)
    .reduce(function(accumulator, param) {
      accumulator.push(param + '=' + params[param])
      return accumulator
    }, [])
    .join('&')

  Array.prototype.slice
    .call(document.querySelectorAll(selector))
    .forEach(function(node) {
      var href = node.href
      var hasQueryParams = href.indexOf('?') > -1
      node.setAttribute(
        'href',
        href + (hasQueryParams ? '&' : '?') + queryParams,
      )
    })
}

window.addEventListener('load', function() {
  var encodedPathname = encodeURIComponent(window.location.pathname)
  findLinksAndAddQueryParams('[href^="https://app.adjust.com"]', {
    monzo_referrer: encodedPathname,
  })
  findLinksAndAddQueryParams('[href^="/-deeplinks"]', {
    monzo_referrer: encodedPathname,
  })

  window.ga &&
    window.ga(function(tracker) {
      // If GA isn't blocked by adblockers, lets add the GA clientId onto the adjust links as well.
      findLinksAndAddQueryParams('[href^="https://app.adjust.com"]', {
        google_client_id: tracker.get('clientId'),
      })
    })

  function navigateTo(url) {
    window.location = url
  }

  ga('send', 'pageview', { dimension1: branch, dimension2: gitCommit })

  Array.prototype.slice
    .call(document.querySelectorAll('[data-analytics-category]'))
    .forEach(function(trackedElement) {
      trackedElement.addEventListener('click', function(e) {
        e.preventDefault()
        var href = e.currentTarget.href

        if (href.indexOf('https://app.adjust.com') > -1) {
          // We are using the existance of adjust links to identify download buttons
          // that take you directly to the app / play store to download.
          // We only want to fire these Facebook for those buttons.
          fbq('track', 'InitiateCheckout', { url: window.location.pathname })
        }

        var elementData = e.currentTarget.dataset
        ga('send', {
          hitType: 'event',
          transport: 'beacon',
          hitCallback: function() {
            navigateTo(href)
          },
          eventCategory: elementData.analyticsCategory,
          eventAction: elementData.analyticsAction,
          eventLabel: elementData.analyticsLabel,
        })
        // Sets a timeout just in case the GA send event doesn't happen
        // and the hitCallback isn't called
        setTimeout(function() {
          navigateTo(href)
        }, 1000)
      })
    })
})

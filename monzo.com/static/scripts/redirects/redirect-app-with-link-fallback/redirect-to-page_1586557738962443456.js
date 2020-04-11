;(function() {
  // remove the '?' from the URL query params
  var SEARCH_PARAMS = window.location.search.slice(1)

  function buildDeeplink(deeplink) {
    var hasQueryParams = deeplink.indexOf('?') > -1

    if (!SEARCH_PARAMS) {
      return deeplink
    }

    return deeplink + (hasQueryParams ? '&' : '?') + SEARCH_PARAMS
  }

  function redirectToApp() {
    var appSchema = document
      .getElementsByTagName('body')[0]
      .getAttribute('data-app-deep-link')

    window.location.href = buildDeeplink(appSchema)
  }

  function convertSearchParamsToObject() {
    return SEARCH_PARAMS.split('&').reduce(function(accumulator, param) {
      var keyValue = param.split('=')
      if (keyValue.length === 2) {
        accumulator[keyValue[0]] = keyValue[1]
      }
      return accumulator
    }, {})
  }

  function redirectToPage() {
    var searchParams = convertSearchParamsToObject()
    // REDIRECT_LINK comes from the files in the redirects/page-variables files
    window.location.href = REDIRECT_LINK
  }

  function redirect(event) {
    if (event && event.preventDefault) event.preventDefault()

    setTimeout(redirectToApp, 0)
    setTimeout(redirectToPage, 300)
  }

  document.getElementById('js-launch-app').addEventListener('click', redirect)
  redirect()
})()

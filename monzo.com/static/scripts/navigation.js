;(function() {
  var IS_VISIBLE = 'is-visible'
  var MOBILE_OVERLAY = 'mobile-navigation-overlay'
  var MOBILE_NO_SCROLL = 'mobile-no-scroll'

  var openMenu = document.querySelector('.js-open-main-navigation')
  var closeMenu = document.querySelector('.js-close-main-navigation')
  var mainNavigation = document.querySelector('.js-main-navigation')
  var dropdownToggles = document.querySelectorAll('.js-dropdown-toggle')
  var dropdowns = document.querySelectorAll('.main-navigation__links__dropdown')
  var html = document.getElementsByTagName('html')[0]

  function touchMoveListener(event) {
    event.preventDefault()
  }

  function addOverlay() {
    var overlay = document.createElement('div')
    overlay.setAttribute('class', MOBILE_OVERLAY)
    document.body.appendChild(overlay)
  }

  function removeOverlay() {
    document.body.removeChild(document.querySelector('.' + MOBILE_OVERLAY))
  }

  openMenu.addEventListener('click', function(e) {
    e.preventDefault()
    addOverlay()
    mainNavigation.classList.add(IS_VISIBLE)
    html.classList.add(MOBILE_NO_SCROLL)
    html.addEventListener('touchmove', touchMoveListener)
  })

  closeMenu.addEventListener('click', function(e) {
    e.preventDefault()
    removeOverlay()
    mainNavigation.classList.remove(IS_VISIBLE)
    html.classList.remove(MOBILE_NO_SCROLL)
    html.removeEventListener('touchmove', touchMoveListener)
  })

  Array.prototype.forEach.call(dropdownToggles, function(dropdownToggle) {
    dropdownToggle.addEventListener('click', function(e) {
      e.preventDefault()
      // Go up through the h3, and up to the li
      var dropdown = e.currentTarget.parentNode.parentNode.querySelector('ul')

      if (dropdown.classList.contains(IS_VISIBLE)) {
        return dropdown.classList.remove(IS_VISIBLE)
      }
      return dropdown.classList.add(IS_VISIBLE)
    })

    dropdownToggle.addEventListener('mouseleave', function(e) {
      e.preventDefault()
      // Go up through the h3, and up to the li
      var dropdown = dropdownToggle.parentNode.parentNode.querySelector('ul')
      dropdown.classList.remove(IS_VISIBLE)
    })
  })

  Array.prototype.forEach.call(dropdowns, function(dropdown) {
    dropdown.addEventListener('focusout', function(event) {
      if (dropdown.contains(event.relatedTarget)) {
        return dropdown.classList.add(IS_VISIBLE)
      }
      return dropdown.classList.remove(IS_VISIBLE)
    })
  })
})()

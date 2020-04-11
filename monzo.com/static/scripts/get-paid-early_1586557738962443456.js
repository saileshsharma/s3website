/* global bodymovin */
if (bodymovin) {
  if (window.innerWidth <= 768) {
    var confettiAnimation = bodymovin.loadAnimation({
      container: document.querySelector('.wallet-animation__confetti'),
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: '/static/data/confetti.json',
    })

    var animationHasPlayed = false

    window.addEventListener('scroll', function() {
      var animationContainer = document.querySelector('.wallet-animation')

      /**
       * Checks how near the bottom of the animation div is to the top of the
       * main window.
       */
      if (animationContainer.getBoundingClientRect().bottom < 390) {
        if (!animationHasPlayed) {
          confettiAnimation.play()
          animationHasPlayed = true
        }
        animationContainer.classList.add('wallet-animation--close-wallet')
      } else {
        animationContainer.classList.remove('wallet-animation--close-wallet')
      }
    })
  }
}

// Add animation
bodymovin &&
  bodymovin.loadAnimation({
    container: document.getElementById('confetti'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: '/static/data/confetti.json',
  });

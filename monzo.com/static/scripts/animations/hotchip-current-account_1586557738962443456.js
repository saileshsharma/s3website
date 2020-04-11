var animation = bodymovin.loadAnimation({
  container: document.getElementById('hotchip-current-account'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  prerender: true,
  rendererSettings: {
      progressiveLoad:true
  },
  path: '/static/data/hotchip-current-account.json'
})

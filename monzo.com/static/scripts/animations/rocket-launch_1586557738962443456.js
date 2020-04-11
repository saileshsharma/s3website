(function() {
  window.addEventListener("load", function() {
    document.body.classList.add("animation-running");

    window.requestAnimationFrame(function() {
      animation.playSegments([0, 30], true);
    });
    window.setTimeout(function() {
      document.body.classList.remove("animation-running");
      window.setTimeout(function() {
        document.body.classList.add("animation-complete");
      }, 1);
    }, 1000);
  });

  var animation = bodymovin.loadAnimation({
    container: document.getElementById("rocket-launch"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "/static/data/rocket-launch.json"
  });
})();

$(function() {
  var toc = $(".c-toc");
  var tocContainer = $(".c-toc__container");
  var tocContent = $(".c-toc__content");

  function setTocModifier(modifier) {
    tocContainer.removeClass("c-toc__container--top");
    toc.removeClass("c-toc--top");
    tocContainer.removeClass("c-toc__container--bottom");
    toc.removeClass("c-toc--bottom");
    tocContainer.removeClass("c-toc__container--fixed");
    toc.removeClass("c-toc--fixed");
    tocContainer.addClass("c-toc__container--" + modifier);
    toc.addClass("c-toc--" + modifier);
  }

  var position = undefined;
  function repositionToc() {
    var tocContentHeight = tocContent.outerHeight();
    var tocClientRect = toc[0].getBoundingClientRect();
    var largeViewport = $(window).width() >= 1024;

    if (largeViewport) {
      tocContainer.css("width", toc.width());
      tocContainer.css("max-height", "");
    } else {
      tocContainer.css("width", "");
    }

    var moveToTop = tocClientRect.top > 0;
    var moveToBottom =
      largeViewport && tocClientRect.bottom <= tocContentHeight;
    var moveToFixed = !moveToBottom && !moveToTop;
    if (!toc.hasClass("c-toc--bottom") && moveToBottom) {
      setTocModifier("bottom");
    } else if (!toc.hasClass("c-toc--top") && moveToTop) {
      setTocModifier("top");
    } else if (!toc.hasClass("c-toc--fixed") && moveToFixed) {
      setTocModifier("fixed");
    }
  }

  function highlightActiveTocItem() {
    var contentSectionsSelector = $(".c-toc__nav a")
      .map((i, a) => $(a).attr("href"))
      .get()
      .join(", ");
    var contentSections = $(contentSectionsSelector);
    var windowHeight = $(window).height();

    // Remove highlight from all list items
    $(".c-toc__nav li").removeClass("c-toc__item--active");

    // Calculate active section
    var activeContentSection = contentSections[0];
    for (i = 0; i < contentSections.length; i++) {
      var distanceFromTop = contentSections[i].getBoundingClientRect().top;
      var breakpoint = windowHeight * 0.25;
      if (distanceFromTop > breakpoint) break;
      activeContentSection = contentSections[i];
    }

    // Highlight active list item
    var activeLink = $(
      $('.c-toc__nav a[href="#' + activeContentSection.id + '"]')[0]
    );
    var activeListItem = activeLink.parent();
    activeListItem.addClass("c-toc__item--active");
  }

  function resetToc() {
    toc.removeClass("c-toc--active");
    tocContainer.css("max-height", "");
    tocContainer.scrollTop(0);
  }

  function toggleToc() {
    toc.toggleClass("c-toc--active");
    tocContainer.toggleClass("c-toc__container--active");
    var maxHeight = tocContent.height();
    var newMaxHeight = toc.hasClass("c-toc--active") ? maxHeight : "";
    tocContainer.css("max-height", newMaxHeight);
    tocContainer.animate({ scrollTop: 0 }, "fast");
  }

  $(".c-toc__header").on("click", toggleToc);
  $(".c-toc__item > a").on("click", function() {
    if (toc.hasClass("c-toc--active")) {
      toggleToc();
    }
  });

  highlightActiveTocItem();
  repositionToc();

  $(window).on("scroll", function() {
    highlightActiveTocItem();
    repositionToc();
  });

  var lastWindowWidth;
  $(window).on("resize", function(e) {
    var newWindowWidth = $(window).width();

    if (lastWindowWidth >= 1024 && newWindowWidth < 1024) {
      resetToc();
    }

    repositionToc();

    lastWindowWidth = newWindowWidth;
  });
});

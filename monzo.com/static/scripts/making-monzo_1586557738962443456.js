'use strict';

(function() {
  var API_BASE_PATH = 'https://api.monzo.com';
  var FEATURES_URL = API_BASE_PATH + '/making-monzo/features';

  var FEATURE_CONTAINER_ID = 'feature-list';
  var EXPANDED_FEATURE_CONTAINER_ID = 'expanded-feature';
  var CATEGORIES_CONTAINER_ID = 'category-list';

  var templates = {
    category: makeBasicTemplate('category-template'),
    feature: makeBasicTemplate('feature-template'),
    expandedFeature: makeBasicTemplate('expanded-feature-template'),
  };

  var categories;
  var defaultHash;
  var currentCategory;

  /*****************
   * API
   *****************/

  function loadFeatures(callback) {
    $.ajax({
      url: FEATURES_URL,
      type: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      success: function(response) {
        callback(response.categories);
      },
      error: function(jqXHR, status, error) {
        console.error(error);
      },
    });
  }

  /*****************
   * Basic templating
   *****************/

  function makeBasicTemplate(elementId) {
    var template = document.getElementById(elementId).innerHTML;
    return function(data) {
      return Object.keys(data)
        .reduce(function(result, key) {
          return result.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), data[key]);
        }, template)
        .replace(/{{[^}]*}}/g, '');
    };
  }

  /*****************
   * Navigation
   *****************/
  function handleHashChange() {
    parseHash();
    clearExpandedSectionFromDocument();
  }

  function parseHash() {
    clearExpandedSectionFromDocument();
    var hash = document.location.hash || defaultHash || '';
    var navItem = $(".c-secondary-navigation__link[href='" + hash + "']").get(0);

    if (navItem) {
      $('.c-secondary-navigation__item.selected').removeClass('selected');
      $(navItem)
        .parent()
        .addClass('selected');

      currentCategory = navItem.textContent;
      renderFeaturesToDocument();
    }
  }

  function generateSlug(string) {
    return string.toLowerCase().replace(/\s/g, '-');
  }

  function renderCategory(category) {
    var slug = generateSlug(category.title);
    return templates.category({ slug: slug, title: category.title });
  }

  /*****************
   * Rendering
   *****************/

  function renderCategoriesToDocument() {
    if (!categories) {
      return;
    }
    var rendered = categories.map(renderCategory).join('');
    var container = document.getElementById(CATEGORIES_CONTAINER_ID);
    container.innerHTML = rendered;
    var links = container.querySelectorAll('a');
    links.forEach(function(link) {
      link.addEventListener('touchstart', function(e) {
        this.click();
        e.preventDefault();
      });
    });
  }

  function clearExpandedSectionFromDocument() {
    var container = document.getElementById(EXPANDED_FEATURE_CONTAINER_ID);
    container.innerHTML = '';
  }

  function renderExpandedSectionToDocument(slug) {
    var category = categories
      .find(function(category) {
        return category.title === currentCategory;
      })
      .features.filter(function(feature) {
        return feature.slug === slug;
      });

    var container = document.getElementById(EXPANDED_FEATURE_CONTAINER_ID);
    var rendered = templates.expandedFeature(category[0]);
    container.innerHTML = rendered;

    if (!category[0].latest_update) {
      var aside = document.getElementById('latest-update-aside');
      aside.parentNode.removeChild(aside);
    }

    $('html,body').animate({
      scrollTop: $('#category-list').offset().top,
    });

    var expandedFeatureCloseIcon = document.getElementById('expanded-feature-close-icon');

    expandedFeatureCloseIcon.addEventListener('click', clearExpandedSectionFromDocument);

    expandedFeatureCloseIcon.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        clearExpandedSectionFromDocument();
      }
    });
  }

  function renderFeaturesByCategory(category) {
    return category.features.map(templates.feature).join('');
  }

  function renderFeaturesToDocument() {
    if (!categories) {
      return;
    }

    var category = categories.find(function(category) {
      return category.title === currentCategory;
    });

    // pin featured to top
    category.features.sort(function(featureA, featureB) {
      featureA.featured ? -1 : featureB.featured ? 1 : 0;
    });
    var rendered = renderFeaturesByCategory(category);
    var container = document.getElementById(FEATURE_CONTAINER_ID);
    container.innerHTML = rendered;

    var featureCards = document.getElementsByClassName('feature-card');

    Array.from(featureCards).forEach(function(featureCard) {
      featureCard.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          var focussedCard = document.activeElement;
          if (focussedCard.classList.contains('feature-card')) {
            focussedCard.click();
          }
        }
      });
    });

    // add "FEATURED" banner
    category.features.forEach(function(feature) {
      if (feature.is_featured) {
        document.getElementById(feature.slug).classList.add('is-featured');
      }
    });

    // Use event delegation to detect element's data-slug attribute
    container.addEventListener('click', function(e) {
      var slug = e.target.dataset.slug;
      renderExpandedSectionToDocument(slug);
    });
  }

  /*****************
   * Init
   *****************/

  function init() {
    loadFeatures(function(result) {
      categories = result;
      defaultHash = '#' + generateSlug(categories[0].title);

      renderCategoriesToDocument();
      parseHash();
    });

    initTwitterFeed();
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      clearExpandedSectionFromDocument();
    }
  });

  window.addEventListener('hashchange', handleHashChange);
})();

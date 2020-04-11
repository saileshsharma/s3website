$(function() {
  var isProduction = window.location.href.indexOf('https://monzo.com') >= 0

  var SAVINGS_API_BASE_PATH = isProduction
    ? 'https://api.monzo.com'
    : 'https://api.s101.nonprod-ffs.io'

  var SAVINGS_DEV_CLIENT_SECRET =
    'vPI4zuR25uZKl4h2hq59WvHcUeVS2dpHDCl7/k3gY0WPaEGXf1dS5NBIsnhvu2q4gNFs9Y9Zoos0bfCgHFS2'

  var SAVINGS_DEV_CLIENT_ID = 'oauthclient_000094oi2ytifdsiO84Xfl'

  var SAVINGS_PROD_CLIENT_SECRET =
    'vPI4zuR25uZKl4h2hq59WvHcUeVS2dpHDCl7/k3gY0WPaEGXf1dS5NBIsnhvu2q4gNFs9Y9Zoos0bfCgHFS2'

  var SAVINGS_PROD_CLIENT_ID = 'oauthclient_000094oi2ytifdsiO84Xfl'

  var SAVINGS_CLIENT_SECRET = isProduction
    ? SAVINGS_PROD_CLIENT_SECRET
    : SAVINGS_DEV_CLIENT_SECRET

  var SAVINGS_CLIENT_ID = isProduction
    ? SAVINGS_PROD_CLIENT_ID
    : SAVINGS_DEV_CLIENT_ID

  const easyAccessLoading = $('#easy-access-loading')
  const isaLoading = $('#isa-loading')
  const fixedLoading = $('#fixed-loading')

  // Rates logic
  function refreshHeadlineRate(access_token) {
    $.get({
      url: SAVINGS_API_BASE_PATH + '/pots/savings/issues/headline',
      headers: { "Authorization": "Bearer " + access_token },
      timeout: 2000 //ms
    }).done(function(rate) {
        document.getElementById("headline-rate").innerHTML = rate.interest_rate_aer_formatted
        document.getElementById("headline-rate-type").innerHTML = rateTypeText(rate)
    }).fail(function() {
      // intentionally do nothing, as this is inline
    })
  }

  function refreshAvailableRates(access_token) {
    $.get({
      url: SAVINGS_API_BASE_PATH + '/pots/savings/issues/available',
      headers: { "Authorization": "Bearer " + access_token },
      timeout: 2000 //ms
    }).done(function(ratesResponse) {
      let easyAccessRow = $('#easy-access-rates')
      let isaRow = $('#isa-rates')
      let fixedRow = $('#fixed-rates')
      let easyAccessRatesCount = 0
      let isaRateCount = 0
      let fixedRateCount = 0

      ratesResponse.rates.forEach(rate => {
        var html = buildRateHTML(rate)

        if (rate.type == "flexible_savings") {
          if (rate.isa_wrapper == "ISA") {
            isaRow.append(html)
            isaRateCount += 1
          } else {
            easyAccessRow.append(html)
            easyAccessRatesCount += 1
          }
        } else {
          fixedRow.append(html)
          fixedRateCount += 1
        }
      })

      if (easyAccessRatesCount == 0) {
        $('#easy-access-section').remove()
      } else {
        easyAccessLoading.remove()
      }
      if (isaRateCount == 0) {
        $('#isa-section').remove()
      } else {
        isaLoading.remove()
      }
      if (fixedRateCount == 0) {
        $('#fixed-section').remove()
      } else {
        fixedLoading.remove()
      }
    }).fail(handleAPIFailure)
  }

  function handleAPIFailure() {
    let message = "Whoops, we couldn't load the rates please refresh or try again later."
    easyAccessLoading.text(message)
    isaLoading.text(message)
    fixedLoading.text(message)
  }

  function buildRateHTML(rate) {
    return [
      '<div class="grid-col-12 grid-col-6-md">' +
        '<div class="o-box o-box--white u-margin-top-large-md rate-container">' +
          '<div class="grid-row grid-row--center grid-row--middle">' +
            '<div class="grid-col-6 u-align-left ' + providerId(rate) + '-height">' +
              '<img ' +
                'width="120" ' +
                'src="/static/images/savings/' + providerId(rate) + '@2x.png" ' +
                'alt="' + providerId(rate) + '" ' +
              '/>' +
            '</div>' +
            '<div class="grid-col-6 u-align-right">' +
              '<span class="u-font-size-h3 u-font-bold">' + rate.interest_rate_aer_formatted + '</span>' +
              '<br />' +
              '<span class="u-font-size-h6">' + interestPerYearText(rate) + ' ' + rateTypeText(rate) + '</span>' +
            '</div>' +
          '</div>' +
          '<h4 class="u-margin-top-small">' + productName(rate) + '</h4>' +
          '<p class="u-margin-top-small">' +
            withdrawText(rate) +
            '<br />' +
            rate.minimum_deposit_formatted + ' minimum deposit' +
          '</p>' +
          unavailableHtml(rate) +
        '</div>' +
      '</div>'
    ].join("\n")
  }

  function rateTypeText(rate) {
    let result = '(AER, variable)'
    if (rate.type === 'fixed_savings') {
      result = '(AER, fixed)'
    }
    return result
  }

  function interestPerYearText(rate) {
    let result = 'interest per year'
    if (rate.type === 'fixed_savings') {
      result = 'gross interest per year'
    }
    return result
  }

  function providerId(rate) {
    return rate.provider.toLowerCase()
  }

  function withdrawText(rate) {
    let result = 'Withdraw the next working day'
    if (rate.type === 'fixed_savings') {
      result = 'Withdraw in ' + durationInMonths(rate) + ' months'
    }
    return result
  }

  function productName(rate) {
    let provider = rate.provider
    if (provider === 'Charter') {
      provider = 'Charter Savings Bank'
    }
    let result = provider
    if (rate.type === 'fixed_savings') {
      result = provider + ' ' + durationInMonths(rate)
    }
    return result
  }

  function durationInMonths(rate) {
    let durationIso8601 = rate.term_coarse_grained_duration_iso8601
    return durationIso8601.substring(1, durationIso8601.length-1)
  }

  function unavailableHtml(rate) {
    let unavailableTemplate = [
      '<div class="unavailable">' +
      ' <p>Temporarily unavailable. <br />Be back soon!</p>' +
      '</div>'
    ].join("\n")
    return rate.is_temporarily_unavailable ? unavailableTemplate : ''
  }

  $.post({
    url: SAVINGS_API_BASE_PATH + '/oauth2/token',
    data: {
      grant_type: 'client_credentials',
      client_id: SAVINGS_CLIENT_ID,
      client_secret: SAVINGS_CLIENT_SECRET,
    },
    timeout: 2000 //ms
  }).done(function(authResponse) {
    refreshHeadlineRate(authResponse.access_token)
    refreshAvailableRates(authResponse.access_token)
  }).fail(handleAPIFailure)
})

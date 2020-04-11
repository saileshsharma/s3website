;(function() {
  var isProduction = window.location.href.indexOf('https://monzo.com') >= 0
  var API_BASE_PATH = isProduction
    ? 'https://api.monzo.com'
    : 'https://api.s101.nonprod-ffs.io'

  var DEV_CLIENT_SECRET =
    'mnzpub.zob+O6cAnaU71h9d5d674t4BE5+0haGGmEizDUczfkTQpqIR2QbKsPTH8F8Ws8FJbZmgtNYGY5nSlhHnzvDC'
  var DEV_CLIENT_ID = 'oauth2client_00009fjFlVvP56SEqpZ0OP'

  var PROD_CLIENT_SECRET =
    'mnzpub.Qk3jHt9agu5rMM3weExs66j8vzowevEr3S7hb+KHwrMyI5hytXAfDXysUMwPsZ8MJF/tvp++nENZs+py3VHG'
  var PROD_CLIENT_ID = 'oauth2client_00009fjFnFp5uzTZtRxZ57'

  var CLIENT_SECRET = isProduction ? PROD_CLIENT_SECRET : DEV_CLIENT_SECRET
  var CLIENT_ID = isProduction ? PROD_CLIENT_ID : DEV_CLIENT_ID

  window.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('text-to-install-form')

    form.addEventListener('submit', function(e) {
      e.preventDefault()

      if (!window.ga) return handleSubmit()

      // Set a timer to trigger the submit after 250ms
      // This is just incase the the send event below fails
      // or is taking a particularly long time
      var timer = setTimeout(function() {
        handleSubmit()
      }, 250)

      window.ga('send', {
        hitType: 'event',
        eventCategory: 'conversion',
        eventAction: 'download app',
        eventLabel: 'download page',
        transport: 'beacon',
        hitCallback: function() {
          handleSubmit()
          clearTimeout(timer)
        },
      })
    })

    function handleSubmit() {
      var formData = $(form)
        .serializeArray()
        .reduce(
          function(accumulator, current) {
            accumulator[current.name] = current.value
            return accumulator
          },
          { label: 'homepage hero' },
        )
      var JSONFormData = JSON.stringify(formData)

      function renderSuccessFailureMessage(message) {
        form.style.display = 'none'

        var messageContainer = document.getElementById(
          'success-failure-message',
        )
        messageContainer.innerText = message
      }

      function formSubmissionSuccess() {
        window.fbq &&
          window.fbq('track', 'Lead', { url: window.location.pathname })
        renderSuccessFailureMessage(
          'Check your phone, your text is on its way!',
        )
      }

      function formSubmissionFailure() {
        renderSuccessFailureMessage(
          'Something went wrong. Please add a valid UK phone number, or try again later.',
        )
      }

      $.post({
        url: API_BASE_PATH + '/oauth2/token',
        data: {
          grant_type: 'client_credentials',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        },
      })
        .done(function(response) {
          $.post({
            url: API_BASE_PATH + '/install-link-sender/send-sms',
            data: JSONFormData,
            beforeSend: function(xhr) {
              xhr.setRequestHeader(
                'Authorization',
                'Bearer ' + response.access_token,
              )
            },
          })
            .done(formSubmissionSuccess)
            .fail(formSubmissionFailure)
        })
        .fail(formSubmissionFailure)
    }

    var phoneInput = form.querySelector('#phone_number')
    phoneInput.addEventListener('focus', function phoneInputFocus() {
      window.ga &&
        window.ga('send', {
          hitType: 'event',
          eventCategory: 'text to install',
          eventAction: 'form interaction',
          eventLabel: 'download page',
          transport: 'beacon',
        })
      // We only want to send the event once
      // so we need to remove the event listener after the first focus
      phoneInput.removeEventListener('focus', phoneInputFocus)
    })
  })
})()

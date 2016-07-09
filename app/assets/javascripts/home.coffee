$(document).on 'page:load ready', ->
  $('[data-toggle="popover"]').popover()
  lightbox.init()

  $('.toggle-content').click (e) ->
    e.preventDefault()
    $target = $($(this).data('target'))
    if $target.is(':visible')
      $target.slideUp()
    else
      $target.slideDown()
    false

$(window).on 'page:load', ->
  if $('[data-parsley-validate]').length
    $('[data-parsley-validate]').parsley()
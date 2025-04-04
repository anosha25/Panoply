$(document).ready(function () {
  // Mobile instructions and button toggle
  if (window.innerWidth <= 768) {
    $('#addTextBtn').show();
    $('#instructions').html('Drag things around.<br>Tap the button to add text.');
  } else {
    $('#addTextBtn').hide();
    $('#instructions').html('Drag things around.<br>Double click to add text.');
  }

  // Make letters draggable
  $('.draggable-letter').draggable({
    cursor: 'grab',
    // containment: 'body',
    scroll: false,
    helper: 'original',
    start: function (event, ui) {
      $(this).css('z-index', 3);
    },
    stop: function (event, ui) {
      $(this).css('z-index', '');
    }
  });
  
  // Mouse trail with delay
  let lastTrailTime = 0;
  $(document).on('mousemove', function (e) {
    const now = Date.now();
    if (now - lastTrailTime < 100) return;
    lastTrailTime = now;

    const shapeDiv = $('<div class="shape circle"></div>');
    shapeDiv.css({
      left: e.clientX + 'px',
      top: e.clientY + 'px',
      backgroundColor: getRandomColor(),
      zIndex: 0,
    });
    $('#trail-layer').append(shapeDiv);
  });

  // Desktop: double-click to add text box
  $(document).on('dblclick', function (e) {
    if (window.innerWidth > 768) {
      createTextBox(e.pageX, e.pageY);
    }
  });

  // Mobile: tap to create random text box
  $('#addTextBtn').on('click', function () {
    const randomX = Math.floor(Math.random() * (window.innerWidth - 220));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 120));
    createTextBox(randomX, randomY);
  });

  // Create text box with placeholder logic
  function createTextBox(x, y) {
    $('.text-box').attr('contenteditable', 'false').removeClass('active-text-box');

    const textBox = $('<div class="text-box active-text-box" contenteditable="true" data-placeholder="Type something..."></div>');
    textBox.css({ left: x + 'px', top: y + 'px' });
    textBox.text('');
    $('body').append(textBox);
    textBox.draggable().focus();

    textBox.attr('data-placeholder-active', true);

    textBox.on('input', function () {
      $(this).attr('data-placeholder-active', false);
    });

    textBox.on('dblclick', function () {
      $('.text-box').attr('contenteditable', 'false').removeClass('active-text-box');
      $(this).attr('contenteditable', 'true').focus().addClass('active-text-box');
    });
  }

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
});

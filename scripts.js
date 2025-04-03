$(document).ready(function () {
  // Make letter divs draggable
  $('.letters').draggable({
    cursor: 'grab',
    containment: 'window',
  });

  // Mouse trail with circle shapes
  $(document).on('mousemove', function (e) {
    const shapeDiv = $('<div class="shape circle"></div>');
    shapeDiv.css({
      left: e.pageX + 'px',
      top: e.pageY + 'px',
      width: '30px',
      height: '30px',
      position: 'absolute',
      backgroundColor: getRandomColor(),
      borderRadius: '50%',
      opacity: '0.5',
      pointerEvents: 'none',
      zIndex: 1,
    });
    $('body').append(shapeDiv);
  });

  // Create a text box on double click (desktop) or button (mobile)
  $(document).on('dblclick', function (e) {
    createTextBox(e.pageX, e.pageY);
  });

  $('#addTextBtn').on('click', function () {
    const randomX = Math.floor(Math.random() * (window.innerWidth - 220));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 120));
    createTextBox(randomX, randomY);
  });

  // Helper to create text box
  function createTextBox(x, y) {
    const textBox = $('<div class="text-box" contenteditable="true">Edit me</div>');
    textBox.css({
      left: x + 'px',
      top: y + 'px',
      width: '200px',
      height: '100px',
      position: 'absolute',
      border: '1px solid black',
      backgroundColor: '#fff',
      padding: '10px',
      overflow: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      zIndex: 2,
    });
    $('body').append(textBox);
    textBox.draggable().focus();
  }

  // Color generator
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
});

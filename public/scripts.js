// Firebase SDK imports (MODULAR SDK, via <script> tag version)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
import { getFirestore, doc, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDPY2D2yHuxXEB8NLU8oVdgDm0nrGoT7nQ",
  authDomain: "panoply-web.firebaseapp.com",
  projectId: "panoply-web",
  storageBucket: "panoply-web.firebasestorage.app",
  messagingSenderId: "625340337711",
  appId: "1:625340337711:web:da025111343b53eca040da",
  measurementId: "G-Y2PMELK4VR"
};

// ✅ Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

$(document).ready(function () {
  const letterIDs = ['P', 'A', 'N', 'O', 'P2', 'L', 'Y'];

  // Load existing letter positions in real-time
  letterIDs.forEach((id) => {
    const el = $(`#letter${id}`);
    const ref = doc(db, 'letters', id);
    onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        el.css({ left: data.left, top: data.top });
      }
    });

    el.draggable({
      cursor: 'grab',
      // containment: 'body',
      scroll: false,
      stop: async function (event, ui) {
        await setDoc(ref, {
          left: ui.position.left + 'px',
          top: ui.position.top + 'px'
        });
      }
    });
  });

  // Mobile / desktop instructions
  if (window.innerWidth <= 768) {
    $('#addTextBtn').show();
    $('#instructions').html('Drag things around.<br>Tap the button to add text.');
  } else {
    $('#addTextBtn').hide();
    $('#instructions').html('Drag things around.<br>Double click to add text.');
  }

  // Text box creation
  $('#addTextBtn').on('click', () => addTextBox());
  $(document).on('dblclick', (e) => {
    if (window.innerWidth > 768) addTextBox(e.pageX, e.pageY);
  });

  function addTextBox(x = Math.random() * window.innerWidth, y = Math.random() * window.innerHeight) {
    $('.text-box').attr('contenteditable', 'false').removeClass('active-text-box');
    const textBox = $('<div class="text-box active-text-box" contenteditable="true" data-placeholder="Type something..."></div>');
    textBox.css({ left: x + 'px', top: y + 'px' });
    textBox.text('');
    $('body').append(textBox);
    textBox.draggable().focus();
    textBox.attr('data-placeholder-active', true);
    textBox.on('input', () => textBox.attr('data-placeholder-active', false));
    textBox.on('dblclick', function () {
      $('.text-box').attr('contenteditable', 'false').removeClass('active-text-box');
      $(this).attr('contenteditable', 'true').focus().addClass('active-text-box');
    });
  }

  // Mouse trail
  let lastTrailTime = 0;
  $(document).on('mousemove', function (e) {
    const now = Date.now();
    if (now - lastTrailTime < 100) return;
    lastTrailTime = now;

    const circle = $('<div class="shape circle"></div>');
    circle.css({
      left: e.pageX + 'px',
      top: e.pageY + 'px',
      backgroundColor: getRandomColor()
    });
    $('#trail-layer').append(circle);
  });

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    return '#' + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('');
  }
});

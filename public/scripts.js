// ✅ Firebase setup (replace with your own config)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  getDocs
} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXXXX",
  appId: "XXXXXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

$(document).ready(function () {
  // Mobile instruction
  if (window.innerWidth <= 768) {
    $('#addTextBtn').show();
    $('#instructions').html('Drag things around.<br>Tap the button to add text.');
  } else {
    $('#addTextBtn').hide();
    $('#instructions').html('Drag things around.<br>Double click to add text.');
  }

  // Drag the letters
  $('.draggable-letter').draggable({
    cursor: 'grab',
    scroll: false,
    helper: 'original',
    start: function () {
      $(this).css('z-index', 3);
    },
    stop: function (event, ui) {
      $(this).css('z-index', '');
      const id = $(this).attr('id');
      const position = $(this).position();
      setDoc(doc(db, 'letters', id), {
        top: position.top,
        left: position.left
      });
    }
  });

  // Load stored letter positions
  async function loadLetters() {
    const ids = ['letterP', 'letterA', 'letterN', 'letterO', 'letterP2', 'letterL', 'letterY'];
    for (let id of ids) {
      const snap = await getDoc(doc(db, 'letters', id));
      if (snap.exists()) {
        const pos = snap.data();
        $(`#${id}`).css({ top: pos.top + 'px', left: pos.left + 'px' });
      }
    }
  }

  loadLetters();

  // Mouse trail (slow)
  let lastTrail = 0;
  $(document).on('mousemove', function (e) {
    const now = Date.now();
    if (now - lastTrail < 100) return;
    lastTrail = now;

    const circle = $('<div class="shape circle"></div>');
    circle.css({
      left: e.clientX + 'px',
      top: e.clientY + 'px',
      backgroundColor: getRandomColor()
    });
    $('#trail-layer').append(circle);
  });

  // Create text box (desktop double-click)
  $(document).on('dblclick', function (e) {
    if (window.innerWidth > 768) {
      createTextBox(e.pageX, e.pageY);
    }
  });

  // Create text box (mobile button)
  $('#addTextBtn').on('click', function () {
    const x = Math.floor(Math.random() * (window.innerWidth - 220));
    const y = Math.floor(Math.random() * (window.innerHeight - 120));
    createTextBox(x, y);
  });

  // Create text box
  function createTextBox(x, y) {
    $('.text-box').attr('contenteditable', 'false').removeClass('active-text-box');

    const box = $('<div class="text-box active-text-box" contenteditable="true" data-placeholder="Type something..."></div>');
    box.css({ top: y + 'px', left: x + 'px' });
    $('body').append(box);
    box.draggable().focus();
    box.attr('data-placeholder-active', true);

    box.on('input', function () {
      $(this).attr('data-placeholder-active', false);
    });

    box.on('dblclick', function () {
      $('.text-box').attr('contenteditable', 'false').removeClass('active-text-box');
      $(this).attr('contenteditable', 'true').focus().addClass('active-text-box');
    });

    // Save to Firestore
    addDoc(collection(db, 'textBoxes'), {
      top: y,
      left: x,
      content: ''
    }).then(docRef => {
      box.attr('data-id', docRef.id);
      box.on('input', function () {
        updateDoc(doc(db, 'textBoxes', docRef.id), {
          content: $(this).text()
        });
      });
    });
  }

  // Load saved boxes
  async function loadTextBoxes() {
    const snapshot = await getDocs(collection(db, 'textBoxes'));
    snapshot.forEach(docSnap => {
      const d = docSnap.data();
      const box = $('<div class="text-box"></div>');
      box.css({ top: d.top + 'px', left: d.left + 'px' });
      box.text(d.content);
      box.attr('data-id', docSnap.id);
      $('body').append(box);
      box.draggable();
    });
  }

  loadTextBoxes();

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
});

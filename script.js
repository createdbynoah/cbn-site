// tiny JS: entrance + year + "/" shortcut
document.body.classList.add('ready');
document.getElementById('year').textContent = new Date().getFullYear();

let pulseTimeout = null;

window.addEventListener('keydown', (e) => {
  if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    e.preventDefault();
    const currentFocus = document.querySelector('.current-focus');
    const currentFocusCard = currentFocus?.querySelector('.card');
    if (currentFocus && currentFocusCard) {
      currentFocus.scrollIntoView({ behavior: 'smooth', block: 'center' });
      currentFocusCard.focus();
      currentFocus.classList.add('pulse');
      if (pulseTimeout) clearTimeout(pulseTimeout);
      pulseTimeout = setTimeout(
        () => currentFocus.classList.remove('pulse'),
        6000,
      );
    }
  }

  // Stop pulse animation on Tab key press and allow normal navigation
  if (e.key === 'Tab') {
    const currentFocus = document.querySelector('.current-focus');
    if (currentFocus && currentFocus.classList.contains('pulse')) {
      currentFocus.classList.remove('pulse');
      if (pulseTimeout) {
        clearTimeout(pulseTimeout);
        pulseTimeout = null;
      }
      // Don't prevent default - let Tab navigate normally
    }
  }
});

// Typewriter effect for kicker
const kickerMessages = [
  'From concept to deployment',
  'A designer’s eye for code',
  'Visual roots, technical execution',
  'Systems thinking meets creative soul',
  'AI-native mobile/web developer',
  'Building scalable micro-SaaS',
];

let currentMessageIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 80; // ms per character
let deletingSpeed = 40; // ms per character when deleting
let pauseAfterComplete = 3000; // pause after typing complete message
let pauseAfterDelete = 500; // pause after deleting before typing next

const kickerTextElement = document.querySelector('.kicker-text');

function typeWriter() {
  const currentMessage = kickerMessages[currentMessageIndex];

  if (!isDeleting && currentCharIndex < currentMessage.length) {
    // Typing forward
    kickerTextElement.textContent = currentMessage.substring(
      0,
      currentCharIndex + 1,
    );
    currentCharIndex++;
    setTimeout(typeWriter, typingSpeed);
  } else if (!isDeleting && currentCharIndex === currentMessage.length) {
    // Finished typing, pause then start deleting
    isDeleting = true;
    setTimeout(typeWriter, pauseAfterComplete);
  } else if (isDeleting && currentCharIndex > 0) {
    // Deleting backward
    kickerTextElement.textContent = currentMessage.substring(
      0,
      currentCharIndex - 1,
    );
    currentCharIndex--;
    setTimeout(typeWriter, deletingSpeed);
  } else if (isDeleting && currentCharIndex === 0) {
    // Finished deleting, move to next message
    isDeleting = false;
    currentMessageIndex = (currentMessageIndex + 1) % kickerMessages.length;
    setTimeout(typeWriter, pauseAfterDelete);
  }
}

// Start typewriter effect after a brief delay
setTimeout(() => {
  typeWriter();
}, 800);

// Cursor-reactive background (very subtle)
let mouseX = 50;
let mouseY = 50;
let rafId = null;

function updateCursorPosition() {
  document.documentElement.style.setProperty('--mouse-x', mouseX + '%');
  document.documentElement.style.setProperty('--mouse-y', mouseY + '%');
  rafId = null;
}

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 100;
  mouseY = (e.clientY / window.innerHeight) * 100;

  if (!rafId) {
    rafId = requestAnimationFrame(updateCursorPosition);
  }
});

// Respect reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.removeEventListener('mousemove', updateCursorPosition);
  // Show static message for reduced motion
  if (kickerTextElement) {
    kickerTextElement.textContent = kickerMessages[0];
  }
}

// Scroll-triggered project card reveals
const scrollRevealContainers = document.querySelectorAll(
  '[data-scroll-reveal]',
);

if (
  scrollRevealContainers.length > 0 &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.scroll-reveal-item');
          items.forEach((item) => {
            item.classList.add('revealed');
          });
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    },
  );

  scrollRevealContainers.forEach((container) => {
    revealObserver.observe(container);
  });
}

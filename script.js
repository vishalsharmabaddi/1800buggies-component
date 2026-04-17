// Intersection Observer — triggers CSS animations when section enters viewport
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.buggies-info-section');

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add('buggies-visible');
        observer.disconnect();
      }
    },
    { threshold: 0.15 }
  );

  observer.observe(section);

  // Contact button ripple effect
  const contactBtn = document.querySelector('.buggies-contact-btn');
  contactBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.4);
      width: 100px; height: 100px;
      transform: translate(-50%, -50%) scale(0);
      animation: buggies-ripple-anim 0.5s ease-out forwards;
      pointer-events: none;
    `;
    const rect = contactBtn.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';

    contactBtn.style.position = 'relative';
    contactBtn.style.overflow = 'hidden';
    contactBtn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Inject ripple keyframe once
const buggiesStyle = document.createElement('style');
buggiesStyle.textContent = `
  @keyframes buggies-ripple-anim {
    to { transform: translate(-50%, -50%) scale(3); opacity: 0; }
  }
`;
document.head.appendChild(buggiesStyle);


/* ═══════════════════════════════════════════
   SECOND COMPONENT — Scroll-Driven Products
════════════════════════════════════════════ */
(function () {
  const wrapper   = document.querySelector('.buggies-products-scroll-wrapper');
  const images    = document.querySelectorAll('.buggies-product-img');
  const contents  = document.querySelectorAll('.buggies-product-content');
  const dots      = document.querySelectorAll('.buggies-products-dot');
  const TOTAL     = images.length;

  if (!wrapper || !images.length) return;

  let currentIndex = 0;
  let autoPlayTimer = null;

  function activateSlide(index) {
    if (index === currentIndex) return;

    const prev = currentIndex;
    currentIndex = index;

    // Mark previous as leaving
    if (images[prev])   { images[prev].classList.remove('buggies-active');   images[prev].classList.add('buggies-leaving'); }
    if (contents[prev]) { contents[prev].classList.remove('buggies-active'); contents[prev].classList.add('buggies-leaving'); }

    // Mark new as active
    if (images[index])   images[index].classList.add('buggies-active');
    if (contents[index]) contents[index].classList.add('buggies-active');

    // Update dots state (hidden visually but tracked for logic)
    dots.forEach(el => el.classList.remove('buggies-active'));
    if (dots[index]) dots[index].classList.add('buggies-active');

    // Clean up leaving class
    setTimeout(() => {
      if (images[prev])   images[prev].classList.remove('buggies-leaving');
      if (contents[prev]) contents[prev].classList.remove('buggies-leaving');
    }, 500);
  }

  // Auto-play: cycle slides every 3s; resets whenever scroll changes the slide
  function startAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      activateSlide((currentIndex + 1) % TOTAL);
    }, 3000);
  }

  function onScroll() {
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperTop  = -wrapperRect.top;
    const scrollRange = wrapper.offsetHeight - window.innerHeight;

    const progress = Math.min(Math.max(wrapperTop / scrollRange, 0), 1);
    const index    = Math.min(Math.floor(progress * TOTAL), TOTAL - 1);

    // If scroll drives a new slide, reset auto-play timer so it doesn't fire immediately after
    if (index !== currentIndex) startAutoPlay();

    activateSlide(index);
  }

  // Dot click — scroll to that slide
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.dataset.dot, 10);
      const scrollRange = wrapper.offsetHeight - window.innerHeight;
      const targetScroll = wrapper.offsetTop + (targetIndex / TOTAL) * scrollRange;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  startAutoPlay();
})();

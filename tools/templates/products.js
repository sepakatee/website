/**
 * Shared helpers for template pages (loader, smooth scroll, FAQ if present).
 * Main catalog UI lives in template-catalog-main.js on index.html.
 */

// FAQ Accordion (no-op if no .faq-item on page)
(function () {
  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;
    
    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      if (!question) return;
      
      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) otherItem.classList.remove('is-open');
        });

        if (isOpen) {
          item.classList.remove('is-open');
        } else {
          item.classList.add('is-open');
        }
      });
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
})();

// Page loader
(function () {
  var loader = document.getElementById('pageLoader');
  if (!loader) return;
  loader.classList.remove('is-loading');
})();

// Smooth scroll for anchor links
(function () {
  function handleSmoothScroll(e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    
    var href = link.getAttribute('href');
    if (!href || href === '#') return;
    
    var target = document.querySelector(href);
    if (!target) return;
    
    e.preventDefault();
    
    var headerOffset = 80;
    var elementPosition = target.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
  
  document.addEventListener('click', handleSmoothScroll);
})();

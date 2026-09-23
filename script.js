(function(){
  // Announcement bar dismiss
  var announceBar = document.getElementById('announceBar');
  var announceClose = document.getElementById('announceClose');
  if(announceBar && announceClose){
    announceClose.addEventListener('click', function(){
      announceBar.classList.add('hidden');
    });
  }

  var currentLang = 'ar';
  var langToggle = document.getElementById('langToggle');
  var elsWithText = document.querySelectorAll('[data-ar][data-en]');

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var navEl = document.querySelector('.nav');
  if(navToggle && navEl){
    navToggle.addEventListener('click', function(){
      navEl.classList.toggle('open');
    });
    document.querySelectorAll('.nav-mobile a').forEach(function(a){
      a.addEventListener('click', function(){ navEl.classList.remove('open'); });
    });
  }

  function applyLang(lang){
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-en', lang === 'en');

    elsWithText.forEach(function(el){
      el.textContent = el.getAttribute('data-' + lang);
    });
    document.querySelectorAll('.gallery-item[data-category]').forEach(function(photo){
      var title = photo.getAttribute('data-title-' + lang);
      photo.setAttribute('aria-label', title);
      photo.querySelector('img').alt = title;
    });

    langToggle.querySelectorAll('.lang-opt').forEach(function(opt){
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
  }

  langToggle.addEventListener('click', function(){
    applyLang(currentLang === 'ar' ? 'en' : 'ar');
  });

  // Filter project photographs and open the original image in an accessible dialog.
  var filters = document.querySelectorAll('.gallery-filter');
  var photos = document.querySelectorAll('.gallery-item[data-category]');
  var lightbox = document.getElementById('galleryLightbox');
  filters.forEach(function(filter){
    filter.addEventListener('click', function(){
      var category = filter.dataset.filter;
      filters.forEach(function(button){
        var selected = button === filter;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      photos.forEach(function(photo){ photo.hidden = category !== 'all' && photo.dataset.category !== category; });
    });
  });
  photos.forEach(function(photo){
    photo.addEventListener('click', function(){
      lightbox.querySelector('img').src = photo.dataset.image;
      lightbox.querySelector('img').alt = photo.getAttribute('data-title-' + currentLang);
      lightbox.querySelector('p').textContent = photo.getAttribute('data-title-' + currentLang);
      lightbox.showModal();
    });
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', function(){ lightbox.close(); });
  lightbox.addEventListener('click', function(event){ if(event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('close', function(){ lightbox.querySelector('img').removeAttribute('src'); });

  // Count-up hero stats
  var counters = document.querySelectorAll('.meta-num');
  var countObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start = 0;
      var duration = 900;
      var startTime = null;
      function step(ts){
        if(!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var value = Math.round(start + (target - start) * progress);
        el.textContent = value + suffix;
        if(progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(function(el){ countObserver.observe(el); });

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function(el){ observer.observe(el); });

  // FAQ accordion
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item){
    var btn = item.querySelector('.faq-q');
    btn.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function(i){ i.classList.remove('open'); });
      if(!isOpen) item.classList.add('open');
    });
  });

  // Booking form -> WhatsApp handoff
  var form = document.getElementById('bookForm');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('f-name').value.trim();
    var phone = document.getElementById('f-phone').value.trim();
    var serviceSelect = document.getElementById('f-service');
    var service = serviceSelect.options[serviceSelect.selectedIndex].getAttribute('data-' + currentLang);
    var details = document.getElementById('f-msg').value.trim();

    var lines = currentLang === 'ar'
      ? ['طلب استشارة مجانية', 'الاسم: ' + name, 'الجوال: ' + phone, 'الخدمة: ' + service, 'التفاصيل: ' + (details || '—')]
      : ['Free consultation request', 'Name: ' + name, 'Phone: ' + phone, 'Service: ' + service, 'Details: ' + (details || '—')];

    var message = encodeURIComponent(lines.join('\n'));
    window.open('https://wa.me/966568063384?text=' + message, '_blank', 'noopener');
  });
})();

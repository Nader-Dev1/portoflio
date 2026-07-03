(function(){
  // Announcement bar dismiss
  var announceBar = document.getElementById('announceBar');
  var announceClose = document.getElementById('announceClose');
  if(announceBar && announceClose){
    announceClose.addEventListener('click', function(){
      announceBar.classList.add('hidden');
    });
  }

  // Activity toast — light social-proof hook, appears once after a delay
  var activityToast = document.getElementById('activityToast');
  var activityClose = document.getElementById('activityClose');
  if(activityToast && activityClose){
    var toastTimer = setTimeout(function(){ activityToast.classList.add('show'); }, 4000);
    var hideTimer = setTimeout(function(){ activityToast.classList.remove('show'); }, 14000);
    activityClose.addEventListener('click', function(){
      activityToast.classList.remove('show');
      clearTimeout(toastTimer);
      clearTimeout(hideTimer);
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

    langToggle.querySelectorAll('.lang-opt').forEach(function(opt){
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
  }

  langToggle.addEventListener('click', function(){
    applyLang(currentLang === 'ar' ? 'en' : 'ar');
  });

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
    window.open('https://wa.me/966501028675?text=' + message, '_blank');
  });
})();
(function(){
  "use strict";
  var nav=document.querySelector('.nav');
  var toggle=document.querySelector('.nav__toggle');
  if(toggle){toggle.addEventListener('click',function(){document.body.classList.toggle('nav-open');});
    document.querySelectorAll('.nav__links a').forEach(function(a){a.addEventListener('click',function(){document.body.classList.remove('nav-open');});});}
  window.addEventListener('scroll',function(){if(nav)nav.classList.toggle('is-scrolled',(window.scrollY||0)>8);},{passive:true});

  var motion=document.documentElement.classList.contains('motion');
  // hero ignite
  var hero=document.querySelector('.hero');
  if(hero){ if(motion){ requestAnimationFrame(function(){ requestAnimationFrame(function(){ hero.classList.add('lit'); }); }); } else { hero.classList.add('lit'); } }
  // reveals
  var rev=document.querySelectorAll('.reveal');
  if(motion && 'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    rev.forEach(function(el){io.observe(el);});
  } else { rev.forEach(function(el){el.classList.add('in');}); }
  var form=document.querySelector('form[data-eax-form]');if(form){form.addEventListener('submit',function(e){e.preventDefault();var d=new URLSearchParams(new FormData(form)).toString();var done=function(){form.style.display='none';var ok=document.getElementById('form-success');if(ok){ok.classList.add('show');}};fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:d}).then(done).catch(done);});}
  document.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear();});
})();
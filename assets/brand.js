(function(){
  "use strict";
  var nav=document.querySelector('.nav');
  var toggle=document.querySelector('.nav__toggle');
  if(toggle){var menu=document.querySelector('.nav__links');if(menu){menu.id='primary-navigation';toggle.setAttribute('aria-controls',menu.id);}
    var closeMenu=function(){document.body.classList.remove('nav-open');toggle.setAttribute('aria-expanded','false');};
    toggle.addEventListener('click',function(){var open=document.body.classList.toggle('nav-open');toggle.setAttribute('aria-expanded',String(open));});
    document.querySelectorAll('.nav__links a').forEach(function(a){a.addEventListener('click',closeMenu);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});}
  window.addEventListener('scroll',function(){if(nav)nav.classList.toggle('is-scrolled',(window.scrollY||0)>8);},{passive:true});

  // active-nav trust-layer indicator: rests under the current page, follows on hover
  var navLinks=nav?nav.querySelector('.nav__links'):null;
  if(navLinks){
    var curLink=navLinks.querySelector('a[aria-current="page"]');
    var ind=document.createElement('span');ind.className='nav__ind';navLinks.appendChild(ind);
    var place=function(el){if(!el){ind.style.opacity='0';return;}var r=el.getBoundingClientRect(),pr=navLinks.getBoundingClientRect();ind.style.width=r.width+'px';ind.style.transform='translateX('+(r.left-pr.left)+'px)';ind.style.opacity='1';};
    var rest=function(){place(curLink);};
    if(curLink){requestAnimationFrame(rest);setTimeout(rest,300);}
    navLinks.querySelectorAll('a:not(.nav__kweli)').forEach(function(a){a.addEventListener('mouseenter',function(){place(a);});});
    navLinks.addEventListener('mouseleave',rest);
    window.addEventListener('resize',rest);
  }

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
  var form=document.querySelector('form[data-eax-form]');if(form){var fcard=form.closest('.form-card'),submit=form.querySelector('[type="submit"]'),error=form.querySelector('.form-error'),sending=false;form.addEventListener('submit',function(e){e.preventDefault();if(sending)return;sending=true;if(submit)submit.disabled=true;if(error)error.hidden=true;if(fcard){fcard.classList.add('is-sending');fcard.setAttribute('aria-busy','true');}var d=new URLSearchParams(new FormData(form)).toString();fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:d}).then(function(response){if(!response.ok)throw new Error('Form submission failed');if(fcard){fcard.classList.remove('is-sending');fcard.removeAttribute('aria-busy');}form.style.display='none';var ok=document.getElementById('form-success');if(ok){ok.classList.add('show');ok.focus();}}).catch(function(){if(fcard){fcard.classList.remove('is-sending');fcard.removeAttribute('aria-busy');}if(error){error.hidden=false;error.focus();}}).finally(function(){sending=false;if(submit)submit.disabled=false;});});}
  var flows=document.querySelectorAll('[data-flow]');if(motion&&'IntersectionObserver' in window){var fio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('play');void e.target.offsetWidth;e.target.classList.add('play');}else{e.target.classList.remove('play');}});},{threshold:.55,rootMargin:'0px 0px -8% 0px'});flows.forEach(function(f){fio.observe(f);});}
  document.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear();});
})();

/* Bendras skriptas: kalbos, nbsp, meniu, formos, ryšio valdiklis */
(function(){
  var SHORT={
    lt:'ir|su|į|be|per|iki|nuo|už|po|ar|o|bei|kai|kad|jei|ne|ką|iš|prie|dėl|apie|kas|tik|jau|net',
    ru:'в|во|на|с|со|к|ко|о|об|и|а|но|не|ни|по|за|до|от|из|у|без|для|при|под|над|что|как|же',
    en:'a|an|the|to|of|in|on|by|for|and|or|no|at|is|we|our|your|up'
  };
  function nb(str,lang){
    var re=new RegExp('(^|[\\s>(„«])('+SHORT[lang]+')\\s','gi');
    str=str.replace(re,'$1$2 ').replace(re,'$1$2 ');
    // skaičius + vienetas, "nuo 650 €"
    str=str.replace(/(\d)\s(?=[€%a-zA-Zą-žĄ-Žа-яА-Я²+])/g,'$1 ');
    return str;
  }
  var dict=window.I18N||{}; dict.lt={};
  var els=[].slice.call(document.querySelectorAll('[data-i]'));
  var phs=[].slice.call(document.querySelectorAll('[data-i-ph]'));
  els.forEach(function(e){dict.lt[e.getAttribute('data-i')]=e.innerHTML.trim();});
  phs.forEach(function(e){dict.lt['ph:'+e.getAttribute('data-i-ph')]=e.getAttribute('placeholder');});
  if(window.TITLES) dict.lt['__title']=document.title;
  function setLang(l){
    if(!dict[l]) l='lt';
    els.forEach(function(e){var k=e.getAttribute('data-i');var v=dict[l][k]!=null?dict[l][k]:dict.lt[k];e.innerHTML=nb(v,l);});
    phs.forEach(function(e){var k='ph:'+e.getAttribute('data-i-ph');var v=dict[l][k]||dict.lt[k];if(v)e.setAttribute('placeholder',v);});
    if(window.TITLES&&window.TITLES[l]) document.title=window.TITLES[l]; else if(window.TITLES) document.title=dict.lt.__title;
    document.documentElement.lang=l;
    document.querySelectorAll('.langs button').forEach(function(b){b.classList.toggle('on',b.dataset.l===l);});
    try{localStorage.setItem('lang',l);}catch(e){}
    document.dispatchEvent(new CustomEvent('langchange',{detail:l}));
  }
  window.curLang=function(){return document.documentElement.lang||'lt';};
  window.t=function(k){var l=curLang();return (dict[l]&&dict[l][k])||dict.lt[k]||k;};
  document.querySelectorAll('.langs button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.l);});});
  var saved='lt';try{saved=localStorage.getItem('lang')||'lt';}catch(e){}
  setLang(saved);

  // meniu
  var burger=document.querySelector('.burger'),mm=document.querySelector('.mobile-menu');
  if(burger)burger.addEventListener('click',function(){var o=mm.classList.toggle('open');burger.setAttribute('aria-expanded',o);});
  // sklandus slinkimas į #inkarus
  document.addEventListener('click',function(ev){
    var a=ev.target.closest('a[href^="#"],[data-go]');if(!a)return;
    var id=(a.getAttribute('data-go')||a.getAttribute('href')).slice(1);var el=document.getElementById(id);
    if(!el)return;ev.preventDefault();if(mm)mm.classList.remove('open');
    el.scrollIntoView({behavior:'smooth',block:'start'});
    if(a.dataset.plan){var r=document.querySelector('input[name="q1"][value="'+a.dataset.plan+'"]');if(r){r.checked=true;r.dispatchEvent(new Event('change',{bubbles:true}));}}
  });
  // kanalų skirtukai
  document.querySelectorAll('.channels').forEach(function(c){
    c.addEventListener('click',function(ev){var b=ev.target.closest('button');if(!b)return;
      c.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b);});});
  });
  // telefono kaukė +370 6xx xxxxx
  document.querySelectorAll('input[type=tel]').forEach(function(f){
    f.addEventListener('input',function(){var d=f.value.replace(/\D/g,'');if(d.indexOf('370')===0)d=d.slice(3);if(d[0]==='8')d=d.slice(1);d=d.slice(0,8);
      f.value=d?'+370 '+d.slice(0,3)+(d.length>3?' '+d.slice(3):''):'';});
  });
  window.validForm=function(box){
    var tel=box.querySelector('input[type=tel]'),c=box.querySelector('.consent input');
    var ok=tel.value.replace(/\D/g,'').length>=11&&(!c||c.checked);
    box.classList.toggle('show-err',!ok);return ok;
  };
  document.querySelectorAll('form.lead-form').forEach(function(f){
    f.addEventListener('submit',function(ev){ev.preventDefault();if(validForm(f))f.classList.add('sent');});
  });
  // ryšio valdiklis
  var fab=document.querySelector('.fab');
  if(fab)fab.querySelector('.fab-btn').addEventListener('click',function(){var o=fab.classList.toggle('open');this.setAttribute('aria-expanded',o);});
})();

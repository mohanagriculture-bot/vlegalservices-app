/* V Legal Services - makes the portals installable as phone apps. */
(function(){
  if(window.top!==window) return;               /* not inside the Admin page's frames */
  var p=location.pathname, app=null;
  if(p.indexOf('/kannangroup/office')===0) app='office';
  else if(p.indexOf('/kannangroup/theni')===0) app='theni';
  else if(p.indexOf('/admin')===0) app='admin';
  else if(p.indexOf('/login')===0){
    var n=new URLSearchParams(location.search).get('next')||'';
    app = n.indexOf('/kannangroup/office')===0 ? 'office' : n.indexOf('/kannangroup/theni')===0 ? 'theni' : 'admin';
  }
  if(!app) return;
  var color={office:'#16233A',theni:'#16233A',admin:'#16233A'}[app];
  var title={office:'V Legal Desk',theni:'Theni Properties',admin:'V Legal Admin'}[app];
  function tag(t,a){var e=document.createElement(t);for(var k in a)e.setAttribute(k,a[k]);document.head.appendChild(e);}
  tag('link',{rel:'manifest',href:'/assets/pwa-'+app+'.webmanifest'});
  tag('link',{rel:'apple-touch-icon',href:'/assets/pwa-'+app+'-180.png'});
  tag('meta',{name:'apple-mobile-web-app-capable',content:'yes'});
  tag('meta',{name:'mobile-web-app-capable',content:'yes'});
  tag('meta',{name:'apple-mobile-web-app-title',content:title});
  if(!document.querySelector('meta[name="theme-color"]')) tag('meta',{name:'theme-color',content:color});
  if('serviceWorker' in navigator){ window.addEventListener('load',function(){ navigator.serviceWorker.register('/sw.js').catch(function(){}); }); }

  var standalone = (window.matchMedia&&matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
  if(standalone) return;
  var dismissed=false; try{dismissed=sessionStorage.getItem('vls_pwa_x')==='1';}catch(e){}
  if(dismissed) return;
  var ua=navigator.userAgent, ios=/iphone|ipad|ipod/i.test(ua), deferred=null;
  function bar(text,btn,onbtn){
    if(document.getElementById('vls-pwa')) return;
    var d=document.createElement('div'); d.id='vls-pwa';
    d.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;background:#16233A;color:#F5F3EC;border-radius:10px;padding:11px 12px;display:flex;align-items:center;gap:10px;font:14px/1.35 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.28);max-width:460px;margin:0 auto';
    var s=document.createElement('span'); s.style.flex='1'; s.textContent=text; d.appendChild(s);
    if(btn){var b=document.createElement('button'); b.textContent=btn; b.style.cssText='background:#A9762F;color:#fff;border:0;border-radius:6px;padding:8px 14px;font:600 14px system-ui,sans-serif'; b.onclick=onbtn; d.appendChild(b);}
    var x=document.createElement('button'); x.textContent='×'; x.setAttribute('aria-label','Close'); x.style.cssText='background:none;border:0;color:#F5F3EC;font-size:22px;line-height:1;padding:0 4px'; x.onclick=function(){d.remove();try{sessionStorage.setItem('vls_pwa_x','1');}catch(e){}}; d.appendChild(x);
    document.body.appendChild(d);
  }
  window.addEventListener('beforeinstallprompt',function(e){
    e.preventDefault(); deferred=e;
    bar('Install '+title+' on this phone','Install',function(){ deferred.prompt(); deferred.userChoice.finally(function(){var d=document.getElementById('vls-pwa'); if(d)d.remove(); deferred=null;}); });
  });
  window.addEventListener('appinstalled',function(){var d=document.getElementById('vls-pwa'); if(d)d.remove();});
  if(ios && /safari/i.test(ua) && !/crios|fxios/i.test(ua)){
    window.addEventListener('load',function(){ setTimeout(function(){ bar('To install: tap the Share button, then “Add to Home Screen”.'); },1500); });
  }
})();

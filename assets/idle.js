/* ============================================================
   V Legal Services — automatic sign-out after 10 idle minutes.
   Activity anywhere in the tab (including inside the Admin page's
   frames) keeps the session alive. After IDLE_MINUTES without any
   activity, every sign-in held by this tab is cleared and the
   person is sent to the Login Portal.
   Sign-ins are kept in sessionStorage, so closing the tab or the
   browser also ends them.
   ============================================================ */
(function(){
  var IDLE_MINUTES = 10;
  var KEY = 'vls_last_active';
  var LIMIT = IDLE_MINUTES * 60 * 1000;
  var isClientArea = /^\/(client|kannangroup)(\/|$)/.test(location.pathname);

  function now(){ return Date.now(); }
  function last(){ try { return parseInt(sessionStorage.getItem(KEY) || '0', 10); } catch(e){ return 0; } }
  function touch(){ try { sessionStorage.setItem(KEY, String(now())); } catch(e){} }

  function expire(){
    try { sessionStorage.clear(); } catch(e){}   // Supabase session, client tokens, desk tokens
    var dest = '/login/?timeout=1' + (isClientArea ? '&as=client' : '');
    try { window.top.location.replace(dest); } catch(e){ location.replace(dest); }
  }

  // Coming back to a tab that sat idle (or a laptop that slept) counts too
  var l = last();
  if (l && now() - l > LIMIT) { expire(); return; }
  touch();

  var pending = false;
  function onActivity(){
    if (pending) return;
    pending = true;
    setTimeout(function(){ pending = false; touch(); }, 1000);
  }
  ['mousemove','mousedown','keydown','scroll','touchstart','wheel'].forEach(function(ev){
    window.addEventListener(ev, onActivity, { passive: true, capture: true });
  });
  setInterval(function(){ if (now() - last() > LIMIT) expire(); }, 15000);
  document.addEventListener('visibilitychange', function(){
    if (!document.hidden && now() - last() > LIMIT) expire();
  });
})();

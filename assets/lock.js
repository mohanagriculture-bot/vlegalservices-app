/* ============================================================
   V Legal Services — failed sign-in lock.
   After 3 wrong passwords, sign-in on this device is blocked for
   LOCK_MINUTES and the person is asked to contact the admin.
   Shared by the Login Portal and every page with its own sign-in.
   ============================================================ */
(function(){
  var KEY = 'vls_signin_lock', MAX = 3, LOCK_MINUTES = 60;
  var CONTACT = 'Too many wrong attempts. Sign-in is blocked on this device. Please contact the admin: call or WhatsApp 73737 35222.';

  function read(){ try { return JSON.parse(localStorage.getItem(KEY)) || {n:0,until:0}; } catch(e){ return {n:0,until:0}; } }
  function write(v){ try { localStorage.setItem(KEY, JSON.stringify(v)); } catch(e){} }

  window.VLSLock = {
    MAX: MAX,
    message: CONTACT,
    locked: function(){
      var v = read();
      if (v.until && Date.now() < v.until) return true;
      if (v.until) write({n:0,until:0});   // lock period over
      return false;
    },
    /* Call after a wrong password. Returns attempts left (0 = now locked). */
    fail: function(){
      var v = read(); v.n = (v.n||0) + 1;
      if (v.n >= MAX){ v.until = Date.now() + LOCK_MINUTES*60*1000; }
      write(v);
      return Math.max(0, MAX - v.n);
    },
    reset: function(){ write({n:0,until:0}); },
    /* Message for a wrong password */
    wrongText: function(left){
      return left > 0 ? 'User ID or password is incorrect. ' + left + (left===1?' attempt':' attempts') + ' left.' : CONTACT;
    }
  };
})();

/* ────────────────────────────────────────────────────────────────
   ACCESS GATE  ·  IELTS Core Thematic Vocabulary
   ----------------------------------------------------------------
   Client-side password gate. A deterrent, not real security —
   anyone with devtools can bypass it. The access code is never
   stored; only its SHA-256 digest is compared.

   The access code is distributed out of band and is deliberately NOT recorded
   in this file. Do not write it in a comment: this repository is public.
   Use a code unique to this app — never one shared with another site.
   Include on every page with:  <script src="gate.js"></script>
   placed in <head> BEFORE the page's own styles/scripts.
   ──────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  // SHA-256 digest of this app's access code. The plaintext is not stored here.
  // ROTATE ME: the previous code was published in this file's git history and
  // reused across another app, so it must be considered public.
  var HASH = "c04325c6510c0727a112712354b61554dd084ed5defa11dc5655eb39baf68e4d";
  var KEY = "ielts_vocab_auth";
  var REMEMBER_DAYS = 30;

  // ── Already authenticated? ────────────────────────────────────
  function readToken() {
    try {
      var raw = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
      if (!raw) return false;
      var o = JSON.parse(raw);
      if (o.hash !== HASH) return false;
      if (o.expires && Date.now() > o.expires) return false;
      return true;
    } catch (e) { return false; }
  }
  if (readToken()) return;

  // ── Hide the page until unlocked ──────────────────────────────
  var hideStyle = document.createElement("style");
  hideStyle.id = "gate-hide";
  hideStyle.textContent = "body{visibility:hidden!important;}";
  (document.head || document.documentElement).appendChild(hideStyle);

  // ── SHA-256 helper ────────────────────────────────────────────
  function sha256(str) {
    var buf = new TextEncoder().encode(str);
    return crypto.subtle.digest("SHA-256", buf).then(function (digest) {
      var bytes = new Uint8Array(digest), hex = "";
      for (var i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, "0");
      }
      return hex;
    });
  }

  // ── Build the lock overlay ────────────────────────────────────
  function buildLock() {
    var css =
      "#ielts-lock{position:fixed;inset:0;z-index:99999;visibility:visible;" +
      "background:#2E1A47;display:flex;align-items:center;justify-content:center;" +
      "padding:24px;font-family:'Lora','Times New Roman',serif;}" +
      "#ielts-lock .lk-card{width:min(420px,100%);background:#FAF7FC;border-radius:4px;" +
      "padding:42px 34px 34px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.45);}" +
      "#ielts-lock .lk-mark{width:60px;height:60px;margin:0 auto 18px;border-radius:50%;" +
      "background:#F0E9F7;color:#8E5FB0;display:flex;align-items:center;justify-content:center;}" +
      "#ielts-lock .lk-eyebrow{font-family:'JetBrains Mono','Courier New',monospace;font-size:.6rem;" +
      "letter-spacing:.2em;text-transform:uppercase;color:#8E5FB0;margin-bottom:10px;}" +
      "#ielts-lock h1{font-family:'Playfair Display',Georgia,serif;font-size:1.4rem;font-weight:700;" +
      "color:#2E1A47;line-height:1.2;margin-bottom:4px;}" +
      "#ielts-lock .lk-sub{font-size:.82rem;color:#9A8AA8;font-style:italic;margin-bottom:6px;}" +
      "#ielts-lock .lk-hint{font-size:.78rem;color:#9A8AA8;margin-bottom:22px;}" +
      "#ielts-lock input[type=password]{width:100%;padding:12px 14px;font-size:.95rem;" +
      "font-family:inherit;color:#2E1A47;background:#fff;border:1px solid #E2D5EE;border-radius:4px;" +
      "outline:none;transition:border-color .15s;}" +
      "#ielts-lock input[type=password]:focus{border-color:#8E5FB0;}" +
      "#ielts-lock .lk-remember{display:flex;align-items:center;justify-content:center;gap:7px;" +
      "font-size:.72rem;color:#9A8AA8;margin:14px 0 18px;cursor:pointer;}" +
      "#ielts-lock .lk-remember input{accent-color:#8E5FB0;}" +
      "#ielts-lock button{width:100%;padding:12px;font-size:.9rem;font-family:inherit;font-weight:600;" +
      "color:#fff;background:#8E5FB0;border:none;border-radius:4px;cursor:pointer;transition:opacity .15s;}" +
      "#ielts-lock button:hover{opacity:.88;}" +
      "#ielts-lock .lk-error{color:#8E5FB0;font-size:.76rem;margin-top:14px;min-height:1em;}";
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);

    var wrap = document.createElement("div");
    wrap.id = "ielts-lock";
    wrap.innerHTML =
      '<div class="lk-card">' +
        '<div class="lk-mark">' +
          '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" ' +
          'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="3" y="11" width="18" height="11" rx="2"/>' +
          '<path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
        '</div>' +
        '<div class="lk-eyebrow">IELTS Preparation</div>' +
        '<h1>IELTS 雅思核心字彙</h1>' +
        '<p class="lk-sub">IELTS Core Thematic Vocabulary</p>' +
        '<p class="lk-hint">請輸入老師提供的存取碼</p>' +
        '<form id="lk-form">' +
          '<input id="lk-input" type="password" placeholder="存取碼 Access code" ' +
          'autocomplete="off" autofocus required>' +
          '<label class="lk-remember"><input id="lk-remember" type="checkbox" checked>' +
          '記住此裝置 (Remember this device)</label>' +
          '<button type="submit">解鎖 Unlock</button>' +
          '<p class="lk-error" id="lk-error"></p>' +
        '</form>' +
      '</div>';
    document.body.appendChild(wrap);

    var form = wrap.querySelector("#lk-form");
    var input = wrap.querySelector("#lk-input");
    var remember = wrap.querySelector("#lk-remember");
    var errEl = wrap.querySelector("#lk-error");
    input.focus();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      errEl.textContent = "";
      sha256(input.value).then(function (h) {
        if (h === HASH) {
          var token = JSON.stringify({
            hash: HASH,
            expires: remember.checked ? Date.now() + REMEMBER_DAYS * 86400000 : 0
          });
          try {
            (remember.checked ? localStorage : sessionStorage).setItem(KEY, token);
          } catch (e) {}
          // Reveal the page.
          var hs = document.getElementById("gate-hide");
          if (hs) hs.remove();
          wrap.remove();
        } else {
          errEl.textContent = "存取碼不正確，請再試一次";
          input.value = "";
          input.focus();
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildLock);
  } else {
    buildLock();
  }
})();

/**
 * TTD Express Autofill - Exact Content Engine
 * Injects FAB Button (#ttdaf-fab-wrap), handles Alt+A shortcut, and fills forms
 */

(function () {
  'use strict';

  if (window.__TTDAF_CONTENT_INJECTED__) return;
  window.__TTDAF_CONTENT_INJECTED__ = true;

  console.log('[TTD Express Autofill] Injected.');

  // Native React/Angular Event Dispatcher
  function dispatchEvents(el) {
    if (!el) return;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  function setNativeValue(el, val) {
    if (!el || val === undefined || val === null) return;
    const proto = el.constructor.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, 'value') || Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (desc && desc.set) {
      desc.set.call(el, val);
    } else {
      el.value = val;
    }
    dispatchEvents(el);
  }

  // Dropdown selector
  async function selectOption(el, textVal) {
    if (!el || !textVal) return;
    const target = textVal.toString().toLowerCase().trim();

    if (el.tagName === 'SELECT') {
      const opts = Array.from(el.options);
      const match = opts.find(o => o.text.toLowerCase().trim() === target || o.text.toLowerCase().includes(target));
      if (match) {
        setNativeValue(el, match.value);
        return;
      }
    }

    // Material / Custom React dropdowns
    el.click();
    await new Promise(r => setTimeout(r, 60));
    const items = document.querySelectorAll('[role="option"], li, .dropdown_scroll li, [class*="floatingDropdown_listItem"]');
    for (const it of items) {
      if (it.innerText && it.innerText.toLowerCase().trim().includes(target)) {
        it.click();
        break;
      }
    }
  }

  // Toast System
  function showToast(msg, type = 'success') {
    const old = document.querySelector('.ttdaf-fill-toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = `ttdaf-fill-toast ${type}`;
    toast.innerText = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast) toast.remove();
    }, 3500);
  }

  // Core Fill Logic
  async function fillAllPilgrims(pilgrims = []) {
    if (!pilgrims || pilgrims.length === 0) {
      // Load from local storage
      const res = await new Promise(r => chrome.storage.local.get(['ttd_pilgrims', 'ttd_vault'], r));
      pilgrims = (res.ttd_pilgrims || []).filter(p => p.name) || res.ttd_vault || [];
    }

    if (pilgrims.length === 0) {
      showToast('⚠️ No pilgrims saved. Open extension to add.', 'warn');
      return;
    }

    let filledCount = 0;

    for (let i = 0; i < pilgrims.length; i++) {
      const p = pilgrims[i];
      if (!p || !p.name) continue;

      // Find Name input (name_0, fname, name, pilgrimName)
      let nameEl = document.querySelector(`input[name="name_${i}"], input[formcontrolname="name_${i}"], input#name_${i}`);
      let ageEl = document.querySelector(`input[name="age_${i}"], input[formcontrolname="age_${i}"], input#age_${i}`);
      let genderEl = document.querySelector(`select[name="gender_${i}"], select[formcontrolname="gender_${i}"], input[name="gender_${i}"]`);
      let idTypeEl = document.querySelector(`select[name="idProofType_${i}"], select[formcontrolname="idProofType_${i}"], input[name="idProofType_${i}"]`);
      let idNumEl = document.querySelector(`input[name="idProofNumber_${i}"], input[formcontrolname="idProofNumber_${i}"], input#idProofNumber_${i}`);

      // Fallback: search row containers
      if (!nameEl) {
        const rows = document.querySelectorAll('.pilgrim-row, tbody tr, .card');
        if (rows && rows[i]) {
          const row = rows[i];
          nameEl = row.querySelector('input[placeholder*="Name" i], input[formcontrolname*="name" i], input[name*="name" i]');
          ageEl = row.querySelector('input[placeholder*="Age" i], input[formcontrolname*="age" i], input[name*="age" i]');
          genderEl = row.querySelector('select[formcontrolname*="gender" i], select, input[name*="gender" i]');
          idTypeEl = row.querySelector('select[formcontrolname*="id" i], select[name*="proof" i], select');
          idNumEl = row.querySelector('input[placeholder*="ID" i], input[name*="proof" i], input[name*="id" i]');
        }
      }

      if (nameEl) {
        setNativeValue(nameEl, p.name);
        await new Promise(r => setTimeout(r, 40));
      }
      if (ageEl && p.age) {
        setNativeValue(ageEl, p.age);
        await new Promise(r => setTimeout(r, 40));
      }
      if (genderEl && p.gender) {
        await selectOption(genderEl, p.gender);
      }
      if (idTypeEl && p.idType) {
        await selectOption(idTypeEl, p.idType);
        await new Promise(r => setTimeout(r, 60));
      }
      if (idNumEl && p.idNumber) {
        setNativeValue(idNumEl, p.idNumber);
      }

      if (nameEl || idNumEl) filledCount++;
    }

    // Auto-check agree / terms checkbox
    const agreeCheck = document.querySelector('input[type="checkbox"][name*="agree" i], input[type="checkbox"]#agree, input[type="checkbox"][formcontrolname*="agree" i]');
    if (agreeCheck && !agreeCheck.checked) {
      agreeCheck.click();
      agreeCheck.checked = true;
      dispatchEvents(agreeCheck);
    }

    // Focus Captcha
    const cap = document.querySelector('input[placeholder*="Captcha" i], input[formcontrolname*="captcha" i], #captcha');
    if (cap) {
      cap.focus();
      cap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (filledCount > 0) {
      showToast(`⚡ Filled ${filledCount} pilgrim${filledCount === 1 ? '' : 's'}.`, 'success');
    } else {
      showToast('Open a TTD booking form first.', 'warn');
    }
  }

  // Floating Action Button (FAB)
  function injectFAB() {
    if (document.getElementById('ttdaf-fab-wrap')) return;

    const wrap = document.createElement('div');
    wrap.id = 'ttdaf-fab-wrap';
    wrap.innerHTML = `
      <div class="ttdaf-pop">
        <div class="ttdaf-pop-title">Fill Pilgrim Details</div>
        <div class="ttdaf-pop-kbd-row"><span>Shortcut</span> <kbd>Alt</kbd><kbd>A</kbd></div>
      </div>
      <div id="ttdaf-fill-button" role="button" aria-label="Fill pilgrim details">
        <span class="ttdaf-icon">🛕</span>
        <span class="ttdaf-kbd">Alt+A</span>
      </div>
    `;

    document.body.appendChild(wrap);

    document.getElementById('ttdaf-fill-button').addEventListener('click', () => fillAllPilgrims());
  }

  // Keyboard shortcut listener: Alt+A
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'a' || e.key === 'A' || e.keyCode === 65)) {
      e.preventDefault();
      fillAllPilgrims();
    }
  });

  // Message listener from popup
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'FILL_ALL' || msg.action === 'TRIGGER_AUTOFILL') {
      fillAllPilgrims(msg.data?.pilgrims).then(() => sendResponse({ status: 'done' }));
      return true;
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFAB);
  } else {
    injectFAB();
  }
})();

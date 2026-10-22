/**
 * Popup Script matching TTD Autofill Assistant
 */

document.addEventListener('DOMContentLoaded', () => {
  let activeTabKey = '0';
  let pilgrims = [
    { name: 'Venkata Raman', age: '45', gender: 'Male', idType: 'Aadhaar Card', idNumber: '987654321012', mobile: '9876543210', state: 'Andhra Pradesh', city: 'Tirupati', pincode: '517501' },
    { name: 'Lakshmi Devi', age: '42', gender: 'Female', idType: 'Aadhaar Card', idNumber: '987654321013', mobile: '9876543210', state: 'Andhra Pradesh', city: 'Tirupati', pincode: '517501' },
    { name: 'Srinivasa Rao', age: '20', gender: 'Male', idType: 'Aadhaar Card', idNumber: '987654321014', mobile: '9876543210', state: 'Andhra Pradesh', city: 'Tirupati', pincode: '517501' },
    { name: 'Padmavathi R', age: '18', gender: 'Female', idType: 'Aadhaar Card', idNumber: '987654321015', mobile: '9876543210', state: 'Andhra Pradesh', city: 'Tirupati', pincode: '517501' },
    { name: '', age: '', gender: 'Male', idType: 'Aadhaar Card', idNumber: '', mobile: '', state: 'Andhra Pradesh', city: '', pincode: '' },
    { name: '', age: '', gender: 'Male', idType: 'Aadhaar Card', idNumber: '', mobile: '', state: 'Andhra Pradesh', city: '', pincode: '' }
  ];

  let familyVault = [];

  // Elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const currentTabTitle = document.getElementById('current-tab-title');
  const btnFillAll = document.getElementById('btn-fill-all');
  const btnSaveCurrent = document.getElementById('btn-save-current');
  const btnClearCurrent = document.getElementById('btn-clear-current');
  const btnDemoLink = document.getElementById('btn-demo-link');
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const btnOpenVault = document.getElementById('btn-open-vault');

  const pName = document.getElementById('p-name');
  const pAge = document.getElementById('p-age');
  const pGender = document.getElementById('p-gender');
  const pIdType = document.getElementById('p-id-type');
  const pIdNumber = document.getElementById('p-id-number');
  const btnToggleIdReveal = document.getElementById('btn-toggle-id-reveal');
  const passportExtraFields = document.getElementById('passport-extra-fields');
  const pPassCountry = document.getElementById('p-pass-country');
  const pVisaNumber = document.getElementById('p-visa-number');
  const pMobile = document.getElementById('p-mobile');
  const pState = document.getElementById('p-state');
  const pCity = document.getElementById('p-city');
  const pPincode = document.getElementById('p-pincode');

  const btnVaultToggle = document.getElementById('btn-vault-toggle');
  const vaultPickerList = document.getElementById('vault-picker-list');
  const vaultArrow = document.getElementById('vault-arrow');
  const toastMsg = document.getElementById('toast-msg');

  // Load theme
  chrome.storage.local.get(['theme', 'ttd_pilgrims', 'ttd_vault'], (res) => {
    if (res.theme) {
      document.documentElement.setAttribute('data-theme', res.theme);
    }
    if (res.ttd_pilgrims && Array.isArray(res.ttd_pilgrims)) {
      pilgrims = res.ttd_pilgrims;
      // Ensure 6 slots
      while (pilgrims.length < 6) {
        pilgrims.push({ name: '', age: '', gender: 'Male', idType: 'Aadhaar Card', idNumber: '', mobile: '', state: 'Andhra Pradesh', city: '', pincode: '' });
      }
    }
    if (res.ttd_vault && Array.isArray(res.ttd_vault)) {
      familyVault = res.ttd_vault;
    } else {
      familyVault = pilgrims.filter(p => p.name);
    }
    renderActiveTab();
    renderVaultPicker();
  });

  // Tab switching
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      saveActiveTabToMemory();
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTabKey = btn.getAttribute('data-tab');
      renderActiveTab();
    });
  });

  function renderActiveTab() {
    if (activeTabKey >= '0' && activeTabKey <= '5') {
      const idx = parseInt(activeTabKey, 10);
      currentTabTitle.innerText = `Pilgrim ${idx + 1} Details ${idx === 0 ? '(Primary / Lead)' : ''}`;
      const p = pilgrims[idx] || {};

      pName.value = p.name || '';
      pAge.value = p.age || '';
      pGender.value = p.gender || 'Male';
      pIdType.value = p.idType || 'Aadhaar Card';
      pIdNumber.value = p.idNumber || '';
      pPassCountry.value = p.passportCountry || '';
      pVisaNumber.value = p.visaNumber || '';
      pMobile.value = p.mobile || '';
      pState.value = p.state || 'Andhra Pradesh';
      pCity.value = p.city || '';
      pPincode.value = p.pincode || '';

      checkPassportDisplay();
    }
  }

  function saveActiveTabToMemory() {
    if (activeTabKey >= '0' && activeTabKey <= '5') {
      const idx = parseInt(activeTabKey, 10);
      pilgrims[idx] = {
        name: pName.value.trim(),
        age: pAge.value.trim(),
        gender: pGender.value,
        idType: pIdType.value,
        idNumber: pIdNumber.value.trim(),
        passportCountry: pPassCountry.value.trim(),
        visaNumber: pVisaNumber.value.trim(),
        mobile: pMobile.value.trim(),
        state: pState.value,
        city: pCity.value.trim(),
        pincode: pPincode.value.trim()
      };
    }
  }

  // ID Type changed
  pIdType.addEventListener('change', checkPassportDisplay);
  function checkPassportDisplay() {
    if (pIdType.value === 'Passport') {
      passportExtraFields.style.display = 'block';
    } else {
      passportExtraFields.style.display = 'none';
    }
  }

  // Reveal / Hide ID
  let isRevealed = false;
  btnToggleIdReveal.addEventListener('click', () => {
    isRevealed = !isRevealed;
    pIdNumber.type = isRevealed ? 'text' : 'password';
    btnToggleIdReveal.innerText = isRevealed ? 'Hide' : 'Show';
  });

  // Save current
  btnSaveCurrent.addEventListener('click', () => {
    saveActiveTabToMemory();
    chrome.storage.local.set({ ttd_pilgrims: pilgrims, ttd_devotees: pilgrims.filter(p => p.name) }, () => {
      showToast('✅ Saved successfully!');
      notifyContent();
    });
  });

  // Clear current
  btnClearCurrent.addEventListener('click', () => {
    if (activeTabKey >= '0' && activeTabKey <= '5') {
      const idx = parseInt(activeTabKey, 10);
      pilgrims[idx] = { name: '', age: '', gender: 'Male', idType: 'Aadhaar Card', idNumber: '', mobile: '', state: 'Andhra Pradesh', city: '', pincode: '' };
      renderActiveTab();
      showToast('🗑️ Cleared!');
    }
  });

  // Vault Quick-Picker Toggle
  btnVaultToggle.addEventListener('click', () => {
    const isHidden = vaultPickerList.style.display === 'none';
    vaultPickerList.style.display = isHidden ? 'flex' : 'none';
    vaultArrow.innerText = isHidden ? '▲' : '▼';
  });

  function renderVaultPicker() {
    vaultPickerList.innerHTML = '';
    if (familyVault.length === 0) {
      vaultPickerList.innerHTML = '<div style="font-size: 11px; color: var(--text-muted); padding: 4px;">No saved members in Family Vault. Open Vault to add.</div>';
      return;
    }

    familyVault.forEach((v) => {
      if (!v.name) return;
      const item = document.createElement('div');
      item.className = 'vault-picker-item';
      item.innerHTML = `
        <div class="vault-picker-item-info">
          <strong>${v.name}</strong>
          <span>${v.age ? `${v.age} yrs · ` : ''}${v.gender || ''} · ${v.idType || 'ID'}</span>
        </div>
        <button class="vault-picker-add" data-id="${v.name}">+ Pick</button>
      `;

      item.querySelector('.vault-picker-add').addEventListener('click', () => {
        if (activeTabKey >= '0' && activeTabKey <= '5') {
          const idx = parseInt(activeTabKey, 10);
          pilgrims[idx] = { ...v };
          renderActiveTab();
          vaultPickerList.style.display = 'none';
          vaultArrow.innerText = '▼';
          showToast(`Applied ${v.name} to Pilgrim ${idx + 1}!`);
        }
      });

      vaultPickerList.appendChild(item);
    });
  }

  // Fill All Button
  btnFillAll.addEventListener('click', () => {
    saveActiveTabToMemory();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        const validPilgrims = pilgrims.filter(p => p.name);
        const primary = validPilgrims[0] || pilgrims[0] || {};
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'FILL_ALL',
          data: {
            pilgrims: validPilgrims,
            contact: {
              email: primary.email || '',
              city: primary.city || '',
              state: primary.state || '',
              pincode: primary.pincode || '',
              country: primary.passportCountry || 'India',
              mobile: primary.mobile || ''
            }
          }
        }, (res) => {
          if (chrome.runtime.lastError) {
            showToast('Open TTD booking page first!');
          } else {
            showToast('⚡ Form Filled!');
          }
        });
      }
    });
  });

  // Demo Page Link
  btnDemoLink?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('demo_portal/index.html') });
  });

  // Open Options / Vault
  btnOpenVault.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options/options.html'));
    }
  });

  // Theme Toggle
  btnThemeToggle.addEventListener('click', () => {
    const curr = document.documentElement.getAttribute('data-theme');
    const next = curr === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    chrome.storage.local.set({ theme: next });
  });

  function showToast(msg) {
    toastMsg.innerText = msg;
    toastMsg.style.display = 'block';
    setTimeout(() => {
      toastMsg.style.display = 'none';
    }, 2500);
  }

  function notifyContent() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'CONFIG_UPDATED' }).catch(() => {});
      }
    });
  }
});

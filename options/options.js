/**
 * Options Logic matching TTD Autofill Assistant
 */

document.addEventListener('DOMContentLoaded', () => {
  let vaultProfiles = [
    { id: '1', name: 'Venkata Raman', relation: 'Self', gender: 'Male', age: '45', idType: 'Aadhaar Card', idNumber: '987654321012', mobile: '9876543210', state: 'Andhra Pradesh', city: 'Tirupati', pincode: '517501' },
    { id: '2', name: 'Lakshmi Devi', relation: 'Spouse', gender: 'Female', age: '42', idType: 'Aadhaar Card', idNumber: '987654321013', mobile: '9876543210', state: 'Andhra Pradesh', city: 'Tirupati', pincode: '517501' },
    { id: '3', name: 'Srinivasa Rao', relation: 'Son', gender: 'Male', age: '20', idType: 'Aadhaar Card', idNumber: '987654321014', mobile: '9876543210', state: 'Andhra Pradesh', city: 'Tirupati', pincode: '517501' },
    { id: '4', name: 'Padmavathi R', relation: 'Daughter', gender: 'Female', age: '18', idType: 'Aadhaar Card', idNumber: '987654321015', mobile: '9876543210', state: 'Andhra Pradesh', city: 'Tirupati', pincode: '517501' }
  ];

  let sets = [
    { id: 'set_1', name: 'Family (4 Persons)', memberIds: ['1', '2', '3', '4'] },
    { id: 'set_2', name: 'Self & Spouse', memberIds: ['1', '2'] }
  ];

  let editingProfileId = null;

  // Nav Items & Screens
  const navItems = document.querySelectorAll('.opt-nav-item');
  const screens = {
    'dashboard': document.getElementById('screen-dashboard'),
    'family-vault': document.getElementById('screen-family-vault'),
    'sets': document.getElementById('screen-sets'),
    'backup': document.getElementById('screen-backup'),
    'trust': document.getElementById('screen-trust')
  };

  // Switch Screen
  function switchScreen(route) {
    navItems.forEach(n => {
      if (n.getAttribute('data-route') === route) n.classList.add('is-active');
      else n.classList.remove('is-active');
    });

    Object.keys(screens).forEach(k => {
      if (screens[k]) screens[k].style.display = (k === route) ? 'flex' : 'none';
    });
  }

  navItems.forEach(item => {
    const r = item.getAttribute('data-route');
    if (r) {
      item.addEventListener('click', () => switchScreen(r));
    }
  });

  // Load from chrome.storage
  function loadStorage() {
    chrome.storage.local.get(['ttd_vault', 'ttd_sets', 'theme'], (res) => {
      if (res.theme) document.documentElement.setAttribute('data-theme', res.theme);
      if (res.ttd_vault && Array.isArray(res.ttd_vault) && res.ttd_vault.length > 0) {
        vaultProfiles = res.ttd_vault;
      }
      if (res.ttd_sets && Array.isArray(res.ttd_sets)) {
        sets = res.ttd_sets;
      }
      updateDashboardUI();
      renderVaultCards();
      renderSetsUI();
    });
  }

  function saveStorage() {
    chrome.storage.local.set({
      ttd_vault: vaultProfiles,
      ttd_sets: sets,
      ttd_devotees: vaultProfiles
    }, () => {
      updateDashboardUI();
      renderVaultCards();
      renderSetsUI();
    });
  }

  // Dashboard Stats & Readiness
  function updateDashboardUI() {
    const countEl = document.getElementById('stat-pilgrims-count');
    const setsEl = document.getElementById('stat-sets-count');
    if (countEl) countEl.innerText = vaultProfiles.length;
    if (setsEl) setsEl.innerText = sets.length;
  }

  // Quick Action Buttons
  document.getElementById('qa-add-pilgrim').addEventListener('click', () => {
    switchScreen('family-vault');
    openVaultForm();
  });
  document.getElementById('qa-manage-sets').addEventListener('click', () => switchScreen('sets'));
  document.getElementById('qa-backup').addEventListener('click', () => switchScreen('backup'));
  document.getElementById('qa-demo')?.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('demo_portal/index.html') });
  });
  document.getElementById('qa-ttd').addEventListener('click', () => {
    window.open('https://ttdevasthanams.ap.gov.in', '_blank');
  });

  // Family Vault UI
  const vaultCardsGrid = document.getElementById('vault-cards-grid');
  const vaultFormArea = document.getElementById('vault-form-area');
  const btnVaultAddNew = document.getElementById('btn-vault-add-new');
  const btnVfCancel = document.getElementById('btn-vf-cancel');
  const btnVfSave = document.getElementById('btn-vf-save');

  function renderVaultCards() {
    vaultCardsGrid.innerHTML = '';
    vaultProfiles.forEach(p => {
      const card = document.createElement('div');
      card.className = 'opt-vault-card';
      const initial = (p.name || '?').charAt(0).toUpperCase();
      const maskedId = p.idNumber ? `XXXX-XXXX-${p.idNumber.slice(-4)}` : 'No ID';

      card.innerHTML = `
        <div class="opt-vault-card-top">
          <div class="opt-avatar">${initial}</div>
          <div class="opt-vault-card-id">
            <strong>${p.name || 'Unnamed'}</strong>
            <span class="opt-muted opt-small">${p.relation || 'Member'} · ${p.age ? `${p.age} yrs` : ''} · ${p.gender || ''}</span>
          </div>
        </div>
        <div class="opt-vault-card-meta">
          <span class="opt-pill">${p.idType || 'ID'}: ${maskedId}</span>
          ${p.mobile ? `<span class="opt-pill">📞 ${p.mobile}</span>` : ''}
        </div>
        <div class="opt-vault-card-actions">
          <button class="opt-btn opt-btn-ghost opt-btn-sm btn-card-edit" data-id="${p.id}">Edit</button>
          <button class="opt-btn opt-btn-ghost opt-btn-sm opt-danger-text btn-card-del" data-id="${p.id}">Delete</button>
        </div>
      `;

      card.querySelector('.btn-card-edit').addEventListener('click', () => openVaultForm(p));
      card.querySelector('.btn-card-del').addEventListener('click', () => {
        if (confirm(`Remove ${p.name} from Family Vault?`)) {
          vaultProfiles = vaultProfiles.filter(x => x.id !== p.id);
          saveStorage();
        }
      });

      vaultCardsGrid.appendChild(card);
    });
  }

  function openVaultForm(profile = null) {
    vaultFormArea.style.display = 'block';
    vaultFormArea.scrollIntoView({ behavior: 'smooth' });
    const vfTitle = document.getElementById('vault-form-title');

    if (profile) {
      editingProfileId = profile.id;
      vfTitle.innerText = `Edit ${profile.name}`;
      document.getElementById('vf-name').value = profile.name || '';
      document.getElementById('vf-relation').value = profile.relation || 'Self';
      document.getElementById('vf-gender').value = profile.gender || 'Male';
      document.getElementById('vf-age').value = profile.age || '';
      document.getElementById('vf-id-type').value = profile.idType || 'Aadhaar Card';
      document.getElementById('vf-id-number').value = profile.idNumber || '';
      document.getElementById('vf-mobile').value = profile.mobile || '';
      document.getElementById('vf-state').value = profile.state || 'Andhra Pradesh';
      document.getElementById('vf-city').value = profile.city || '';
      document.getElementById('vf-pincode').value = profile.pincode || '';
    } else {
      editingProfileId = null;
      vfTitle.innerText = 'Add New Pilgrim';
      document.getElementById('vf-name').value = '';
      document.getElementById('vf-relation').value = 'Self';
      document.getElementById('vf-gender').value = 'Male';
      document.getElementById('vf-age').value = '';
      document.getElementById('vf-id-type').value = 'Aadhaar Card';
      document.getElementById('vf-id-number').value = '';
      document.getElementById('vf-mobile').value = '';
      document.getElementById('vf-state').value = 'Andhra Pradesh';
      document.getElementById('vf-city').value = '';
      document.getElementById('vf-pincode').value = '';
    }
  }

  btnVaultAddNew.addEventListener('click', () => openVaultForm());
  btnVfCancel.addEventListener('click', () => {
    vaultFormArea.style.display = 'none';
  });

  btnVfSave.addEventListener('click', () => {
    const name = document.getElementById('vf-name').value.trim();
    if (!name) {
      alert('Please enter full name.');
      return;
    }

    const data = {
      id: editingProfileId || Date.now().toString(),
      name: name,
      relation: document.getElementById('vf-relation').value,
      gender: document.getElementById('vf-gender').value,
      age: document.getElementById('vf-age').value.trim(),
      idType: document.getElementById('vf-id-type').value,
      idNumber: document.getElementById('vf-id-number').value.trim(),
      mobile: document.getElementById('vf-mobile').value.trim(),
      state: document.getElementById('vf-state').value.trim(),
      city: document.getElementById('vf-city').value.trim(),
      pincode: document.getElementById('vf-pincode').value.trim()
    };

    if (editingProfileId) {
      const idx = vaultProfiles.findIndex(x => x.id === editingProfileId);
      if (idx !== -1) vaultProfiles[idx] = data;
    } else {
      vaultProfiles.push(data);
    }

    saveStorage();
    vaultFormArea.style.display = 'none';
  });

  // Sets Management
  const setsListContainer = document.getElementById('sets-list-container');
  const inputNewSetName = document.getElementById('input-new-set-name');
  const btnCreateSet = document.getElementById('btn-create-set');

  function renderSetsUI() {
    setsListContainer.innerHTML = '';
    sets.forEach(set => {
      const card = document.createElement('div');
      card.className = 'opt-set-card';

      const chipsHtml = vaultProfiles.map(p => {
        const isIn = set.memberIds && set.memberIds.includes(p.id);
        return `
          <label class="opt-member-chip ${isIn ? 'is-in' : ''}">
            <input type="checkbox" data-set="${set.id}" data-member="${p.id}" ${isIn ? 'checked' : ''}>
            ${p.name}
          </label>
        `;
      }).join('');

      card.innerHTML = `
        <div class="opt-set-card-head">
          <strong>${set.name}</strong>
          <button class="opt-btn opt-btn-ghost opt-btn-sm opt-danger-text btn-del-set" data-id="${set.id}">Delete</button>
        </div>
        <div class="opt-set-members">
          ${chipsHtml || '<span class="opt-muted opt-small">Add pilgrims to vault first.</span>'}
        </div>
      `;

      card.querySelectorAll('input[type="checkbox"]').forEach(chk => {
        chk.addEventListener('change', (e) => {
          const mId = e.target.getAttribute('data-member');
          if (e.target.checked) {
            if (!set.memberIds.includes(mId)) set.memberIds.push(mId);
          } else {
            set.memberIds = set.memberIds.filter(x => x !== mId);
          }
          saveStorage();
        });
      });

      card.querySelector('.btn-del-set').addEventListener('click', () => {
        sets = sets.filter(x => x.id !== set.id);
        saveStorage();
      });

      setsListContainer.appendChild(card);
    });
  }

  btnCreateSet.addEventListener('click', () => {
    const name = inputNewSetName.value.trim();
    if (!name) return;
    sets.push({
      id: 'set_' + Date.now(),
      name: name,
      memberIds: []
    });
    inputNewSetName.value = '';
    saveStorage();
  });

  // Backup & Restore
  document.getElementById('btn-export-backup').addEventListener('click', () => {
    const payload = {
      version: '7.0.1',
      exportedAt: new Date().toISOString(),
      pilgrimProfiles: vaultProfiles,
      pilgrimSets: sets
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ttd-autofill-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  });

  document.getElementById('input-restore-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.pilgrimProfiles) {
          vaultProfiles = data.pilgrimProfiles;
          if (data.pilgrimSets) sets = data.pilgrimSets;
          saveStorage();
          alert('✅ Backup restored successfully!');
        }
      } catch (err) {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  });

  // Danger Zone
  const dangerInput = document.getElementById('input-danger-confirm');
  const dangerBtn = document.getElementById('btn-danger-delete');
  dangerInput.addEventListener('input', () => {
    dangerBtn.disabled = dangerInput.value.trim() !== 'DELETE';
  });
  dangerBtn.addEventListener('click', () => {
    if (dangerInput.value.trim() === 'DELETE') {
      vaultProfiles = [];
      sets = [];
      saveStorage();
      alert('All profiles have been wiped.');
      dangerInput.value = '';
      dangerBtn.disabled = true;
    }
  });

  loadStorage();
});

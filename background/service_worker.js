/**
 * TTD Express Autofill - Background Service Worker (Manifest V3)
 */

// Default initialization on install
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[TTD Assistant] Extension Installed / Updated:', details.reason);

  // Set default storage if empty
  chrome.storage.local.get(['ttd_devotees', 'ttd_settings'], (res) => {
    if (!res.ttd_devotees || res.ttd_devotees.length === 0) {
      const defaultDevotees = [
        { name: 'Venkata Raman', age: '45', gender: 'Male', idType: 'Aadhaar Card', idNumber: '987654321012', state: 'Andhra Pradesh', city: 'Tirupati', photoData: '' },
        { name: 'Lakshmi Devi', age: '42', gender: 'Female', idType: 'Aadhaar Card', idNumber: '987654321013', state: 'Andhra Pradesh', city: 'Tirupati', photoData: '' }
      ];

      const defaultSettings = {
        autoFillEnabled: true,
        autoFocusCaptcha: true,
        autoAcceptTerms: true,
        playChimeOnCaptcha: true,
        fillDelayMs: 50,
        defaultLaddus: '2',
        defaultHundi: '101'
      };

      chrome.storage.local.set({
        ttd_devotees: defaultDevotees,
        ttd_settings: defaultSettings
      }, () => {
        updateBadge(defaultDevotees.length);
      });
    } else {
      updateBadge(res.ttd_devotees.length);
    }
  });

  // Create context menu items for fast power-user access
  chrome.contextMenus.create({
    id: 'ttd-autofill-now',
    title: '⚡ Autofill TTD Pilgrim Details',
    contexts: ['page', 'editable']
  });

  chrome.contextMenus.create({
    id: 'ttd-open-manager',
    title: '👥 Open Devotee Manager',
    contexts: ['action']
  });
});

// Handle Context Menus
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'ttd-autofill-now' && tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'TRIGGER_AUTOFILL' }).catch(() => {});
  } else if (info.menuItemId === 'ttd-open-manager') {
    chrome.runtime.openOptionsPage();
  }
});

// Watch storage changes to update toolbar badge count
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.ttd_devotees) {
    const count = changes.ttd_devotees.newValue ? changes.ttd_devotees.newValue.length : 0;
    updateBadge(count);
  }
});

function updateBadge(count) {
  if (count > 0) {
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#ea580c' }); // Saffron gold badge
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

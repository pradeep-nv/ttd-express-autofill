// TTD Express Autofill - Background Service Worker
console.log('[TTD Express Autofill] Service worker active.');

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg) return;

  if (msg.type === "TTDAF_AUTHORIZE_FILL" || msg.type === "TTDAF_LICENSE_STATUS") {
    sendResponse({
      ok: true,
      status: "active",
      license: {
        key: "UNLOCKED-COMMUNITY-EDITION",
        installation_uuid: "LOCAL-DEV",
        valid: true
      }
    });
    return true;
  }

  if (msg.type === "TTDAF_ACTIVATE_KEY") {
    sendResponse({
      ok: true,
      status: "active",
      license: {
        key: msg.license_key || "UNLOCKED",
        valid: true
      }
    });
    return true;
  }

  if (msg.type === "TTDAF_DEACTIVATE_LICENSE") {
    sendResponse({ ok: true, status: "none", warned: null });
    return true;
  }
});

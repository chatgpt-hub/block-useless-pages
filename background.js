chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "add-to-blocklist",
    title: "添加到阻止列表",
    contexts: ["page"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "add-to-blocklist") {
    let url = new URL(tab.url);
    chrome.storage.sync.get("blockedSites", function (data) {
      let blockedSites = data.blockedSites || [];
      blockedSites.push(url.hostname);
      chrome.storage.sync.set({ blockedSites: blockedSites });
    });
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "loading") {
    chrome.storage.sync.get("blockedSites", function (data) {
      let blockedSites = data.blockedSites || [];
      let url = new URL(tab.url);
      if (blockedSites.includes(url.hostname)) {
        chrome.tabs.update(tabId, { url: "about:blank" });
      }
    });
  }
});
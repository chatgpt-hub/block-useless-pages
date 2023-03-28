function addSite() {
    let input = document.querySelector("#site-input");
    let site = input.value.trim();
    if (site) {
        chrome.storage.sync.get("blockedSites", function (data) {
            let blockedSites = data.blockedSites || [];
            blockedSites.push(site);
            chrome.storage.sync.set({ blockedSites: blockedSites }, function () {
                input.value = "";
                updateList();
            });
        });
    }
}

function removeSite(site) {
    chrome.storage.sync.get("blockedSites", function (data) {
        let blockedSites = data.blockedSites || [];
        let index = blockedSites.indexOf(site);
        if (index > -1) {
            blockedSites.splice(index, 1);
            chrome.storage.sync.set({ blockedSites: blockedSites }, function () {
                updateList();
            });
        }
    });
}

function updateList() {
    let list = document.querySelector("#blocked-sites-list");
    list.innerHTML = "";
    chrome.storage.sync.get("blockedSites", function (data) {
        let blockedSites = data.blockedSites || [];
        blockedSites.forEach(function (site) {
            let li = document.createElement("li");
            li.classList.add("flex", "justify-between", "items-center", "py-2", "px-4");
            let siteText = document.createElement("span");
            siteText.classList.add("text-gray-700", "font-medium");
            siteText.textContent = site;
            li.appendChild(siteText);
            let button = document.createElement("button");
            button.textContent = "移除";
            button.classList.add("bg-red-500", "hover:bg-red-700", "text-white", "font-bold", "py-1", "px-2", "rounded", "focus:outline-none", "focus:shadow-outline");
            button.onclick = function () {
                removeSite(site);
            };
            li.appendChild(button);
            list.appendChild(li);
        });
    });
}


document.addEventListener("DOMContentLoaded", function () {
    let addButton = document.querySelector("#add-button");
    addButton.onclick = addSite;
    updateList();
});


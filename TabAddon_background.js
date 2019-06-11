class TabStorage {
	constructor(storageData) {
		storageData = storageData || {};
		this.tabCount = storageData.tabCount || {};
		this.ids = storageData.ids || new Array();
		this.badgeProvider = new BadgeProvider(storageData.badgeProvider);
	}

	addTabCount(tabCount) {
		const id = this.getDate(new Date());
		if (this.ids.includes(id) === false) {
			this.ids.push(id);
		}
		this.tabCount[id] = tabCount;
	}

	getDate(date) {
		const addzero = (value) => { return value < 10 ? '0' + value : value; };
		return `${addzero(date.getDate())}.${addzero(date.getMonth())}.${date.getFullYear()}>${addzero(date.getHours())}`;
	}
}

class BadgeProvider {
	constructor(storageData) {
		storageData = storageData || {};
	}

	setBadgeColor() {
		browser.browserAction.setBadgeBackgroundColor({ 'color':  this.getBadgeColor()});
	}

	getBadgeColor() {
		if (true){
			return "green";
		}
	}
}

function updateCount(tabId, isOnRemoved) {
	browser.tabs.query({})
		.then((tabs) => {
			let length = tabs.length;

			// onRemoved fires too early and the count is one too many.
			// see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
			if (isOnRemoved && tabId && tabs.map((t) => { return t.id; }).includes(tabId)) {
				length--;
			}

			browser.browserAction.setBadgeText({ text: length.toString() });
			
			UpdateStorage(tabs);
		});
}

function isEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

// Informations about browser.storage.*
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local
function UpdateStorage(tabs) {
	const storageNodeName = "tabData";
	browser.storage.sync.get(storageNodeName).then((data) => {
		console.log("Loaded Data", data);

		InitStorageData(data, storageNodeName);

		ProcessData(data[storageNodeName].storage, tabs);

		console.log("Save Data", data);
		browser.storage.sync.set({ [storageNodeName]: data[storageNodeName] });
	}, onError);
}

function ProcessData(storageData, tabs) {
	storageData.addTabCount(tabs.length);

	storageData.badgeProvider.setBadgeColor()
	
	
	

	// add code here
}

function InitStorageData(data, storageNodeName) {
	if (isEmpty(data)) {
		console.log("Storage Init!");
		data[storageNodeName] = { Version: 1 };
	}
	// required every time, because data is loaded each time from storage
	data[storageNodeName].storage = new TabStorage(data[storageNodeName].storage);
}

function onError(error) {
	console.log(`Error: ${error}`);
}

browser.tabs.onRemoved.addListener((tabId) => {
	updateCount(tabId, true);
});
browser.tabs.onCreated.addListener((tabId) => {
	updateCount(tabId, false);
});
updateCount();


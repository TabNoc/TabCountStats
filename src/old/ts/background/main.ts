import TabCountHandler from './TabCountHandler';
import { Migrator } from '~/logic/storage/Migrator';
import TabCountStorage from '~/logic/storage/TabCountStorage';

const tabCountHandler = new TabCountHandler(new TabCountStorage());

async function startAddonBackgroundAsync() {
	await new Migrator().checkAndApplyMigrations();
}
function startAddonBackgroundSync() {
	tabCountHandler.registerListeners();
}

startAddonBackgroundAsync()
	.then(startAddonBackgroundSync);

// Informations about browser.storage.*
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local

function saveOptions(e: any) {
	e.preventDefault();
	alert('Save stopped because only testContent availible!');
	return;
	browser.storage.sync.set({
		color: document.querySelector<HTMLInputElement>('#color')!.value,
	});
}

function restoreOptions() {
	function setCurrentChoice(result: any) {
		document.querySelector<HTMLInputElement>('#color')!.value
      = result.color || 'blue';
	}

	function onError(error: string) {
		console.log(`Error: ${error}`);
	}

	const getting = browser.storage.sync.get('color');
	getting.then(setCurrentChoice, onError);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form')!.addEventListener('submit', saveOptions);

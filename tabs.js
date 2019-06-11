
function firstUnpinnedTab(tabs) {
  for (var tab of tabs) {
    if (!tab.pinned) {
      return tab.index;
    }
  }
}

/**
 * listTabs to switch to
 */
function listTabs() {
  getCurrentWindowTabs().then((tabs) => {
  });
}

document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

document.addEventListener("click", (e) => {
  function callOnActiveTab(callback) {
    getCurrentWindowTabs().then((tabs) => {
      for (var tab of tabs) {
        if (tab.active) {
          callback(tab, tabs);
        }
      }
    });
  }

  if (e.target.id === "tabs-reload") {
    callOnActiveTab((tab) => {
      browser.tabs.reload(tab.id);
    });
  }

  else if (e.target.id === "tabs-cleardata") {
    browser.storage.sync.clear();
    console.log("ClearedData!");
    browser.storage.sync.get().then((data)=>{console.log(data);});
  }
  else if (e.target.id === "tabs-readdata") {
    browser.storage.sync.get().then((data)=>{console.log(data);});
  }

  else if (e.target.id === "tabs-alertinfo") {
    callOnActiveTab((tab) => {
      let props = "";
      for (let item in tab) {
        props += `${ item } = ${ tab[item] } \n`;
      }
      alert(props);
    });
  }

  else if (e.target.id === "tabs-activate-random-activewindow") {
    browser.tabs.query({currentWindow: true}).then((tabs) => {
      OpenRandomTabFromQuery(tabs);
    });
  }

  else if (e.target.id === "tabs-activate-random-anywhere") {
    browser.tabs.query({}).then((tabs) => {
      OpenRandomTabFromQuery(tabs);
    });
  }

  e.preventDefault();
});

function OpenRandomTabFromQuery(tabs){
  const tabid = tabs[Math.floor(Math.random()*tabs.length)].id;
  browser.tabs.update(tabid, {
    active: true
  });
}

//onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`The tab with id: ${tabId}, is closing`);

  if(removeInfo.isWindowClosing) {
    console.log(`Its window is also closing.`);
  } else {
    console.log(`Its window is not closing`);
  }
});

//onMoved listener. fired when tab is moved into the same window
browser.tabs.onMoved.addListener((tabId, moveInfo) => {
  var startIndex = moveInfo.fromIndex;
  var endIndex = moveInfo.toIndex;
  console.log(`Tab with id: ${tabId} moved from index: ${startIndex} to index: ${endIndex}`);
});

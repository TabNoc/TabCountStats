const changeWindowId = "tabs-changeWindow";
const windowIdAttribute = "tabs-windowId";

export class WindowsHandler {
    populateCurrentWindowTabCount(targetId: string):void {
        let countDiv = document.getElementById(targetId);
        if (countDiv == null) {
            return;
        }

        browser.tabs.query({ currentWindow: true })
            .then((tabs) => {
                countDiv!.innerText = tabs.length.toString();
            });
    }
    populateWindowCount(targetId: string):void {
        let countDiv = document.getElementById(targetId);
        if (countDiv == null) {
            return;
        }
    
        browser.windows.getAll()
            .then((windows) => {
                countDiv!.innerText = windows.length.toString();
            });
    }
    processClickEvent(target: HTMLElement): boolean {
        if (target.id == changeWindowId) {
            const attributeValue = target.getAttribute(windowIdAttribute);
            if (attributeValue != null) {
                this.switchToWindow(Number.parseInt(attributeValue));
                return true;
            }
        }
        return false;
    }

    switchToTab(choosenTab: browser.tabs.Tab): void {
        browser.tabs.update(choosenTab.id, {
            active: true
        });
        this.switchToWindow(choosenTab.windowId);
    }

    populateWindowContainer(targetId: string): void {
        browser.windows.getAll().then((windows) => {
            let list = document.getElementById(targetId)!;

            windows
                .sort(this.sortByWindowTitle)
                .forEach(window => {
                    if (window.id != null) {
                        const listItem = document.createElement("li");
                        const link = document.createElement("a");
                        link.setAttribute("class", "windowLink");
                        link.href = "#";
                        link.text = (window as any).title as string;
                        link.id = changeWindowId;
                        link.setAttribute(windowIdAttribute, window.id.toString());

                        listItem.appendChild(link)
                        list.appendChild(listItem);
                    }
                });
        });
    }
    constructor() {

    }

    private sortByWindowTitle(firstWindow: browser.windows.Window, secondWindow: browser.windows.Window): number {
        const firstTitle: string = (<any>firstWindow).title;
        const secondTitle: string = (<any>secondWindow).title;

        if (firstTitle.startsWith("[") && secondTitle.startsWith("[") == false) {
            return -1;
        }
        if (firstTitle.startsWith("[") == false && secondTitle.startsWith("[")) {
            return 1;
        }

        if (firstTitle < secondTitle) {
            return -1;
        }
        return 1;
    }

    private switchToWindow(windowId: number) {
        browser.windows.update(windowId, {
            focused: true
        });
    }
}
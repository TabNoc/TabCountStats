const changeWindowId = "tabs-changeWindow";
const windowIdAttribute = "tabs-windowId";
const windowContainerId = "tabs-windowContainer";

export class WindowsHandler {
    registerWindowSearchEvent(targetId: string): void {
        document.getElementById(targetId)?.addEventListener("input", (ev) => {
            this.populateWindowContainer((<HTMLInputElement>ev.target).value);
        });
    }
    populateCurrentWindowTabCount(targetId: string): void {
        let countDiv = document.getElementById(targetId);
        if (countDiv == null) {
            return;
        }

        browser.tabs.query({ currentWindow: true })
            .then((tabs) => {
                countDiv!.innerText = tabs.length.toString();
            });
    }
    populateWindowCount(targetId: string): void {
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

    populateWindowContainer(searchString: string | null = null): void {
        browser.windows.getAll().then((windows) => {
            let list = document.getElementById(windowContainerId)!;
            while (list.firstChild != null) {
                list.removeChild(list.firstChild);
            }

            this.sortedWindows(windows, searchString)
                .forEach(window => {
                    if (window.id != null) {
                        const listItem = document.createElement("li");
                        const link = document.createElement("a");
                        link.setAttribute("class", "windowLink");
                        link.href = "#";
                        link.appendChild(this.getHighlitedHTML((window as any).title as string, searchString));
                        link.id = changeWindowId;
                        link.setAttribute(windowIdAttribute, window.id.toString());

                        listItem.appendChild(link)
                        list.appendChild(listItem);
                    }
                });
        });
    }
    getHighlitedHTML(baseText: string, searchString: string | null): HTMLParagraphElement {
        let paragraph = document.createElement("p");
        
        if (searchString != null && baseText.includes(searchString) == true) {
            baseText.split(searchString).forEach((textSegment, index, array) => {
                if (array.length > index && index > 0) {
                    let elementSearchText = document.createElement("span");
                    elementSearchText.className = "highlited";
                    elementSearchText.innerText = searchString;
                    paragraph.appendChild(elementSearchText);
                }

                let element = document.createElement("span");
                element.innerText = textSegment;
                paragraph.appendChild(element);
            });
        }
        else {
            paragraph.innerText = baseText;
        }
        return paragraph;
    }

    constructor() {

    }

    private sortedWindows(windows: browser.windows.Window[], searchString: string | null): browser.windows.Window[] {
        return windows
            .filter((window) => searchString == null || (<string>(<any>window).title).includes(searchString))
            .sort((firstWindow, secondWindow) => this.sortByWindowTitle(firstWindow, secondWindow));
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
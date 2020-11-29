import { WindowFavDataStorageHandler } from "../../background/storageHandler/WindowFavDataStorageHandler";

const changeWindowId = "tabs-changeWindow";
const windowIdAttribute = "tabs-windowId";
const windowContainerId = "tabs-windowContainer";

export class WindowsHandler {
    private storageHandler: WindowFavDataStorageHandler = new WindowFavDataStorageHandler();
    public registerWindowSearchEvent(targetId: string): void {
        document.getElementById(targetId)?.addEventListener("input", (ev) => {
            this.populateWindowContainer((<HTMLInputElement>ev.target).value);
        });
    }
    public populateCurrentWindowTabCount(targetId: string): void {
        let countDiv = document.getElementById(targetId);
        if (countDiv == null) {
            return;
        }

        browser.tabs.query({ currentWindow: true })
            .then((tabs) => {
                countDiv!.innerText = tabs.length.toString();
            });
    }
    public populateWindowCount(targetId: string): void {
        let countDiv = document.getElementById(targetId);
        if (countDiv == null) {
            return;
        }

        browser.windows.getAll()
            .then((windows) => {
                countDiv!.innerText = windows.length.toString();
            });
    }
    public processClickEvent(target: HTMLElement): boolean {
        if (target.id == changeWindowId) {
            const attributeValue = target.getAttribute(windowIdAttribute);
            if (attributeValue != null) {
                this.switchToWindow(Number.parseInt(attributeValue));
                return true;
            }
        }
        return false;
    }
    public switchToTab(choosenTab: browser.tabs.Tab): void {
        browser.tabs.update(choosenTab.id, {
            active: true
        });
        this.switchToWindow(choosenTab.windowId);
    }
    private switchToWindow(windowId: number) {
        browser.windows.update(windowId, {
            focused: true
        });
    }

    public populateWindowContainer(searchString: string | null = null): void {
        browser.windows.getAll().then(async (windows) => {
            let container = document.getElementById(windowContainerId)!;
            while (container.firstChild != null) {
                container.removeChild(container.firstChild);
            }

            let storageMap: Map<number, number> = await this.storageHandler.GetMap();

            this.sortedWindows(windows, searchString, storageMap)
                .forEach(window => {
                    if (window.id != null) {
                        const entry = document.createElement("div");
                        entry.setAttribute("class", "windowEntryWrapper");
                        entry.appendChild(this.createStarElement(window.id, storageMap.has(window.id), searchString));
                        entry.appendChild(this.createWindowLink(window.id, (window as any).title as string, searchString));

                        container.appendChild(entry);
                    }
                });
        });
    }

    private createWindowLink(windowId: number, windowTitle: string, searchString: string | null) {
        const link = document.createElement("a");

        link.setAttribute("class", "windowLink");
        link.setAttribute(windowIdAttribute, windowId.toString());
        link.href = "#";
        link.id = changeWindowId;

        link.addEventListener("click", (ev) => this.switchToWindow(windowId));
        link.appendChild(this.getHighlightedHTML(windowTitle, searchString));
        return link;
    }

    private createStarElement(windowId: number, active: boolean, searchString: string | null): HTMLDivElement {
        let wrapper = document.createElement("div");
        let span = document.createElement("span");

        span.setAttribute("class", "star" + (active ? " active" : ""));
        span.addEventListener("click", (ev) => {
            if (active) {
                this.storageHandler.RemoveWindow(windowId)
                    .then(() => this.populateWindowContainer(searchString));
            }
            else {
                let priority: number = 1;
                try {
                    priority = parseInt(prompt("Wich priority has this window? (higher number -> higher position)", "1")!);
                    if (Number.isNaN(priority)) {
                        return; // do not add if no valid input
                    }
                } catch (error) {
                    console.warn(error);
                }
                this.storageHandler.AddWindow(windowId, priority)
                    .then(() => this.populateWindowContainer(searchString));
            }
        });

        wrapper.setAttribute("class", "starWrap");
        wrapper.appendChild(span);

        return wrapper;
    }
    private getHighlightedHTML(baseText: string, searchString: string | null): HTMLParagraphElement {
        let paragraph = document.createElement("p");
        let result = baseText.match(new RegExp("^(.*?)(" + searchString + ")(.*)$", "i"));

        if (searchString != null && result != null) {
            let start = document.createElement("span");
            start.innerText = result[1];
            paragraph.appendChild(start);

            let searchText = document.createElement("span");
            searchText.className = "highlighted";
            searchText.innerText = result[2];
            paragraph.appendChild(searchText);

            let end = document.createElement("span");
            end.innerText = result[3];
            paragraph.appendChild(end);

            /*
            paragraph.innerHTML = baseText.replace(new RegExp(searchString, "gi"), (match, offset, all) => {
                let elementSearchText = document.createElement("span");
                elementSearchText.className = "highlighted";
                elementSearchText.innerText = match;

                return elementSearchText.outerHTML;
            });
            */
        }
        else {
            paragraph.innerText = baseText;
        }
        return paragraph;
    }

    constructor() {

    }

    private sortedWindows(windows: browser.windows.Window[], searchString: string | null, storageMap: Map<number, number>): browser.windows.Window[] {
        return windows
            .filter((window) => window.id != null && (searchString == null || (<string>(<any>window).title).toLowerCase().includes(searchString.toLowerCase())))
            .sort((firstWindow, secondWindow) => this.sortWindows(firstWindow, secondWindow, storageMap));
    }

    private sortWindows(firstWindow: browser.windows.Window, secondWindow: browser.windows.Window, storageMap: Map<number, number>): number {
        const firstTitle: string = (<any>firstWindow).title;
        const secondTitle: string = (<any>secondWindow).title;

        const firstWindowId = (firstWindow.id!);
        const secondWindowId = (secondWindow.id!);
        if (storageMap.has(firstWindowId) && storageMap.has(secondWindowId)) {
            if (storageMap.get(firstWindowId)! > storageMap.get(secondWindowId)!) {
                return -1;
            }
            if (storageMap.get(firstWindowId)! < storageMap.get(secondWindowId)!) {
                return 1;
            }
        }
        else if (storageMap.has(firstWindowId) && storageMap.has(secondWindowId) == false) {
            return -1;
        }
        else if (storageMap.has(firstWindowId) == false && storageMap.has(secondWindowId)) {
            return 1;
        }

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
}
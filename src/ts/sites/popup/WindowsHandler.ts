import { WindowFavoritePriorityRepository } from "../../background/storage/WindowFavoriteRepository";

const changeWindowId = "tabs-changeWindow";
const windowIdAttribute = "tabs-windowId";
const windowContainerId = "tabs-windowContainer";

export class WindowsHandler {
    private windowFavoriteRepository: WindowFavoritePriorityRepository = new WindowFavoritePriorityRepository();
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

    public async populateWindowContainer(searchString: string | null = null): Promise<void> {
        let windows = await browser.windows.getAll()
        let currentWindowId = (await browser.windows.getCurrent()).id;
        let container = document.getElementById(windowContainerId)!;

        while (container.firstChild != null) {
            container.removeChild(container.firstChild);
        }
        (await this.sortedWindows(windows, searchString))
            .forEach(windowWrapper => {
                if (windowWrapper.window.id != null) {
                    const entry = document.createElement("div");
                    entry.setAttribute("class", "windowEntryWrapper");
                    entry.appendChild(this.createStarElement(windowWrapper.window.id, windowWrapper.priority, searchString));
                    entry.appendChild(this.createWindowLink(windowWrapper.window.id, windowWrapper.getAdjustedTitle(), searchString));

                    if (windowWrapper.window.id == currentWindowId) {
                        entry.classList.add("currentWindowEntryWrapper")
                        container.insertBefore(entry, container.firstChild);
                    }
                    else {
                        container.appendChild(entry);
                    }
                }
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

    private createStarElement(windowId: number, priority: number | undefined, searchString: string | null): HTMLDivElement {
        let wrapper = document.createElement("div");
        let span = document.createElement("span");


        if (priority != undefined) {
            span.setAttribute("class", "star active tooltip");
            let tooltip = document.createElement("span");
            tooltip.setAttribute("class", "tooltiptext tooltip-bottom");
            tooltip.textContent = priority.toString();
            span.appendChild(tooltip);
        }
        else {
            span.setAttribute("class", "star");
        }
        span.addEventListener("click", (ev) => {
            if (priority != undefined) {
                this.windowFavoriteRepository.removeWindowFavoritePriority(windowId)
                    .then(() => this.populateWindowContainer(searchString));
            }
            else {
                let newPriority: number = 1;
                try {
                    newPriority = parseInt(prompt("Wich priority has this window? (higher number -> higher position)", "1")!);
                    if (Number.isNaN(newPriority)) {
                        return; // do not add if no valid input
                    }
                } catch (error) {
                    console.warn(error);
                }
                this.windowFavoriteRepository.saveWindowFavoritePriority(windowId, newPriority)
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
        }
        else {
            paragraph.innerText = baseText;
        }
        return paragraph;
    }

    private async sortedWindows(windows: browser.windows.Window[], searchString: string | null): Promise<FavoriteWindowWrapper[]> {
        let filteredWindows = windows
            .filter((window) => window.id != null && (searchString == null || (<string>(<any>window).title).toLowerCase().includes(searchString.toLowerCase())));

        let storageMap = new Map<number, number | undefined>();

        await Promise.all(filteredWindows.map((window) => {
            return new Promise(async (resolve) => {
                storageMap.set(window.id!, await this.windowFavoriteRepository.getWindowFavoritePriority(window.id!));
                resolve(null);
            })
        }));

        return filteredWindows
            .sort((firstWindow, secondWindow) => this.sortWindows(firstWindow, secondWindow, storageMap))
            .map((window) => new FavoriteWindowWrapper(window, storageMap.get(window.id!)));
    }

    private sortWindows(firstWindow: browser.windows.Window, secondWindow: browser.windows.Window, storageMap: Map<number, number | undefined>): number {
        const firstTitle: string = (<any>firstWindow).title;
        const secondTitle: string = (<any>secondWindow).title;

        const firstWindowId = (firstWindow.id!);
        const secondWindowId = (secondWindow.id!);

        const hasFirstWindow = storageMap.get(firstWindowId) != undefined;
        const hasSecondWindow = storageMap.get(secondWindowId) != undefined;
        if (hasFirstWindow && hasSecondWindow) {
            if (storageMap.get(firstWindowId)! > storageMap.get(secondWindowId)!) {
                return -1;
            }
            if (storageMap.get(firstWindowId)! < storageMap.get(secondWindowId)!) {
                return 1;
            }
        }
        else if (hasFirstWindow && hasSecondWindow == false) {
            return -1;
        }
        else if (hasFirstWindow == false && hasSecondWindow) {
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

class FavoriteWindowWrapper {
    constructor(public window: browser.windows.Window, public priority: number | undefined) { }

    public getAdjustedTitle(): string {
        let orgTitle: string = (<any>this.window).title;

        if (orgTitle.substring(orgTitle.lastIndexOf(" - ")).toLowerCase().includes("firefox")) {
            return orgTitle.slice(0, orgTitle.lastIndexOf(" - "));
        }
        else if (orgTitle.substring(orgTitle.lastIndexOf(" — ")).toLowerCase().includes("firefox")) {
            return orgTitle.slice(0, orgTitle.lastIndexOf(" — "));
        }
        else {
            return orgTitle;
        }
    }
}
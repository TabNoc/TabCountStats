const changeWindowId = "tabs-changeWindow";
const windowIdAttribute = "tabs-windowId";

export class WindowsHandler {
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

    populateHTML(targetId: string): void {
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

    private sortByWindowTitle(a: browser.windows.Window, b: browser.windows.Window): number {
        const TitleA: string = (<any>a).title;
        const TitleB: string = (<any>b).title;

        if (TitleA.startsWith("[") && TitleB.startsWith("[") == false) {
            return -1;
        }
        if (TitleA.startsWith("[") == false && TitleB.startsWith("[")) {
            return 1;
        }

        if (TitleA < TitleB) {
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
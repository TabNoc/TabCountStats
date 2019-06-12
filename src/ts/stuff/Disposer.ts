import { Disposable } from "./Disposable";

export class Disposer implements Disposable {
    protected CheckOrThrowDisposed() {
        if (this.disposed == true) {
            throw new Error("ObjectDisposedException");
        }
    }
    protected disposed: boolean = false;
    dispose(): void {
        this.disposed = true;
    }
}

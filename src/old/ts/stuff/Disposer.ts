import type { Disposable } from './Disposable';

export class Disposer implements Disposable {
	protected CheckOrThrowDisposed() {
		if (this.disposed == true)
			throw new Error('ObjectDisposedException');
	}

	protected disposed = false;
	dispose(): void {
		this.disposed = true;
	}
}

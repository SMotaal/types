declare global {
  var ResizeObserver: Window['ResizeObserver'] | undefined;

  interface Window {
    ResizeObserver: ResizeObserverConstructor;
  }

  type InstanceOf<T extends {readonly prototype: {}}> = T['prototype'] & {
    constructor: T;
  };

  interface ResizeObserverConstructor {
    new (callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void): InstanceOf<this>;
    readonly prototype: ResizeObserver;
  }

  interface ResizeObserver {
    // constructor: ResizeObserverConstructor | Function;
    observe(target: HTMLElement): void;
    unobserve(target: HTMLElement): void;
    disconnect(): void;
  }

  interface ResizeObserverEntry {
    readonly contentRect: DOMRectInit;
    readonly target: HTMLElement;
    new (target: HTMLElement): ResizeObserverEntry;
  }
}

export {ResizeObserver, ResizeObserverConstructor, ResizeObserverEntry};

// SEE: https://github.com/airbnb/lunar/blob/master/types/global.d.ts
declare global {
  var requestIdleCallback: Window['requestIdleCallback'] | undefined;
  var cancelIdleCallback: Window['cancelIdleCallback'] | undefined;

  interface Window {
    requestIdleCallback(
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions,
    ): number;

    cancelIdleCallback(handle: number): void;
  }

  interface RequestIdleCallbackOptions {
    timeout?: number;
  }

  interface RequestIdleCallbackDeadline {
    readonly didTimeout: boolean;
    timeRemaining(): number;
  }
}

export {RequestIdleCallbackOptions, RequestIdleCallbackDeadline};

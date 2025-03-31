declare namespace WebdriverIO {
    interface Element {
        elementId: string;
        selector: string;
        waitForExist(options?: { timeout?: number }): Promise<boolean>;
        waitForDisplayed(options?: { timeout?: number }): Promise<boolean>;
        click(): Promise<void>;
        getText(): Promise<string>;
        getAttribute(attr: string): Promise<string>;
    }

    interface Browser {
        $(selector: string): Promise<Element>;
        $$(selector: string): Promise<Element[]>;
        pause(ms: number): Promise<void>;
        startActivity(appPackage: string, appActivity: string): Promise<void>;
    }

    interface RemoteOptions {
        hostname?: string;
        port?: number;
        path?: string;
        protocol?: string;
        capabilities: any;
        logLevel?: string;
        connectionRetryTimeout?: number;
        connectionRetryCount?: number;
    }
}

declare module 'webdriverio' {
    export type Browser = WebdriverIO.Browser;
    export type Element = WebdriverIO.Element;
    export type ChainablePromiseElement<T> = Promise<T> & T;
    export function remote(options: WebdriverIO.RemoteOptions): Promise<WebdriverIO.Browser>;
} 
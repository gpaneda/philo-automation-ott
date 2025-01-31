declare module 'vizio-smart-cast' {
    export default class Vizio {
        constructor(ipAddress: string);
        pairing: {
            initiate(): Promise<void>;
            pair(pin: string): Promise<void>;
        };
        control: {
            power: {
                on(): Promise<void>;
            };
            sendKey(keyCode: number): Promise<void>; // Add this line
        };
        input: {
            set(input: string): Promise<void>;
        };
        launchApp(appId: string): Promise<void>;
    }
}
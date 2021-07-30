export class KeyService {
    constructor() {
        document.addEventListener('keydown', (event: KeyboardEvent) => this.onKeyDown(event));
        document.addEventListener('keyup', (event: KeyboardEvent) => this.onKeyUp(event));
    }

    private keyEvents: {[key: string]: KeyEvent[]} = {};

    registerKeyEvent(keyEvent: KeyEvent): KeyEvent {
        if (!this.keyEvents[keyEvent.key]) this.keyEvents[keyEvent.key] = [];
        this.keyEvents[keyEvent.key].push(keyEvent);
        return keyEvent;
    }

    removeKeyEvent(keyEvent: KeyEvent): void {
        if (!this.keyEvents[keyEvent.key]) return;

        const idx = this.keyEvents[keyEvent.key].findIndex(ke => ke.name === keyEvent.name);
        if (idx === -1) return;

        this.keyEvents[keyEvent.key].splice(idx, 1);
    }

    private onKeyUp(event: KeyboardEvent): void {
        if (!this.keyEvents[event.key]) return;

        event.preventDefault();
        const events = this.keyEvents[event.key].filter(ke => !!ke.keyUp);
        events.forEach(ke => ke.keyUp(event));
        console.log('keyup: %s', event.key);
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (!this.keyEvents[event.key]) return;

        event.preventDefault();
        const events = this.keyEvents[event.key].filter(ke => !!ke.keyDown);
        events.forEach(ke => ke.keyDown(event));
        console.log('keydown: %s', event.key);
    }
}

export interface KeyEvent {
    key: string;
    name: string;
    keyDown: (event: KeyboardEvent) => void;
    keyUp: (event: KeyboardEvent) => void;
}

export const _keyService = new KeyService();
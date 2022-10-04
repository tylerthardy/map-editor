import { Injectable } from '@angular/core';
import { KeyEvent } from './key-event.interface';

@Injectable({
  providedIn: 'root'
})
export class KeyService {
  constructor() {
    document.addEventListener('keydown', (event: KeyboardEvent) => this.onKeyDown(event));
    document.addEventListener('keyup', (event: KeyboardEvent) => this.onKeyUp(event));
    window.addEventListener('blur', () => this.onWindowBlur());
  }

  private keyDowns: { [key: string]: boolean } = {};
  private keyEvents: { [key: string]: KeyEvent[] } = {};

  public registerKeyEvent(keyEvent: KeyEvent): KeyEvent {
    if (!this.keyEvents[keyEvent.key]) this.keyEvents[keyEvent.key] = [];
    this.keyEvents[keyEvent.key].push(keyEvent);
    return keyEvent;
  }

  public removeKeyEvent(keyEvent: KeyEvent): void {
    if (!this.keyEvents[keyEvent.key]) return;

    const idx = this.keyEvents[keyEvent.key].findIndex((ke) => ke.name === keyEvent.name);
    if (idx === -1) return;

    this.keyEvents[keyEvent.key].splice(idx, 1);
  }

  private onKeyUp(event: KeyboardEvent): void {
    this.keyDowns[event.key] = false;
    if (!this.keyEvents[event.key]) return;

    event.preventDefault();
    const events = this.keyEvents[event.key].filter((ke) => !!ke.keyUp);
    events.forEach((ke) => ke.keyUp(event));
    console.log('keyup: %s', event.key);
  }

  private onKeyDown(event: KeyboardEvent): void {
    this.keyDowns[event.key] = true;
    if (!this.keyEvents[event.key]) return;

    event.preventDefault();
    const events = this.keyEvents[event.key].filter((ke) => !!ke.keyDown);
    events.forEach((ke) => ke.keyDown(event));
    console.log('keydown: %s', event.key);
  }

  private onWindowBlur(): void {
    // When window loses focus without a keyup, we should fake the keyups
    const keys = Object.keys(this.keyDowns);

    keys.forEach((key) => {
      const fakeEvent = {
        key: key,
        preventDefault: () => {}
      } as KeyboardEvent;

      this.onKeyUp(fakeEvent);
    });
  }
}

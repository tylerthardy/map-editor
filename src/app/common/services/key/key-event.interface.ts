export interface KeyEvent {
  key: string;
  name: string;
  keyDown: (event: KeyboardEvent) => void;
  keyUp: (event: KeyboardEvent) => void;
}

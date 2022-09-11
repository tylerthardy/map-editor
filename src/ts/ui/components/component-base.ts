import { ComponentContainer, GoldenLayout } from 'golden-layout';

export abstract class ComponentBase implements GoldenLayout.VirtuableComponent {
  private _rootElement: HTMLElement;
  private _container: ComponentContainer;

  get container(): ComponentContainer {
    return this._container;
  }
  get rootHtmlElement(): HTMLElement {
    return this._rootElement;
  }

  constructor() {}

  init(container: ComponentContainer, virtual: boolean) {
    this._container = container;
    if (virtual) {
      this._rootElement = document.createElement('div');
      this._rootElement.style.position = 'absolute';
      this._rootElement.style.overflow = 'hidden';
    } else {
      this._rootElement = this._container.element;
    }
  }
}

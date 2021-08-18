import html from './template.html'
import { ComponentBase } from '../component-base';
import { inject, injectable } from 'inversify';
import { BrushService } from './brush.service';
import { ComponentContainer } from 'golden-layout';

@injectable()
export class BrushComponent extends ComponentBase {
    static readonly typeName = 'brush';

    private _element: HTMLDivElement;
    private _brushSizeLabel: HTMLSpanElement;
    private _sizePlusButton: HTMLButtonElement;
    private _sizeMinusButton: HTMLButtonElement;

    constructor(@inject(BrushService) private _brushService: BrushService) {
        super();
    }

    init(container: ComponentContainer, virtual: boolean): void {
        super.init(container, virtual);

        this._element = document.createElement('div');
        this._element.innerHTML = html;

        this._brushSizeLabel = this._element.getElementsByClassName('brush-size').item(0) as HTMLSpanElement;
        this.setBrushSize(this._brushService.brushSize);
        this._brushService.brushSizeChanged.subscribe((size: number) => this.setBrushSize(size));

        this._sizePlusButton = this._element.getElementsByClassName('brush-plus').item(0) as HTMLButtonElement;
        this._sizePlusButton.addEventListener('click', () => this._brushService.incrementBrushSize());
        this._sizeMinusButton = this._element.getElementsByClassName('brush-minus').item(0) as HTMLButtonElement;
        this._sizeMinusButton.addEventListener('click', () => this._brushService.decrementBrushSize());

        this.rootHtmlElement.appendChild(this._element);
    }

    setBrushSize(size: number): void { 
        this._brushSizeLabel.textContent = size.toString();
    }
}

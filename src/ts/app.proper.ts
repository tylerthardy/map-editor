import { ComponentContainer, GoldenLayout, JsonValue, LogicalZIndex, ResolvedComponentItemConfig } from "golden-layout";
import { BooleanComponent } from "./ui/components/boolean-component";
import { ColorComponent } from "./ui/components/color-component";
import { ComponentBase } from "./ui/components/component-base";

export class ProperApp {
    private _layoutElement: HTMLElement;
    private _goldenLayout: GoldenLayout;
    private _bindComponentEventListener =
        (container: ComponentContainer, itemConfig: ResolvedComponentItemConfig) => this.handleBindComponentEvent(container, itemConfig);
    private _unbindComponentEventListener = (container: ComponentContainer) => this.handleUnbindComponentEvent(container);
    private _useVirtualEventBinding: boolean = true;
    private _boundComponentMap = new Map<ComponentContainer, ComponentBase>();
    private _goldenLayoutBoundingClientRect: DOMRect;
    private _addComponentButton: HTMLButtonElement;
    private _addComponentButtonClickListener = () => this.handleAddComponentButtonClick();
    private _typeSelect: HTMLSelectElement;

    constructor() { }

    init() {
        const layoutElement = document.querySelector('#layoutContainer') as HTMLElement;
        if (layoutElement === null) {
            throw new Error('layoutContainerElement not found');
        }
        this._layoutElement = layoutElement;
        this._goldenLayout = new GoldenLayout(this._layoutElement, this._bindComponentEventListener, this._unbindComponentEventListener);
        this._goldenLayout.beforeVirtualRectingEvent = (count) => this.handleBeforeVirtualRectingEvent(count);
        
        const addComponentButton = document.querySelector('#addComponentButton') as HTMLButtonElement;
        this._addComponentButton = addComponentButton;
        this._addComponentButton.addEventListener('click', this._addComponentButtonClickListener, { passive: true });

        const typeSelectButton = document.querySelector('#typeSelect') as HTMLSelectElement;
        this._typeSelect = typeSelectButton;
    }

    private handleAddComponentButtonClick() {
        const componentType: string = this._typeSelect.value;
        this._goldenLayout.addComponent(componentType);
    }

    private createComponent(container: ComponentContainer, componentTypeName: string, state: JsonValue | undefined, virtual: boolean) {
        switch (componentTypeName) {
            case ColorComponent.typeName: return new ColorComponent(container, state, virtual);
            //case TextComponent.typeName: return new TextComponent(container, state, virtual);
            case BooleanComponent.typeName: return new BooleanComponent(container, state, virtual);
            //case EventComponent.typeName: return new EventComponent(container, state, virtual);
            default:
                throw new Error('createComponent: Unexpected componentTypeName: ' + componentTypeName);
        }
    }

    private handleBindComponentEvent(container: ComponentContainer, itemConfig: ResolvedComponentItemConfig): ComponentContainer.BindableComponent {
        const componentTypeName = ResolvedComponentItemConfig.resolveComponentTypeName(itemConfig);
        if (componentTypeName === undefined) {
            throw new Error('handleBindComponentEvent: Undefined componentTypeName');
        }
        const component = this.createComponent(container, componentTypeName, itemConfig.componentState, this._useVirtualEventBinding);
        if (this._useVirtualEventBinding) {
            const componentRootElement = component.rootHtmlElement;
            this._layoutElement.appendChild(componentRootElement);
            this._boundComponentMap.set(container, component);
            container.virtualRectingRequiredEvent =
                (container, width, height) => this.handleContainerVirtualRectingRequiredEvent(container, width, height);
            container.virtualVisibilityChangeRequiredEvent =
                (container, visible) => this.handleContainerVirtualVisibilityChangeRequiredEvent(container, visible);
            container.virtualZIndexChangeRequiredEvent =
                (container, logicalZIndex, defaultZIndex) =>
                    this.handleContainerVirtualZIndexChangeRequiredEvent(container, logicalZIndex, defaultZIndex);
            return {
                component,
                virtual: true,
            }
        } else {
            // Note that container.element is used as the root element in the component. This is set up in the component constructor
            return {
                component,
                virtual: false,
            }
        }
    }

    private handleUnbindComponentEvent(container: ComponentContainer) {
        const component = this._boundComponentMap.get(container);
        if (component === undefined) {
            throw new Error('handleUnbindComponentEvent: Component not found');
        }

        const componentRootElement = component.rootHtmlElement;
        if (componentRootElement === undefined) {
            throw new Error('handleUnbindComponentEvent: Component does not have a root HTML element');
        }

        if (container.virtual) {
            this._layoutElement.removeChild(componentRootElement);
        } else {
            // If embedded, then component handles unbinding of component elements from content.element
        }
        this._boundComponentMap.delete(container);
    }

    private handleBeforeVirtualRectingEvent(count: number) {
        this._goldenLayoutBoundingClientRect = this._layoutElement.getBoundingClientRect();
        // this._lastVirtualRectingCount = count;
        // this._lastVirtualRectingCountSpan.innerText = this._lastVirtualRectingCount.toString();
    }

    private handleContainerVirtualRectingRequiredEvent(container: ComponentContainer, width: number, height: number) {
        const component = this._boundComponentMap.get(container);
        if (component === undefined) {
            throw new Error('handleContainerVirtualRectingRequiredEvent: Component not found');
        }

        const rootElement = component.rootHtmlElement;
        if (rootElement === undefined) {
            throw new Error('handleContainerVirtualRectingRequiredEvent: Component does not have a root HTML element');
        }

        const containerBoundingClientRect = container.element.getBoundingClientRect();
        const left = containerBoundingClientRect.left - this._goldenLayoutBoundingClientRect.left;
        rootElement.style.left = this.numberToPixels(left);
        const top = containerBoundingClientRect.top - this._goldenLayoutBoundingClientRect.top;
        rootElement.style.top = this.numberToPixels(top);
        rootElement.style.width = this.numberToPixels(width);
        rootElement.style.height = this.numberToPixels(height);
    }

    private handleContainerVirtualVisibilityChangeRequiredEvent(container: ComponentContainer, visible: boolean) {
        const component = this._boundComponentMap.get(container);
        if (component === undefined) {
            throw new Error('handleContainerVisibilityChangeRequiredEvent: Component not found');
        }

        const componentRootElement = component.rootHtmlElement;
        if (componentRootElement === undefined) {
            throw new Error('handleContainerVisibilityChangeRequiredEvent: Component does not have a root HTML element');
        }

        if (visible) {
            componentRootElement.style.display = '';
        } else {
            componentRootElement.style.display = 'none';
        }
    }

    /** @internal */
    private handleContainerVirtualZIndexChangeRequiredEvent(container: ComponentContainer, logicalZIndex: LogicalZIndex, defaultZIndex: string) {
        const component = this._boundComponentMap.get(container);
        if (component === undefined) {
            throw new Error('handleContainerVirtualZIndexChangeRequiredEvent: Component not found');
        }

        const componentRootElement = component.rootHtmlElement;
        if (componentRootElement === undefined) {
            throw new Error('handleContainerVirtualZIndexChangeRequiredEvent: Component does not have a root HTML element');
        }

        componentRootElement.style.zIndex = defaultZIndex;
    }

    private numberToPixels(value: number): string {
        return value.toString(10) + 'px';
    }
}
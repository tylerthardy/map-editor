import { ComponentContainer, JsonValue } from 'golden-layout';
import { Container, interfaces } from 'inversify';
import { ProperApp } from './app.proper';
import { BrushComponent } from './ui/components/brush-component/brush-component';
import { BrushService } from './ui/components/brush-component/brush.service';

const myContainer = new Container();
myContainer.bind<ProperApp>(ProperApp).toSelf().inSingletonScope();
myContainer.bind<BrushService>(BrushService).toSelf().inSingletonScope();

myContainer.bind<BrushComponent>(BrushComponent).toSelf();
myContainer
  .bind<interfaces.Factory<BrushComponent>>('Factory<BrushComponent>')
  .toFactory((context: interfaces.Context) => {
    return (container: ComponentContainer, state: JsonValue | undefined, virtual: boolean) => {
      const component = new BrushComponent(context.container.get<BrushService>(BrushService));
      component.init(container, virtual);
      return component;
    };
  });

export { myContainer };

import { ComponentRef, Injectable } from '@angular/core';
import { GoldenLayoutComponent, IExtendedGoldenLayoutConfig } from 'ngx-golden-layout';
import { Observable, of } from 'rxjs';
import { INITIAL_LAYOUT } from './initial-layout';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  layout!: GoldenLayoutComponent;
  config$: Observable<IExtendedGoldenLayoutConfig> = of(INITIAL_LAYOUT);

  constructor() {}

  public addComponent(name: string): Promise<ComponentRef<any>> {
    return this.layout.createNewComponent({
      type: 'component',
      componentName: name,
      title: 'Dynamic ' + name,
      componentState: {
        aTestString: 'asdf'
      }
    });
  }
}

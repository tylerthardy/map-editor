import { NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentType, GoldenLayoutModule } from 'ngx-golden-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutService, TerrainService } from './common/services';
import { TerrainViewportComponent } from './terrain-viewport/terrain-viewport.component';
import { Terrain2dViewportComponent } from './terrain2d-viewport/terrain2d-viewport.component';

const components: Type<any>[] = [TerrainViewportComponent, Terrain2dViewportComponent];

const componentTypes: ComponentType[] = components.map((componentType: Type<any>): ComponentType => {
  return {
    name: componentType.name,
    type: componentType
  };
});

@NgModule({
  declarations: [AppComponent, TerrainViewportComponent, Terrain2dViewportComponent],
  imports: [BrowserModule, AppRoutingModule, GoldenLayoutModule.forRoot(componentTypes)],
  providers: [TerrainService, LayoutService],
  bootstrap: [AppComponent]
})
export class AppModule {}

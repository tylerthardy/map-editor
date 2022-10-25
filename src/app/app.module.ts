import { ErrorHandler, NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentType, GoldenLayoutModule } from 'ngx-golden-layout';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrushColorComponent } from './brush-color/brush-color.component';
import { BrushElevationComponent } from './brush-elevation/brush-elevation.component';
import { BrushTypeComponent } from './brush-type/brush-type.component';
import { BrushComponent } from './brush/brush.component';
import { LayoutService } from './common/services';
import { GlobalErrorHandler } from './global-error-handler';
import { TerrainViewportComponent } from './terrain-viewport/terrain-viewport.component';
import { Terrain2dViewportComponent } from './terrain2d-viewport/terrain2d-viewport.component';

const components: Type<any>[] = [TerrainViewportComponent, Terrain2dViewportComponent, BrushComponent];

const componentTypes: ComponentType[] = components.map((componentType: Type<any>): ComponentType => {
  return {
    name: componentType.name,
    type: componentType
  };
});

@NgModule({
  declarations: [
    AppComponent,
    TerrainViewportComponent,
    Terrain2dViewportComponent,
    BrushColorComponent,
    BrushElevationComponent,
    BrushComponent,
    BrushTypeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    GoldenLayoutModule.forRoot(componentTypes),
    ToastrModule.forRoot()
  ],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }, LayoutService],
  bootstrap: [AppComponent]
})
export class AppModule {}

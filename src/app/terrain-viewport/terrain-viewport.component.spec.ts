import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerrainViewportComponent } from './terrain-viewport.component';

describe('TerrainViewportComponent', () => {
  let component: TerrainViewportComponent;
  let fixture: ComponentFixture<TerrainViewportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerrainViewportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerrainViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

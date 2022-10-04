import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Terrain2dViewportComponent } from './terrain2d-viewport.component';

describe('Terrain2dViewportComponent', () => {
  let component: Terrain2dViewportComponent;
  let fixture: ComponentFixture<Terrain2dViewportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Terrain2dViewportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Terrain2dViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

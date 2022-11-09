import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushTypeComponent } from './brush-type.component';

describe(BrushTypeComponent.name, () => {
  let component: BrushTypeComponent;
  let fixture: ComponentFixture<BrushTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrushTypeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BrushTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

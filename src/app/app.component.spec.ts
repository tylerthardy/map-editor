import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GoldenLayoutModule } from 'ngx-golden-layout';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { INITIAL_LAYOUT, IpcRendererService, LayoutService } from './common/services';

describe(AppComponent.name, () => {
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, GoldenLayoutModule.forRoot([])],
      declarations: [AppComponent],
      providers: [
        {
          provide: IpcRendererService,
          useValue: {}
        },
        {
          provide: LayoutService,
          useValue: {
            config$: of(INITIAL_LAYOUT)
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app.layout).toBeTruthy();
    expect(app).toBeTruthy();
  });
});

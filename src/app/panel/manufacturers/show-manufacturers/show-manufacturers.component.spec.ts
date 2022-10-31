import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowManufacturersComponent } from './show-manufacturers.component';

describe('ShowManufacturersComponent', () => {
  let component: ShowManufacturersComponent;
  let fixture: ComponentFixture<ShowManufacturersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowManufacturersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowManufacturersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

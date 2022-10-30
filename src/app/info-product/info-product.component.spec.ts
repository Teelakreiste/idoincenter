import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoProductComponent } from './info-product.component';

describe('InfoProductComponent', () => {
  let component: InfoProductComponent;
  let fixture: ComponentFixture<InfoProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

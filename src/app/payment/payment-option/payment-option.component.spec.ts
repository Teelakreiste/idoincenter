import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOptionComponent } from './payment-option.component';

describe('PaymentOptionComponent', () => {
  let component: PaymentOptionComponent;
  let fixture: ComponentFixture<PaymentOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentOptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

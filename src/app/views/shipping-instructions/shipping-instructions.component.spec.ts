import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingInstructionsComponent } from './shipping-instructions.component';

describe('ShippingInstructionsComponent', () => {
  let component: ShippingInstructionsComponent;
  let fixture: ComponentFixture<ShippingInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingInstructionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

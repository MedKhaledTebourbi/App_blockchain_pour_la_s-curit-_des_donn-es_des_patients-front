import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartContratComponent } from './smart-contrat.component';

describe('SmartContratComponent', () => {
  let component: SmartContratComponent;
  let fixture: ComponentFixture<SmartContratComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SmartContratComponent]
    });
    fixture = TestBed.createComponent(SmartContratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

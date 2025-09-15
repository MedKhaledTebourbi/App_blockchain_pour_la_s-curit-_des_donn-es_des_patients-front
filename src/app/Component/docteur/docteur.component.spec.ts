import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocteurComponent } from './docteur.component';

describe('DocteurComponent', () => {
  let component: DocteurComponent;
  let fixture: ComponentFixture<DocteurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocteurComponent]
    });
    fixture = TestBed.createComponent(DocteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

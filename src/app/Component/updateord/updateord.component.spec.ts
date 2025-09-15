import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateordComponent } from './updateord.component';

describe('UpdateordComponent', () => {
  let component: UpdateordComponent;
  let fixture: ComponentFixture<UpdateordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateordComponent]
    });
    fixture = TestBed.createComponent(UpdateordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PbrComponent} from './pbr.component';

describe('PbrComponent', () => {
  let component: PbrComponent;
  let fixture: ComponentFixture<PbrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubassetEditComponent } from './subasset-edit.component';

describe('SubassetEditComponent', () => {
  let component: SubassetEditComponent;
  let fixture: ComponentFixture<SubassetEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubassetEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubassetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

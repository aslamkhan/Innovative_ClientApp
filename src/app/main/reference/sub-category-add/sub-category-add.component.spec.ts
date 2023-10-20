import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryAddComponent } from './sub-category-add.component';

describe('SubCategoryAddComponent', () => {
  let component: SubCategoryAddComponent;
  let fixture: ComponentFixture<SubCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategoryAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetConditionEditComponent } from './asset-condition-edit.component';

describe('AssetConditionEditComponent', () => {
  let component: AssetConditionEditComponent;
  let fixture: ComponentFixture<AssetConditionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetConditionEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetConditionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

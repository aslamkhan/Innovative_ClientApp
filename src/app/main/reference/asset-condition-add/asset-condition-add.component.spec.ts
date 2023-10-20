import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetConditionAddComponent } from './asset-condition-add.component';

describe('AssetConditionAddComponent', () => {
  let component: AssetConditionAddComponent;
  let fixture: ComponentFixture<AssetConditionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetConditionAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetConditionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

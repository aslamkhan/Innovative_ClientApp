import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetConditionComponent } from './asset-condition.component';

describe('AssetConditionComponent', () => {
  let component: AssetConditionComponent;
  let fixture: ComponentFixture<AssetConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetConditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetEditquantityComponent } from './asset-editquantity.component';

describe('AssetEditquantityComponent', () => {
  let component: AssetEditquantityComponent;
  let fixture: ComponentFixture<AssetEditquantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetEditquantityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetEditquantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

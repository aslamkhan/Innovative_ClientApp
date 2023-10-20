import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetBarcodeprintComponent } from './asset-barcodeprint.component';

describe('AssetBarcodeprintComponent', () => {
  let component: AssetBarcodeprintComponent;
  let fixture: ComponentFixture<AssetBarcodeprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetBarcodeprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetBarcodeprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

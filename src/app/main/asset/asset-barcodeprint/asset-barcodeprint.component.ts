import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-asset-barcodeprint',
  templateUrl: './asset-barcodeprint.component.html',
  styleUrls: ['./asset-barcodeprint.component.scss']
})
export class AssetBarcodeprintComponent implements OnInit {

  constructor() { }
  @Input() barcodeImage: any;

  ngOnInit(): void {
  }

}

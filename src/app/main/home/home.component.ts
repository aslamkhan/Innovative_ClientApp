import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { CoreConfigService } from '@core/services/config.service';
import { CoreTranslationService } from '@core/services/translation.service';

import { Role, User } from 'app/auth/models';
import { colors, Url } from 'app/colors.const';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HomeService } from './home.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {

  // public
  public data: any;
  public isMenuToggled = false;
  public currentUser: User;
  public isAdmin: boolean;
  public isClient: boolean;
  public contentHeader: object;
  public radioModel = 1;
  url = "";

  locationList: any = [];
  userCount: any = 0;
  passReturnDateCount: any = 0;
  missedInspectionDateCount: any = 0;
  outforMaintenanceCount: any = 0;
  missedMaintenanceDateCount: any = 0;
  noOfAssetsPastReturnDate: any = [0, 1, 2];
  assetRenatedMonths: any = [100, 200, 250];
  // Color Variables

  private tooltipShadow = 'rgba(0, 0, 0, 0.25)';
  private labelColor = '#6e6b7b';
  private grid_line_color = 'rgba(200, 200, 200, 0.2)';
  // Horizontal Bar Chart
  public horiBarChart = {
    chartType: 'horizontalBar',
    options: {
      elements: {
        rectangle: {
          borderWidth: 2,
          borderSkipped: 'right'
        }
      },
      tooltips: {
        // Updated default tooltip UI
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 8,
        shadowColor: this.tooltipShadow,
        backgroundColor: colors.solid.white,
        titleFontColor: colors.solid.black,
        bodyFontColor: colors.solid.black
      },
      responsive: true,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 500,
      animation: {
        onComplete: function () {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              var data = dataset.data[index];
              ctx.fillText(data, bar._model.x + 10, bar._model.y + 10);
            });
          });
        }
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              zeroLineColor: this.grid_line_color,
              borderColor: 'transparent',
              color: this.grid_line_color,
              drawTicks: false
            },
            scaleLabel: {
              display: true
            },
            ticks: {
              min: 0
            }
          }
        ],
        yAxes: [
          {
            display: true,
            barThickness: 35,
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true
            }
          }
        ]
      }
    },

    labels: ['>90 days', '31 to 60 days', '61 to 90 days ', '16 to 30 days', '1 to 15 days'],
    datasets: [
      {
        data: [],
        backgroundColor: "#82D7AD",
        borderColor: 'transparent',
        hoverBackgroundColor: "#82D7AD",
        hoverBorderColor: "#82D7AD",
        pointBackgroundColor: '#82D7AD',
        borderWidth: 10,
        radius: 5,
        pointRadius: 5,
        hoverBorderWidth: 5,
        pointHoverBackgroundColor: '#82D7AD',
      }
    ],

    legend: false
  };

  // lineArea Chart
  public lineAreaChart = {
    chartType: 'line',

    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
        labels: {
          fontColor: '#82D7AD'
        }
      },
      animation: {
        onComplete: function () {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.color = 'orange';
          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              var data = dataset.data[index];
              ctx.fillText(data, bar._model.x, bar._model.y - 5);
            });
          });
        }
      },
      layout: {
        padding: {
          top: -20,
          bottom: -20,
          left: -20
        }
      },
      tooltips: {
        // Updated default tooltip UI
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 8,
        shadowColor: this.tooltipShadow,
        backgroundColor: colors.solid.white,
        titleFontColor: colors.solid.black,
        bodyFontColor: colors.solid.black,

      },
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              zeroLineColor: this.grid_line_color
            },
            scaleLabel: {
              display: true
            },
            ticks: {
              fontColor: this.labelColor
            }
          }
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              color: 'transparent',
              zeroLineColor: this.grid_line_color
            },
            ticks: {
              stepSize: 50,
              min: 0,
              fontColor: this.labelColor
            },
            scaleLabel: {
              display: true
            }
          }
        ]
      }
    },
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        data: [],
        backgroundColor: '#82D7AD',
        borderColor: '#2bdf86',
        pointBackgroundColor: '#2bdf86',
        pointBorderColor: '#fff',
        pointHoverBorderWidth: 5,
        pointHoverBackgroundColor: '#82D7AD',
        pointHoverBorderColor: '#fff',
      },
    ]
  };
  topFiveAssetsRented: any = [];
  topFiveOutofStockItems: any = [];
  topFiveDamagedAssets: any = [];
  oldestPassReturnDateAssets: any = [];
  oldestMissedInspectionDateAssets: any = [];
  oldestMissedMaintenanceDateAssets: any = [];

  constructor(
    private modalService: NgbModal,
    private _coreConfigService: CoreConfigService,
    private _coreTranslationService: CoreTranslationService,
    private route: ActivatedRoute, private _http: HttpClient,
    private router: Router, private _homeService: HomeService) {
  }

  ngOnInit(): void {

    // get the currentUser details from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.route.paramMap
      .subscribe((params: any) => {
        this._http.get(Url + "api/Asset/GetAssetItem").subscribe((data: any) => {
          if (data.status) {
            this.locationList = data.result.departmentList;
            this.locationChangeEvent(data.result.departmentList[0].text);
          }
        })
      }
      );
  }
  modalOpenXs(modalxs, url) {
    this.url = url;
    this.modalService.open(modalxs, {
      centered: true,
      size: 'md'
    });
  }
  ngAfterViewInit() {
    // Subscribe to core config changes
    this._coreConfigService.getConfig().subscribe(config => {
      // If Menu Collapsed Changes
      if (
        (config.layout.menu.collapsed === true || config.layout.menu.collapsed === false) &&
        localStorage.getItem('currentUser')
      ) {
        setTimeout(() => {
          if (this.currentUser.role == Role.Admin) {
            // Get Dynamic Width for Charts
            this.isMenuToggled = true;
          }
        }, 500);
      }
    });
  }

  locationChangeEvent(location: string) {
    this.getDashboardCount(location);
    this.getAssetGraphData(location);
    this.getOldestFiveAssetDetails(location);
    this.getTopFiveAssetDetails(location);
  }
  getDashboardCount(location) {
    this._homeService.getUserAssetCount(location).subscribe((data: any) => {
      if (data.status) {
        var result = data.result;
        this.userCount = result.userCount;
        this.passReturnDateCount = result.passReturnDateCount;
        this.missedInspectionDateCount = result.missedInspectionDateCount;
        this.outforMaintenanceCount = result.outforMaintenanceCount;
        this.missedMaintenanceDateCount = result.missedMaintenanceDateCount;
      }
    });
  }

  getAssetGraphData(location) {
    this._homeService.getAssetGraphDetail(location).subscribe((data: any) => {
      if (data.status) {
        var result = data.result;
        this.horiBarChart.datasets[0].data = result.noOfAssetsPastReturnDate;
        this.lineAreaChart.datasets[0].data = result.assetRenatedMonths;
      }
    });
  }
  getOldestFiveAssetDetails(location) {
    this._homeService.OldestFiveAssetDetails(location).subscribe((data: any) => {
      if (data.status) {
        var result = data.result;
        this.oldestPassReturnDateAssets = result.oldestPassReturnDateAssets;
        this.oldestMissedInspectionDateAssets = result.oldestMissedInspectionDateAssets;
        this.oldestMissedMaintenanceDateAssets = result.oldestMissedMaintenanceDateAssets;
      }
    });

  }

  getTopFiveAssetDetails(location) {
    this._homeService.TopFiveAssetDetails(location).subscribe((data: any) => {
      if (data.status) {
        var result = data.result;
        this.topFiveAssetsRented = result.topFiveAssetsRented;
        this.topFiveOutofStockItems = result.topFiveOutofStockItems;
        this.topFiveDamagedAssets = result.topFiveDamagedAssets;
      }
    });

  }
}

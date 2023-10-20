import { InMemoryDbService } from 'angular-in-memory-web-api';

import { accountSettingsFakeData } from '@fake-db/account-settings.data';
import { UsersFakeData } from '@fake-db/users.data';
import { OrderDatatableFakeData } from '@fake-db/order-datatables.data';
import { AssetDatatableFakeData } from '@fake-db/asset-datatables.data';

import { DocumentDatatableFakeData } from '@fake-db/document-datatables.data';
import { ReservationsDatatableFakeData } from '@fake-db/reservation-datatables.data';
import { HistoryDatatableFakeData } from '@fake-db/history-datatables.data';
import { MaintenanceDatatableFakeData } from '@fake-db/maintenance-datatables.data';
import { LocationDatatableFakeData } from '@fake-db/location-datatables.data';
import { UserDatatableFakeData } from '@fake-db/user-datatables.data';
import { StockDatatableFakeData } from '@fake-db/stock-datatables.data';
import { AssetDetailDatatableFakeData } from '@fake-db/assetdetail-datatables.data';
import { VendorDatatableFakeData } from '@fake-db/vendor-datatables.data';
import { CategoryDatatableFakeData } from '@fake-db/category-datatables.data';
import { SubCategoryDatatableFakeData } from '@fake-db/sub-category-datatables.data';
import { AssetConditionDatatableFakeData } from '@fake-db/asset-condition-datatables.data';
import { StockHistoryDatatableFakeData } from '@fake-db/stock-history-datatables.data';
import { OrderDetailDatatableFakeData } from '@fake-db/order-detail-datatables.data';
import { CalendarFakeData } from '@fake-db/calendar.data';
export class FakeDbService implements InMemoryDbService {
  createDb(): any {
    return {
      // Data-table
      'order-datatable': OrderDatatableFakeData.rows,
      'asset-datatable': AssetDatatableFakeData.rows,
      'assetdetail-datatable': AssetDetailDatatableFakeData.rows,
      'document-datatable': DocumentDatatableFakeData.rows,
      'reservation-datatable': ReservationsDatatableFakeData.rows,
      'history-datatable': HistoryDatatableFakeData.rows,
      'maintenance-datatable': MaintenanceDatatableFakeData.rows,
      'location-datatable': LocationDatatableFakeData.rows,
      'user-datatable': UserDatatableFakeData.rows,
      'stock-datatable': StockDatatableFakeData.rows,
      // Account Settings
      'account-settings-data': accountSettingsFakeData.data,
      // Users
      'users-data': UsersFakeData.users,   
      'vendor-datatable': VendorDatatableFakeData.rows,  
      'category-datatable': CategoryDatatableFakeData.rows, 
      'sub-category-datatable': SubCategoryDatatableFakeData.rows, 
      'asset-condition-datatable': AssetConditionDatatableFakeData.rows, 
      'stock-history-datatable': StockHistoryDatatableFakeData.rows, 
      'order-detail-datatable': OrderDetailDatatableFakeData.rows,
      'calendar-events': CalendarFakeData.events,
      'calendar-filter': CalendarFakeData.calendar,
    };
  }
}

import { CoreMenu } from '@core/types';
export const menu: CoreMenu[] = [

  {
    id: 'site-dashboard',
    title: 'Dashboard',
    translate: 'Dashboard',
    type: 'item',
    icon: 'dashboard',
    url: 'home'
  },
  {
    // If role is not assigned will be display to all
    id: 'orders',
    title: 'Orders',
    translate: 'Orders',
    type: 'item',
    icon: 'order',
    url: 'order/list'
  },
  {
    id: 'assets',
    title: 'Assets',
    translate: 'Assets',
    type: 'collapsible',
    icon: 'asset',
    children: [
      {
        id: 'asset_list',
        title: 'Item Summary',
        translate: 'Item Summary',
        type: 'item',
        icon: '',
        url: 'asset/lists'
      },
      {
        id: 'documents',
        title: 'Documents',
        translate: 'Documents',
        type: 'item',
        icon: '',
        url: 'asset/documents'
      },
      {
        id: 'reservations',
        title: 'Reservations',
        translate: 'Reservations',
        type: 'item',
        icon: '',
        url: 'asset/reservations'
      },
      {
        id: 'reservation_history',
        title: 'Rental History',
        translate: 'Rental History',
        type: 'item',
        icon: '',
        url: 'asset/reservation-history'
      },
      {
        id: 'comments',
        title: 'Comments',
        translate: 'Comments',
        type: 'item',
        icon: '',
        url: 'asset/comments'
      },
      {
        id: 'maintenance',
        title: 'Maintenance',
        translate: 'Maintenance',
        type: 'item',
        icon: '',
        url: 'asset/maintenances'
      },
      {
        id: 'audit_history',
        title: 'Audit History',
        translate: 'Audit History',
        type: 'item',
        icon: '',
        url: 'asset/histories'
      }
    ]
  },
  {
    id: 'out_of_stock_log',
    title: 'Out of Stock Log',
    translate: 'Out of Stock Log',
    type: 'item',
    icon: 'stock',
    url: 'out_of_stock/logs'
  },
  {
    id: 'customer',
    title: 'Customers',
    translate: 'Customers',
    type: 'item',
    icon: 'customer',
    url: 'customer/list'
  },
  {
    id: 'users',
    title: 'Users',
    translate: 'Users',
    type: 'collapsible',
    icon: 'users',
    children: [
      {
        id: 'user_list',
        title: 'Users',
        translate: 'Users',
        type: 'item',
        icon: '',
        url: 'user/list'
      },
      {
        id: 'user_aduit_history',
        title: 'User Aduit History',
        translate: 'User Aduit History',
        type: 'item',
        icon: '',
        url: 'user/history'
      }
    ]
  },
  {
    id: 'locations',
    title: 'Locations',
    translate: 'Locations',
    type: 'item',
    icon: 'location',
    url: 'location/list'
  },
  {
    id: 'reports',
    title: 'Reports',
    translate: 'Reports',
    type: 'item',
    icon: 'file',
    url: 'reports'
  },
  {
    id: 'references',
    title: 'References',
    translate: 'References',
    type: 'collapsible',
    icon: 'setting',
    children: [
      {
        id: 'vendors',
        title: 'Vendors',
        translate: 'Vendors',
        type: 'item',
        icon: '',
        url: 'reference/vendors'
      },
      {
        id: 'categories',
        title: 'Categories',
        translate: 'Categories',
        type: 'item',
        icon: '',
        url: 'reference/categories'
      },
      {
        id: 'sub_categories',
        title: 'Sub Categories',
        translate: 'Sub Categories',
        type: 'item',
        icon: '',
        url: 'reference/sub_categories'
      },
      {
        id: 'asset_conditions',
        title: 'Asset Conditions',
        translate: 'Asset Conditions',
        type: 'item',
        icon: '',
        url: 'reference/asset_conditions'
      },
      {
        id: 'configuration',
        title: 'Configuration',
        translate: 'Configuration',
        type: 'item',
        icon: '',
        url: 'reference/configuration'
      },
      {
        id: 'color-list',
        title: 'Color',
        translate: 'Color',
        type: 'item',
        icon: '',
        url: 'reference/color/color-list'
      }
    ]
  },

];

/**
 * This file contains authentication parameters. Contents of this file
 * is roughly the same across other MSAL.js libraries. These parameters
 * are used to initialize Angular and MSAL Angular configurations in
 * in app.module.ts file.
 */

import {
  LogLevel,
  Configuration,
  BrowserCacheLocation,
} from '@azure/msal-browser';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

/**
 * Enter here the user flows and custom policies for your B2C application,
 * To learn more about user flows, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1_SignUpSingIn', //replace these names properly the way you created in azure portal
    editProfile: 'B2C_1_ProfileEdit',
    passwordReset: 'B2C_1_PasswordReset',
  },
  authorities: {
    signUpSignIn: {
      authority:
        'https://AssetsManager.b2clogin.com/AssetsManager.onmicrosoft.com/B2C_1_SignUpSingIn',
    },
    editProfile: {
      authority:
        'https://AssetsManager.b2clogin.com/AssetsManager.onmicrosoft.com/B2C_1_ProfileEdit',
    },
    passwordReset: {
      authority:
        'https://AssetsManager.b2clogin.com/AssetsManager.onmicrosoft.com/B2C_1_PasswordReset',
    }
  },
  authorityDomain: 'AssetsManager.b2clogin.com',//replace your domain name here
};

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: 'bd9c389b-32a6-43d5-a402-7102f09efb15', // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.signUpSignIn.authority, // Defaults to "https://login.microsoftonline.com/common"
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: '/', // Points to window.location.origin. You must register this URI on Azure portal/App Registration.
    //  postLogoutRedirectUri:'/',
    //  navigateToLoginRequestUrl:true
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) {
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false,
    },
  },
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
  todoListApi: {
    endpoint: 'https://localhost:44317',//'https://lsc-essential-products.azurewebsites.net', //this will change if you deploy to server, server address will go here
    scopes: [
      'https://AssetsManager.onmicrosoft.com/Auth/Delete',
      'https://AssetsManager.onmicrosoft.com/Auth/Write',
      'https://AssetsManager.onmicrosoft.com/Auth/Read',
    ],
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: ['email'],
};


//If you compare the new b2c branch and master branch, the code difference is what is requried for Azure B2C authentication changes for Angular.
//this code sample is in MSDN provided by Microsoft B2C team. the confirguration we did in Azure portal is important and placing the keys in app thats it!
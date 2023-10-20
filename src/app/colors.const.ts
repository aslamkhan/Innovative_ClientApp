import { environment } from "environments/environment";

export const colors = {
  solid: {
    primary: '#0B469D',
    secondary: '#E8E8E8',
    success: '#28C76F',
    info: '#00cfe8',
    warning: '#FF9F43',
    danger: '#EA5455',
    dark: '#4b4b4b',
    black: '#000',
    white: '#fff',
    body: '#f8f8f8'
  },
  light: {
    primary: '#0B469D1a',
    secondary: '#82868b1a',
    success: '#28C76F1a',
    info: '#00cfe81a',
    warning: '#FF9F431a',
    danger: '#EA54551a',
    dark: '#4b4b4b1a'
  }
};
// export const Url = "https://localhost:44317/"; //"https://api.assetmanagerbb.com/";  //
export const Url = environment.apiUrl;
export const locationEditUrl = Url + "api/Location/Update";
export const locationAddUrl = Url + "api/Location/Insert";
export const Available = "Available";
export const NotActive = "Not Active";
export const ActiveClass = "badge-success";
export const NotActiveClass = "badge-danger";
export const AssetEditUrl = Url + "api/Asset/EditAsset";
export const AssetAddUrl = Url + "api/Asset/AddAsset";
export const UploadAssetImages = Url + "api/Asset/UploadAssetImages";
export const UploadAssetDocument = Url + "api/Asset/UploadAssetDocument";

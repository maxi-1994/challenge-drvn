import { SweetAlertOptions } from "sweetalert2";

export const ERROR_PRODUCTS_LIST: string = 'An error occurred while loading the products list';
export const ERROR_PRODUCT_DETAILS: string = 'An error occurred while loading the product';
export const NO_PRODUCT_FOUND: string = 'No products found';
export const SUCCESS_PRODUCT_UPDATE: SweetAlertOptions = {
  position: 'top-end',
  icon: 'success',
  title: 'Product has been updated successfully',
  showConfirmButton: false,
  timer: 1500
};
export const ERROR_PRODUCT_UPDATE: SweetAlertOptions = {
  position: 'top-end',
  icon: 'error',
  title: 'An error occurred while updating the product',
  showConfirmButton: false,
  timer: 1500
};
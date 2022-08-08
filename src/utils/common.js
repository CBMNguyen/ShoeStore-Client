import { unwrapResult } from "@reduxjs/toolkit";
import { PRODUCT_TOAST_OPTIONS } from "constants/globals";
import { toast } from "react-toastify";

export function capitalizeFirstLetter(string = "") {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// get age

export function getAge(birthday) {
  // birthday is a date
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// convert image url to file object

export const toDataURL = (url) =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// Show Toast Success

export const showToastSuccess = async (asyncAction) => {
  const result = await asyncAction;
  if (!unwrapResult(result)) return;
  toast(result.payload.message, {
    ...PRODUCT_TOAST_OPTIONS,
  });
  return result.payload;
};

// Show Toast Error

export const showToastError = (error) => {
  toast(error.message, {
    ...PRODUCT_TOAST_OPTIONS,
  });
};

// Slidee Settings
export const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  autoplay: true,
  slidesToShow: 1,
  slidesToScroll: 1,
};

// handle total price order
export const total = (order) => {
  return order.reduce(
    (sum, product) =>
      sum +
      product.salePrice *
        product.selectedQuantity *
        ((100 - product.promotionPercent) / 100),
    0
  );
};

// handle logic checkout

export const checkout = (cloneOrder, order) => {
  return cloneOrder.map((item, i) => {
    let productDetail = item.productDetail.slice(); // clone product detail

    productDetail.forEach(({ color }, index) => {
      if (color.color === item.selectedColor) {
        // check if same color
        productDetail[index] = {
          ...productDetail[index],
          sizeAndQuantity: productDetail[index].sizeAndQuantity.map(
            ({ size, quantity }) => {
              if (size.size === item.selectedSize) {
                // check if same color and size
                return { size, quantity: quantity - item.selectedQuantity }; // update quantity
              } else {
                // orther color
                const quantityProductInCart = order // check item in cart find quantity of exist product
                  .slice(0, i)
                  .find(
                    ({ _id, selectedColor, selectedSize }) =>
                      _id === item._id &&
                      selectedColor === color.color &&
                      selectedSize === size.size
                  );
                const newQuantity =
                  quantityProductInCart?.selectedQuantity || 0; // if product does not exist => 0
                return { size, quantity: quantity - newQuantity };
              }
            }
          ),
        };
      } else {
        // check other case
        productDetail[index] = {
          ...productDetail[index],
          sizeAndQuantity: productDetail[index].sizeAndQuantity.map(
            ({ size, quantity }) => {
              const quantityProductInCart = order
                .slice(0, i)
                .find(
                  ({ _id, selectedColor, selectedSize }) =>
                    _id === item._id &&
                    selectedColor === color.color &&
                    selectedSize === size.size
                );

              const newQuantity = quantityProductInCart?.selectedQuantity || 0;
              return { size, quantity: quantity - newQuantity };
            }
          ),
        };
      }
    });

    let selectedQuantity = item.selectedQuantity;
    cloneOrder.slice(0, i).forEach((product) => {
      if (product._id === item._id) {
        selectedQuantity += product.selectedQuantity;
      }
    });

    return {
      ...item,
      productDetail,
      quantityStock: item.quantityStock - selectedQuantity,
    };
  });
};

// Order message

export const getMessageOrderByState = (state) => {
  switch (state) {
    case "pending":
      return "Cancel and Clear Checkout";
    case "processing":
      return "The order is being processed irrevocably";
    default:
      return "Order has been sent successfully";
  }
};

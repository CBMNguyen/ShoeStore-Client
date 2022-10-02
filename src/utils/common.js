import { unwrapResult } from "@reduxjs/toolkit";
import { logOut } from "app/userSlice";
import {
  LeftArrowDirection,
  RightArrowDirection,
} from "components/ArrowDirection";
import { PRODUCT_TOAST_OPTIONS } from "constants/globals";
import { toast } from "react-toastify";
import firebase from "firebase";

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

export const showToastSuccess = async (asyncAction, dispatch) => {
  try {
    const result = await asyncAction;
    if (!unwrapResult(result)) return;
    toast(result.payload.message, {
      ...PRODUCT_TOAST_OPTIONS,
    });
    return result.payload;
  } catch (error) {
    showToastError(error);
    dispatch && dispatch(logOut());
    firebase.auth().signOut();
  }
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
  prevArrow: <LeftArrowDirection />,
  nextArrow: <RightArrowDirection />,
};

// handle total price order
export const total = (order = []) => {
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
      _id: item._id,
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

// get star

export const getStarNumbers = (star, reviews) => {
  const starNumbers = [];
  Array.from(Array(5).keys()).forEach((key) => {
    const reviewItem = reviews.filter((review) => review.star === key + 1);
    starNumbers.push(reviewItem.length);
  });
  return starNumbers[star - 1];
};

// get average star
export const getAverageStar = (reviews) => {
  const starNumbers = Array.from(Array(5).keys()).map((key) =>
    getStarNumbers(key + 1, reviews)
  );

  let totalReviewNumber = 0;
  let totalStarNumber = 0;

  starNumbers.forEach((item, index) => {
    totalReviewNumber += item;
    totalStarNumber += item * (index + 1);
  });

  if (totalReviewNumber === 0) return 0;

  return totalStarNumber / totalReviewNumber;
};

export const getColorByState = (state) => {
  if (state === "pending") return "bg-info";
  if (state === "confirmed") return "bg-dark";
  if (state === "shipping") return "bg-warning";
  if (state === "delivered") return "bg-success";
  if (state === "cancelled") return "bg-danger";
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = `${date.getFullYear()}`;
  const hour = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);
  return `${day}/${month}/${year} - ${hour}:${minutes}:${seconds}`;
};

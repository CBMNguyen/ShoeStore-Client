import axiosClient from "./axiosClient";

const orderApi = {
  get: (id) => {
    const url = `/order/${id}`;
    return axiosClient.get(url);
  },

  create: (data) => {
    const url = `/order/`;
    return axiosClient.post(url, data);
  },

  update: (orderId, data) => {
    const url = `/order/${orderId}`;
    return axiosClient.patch(url, data);
  },

  delete: (orderId) => {
    const url = `/order/${orderId}`;
    return axiosClient.delete(url);
  },
};

export default orderApi;

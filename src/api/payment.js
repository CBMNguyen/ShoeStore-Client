import axiosClient from "./axiosClient";

const paymentApi = {
  post: (data) => {
    const url = "/payment";
    return axiosClient.post(url, data);
  },
};

export default paymentApi;

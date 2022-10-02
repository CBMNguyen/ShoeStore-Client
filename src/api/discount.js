import axiosClient from "./axiosClient";

const discountApi = {
  get: (id) => {
    const url = `/discount/${id}`;
    return axiosClient.get(url);
  },
  post: (data) => {
    const url = "/discount";
    return axiosClient.post(url, data);
  },
  patch: (id, data) => {
    const url = `/discount/${id}`;
    return axiosClient.patch(url, data);
  },
  remove: (id) => {
    const url = `/discount/${id}`;
    return axiosClient.delete(url);
  },
};

export default discountApi;

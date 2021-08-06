import axiosClient from "./axiosClient";

const cartApi = {
  get: (id) => {
    const url = `/cart/${id}`;
    return axiosClient.get(url);
  },
};

export default cartApi;

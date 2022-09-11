import axiosClient from "./axiosClient";

const reviewApi = {
  get: (id) => {
    const url = `/review/${id}`;
    return axiosClient.get(url);
  },
};

export default reviewApi;

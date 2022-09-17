import axiosClient from "./axiosClient";

const reviewApi = {
  get: (id) => {
    const url = `/review/${id}`;
    return axiosClient.get(url);
  },
  post: (data) => {
    const url = "/review";
    return axiosClient.post(url, data);
  },
  patch: (id, data) => {
    const url = `/review/${id}`;
    return axiosClient.patch(url, data);
  },
  remove: (id) => {
    const url = `/review/${id}`;
    return axiosClient.delete(url);
  },
};

export default reviewApi;

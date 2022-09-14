import axiosClient from "./axiosClient";

const addressApi = {
  get: (id) => {
    const url = `/address/${id}`;
    return axiosClient.get(url);
  },
  post: (data) => {
    const url = "/address";
    return axiosClient.post(url, data);
  },
  remove: (id) => {
    const url = `/address/${id}`;
    return axiosClient.delete(url);
  },
};

export default addressApi;

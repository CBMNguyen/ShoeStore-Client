import axiosClient from "./axiosClient";

const FavouriteApi = {
  get: (id) => {
    const url = `/favourite/${id}`;
    return axiosClient.get(url);
  },
  post: (data) => {
    const url = "/favourite";
    return axiosClient.post(url, data);
  },
  remove: (id) => {
    const url = `/favourite/${id}`;
    return axiosClient.delete(url);
  },
};

export default FavouriteApi;

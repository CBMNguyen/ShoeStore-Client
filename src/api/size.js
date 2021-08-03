import axiosClient from "./axiosClient";

const sizeApi = {
  getAll: (params) => {
    const url = "/size";
    return axiosClient.get(url, { params });
  },

  get: (id) => {
    const url = `/size/${id}`;
    return axiosClient.get(url);
  },
};

export default sizeApi;

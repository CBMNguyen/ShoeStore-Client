import axiosClient from "./axiosClient";

const colorApi = {
  getAll: (params) => {
    const url = "/color";
    return axiosClient.get(url, { params });
  },

  get: (id) => {
    const url = `/color/${id}`;
    return axiosClient.get(url);
  },
};

export default colorApi;

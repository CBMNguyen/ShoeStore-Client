import axiosClient from "./axiosClient";

const userApi = {
  get: (id) => {
    const url = `/user/${id}`;
    return axiosClient.get(url);
  },
};

export default userApi;

import axiosClient from "./axiosClient";

const feedbackApi = {
  get: (id) => {
    const url = `/feedback/${id}`;
    return axiosClient.get(url);
  },
};

export default feedbackApi;

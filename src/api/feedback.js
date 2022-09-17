import axiosClient from "./axiosClient";

const feedbackApi = {
  get: (id) => {
    const url = `/feedback/${id}`;
    return axiosClient.get(url);
  },
  getNestedFeedback: (id) => {
    const url = `/feedback/nested/${id}`;
    return axiosClient.get(url);
  },
  post: (data) => {
    const url = "/feedback";
    return axiosClient.post(url, data);
  },
  patch: (id, data) => {
    const url = `/feedback/${id}`;
    return axiosClient.patch(url, data);
  },
  remove: (id) => {
    const url = `/feedback/${id}`;
    return axiosClient.delete(url);
  },
};

export default feedbackApi;

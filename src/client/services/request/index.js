import axios from 'axios';

export const axiosInstance = axios.create({
  // Injected by Webpack at compile time
  baseURL: ROOT_URL // eslint-disable-line no-undef
});

function Request({ url, body }) {
  return axiosInstance.request({
    method: 'post',
    url,
    data: body,
    withCredentials: true
  });
}

export default Request;

import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.tuforums.com',
  timeout: 60000, // 增加到 60 秒
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText || error.message;
      throw new Error(`API Error: ${message}`);
    } else if (error.request) {
      // Request made but no response
      throw new Error('Network Error: No response from server');
    } else {
      throw new Error(`Request Error: ${error.message}`);
    }
  }
);

export default client;

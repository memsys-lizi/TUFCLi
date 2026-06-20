import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.tuforums.com',
  timeout: 30000,
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
      throw new Error(`API Error: ${error.response.data?.message || error.message}`);
    } else if (error.request) {
      // Request made but no response
      throw new Error('Network Error: No response from server');
    } else {
      throw new Error(`Request Error: ${error.message}`);
    }
  }
);

export default client;

import axios from 'axios';

// Set the base URLs depending on the environment
const apiBaseURL = 'http://localhost:8000';
const flaskApiURL = 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});

const flaskAxiosInstance = axios.create({
  baseURL: flaskApiURL,
  withCredentials: true,
});

// Function to fetch CSRF token
async function setCsrfToken() {
  try {
    const response = await axiosInstance.get('/csrf-token');
    const csrfToken = response.data.csrf_token;
    
    // Set the CSRF token as a default header for both Axios instances
    axiosInstance.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    
    flaskAxiosInstance.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    flaskAxiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
}

// Call the function to set the CSRF token
setCsrfToken();

export { axiosInstance, flaskAxiosInstance, setCsrfToken };

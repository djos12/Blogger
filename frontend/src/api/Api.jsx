import axios from 'axios';

const apiURL = 'http://localhost:3000';


// Fetch blogs by category
export const getBlogs = async (cat = 'all') => {
    try {
        const response = await axios.get(`${apiURL}/blog/${cat}`);
        console.log('Fetched blogs:', response.data); // Log the response to check data
        return response.data;
    } catch (error) {
        console.error('Error fetching blogs:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error to be handled by the caller
    }
};

// Create a new blog
export const createBlog = async (data) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post(`${apiURL}/blog`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating blog:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

// Fetch a blog by ID
export const getBlogbyid = async (id) => {
    try {
        const response = await axios.get(`${apiURL}/blogbyid/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching blog by ID:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

// Upload a file
export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${apiURL}/blogimage`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

// Delete a blog by ID
export const deleteBlog = async (id) => {
    const token = localStorage.getItem('authToken'); // Retrieve token from local storage
    try {
        const response = await axios.delete(`${apiURL}/blog/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Include token in headers
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting blog:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

// Update a blog by ID
// Update a blog by ID
export const updateBlog = async (id, data) => {
    const token = localStorage.getItem('authToken'); // Retrieve token from local storage
    try {
        const response = await axios.put(`${apiURL}/blog/${id}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`, // Include token in headers
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating blog:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

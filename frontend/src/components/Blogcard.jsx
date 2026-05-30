import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoApps } from "react-icons/io5";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { deleteBlog } from '../api/Api';

// Function to decode JWT token and get user ID
const getUserIdFromToken = (token) => {
    try {
        // Split the token into its parts
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }

        // Decode the payload part
        const payload = parts[1];
        const decodedPayload = atob(payload);

        // Parse the payload as JSON
        const jsonPayload = JSON.parse(decodedPayload);

        // Return the user ID from the payload (assumes 'userId' field exists)
        return jsonPayload.userId; // Adjust based on your token's payload structure
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

const Blogcard = ({ blogdata, onDelete }) => {
    const apiURL = 'http://localhost:3000/';
    const navigate = useNavigate();

    // Get the user ID from the token
    const token = localStorage.getItem('authToken');
    const userId = token ? getUserIdFromToken(token) : null;

    // Check if user is authenticated and if the user is the creator of the blog
    const isAuthenticated = !!token;
    const isOwner = userId === blogdata.userId; // Ensure blogdata contains userId

    // Function to handle delete action
    const handleDelete = async () => {
        try {
            await deleteBlog(blogdata.id);
            if (onDelete) {
                onDelete(blogdata.id); // Notify parent component to remove blog
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    // Function to handle edit action
    const handleEdit = () => {
        navigate(`/edit-blog/${blogdata.id}`);
    };

    return (
        <div className='bg-white shadow-md overflow-hidden rounded-xl relative'>
            <Link to={`/blog/${blogdata.id}`}>
                <div className="flex flex-col w-full">
                    <img style={{ height: '250px', objectFit: 'cover' }} src={`${apiURL}${blogdata.image}`} alt={blogdata.title} />
                    <div className="w-full h-[20px] bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${apiURL}${blogdata.image})` }}>
                    </div>
                    <div className='p-2'>
                        <h5 className='mt-1 text-left'>{blogdata.title}</h5>
                        <p className='flex justify-start items-center opacity-70'>
                            <IoApps />
                            <span className='text-sm text-left ml-2'>{blogdata.category}</span>
                        </p>
                    </div>
                </div>
            </Link>
            {/* Conditionally render Edit Icon */}
            {isAuthenticated && isOwner && (
                <AiFillEdit
                    onClick={handleEdit}
                    className="absolute top-2 right-10 text-blue-600 cursor-pointer"
                    size={24}
                    title="Edit Blog"
                />
            )}
            {/* Conditionally render Delete Icon */}
            {isAuthenticated && isOwner && (
                <AiFillDelete
                    onClick={handleDelete}
                    className="absolute top-2 right-2 text-red-600 cursor-pointer"
                    size={24}
                    title="Delete Blog"
                />
            )}
        </div>
    );
}

export default Blogcard;

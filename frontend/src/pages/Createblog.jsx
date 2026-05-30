import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadFile, createBlog } from '../api/Api';

const Createblog = () => {
    const blankBlog = {
        title: "",
        image: "",
        post: "<p><br></p>",
        category: ""
    };

    const [newblog, setNewblog] = useState(blankBlog);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleUpload = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;

            const uploadedFile = await uploadFile(file);
            if (uploadedFile.path) {
                setNewblog({ ...newblog, image: uploadedFile.path });
            }
        } catch (err) {
            console.error('File upload error:', err);
            setError('Failed to upload image.');
        }
    };

    const handleSubmit = async () => {
        try {
            const createdBlog = await createBlog(newblog);
    
            // Example success check based on typical API response
            if (createdBlog.message === "Added new blog") { // Adjust this line
                setNewblog(blankBlog);
                alert("Blog added successfully!");
            } else {
                alert("Failed to add blog: " + createdBlog.message);
            }
        } catch (error) {
            console.error('Error creating blog:', error);
            alert("Error creating blog: " + (error.response?.data?.message || error.message));
        }
    };
    
    
    const menu = [
        { text: 'Nature', path: '/' },
        { text: 'Travel', path: '/' },
        { text: 'Technology', path: '/' },
        { text: 'Politics', path: '/' },
    ];

    return (
        <div className='flex w-full items-center justify-center'>
            <div className="bg-slate-200 w-[60%] p-5 rounded-xl">
                <h1 className='text-2xl mb-5'>Create Blog Post</h1>
                <div className="flex flex-col">
                    {success && <p className='text-green-500'>{success}</p>}
                    {error && <p className='text-red-500'>{error}</p>}
                    
                    <label htmlFor="" className='ml-1 text-gray-500'>Title</label>
                    <input
                        type="text"
                        value={newblog.title}
                        onChange={(e) => setNewblog({ ...newblog, title: e.target.value })}
                        className='h-10 border border-gray-300 rounded my-2 p-2'
                    />
                    
                    <label htmlFor="" className='ml-1 text-gray-500'>Category</label>
                    <select
                        value={newblog.category}
                        onChange={(e) => setNewblog({ ...newblog, category: e.target.value })}
                        name=""
                        id=""
                        className='h-10 border border-gray-300 rounded my-2 p-2'
                    >
                        <option value="" disabled>Select Category</option>
                        {menu.map((x, i) => (
                            <option key={i} value={x.text}>{x.text}</option>
                        ))}
                    </select>
                    
                    <label htmlFor="" className='ml-1 text-gray-500'>Image</label>
                    <input
                        onChange={handleUpload}
                        type="file"
                        className='border-gray-300 rounded my-2 p-2'
                    />
                    
                    <label htmlFor="" className='ml-1 text-gray-500'>Post</label>
                    <ReactQuill
                        className='bg-white rounded mb-2 mt-2 editingarea'
                        theme="snow"
                        value={newblog.post}
                        onChange={(e) => setNewblog({ ...newblog, post: e })}
                    />

                    <hr />
                    <button
                        onClick={handleSubmit}
                        className='bg-slate-500 text-white h-8 w-[100px] mt-2 rounded'
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Createblog;

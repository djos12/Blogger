import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadFile, getBlogbyid, updateBlog } from '../api/Api';

const EditBlog = () => {
    const { id } = useParams(); // Get blog ID from URL
    const navigate = useNavigate(); // Hook for programmatic navigation

    const blankBlog = {
        title: "",
        image: "",
        post: "<p><br></p>",
        category: ""
    };

    const [blog, setBlog] = useState(blankBlog);

    useEffect(() => {
        // Fetch the blog data when the component mounts
        const fetchBlog = async () => {
            try {
                const fetchedBlog = await getBlogbyid(id);
                if (fetchedBlog && fetchedBlog.data && fetchedBlog.data.length > 0) {
                    setBlog(fetchedBlog.data[0]); // Set the fetched blog data
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
        };
        fetchBlog();
    }, [id]);

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const uploadedFile = await uploadFile(file);
                if (uploadedFile.path) {
                    setBlog({ ...blog, image: uploadedFile.path });
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            await updateBlog(id, blog);
            navigate('/'); // Redirect to home or any other page after successful update
        } catch (error) {
            console.error('Error updating blog:', error);
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
                <h1 className='text-2xl mb-5'>Edit Blog Post</h1>
                <div className="flex flex-col">
                    <label htmlFor="" className='ml-1 text-gray-500'>Title</label>
                    <input
                        type="text"
                        value={blog.title}
                        onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                        className='h-10 border border-gray-300 rounded my-2 p-2'
                    />
                    <label htmlFor="" className='ml-1 text-gray-500'>Category</label>
                    <select
                        value={blog.category}
                        onChange={(e) => setBlog({ ...blog, category: e.target.value })}
                        className='h-10 border border-gray-300 rounded my-2 p-2'
                    >
                        <option value="" default disabled>Select Category</option>
                        {menu.map(x => (
                            <option key={x.text} value={x.text}>{x.text}</option>
                        ))}
                    </select>
                    <label htmlFor="" className='ml-1 text-gray-500'>Image</label>
                    {blog.image && (
                        <div className='mb-2'>
                            <img src={`http://localhost:3000/${blog.image}`} alt="Current" style={{ width: '200px', height: 'auto' }} />
                        </div>
                    )}
                    <input
                        onChange={(e) => handleUpload(e)}
                        type="file"
                        className='border-gray-300 rounded my-2 p-2'
                    />
                    <label htmlFor="" className='ml-1 text-gray-500'>Post</label>
                    <ReactQuill
                        className='bg-white rounded mb-2 mt-2'
                        theme="snow"
                        value={blog.post}
                        onChange={(value) => setBlog({ ...blog, post: value })}
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

export default EditBlog;

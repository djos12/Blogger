import React, { useEffect, useState } from 'react';
import Blogcard from '../components/Blogcard';
import { getBlogs } from '../api/Api';
import { useSearchParams } from 'react-router-dom';

const Home = () => {
    const [searchParams] = useSearchParams(); // Get search parameters
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const category = searchParams.get('category') || 'all'; // Default to 'all'
                const response = await getBlogs(category);
                console.log('Blogs data:', response); // Debug response structure
                setBlogs(response.data || []); // Adjust based on the actual structure
            } catch (err) {
                setError('Failed to load blogs.');
                console.error('Fetch error:', err); // Log full error
            } finally {
                setLoading(false); // Set loading to false after fetch
            }
        };

        fetchData();
    }, [searchParams]); // Re-fetch when searchParams change

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                {blogs.length > 0 ? (
                    blogs.map((blog, i) => (
                        <Blogcard key={i} blogdata={blog} />
                    ))
                ) : (
                    <p>No blogs available.</p>
                )}
            </div>
        </div>
    );
};

export default Home;

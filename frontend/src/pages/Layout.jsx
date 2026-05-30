import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const Layout = () => {
    const isAuthenticated = !!localStorage.getItem('authToken');
    const navigate = useNavigate(); // For navigation

    const menu = [
        { text: 'Nature', path: '/?category=Nature' },
        { text: 'Travel', path: '/?category=Travel' },
        { text: 'Technology', path: '/?category=Technology' },
        { text: 'Politics', path: '/?category=Politics' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Clear the token
        navigate('/login'); // Redirect to login page
    };

    return (
        <div>
            <div className="border-b">
                <div className="px-5 py-5 flex justify-between items-center">
                    <Link to='/'>
                        <span className='font-extrabold text-2xl'>BLOGGER</span>
                    </Link>
                    <div className='flex items-center'>
                        <ul className='flex space-x-4'>
                            {isAuthenticated && menu.map((x, i) => (
                                <li key={i}>
                                    <Link className='p-2 hover:bg-slate-200 rounded' to={x.path}>
                                        <span>{x.text}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {isAuthenticated && (
                            <>
                                <button className='bg-slate-500 text-white px-4 py-2 rounded ml-4 hover:bg-slate-600'>
                                    <Link to='/create'>+ New Post</Link>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className='bg-red-500 text-white px-4 py-2 rounded ml-4 hover:bg-red-600'
                                >
                                    Logout
                                </button>
                            </>
                        )}
                        {!isAuthenticated && (
                            <div className='ml-4'>
                                <Link to='/register'>
                                    <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                                        Register
                                    </button>
                                </Link>
                                <Link to='/login' className='ml-2'>
                                    <button className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'>
                                        Login
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex mx-auto px-5 md:px-20">
                <div className="mt-5 mb-5 min-h-[500px] w-full">
                    <Outlet />
                </div>
            </div>

            <div className="flex bg-slate-800">
                <div className="flex mx-auto px-20 py-20 items-center justify-center">
                    <h3 className='text-gray-400'>BLOGGER</h3>
                </div>
            </div>
        </div>
    );
}

export default Layout;

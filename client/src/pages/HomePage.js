import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import apiService from '../services/apiService';
import PostListItem from "../components/PostListItem";
import './HomePage.css';

const HomePage = () => {
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await apiService.get(`/posts?page=${currentPage}&limit=10`);
                const { posts: fetchPosts, totalPages: fetchTotalPages } = response.data;
                setPosts(fetchPosts);
                setTotalPages(fetchTotalPages);
            } catch (err) {
                console.error("Failed to fetch posts:", err);
                setError("Failed to load posts. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage]);

    const handleNextPage = () => {
        if(currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1)
        }
    };

    if (loading) {
        return <div>Loading post...</div>
    }
    if (error){
        return <div style={{color: 'red'}}>{error}</div>;
    }

    return (
        <div className="home-page">
            <Helmet>
                <title>My Awsome Blog - Latest Posts</title>
                <meta 
                    name="description"
                    content="Welcome to My Awsome Blog. Read the latest articles on web development, technology, and more."
                />
            </Helmet>
            <h1>Latest Post</h1>
            <div className="post-list">
                {posts.length > 0 ? (
                    posts.map(post => <PostListItem key={post._id} post={post}/>)
                ) : (
                    <p>No Post to display.</p>
                )}
            </div>
            {totalPages > 0 && (
                <div className="pagination-controls">
                    <div className="page-info">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="pagination-buttons">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="btn"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="btn"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
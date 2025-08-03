import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import apiService from '../services/apiService'
import PostListItem from "../components/PostListItem";
import './HomePage.css'

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPostByCategory = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await apiService.get(`/posts/category/${categoryName}`);
                setPosts(response.data);
            } catch (err) {
                console.error(`Failed to fetch posts for category ${categoryName}:`, err);
                setError('Could not load posts for this category. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPostByCategory();
    }, [categoryName]);

    if (loading) {
        return <div className="loading-message">Loading posts...</div>;
    }
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="home-page">
            <Helmet>
                <title>{`Post in "${categoryName}" | My Awsome Blog`}</title>
                <meta name="description" content={`Browse all posts categorized under "${categoryName}" on My Awsome Blog`}/>
            </Helmet>
            <h1>Posts in: "{categoryName}"</h1>
            <div className="post-list">
                {posts.length > 0 ? (
                    posts.map(post => <PostListItem key={post._id} post={post}/>)
                ) : (
                    <p>No post found in this category.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
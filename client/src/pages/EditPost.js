import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../services/apiService";
import './CreatePost.css'

const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [markdownContent, setMarkdownContent] = useState('');
    const [categories, setCatagories] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSbumitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await apiService.get(`/posts/${id}`);
                setTitle(response.data.title);
                setMarkdownContent(response.data.markdownContent);

                if (response.data.categories && Array.isArray(response.data.categories)) {
                    setCatagories(response.data.categories.join(', '));
                }

            } catch (err) {
                console.error('Failed to fetch post for editing:', err);
                setError('Failed to load post data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSbumitting(true);
        setError('');

        if (!title.trim() || !markdownContent.trim()) {
            setError('Title and content are required.')
            setSbumitting(false);
            return;
        }

        const categoriesArray = categories.split(',').map(cat => cat.trim()).filter(cat => cat);

        try {
            await apiService.put(`/posts/${id}`, {
                title,
                markdownContent,
                categories: categoriesArray
            });

            navigate('/admin/dashboard');   
        } catch (err) {
            console.error('Failed to update post:', err);
            setError(err.response?.data?.message || 'Failed to update post please try again.');
            setSbumitting(false);
        }
    };

    if(loading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem'}}>Loading post...</div>;
    }

    return (
        <div className="create-post-page">
            <h2>Edit Post</h2>
            <form onSubmit={handleSubmit} className="create-post-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title" 
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={submitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="markdownContent">Content (Markdown)</label>
                    <textarea
                        id="markdownContent" 
                        className="form-control markdown-input"
                        value={markdownContent}
                        onChange={(e) => setMarkdownContent(e.target.value)}
                        disabled={submitting}
                    />
                </div>
                <div>
                    <label htmlFor="categories">Categories (comma-seperated)</label>
                    <input 
                        type="text"
                        id="categories"
                        className="form-control"
                        value={categories}
                        onChange={(e) => setCatagories(e.target.value)}
                        placeholder="e.g., React, Web Development, Tutorial"
                        disabled={submitting}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Update Post'}
                </button>
            </form>
        </div>
    );
};

export default EditPost;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from 'react-markdown';
import '../markdown-styles.css';
import CategoryTag from "../components/CategoryTag";

const PostPage = () => {
    const { slug } = useParams(); //changed id to slug
    
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`http://localhost:5000/api/posts/slug/${slug}`);
                setPost(response.data);
            } 
            catch (err) {
                console.error("Error fetching post:", err);
                if (err.response && err.response.status === 404){
                    setError('Post not found.');
                } 
                else {
                    setError('Failed to load the post. Please try again later.');
                }    
            }
            finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]); // Changed ID to slug

    const createMetaDescription = (markdown) => {
        if(!markdown) return '';
        const plainText = markdown
            .replace(/!\[.*?\]\(.*?\)/g, '') //Remove images
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') //Keep link text
            .replace(/[`*#_~`]/g, '') //Remove markdown characters
            .replace(/\s+/g, ' ')
        
            return plainText.substring(0, 155).trim() + '...';
    };

    if(loading){
        return <div>Loading post...</div>;
    }
    if (error){
        return <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem'}}>Error: {error}</div>;
    }
    if (!post){
        return <div>Post not found.</div>;
    }

    const categoriesContainerStyle = {
        marginTop: '1rem',
        marginBottom: '1rem',
        borderBottom: '1px solid #eee',
        paddingBottom: '1rem',
    };

    return (
        <article className="post-full">
            <Helmet>
                <title>{`${post.title} | My Awsome Blog`}</title>
                <meta 
                    name="description"
                    content={createMetaDescription(post.markdownContent)}
                />
            </Helmet>
            <h1>{post.title}</h1>
            {/* <div className="post-full-meta">
                <span>by {post.author}</span>
                <span>Published on {new Date(post.createdAt).toLocaleDateString()}</span>
            </div> */}
            <p className="post-full-meta">By {post.author} on {new Date(post.createdAt).toLocaleDateString()}</p>
            {post.categories && post.categories.length > 0 && (
                <div style={categoriesContainerStyle}>
                    {post.categories.map(category => (
                        <CategoryTag key={category} category={category}/>
                    ))}
                </div>
            )}
            <div className="post-full-content">
                <ReactMarkdown>{post.markdownContent}</ReactMarkdown>
            </div>
        </article>
    );
};

export default PostPage;
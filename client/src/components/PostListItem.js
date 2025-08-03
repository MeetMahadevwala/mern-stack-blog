import React from "react";
import { Link } from 'react-router-dom'
import CategoryTag from "./CategoryTag";

const categoriesContainerStyle = {
    marginTop: '10px',
};

const PostListItem = ({ post }) => {
    // const snippet = post.markdownContent
    // .replace(/[#*`]/g, '')
    // .substring(0, 150) + '...'

    // return (
    //         <article className="post-list-item">
    //             <h2>
    //                 <Link to={`/post/${post.slug}`} className="post-link">{post.title}</Link>
    //             </h2>
    //             {/* <div className="post-meta">
    //                 <span>by {post.author}</span>
    //                 <span>{new Date(post.createdAt).toLocaleDateString()}</span>
    //             </div> */}
    //             <p className="post-snippet">{snippet}</p>
    //         </article>
    // );
    return (
        <div className="post-list-item">
            <h2>
                <Link to={`/post/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="post-meta">
                By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
            </p>
            {post.categories && post.categories.length > 0 && (
                <div style={categoriesContainerStyle}>
                    {post.categories.map(category => (
                        <CategoryTag key = {category} category={category} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostListItem;
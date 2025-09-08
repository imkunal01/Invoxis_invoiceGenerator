import React, { useState, useEffect } from 'react';
import './BlogSection.css';

/**
 * BlogSection component that displays developer and business trend articles
 */
const BlogSection = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading blog articles from an API
    const loadArticles = () => {
      setIsLoading(true);
      
      // Sample blog data (in a real app, this would come from an API)
      const sampleArticles = [
        {
          id: 1,
          title: 'The Future of Invoicing in 2025',
          excerpt: 'Discover how AI and automation are transforming the invoicing process for businesses of all sizes.',
          author: 'Jane Smith',
          date: 'May 15, 2025',
          category: 'Business Trends',
          // Using gradient background instead of external image
          imageColor: 'linear-gradient(135deg, #4361ee, #4cc9f0)'
        },
        {
          id: 2,
          title: 'React 20: What Developers Need to Know',
          excerpt: 'The latest major update to React brings significant performance improvements and new features.',
          author: 'John Developer',
          date: 'April 28, 2025',
          category: 'Development',
          imageColor: 'linear-gradient(135deg, #3a86ff, #4895ef)'
        },
        {
          id: 3,
          title: 'Small Business Financial Management Tips',
          excerpt: 'Effective strategies for managing cash flow and financial planning for small businesses.',
          author: 'Sarah Finance',
          date: 'April 10, 2025',
          category: 'Business Trends',
          imageColor: 'linear-gradient(135deg, #48bfe3, #56cff3)'
        },
        {
          id: 4,
          title: 'Modern UI Design Principles for Web Applications',
          excerpt: 'Learn the latest design trends and principles for creating engaging user interfaces.',
          author: 'Alex Designer',
          date: 'March 22, 2025',
          category: 'Development',
          imageColor: 'linear-gradient(135deg, #4361ee, #3a86ff)'
        }
      ];
      
      setTimeout(() => {
        setArticles(sampleArticles);
        setIsLoading(false);
      }, 800); // Simulate network delay
    };
    
    loadArticles();
  }, []);

  return (
    <section className="blog-section">
      <div className="blog-header">
        <h2>Latest Articles</h2>
        <p>Stay updated with the latest trends in business and development</p>
      </div>
      
      {isLoading ? (
        <div className="blog-loading">
          <div className="loading-spinner"></div>
          <p>Loading articles...</p>
        </div>
      ) : (
        <div className="blog-grid">
          {articles.map(article => (
            <article key={article.id} className="blog-card">
              <div 
                className="blog-image"
                style={{ background: article.imageColor }}
              >
                <div className="blog-image-icon">
                  {article.category === 'Development' ? '💻' : '📊'}
                </div>
                <span className="blog-category">{article.category}</span>
              </div>
              <div className="blog-content">
                <h3>{article.title}</h3>
                <p className="blog-excerpt">{article.excerpt}</p>
                <div className="blog-meta">
                  <span className="blog-author">{article.author}</span>
                  <span className="blog-date">{article.date}</span>
                </div>
                <button className="blog-read-more">Read More</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogSection;
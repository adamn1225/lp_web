import React, { useEffect, useState } from 'react';

interface Post {
  id: string;
  content: string;
}

interface ConversationPostsProps {
  conversationId: string;
}

const ConversationPosts: React.FC<ConversationPostsProps> = ({ conversationId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`https://open-api.guesty.com/v1/communication/conversations/${conversationId}/posts`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          }
        });

        if (!response.ok) {
          console.error('Error fetching posts:', response.status, response.statusText);
          setError(`Failed to fetch posts: ${response.status} ${response.statusText}`);
          return;
        }

        const text = await response.text();

        try {
          const data = JSON.parse(text);
          setPosts(data);
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
          console.error('Response text:', text);
          if (text.startsWith('<!DOCTYPE')) {
            setError('Server returned an HTML error page');
          } else {
            setError('Failed to parse response');
          }
        }
      } catch (fetchError) {
        console.error('Error fetching posts:', fetchError);
        setError('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, [conversationId]);

  if (error) {
    return <div className='border border-slate-800 p-3 h-full w-full'>Error: {error}</div>;
  }

  return (
    <div className='border border-slate-800 p-3 h-full w-full'>
      {posts.map(post => (
        <div key={post.id}>{post.content}</div>
      ))}
    </div>
  );
};

export default ConversationPosts;
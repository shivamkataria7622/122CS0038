import axios from 'axios';

const API_BASE = 'http://20.244.56.144/evaluation-service';

// Cache system to minimize API calls
const cache = {
  users: null,
  posts: {},
  comments: {}
};

export const fetchUsers = async () => {
  if (!cache.users) {
    try {
      const response = await axios.get(`${API_BASE}/users`);
      cache.users = response.data.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return {};
    }
  }
  return cache.users;
};

export const fetchUserPosts = async (userId) => {
  if (!cache.posts[userId]) {
    try {
      const response = await axios.get(`${API_BASE}/users/${userId}/posts`);
      cache.posts[userId] = response.data.posts || [];
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      return [];
    }
  }
  return cache.posts[userId];
};

export const fetchPostComments = async (postId) => {
  if (!cache.comments[postId]) {
    try {
      const response = await axios.get(`${API_BASE}/posts/${postId}/comments`);
      cache.comments[postId] = response.data.comments || [];
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      return [];
    }
  }
  return cache.comments[postId];
};

// Get all data in optimized way
export const fetchAllData = async () => {
  const users = await fetchUsers();
  const usersWithPosts = await Promise.all(
    Object.entries(users).map(async ([id, name]) => {
      const posts = await fetchUserPosts(id);
      const postsWithComments = await Promise.all(
        posts.map(async post => {
          const comments = await fetchPostComments(post.id);
          return {
            ...post,
            commentCount: comments.length
          };
        })
      );
      return {
        id,
        name,
        posts: postsWithComments,
        totalComments: postsWithComments.reduce((sum, post) => sum + post.commentCount, 0)
      };
    })
  );
  return usersWithPosts;
};
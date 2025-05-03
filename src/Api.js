import axios from 'axios'

const API_BASE_URL = 'http://20.244.56.144/evaluation-service'


export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`)
    return response.data.users
  } catch (error) {
    console.error('Error fetching users:', error)
    return {}
  }
}

export const fetchUserPosts = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/posts`)
    return response.data.posts || []
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error)
    return []
  }
}

export const fetchPostComments = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${postId}/comments`)
    return response.data.comments || []
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error)
    return []
  }
}

// Cache for storing already fetched data to minimize API calls
const cache = {
  users: null,
  userPosts: {},
  postComments: {}
}

export const getUsersWithCache = async () => {
  if (!cache.users) {
    cache.users = await fetchUsers()
  }
  return cache.users
}

export const getUserPostsWithCache = async (userId) => {
  if (!cache.userPosts[userId]) {
    cache.userPosts[userId] = await fetchUserPosts(userId)
  }
  return cache.userPosts[userId]
}

export const getPostCommentsWithCache = async (postId) => {
  if (!cache.postComments[postId]) {
    cache.postComments[postId] = await fetchPostComments(postId)
  }
  return cache.postComments[postId]
} 
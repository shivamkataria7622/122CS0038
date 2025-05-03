import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Grid, Avatar, CircularProgress, Box, Chip } from '@mui/material'
import { getUsersWithCache, getUserPostsWithCache, getPostCommentsWithCache } from '../Api.js'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsersWithCache()
        let allPosts = []
        
        // Fetch all posts from all users
        for (const [userId, userName] of Object.entries(users)) {
          const userPosts = await getUserPostsWithCache(userId)
          const postsWithComments = await Promise.all(
            userPosts.map(async (post) => {
              const comments = await getPostCommentsWithCache(post.id)
              return {
                ...post,
                userName,
                userId,
                commentCount: comments.length,
                timestamp: Date.now() - Math.floor(Math.random() * 1000000) // Simulate different timestamps
              }
            })
          )
          allPosts = [...allPosts, ...postsWithComments]
        }

        // Sort by timestamp (newest first)
        allPosts.sort((a, b) => b.timestamp - a.timestamp)
        setPosts(allPosts)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching feed:', error)
        setLoading(false)
      }
    }

    fetchData()

    // Refresh data every 10 seconds for real-time updates
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Real-time Feed
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Newest posts appear at the top
      </Typography>
      <Grid container spacing={3} mt={2}>
        {posts.map((post, index) => (
          <Grid item xs={12} key={post.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    alt={post.userName}
                    src={`https://i.pravatar.cc/150?img=${index + 20}`}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Typography variant="subtitle1">{post.userName}</Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {post.content}
                </Typography>
                <Box mt={2}>
                  <Chip
                    label={`${post.commentCount} comments`}
                    color="primary"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default Feed
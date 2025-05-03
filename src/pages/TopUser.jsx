import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Grid, Avatar, CircularProgress, Box } from '@mui/material'
import { getUsersWithCache, getUserPostsWithCache, getPostCommentsWithCache } from '../Api'

const TopUser = () => {
  const [topUsers, setTopUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsersWithCache()
        const usersWithStats = await Promise.all(
          Object.entries(users).map(async ([userId, userName]) => {
            const posts = await getUserPostsWithCache(userId)
            const commentCounts = await Promise.all(
              posts.map(async (post) => {
                const comments = await getPostCommentsWithCache(post.id)
                return comments.length
              })
            )
            const totalComments = commentCounts.reduce((sum, count) => sum + count, 0)
            return { userId, userName, totalComments, postCount: posts.length }
          })
        )

        // Sort by total comments in descending order
        const sortedUsers = usersWithStats.sort((a, b) => b.totalComments - a.totalComments)
        setTopUsers(sortedUsers.slice(0, 5))
        setLoading(false)
      } catch (error) {
        console.error('Error fetching top users:', error)
        setLoading(false)
      }
    }

    fetchData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)
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
        Top Users by Comments
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Users with the most commented posts
      </Typography>
      <Grid container spacing={3} mt={2}>
        {topUsers.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={user.userId}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    alt={user.userName}
                    src={`https://i.pravatar.cc/150?img=${index + 1}`}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Typography variant="h6">{user.userName}</Typography>
                </Box>
                <Typography color="text.secondary">
                  Total Posts: {user.postCount}
                </Typography>
                <Typography color="text.secondary">
                  Total Comments: {user.totalComments}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default TopUser
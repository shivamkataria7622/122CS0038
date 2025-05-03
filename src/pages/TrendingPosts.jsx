import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Avatar, CircularProgress, Box, Chip } from "@mui/material";
import { getUsersWithCache, getUserPostsWithCache, getPostCommentsWithCache } from "../Api";

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxComments, setMaxComments] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsersWithCache();
        let allPosts = [];
        
        for (const [userId, userName] of Object.entries(users)) {
          const posts = await getUserPostsWithCache(userId);
          for (const post of posts) {
            const comments = await getPostCommentsWithCache(post.id);
            allPosts.push({
              ...post,
              userName,
              userId,
              commentCount: comments.length
            });
          }
        }

        const max = Math.max(...allPosts.map(post => post.commentCount));
        setMaxComments(max);
        const trending = allPosts.filter(post => post.commentCount === max);
        setTrendingPosts(trending);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Trending Posts
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Posts with the most comments ({maxComments} comments)
      </Typography>
      <Grid container spacing={3} mt={2}>
        {trendingPosts.map((post, index) => (
          <Grid item xs={12} key={post.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    alt={post.userName}
                    src={`https://i.pravatar.cc/150?img=${index + 10}`}
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
  );
};

export default TrendingPosts;
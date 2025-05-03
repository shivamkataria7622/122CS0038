import { CssBaseline, Container, AppBar, Toolbar, Typography } from '@mui/material'
import { Routes, Route, Link } from 'react-router-dom'
import TopUser from './pages/TopUser'
import TrendingPosts from './pages/TrendingPosts'
import Feed from './pages/Feed'

function App() {
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Social Media Analytics
          </Typography>
          <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
            Top Users
          </Link>
          <Link to="/trending" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
            Trending Posts
          </Link>
          <Link to="/feed" style={{ color: 'white', textDecoration: 'none' }}>
            Feed
          </Link>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<TopUser/>} />
          <Route path="/trending" element={<TrendingPosts />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/average-calculator" element={<AverageCalculator />} />
          
        </Routes>
      </Container>
    </>
  )
}

export default App
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  useTheme,
} from '@mui/material';
import {
  VideoLibrary,
  Pending,
  CheckCircle,
  HourglassEmpty,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import apiClient from '../services/apiClient';

interface VideoStats {
  total: number;
  draft: number;
  processing: number;
  review: number;
  approved: number;
  published: number;
  failed: number;
}

const StudioDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<VideoStats>({
    total: 0,
    draft: 0,
    processing: 0,
    review: 0,
    approved: 0,
    published: 0,
    failed: 0,
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadStats();
    loadUser();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [draftRes, processingRes, reviewRes, approvedRes, publishedRes, failedRes] = await Promise.all([
        apiClient.getVideos({ status: 'DRAFT_READY' }),
        apiClient.getVideos({ status: 'AI_PROCESSING' }),
        apiClient.getVideos({ status: 'IN_REVIEW' }),
        apiClient.getVideos({ status: 'FINAL_APPROVED' }),
        apiClient.getVideos({ status: 'PUBLISHED' }),
        apiClient.getVideos({ status: 'FAILED' }),
      ]);

      const newStats: VideoStats = {
        total: 0,
        draft: draftRes.success ? (draftRes.data || []).length : 0,
        processing: processingRes.success ? (processingRes.data || []).length : 0,
        review: reviewRes.success ? (reviewRes.data || []).length : 0,
        approved: approvedRes.success ? (approvedRes.data || []).length : 0,
        published: publishedRes.success ? (publishedRes.data || []).length : 0,
        failed: failedRes.success ? (failedRes.data || []).length : 0,
      };

      newStats.total = Object.values(newStats).reduce((sum, count) => sum + count, 0);
      setStats(newStats);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userRes = await apiClient.getCurrentUser();
        if (userRes.success) {
          setUser(userRes.data);
        }
      }
    } catch (err) {
      // User not logged in
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
  }> = ({ title, value, icon, color, onClick }) => (
    <Card
      sx={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ backgroundColor: '#141414', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress sx={{ color: '#e50914' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#141414', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={handleLogout} />
      
      <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            Studio Dashboard
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#ccc',
            }}
          >
            Manage your video content and production workflow
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 4 }}
            action={
              <button onClick={loadStats} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                Retry
              </button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Videos"
              value={stats.total}
              icon={<VideoLibrary />}
              color="#2196f3"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Draft Ready"
              value={stats.draft}
              icon={<Pending />}
              color="#9c27b0"
              onClick={() => navigate('/studio/review')}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Processing"
              value={stats.processing}
              icon={<HourglassEmpty />}
              color="#ff9800"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="In Review"
              value={stats.review}
              icon={<TrendingUp />}
              color="#f4c430"
              onClick={() => navigate('/studio/review')}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Approved"
              value={stats.approved}
              icon={<CheckCircle />}
              color="#4caf50"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Published"
              value={stats.published}
              icon={<VideoLibrary />}
              color="#e50914"
              onClick={() => navigate('/shorts')}
            />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: 'white',
              mb: 3,
              fontWeight: 'bold',
            }}
          >
            Quick Actions
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/studio/review')}
                sx={{
                  backgroundColor: '#e50914',
                  color: 'white',
                  py: 2,
                  '&:hover': {
                    backgroundColor: '#f40612',
                  },
                }}
              >
                Review Queue
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  py: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                  },
                }}
              >
                Browse Content
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/shorts')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  py: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                  },
                }}
              >
                View Shorts
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                onClick={loadStats}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  py: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                  },
                }}
              >
                Refresh Stats
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Recent Activity */}
        <Box>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: 'white',
              mb: 3,
              fontWeight: 'bold',
            }}
          >
            Production Overview
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Workflow Status
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>Draft Ready</Typography>
                      <Typography sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                        {stats.draft}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>In Review</Typography>
                      <Typography sx={{ color: '#f4c430', fontWeight: 'bold' }}>
                        {stats.review}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>Approved</Typography>
                      <Typography sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                        {stats.approved}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>Published</Typography>
                      <Typography sx={{ color: '#e50914', fontWeight: 'bold' }}>
                        {stats.published}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    System Status
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>Processing</Typography>
                      <Typography sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                        {stats.processing}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>Failed</Typography>
                      <Typography sx={{ color: '#f44336', fontWeight: 'bold' }}>
                        {stats.failed}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>Total Production</Typography>
                      <Typography sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                        {stats.total}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default StudioDashboard;

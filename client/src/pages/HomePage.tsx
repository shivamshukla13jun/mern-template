import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  useTheme,
} from '@mui/material';
import { PlayArrow, Info } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import CollectionRow from '../components/CollectionRow';
import PlaylistCard from '../components/PlaylistCard';
import apiClient from '../services/apiClient';
import { useNavigate } from 'react-router-dom';

interface Category {
  _id: string;
  name: string;
  slug: string;
  type: string;
}

interface Collection {
  _id: string;
  title: string;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
    type: string;
  };
  isFeatured: boolean;
  sortOrder: number;
}

interface Playlist {
  _id: string;
  title: string;
  description: string;
  posterUrl: string;
  type: string;
  categoryId: string;
  collectionId?: string;
}

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [featuredContent, setFeaturedContent] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadData();
    loadUser();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesRes, collectionsRes, playlistsRes] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getCollections(),
        apiClient.getPlaylists(),
      ]);

      if (categoriesRes.success) {
        setCategories(categoriesRes.data || []);
      }

      if (collectionsRes.success) {
        setCollections(collectionsRes.data || []);
      }

      if (playlistsRes.success) {
        setFeaturedContent(playlistsRes.data?.playlists || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load content');
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

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  const handlePlaylistClick = (playlist: any) => {
    navigate(`/playlist/${playlist._id}`);
  };

  const featuredPlaylist = featuredContent[0];

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
      
      {/* Hero Section */}
      {featuredPlaylist && (
        <Box
          sx={{
            position: 'relative',
            height: { xs: '50vh', md: '70vh' },
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%), url(${featuredPlaylist.posterUrl || '/placeholder-hero.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ maxWidth: '600px' }}>
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                {featuredPlaylist.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#b3b3b3',
                  mb: 3,
                  lineHeight: 1.4,
                }}
              >
                {featuredPlaylist.description || 'Experience the best in anime and manga entertainment'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => handlePlaylistClick(featuredPlaylist._id)}
                  sx={{
                    backgroundColor: 'white',
                    color: 'black',
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Play
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Info />}
                  onClick={() => handlePlaylistClick(featuredPlaylist._id)}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  More Info
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      {/* Categories */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            mb: 3,
          }}
        >
          Browse by Category
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#2a2a2a',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#e50914',
              borderRadius: '4px',
            },
          }}
        >
          {categories.map((category) => (
            <Button
              key={category._id}
              variant="outlined"
              onClick={() => handleCategoryClick(category._id)}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                borderRadius: '20px',
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                '&:hover': {
                  borderColor: '#e50914',
                  backgroundColor: 'rgba(229, 9, 20, 0.1)',
                },
              }}
            >
              {category.name}
            </Button>
          ))}
        </Box>
      </Container>

      {/* Collections */}
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        {collections
          .sort((a, b) => {
            // Featured collections first, then by sort order
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return a.sortOrder - b.sortOrder;
          })
          .map((collection) => (
            <Box key={collection._id} sx={{ mb: 6 }}>
              <CollectionRow
                collection={collection}
                playlists={featuredContent.filter(p => p.collectionId === collection._id)}
                onPlaylistClick={handlePlaylistClick}
              />
            </Box>
          ))}
      </Container>

      {error && (
        <Alert
          severity="error"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
          action={
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
              Dismiss
            </button>
          }
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default HomePage;

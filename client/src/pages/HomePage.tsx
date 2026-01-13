import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
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
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
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
        setPlaylists(playlistsRes.data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
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
      // User not logged in, that's okay for home page
    }
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    navigate(`/playlist/${playlist._id}`);
  };

  const handleCategoryClick = (category: Category) => {
    navigate(`/category/${category._id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // Group playlists by collection
  const getPlaylistsByCollection = (collectionId: string) => {
    return playlists.filter(playlist => playlist.collectionId === collectionId);
  };

  // Get featured playlists (not in any collection)
  const getFeaturedPlaylists = () => {
    return playlists.filter(playlist => !playlist.collectionId);
  };

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
        {/* Hero Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #e50914, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Welcome to AnimeStream
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#ccc',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            Discover amazing anime, manga, and video content powered by AI
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 4 }}
            action={
              <button onClick={loadData} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                Retry
              </button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Categories */}
        {categories.length > 0 && (
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
              Browse by Category
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 2,
                '&::-webkit-scrollbar': {
                  height: 8,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#2a2a2a',
                  borderRadius: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#e50914',
                  borderRadius: 4,
                },
              }}
            >
              {categories.map((category) => (
                <Box
                  key={category._id}
                  onClick={() => handleCategoryClick(category)}
                  sx={{
                    minWidth: 120,
                    p: 2,
                    backgroundColor: '#2a2a2a',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    '&:hover': {
                      backgroundColor: '#e50914',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    {category.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Featured Playlists */}
        {getFeaturedPlaylists().length > 0 && (
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
              Featured Content
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 2,
                '&::-webkit-scrollbar': {
                  height: 8,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#2a2a2a',
                  borderRadius: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#e50914',
                  borderRadius: 4,
                },
              }}
            >
              {getFeaturedPlaylists().map((playlist) => (
                <Box
                  key={playlist._id}
                  sx={{
                    minWidth: 200,
                    flexShrink: 0,
                  }}
                >
                  <PlaylistCard
                    playlist={playlist}
                    onClick={() => handlePlaylistClick(playlist)}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Collections */}
        {collections.map((collection) => {
          const collectionPlaylists = getPlaylistsByCollection(collection._id);
          if (collectionPlaylists.length === 0) return null;

          return (
            <CollectionRow
              key={collection._id}
              collection={collection}
              playlists={collectionPlaylists}
              onPlaylistClick={handlePlaylistClick}
            />
          );
        })}

        {/* Empty State */}
        {!loading && categories.length === 0 && collections.length === 0 && playlists.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#ccc',
                mb: 2,
              }}
            >
              No content available yet
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#888',
              }}
            >
              Start by creating categories, collections, and playlists to build your content library.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;

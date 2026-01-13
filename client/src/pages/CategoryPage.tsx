import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  useTheme,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PlaylistCard from '../components/PlaylistCard';
import apiClient from '../services/apiClient';

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

const CategoryPage: React.FC = () => {
  const theme = useTheme();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (categoryId) {
      loadData();
    }
    loadUser();
  }, [categoryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [collectionsRes, playlistsRes] = await Promise.all([
        apiClient.getCollections(categoryId),
        apiClient.getPlaylists(categoryId),
      ]);

      if (collectionsRes.success) {
        setCollections(collectionsRes.data || []);
      }

      if (playlistsRes.success) {
        setPlaylists(playlistsRes.data || []);
      }

      // Get category details
      const allCategoriesRes = await apiClient.getCategories();
      if (allCategoriesRes.success) {
        const foundCategory = (allCategoriesRes.data || []).find(
          (cat: Category) => cat._id === categoryId
        );
        setCategory(foundCategory || null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load category data');
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
      // User not logged in, that's okay
    }
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    window.location.href = `/playlist/${playlist._id}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // Group playlists by collection
  const getPlaylistsByCollection = (collectionId: string) => {
    return playlists.filter(playlist => playlist.collectionId === collectionId);
  };

  // Get playlists not in any collection
  const getStandalonePlaylists = () => {
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
        {/* Category Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              textTransform: 'uppercase',
            }}
          >
            {category?.name || 'Category'}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#ccc',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            Explore the best {category?.name?.toLowerCase()} content
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

        {/* Collections */}
        {collections.map((collection) => {
          const collectionPlaylists = getPlaylistsByCollection(collection._id);
          if (collectionPlaylists.length === 0) return null;

          return (
            <Box key={collection._id} sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  color: 'white',
                  mb: 3,
                  fontWeight: collection.isFeatured ? 'bold' : 'medium',
                }}
              >
                {collection.title}
              </Typography>
              
              <Grid container spacing={3}>
                {collectionPlaylists.map((playlist) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={playlist._id}>
                    <PlaylistCard
                      playlist={playlist}
                      onClick={() => handlePlaylistClick(playlist)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}

        {/* Standalone Playlists */}
        {getStandalonePlaylists().length > 0 && (
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
              More {category?.name} Content
            </Typography>
            
            <Grid container spacing={3}>
              {getStandalonePlaylists().map((playlist) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={playlist._id}>
                  <PlaylistCard
                    playlist={playlist}
                    onClick={() => handlePlaylistClick(playlist)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Empty State */}
        {!loading && collections.length === 0 && playlists.length === 0 && (
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
              No content available in this category yet
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#888',
              }}
            >
              Content will appear here once playlists and collections are created for this category.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CategoryPage;

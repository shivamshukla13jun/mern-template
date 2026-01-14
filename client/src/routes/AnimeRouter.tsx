import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ShortsPage from '../pages/ShortsPage';
import CategoryPage from '../pages/CategoryPage';
import PlaylistPage from '../pages/PlaylistPage';
import StudioDashboard from '../pages/StudioDashboard';
import ReviewQueuePage from '../pages/ReviewQueuePage';
import VideoEditorPage from '../pages/VideoEditorPage';
import AdminCategoriesPage from '../pages/AdminCategoriesPage';
import AdminCollectionsPage from '../pages/AdminCollectionsPage';
import Login from '@/pages/Auth/Login';

const AnimeRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      <Route path="/shorts" element={<ShortsPage />} />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
      <Route path="/studio" element={<StudioDashboard />} />
      <Route path="/studio/review" element={<ReviewQueuePage />} />
      <Route path="/studio/editor/:videoId" element={<VideoEditorPage />} />
      <Route path="/admin/categories" element={<AdminCategoriesPage />} />
      <Route path="/admin/collections" element={<AdminCollectionsPage />} />
    </Routes>
  );
};

export default AnimeRouter;

import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse> {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: any): Promise<ApiResponse> {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse> {
    const response = await this.client.get('/auth/current-user');
    return response.data;
  }

  // Category methods
  async getCategories(): Promise<ApiResponse> {
    const response = await this.client.get('/categories');
    return response.data;
  }

  async createCategory(categoryData: any): Promise<ApiResponse> {
    const response = await this.client.post('/categories', categoryData);
    return response.data;
  }

  async updateCategory(id: string, categoryData: any): Promise<ApiResponse> {
    const response = await this.client.patch(`/categories/${id}`, categoryData);
    return response.data;
  }

  async deleteCategory(id: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/categories/${id}`);
    return response.data;
  }

  // Collection methods
  async getCollections(categoryId?: string): Promise<ApiResponse> {
    const params = categoryId ? { categoryId } : {};
    const response = await this.client.get('/collections', { params });
    return response.data;
  }

  async createCollection(collectionData: any): Promise<ApiResponse> {
    const response = await this.client.post('/collections', collectionData);
    return response.data;
  }

  async updateCollection(id: string, collectionData: any): Promise<ApiResponse> {
    const response = await this.client.patch(`/collections/${id}`, collectionData);
    return response.data;
  }

  async deleteCollection(id: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/collections/${id}`);
    return response.data;
  }

  // Playlist methods
  async getPlaylists(categoryId?: string, collectionId?: string): Promise<ApiResponse> {
    const params: any = {};
    if (categoryId) params.categoryId = categoryId;
    if (collectionId) params.collectionId = collectionId;
    const response = await this.client.get('/playlists', { params });
    return response.data;
  }

  async getPlaylist(id: string): Promise<ApiResponse> {
    const response = await this.client.get(`/playlists/${id}`);
    return response.data;
  }

  async createPlaylist(playlistData: any): Promise<ApiResponse> {
    const response = await this.client.post('/playlists', playlistData);
    return response.data;
  }

  async updatePlaylist(id: string, playlistData: any): Promise<ApiResponse> {
    const response = await this.client.patch(`/playlists/${id}`, playlistData);
    return response.data;
  }

  // Episode methods
  async getEpisodes(playlistId?: string): Promise<ApiResponse> {
    const params = playlistId ? { playlistId } : {};
    const response = await this.client.get('/episodes', { params });
    return response.data;
  }

  async getEpisode(id: string): Promise<ApiResponse> {
    const response = await this.client.get(`/episodes/${id}`);
    return response.data;
  }

  async createEpisode(episodeData: any): Promise<ApiResponse> {
    const response = await this.client.post('/episodes', episodeData);
    return response.data;
  }

  async updateEpisode(id: string, episodeData: any): Promise<ApiResponse> {
    const response = await this.client.patch(`/episodes/${id}`, episodeData);
    return response.data;
  }

  async deleteEpisode(id: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/episodes/${id}`);
    return response.data;
  }

  // Content methods
  async getContent(params?: {
    type?: string;
    genre?: string;
    source?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    const response = await this.client.get('/content', { params });
    return response.data;
  }

  async getTrendingContent(limit?: number): Promise<ApiResponse> {
    const params = limit ? { limit } : {};
    const response = await this.client.get('/content/trending', { params });
    return response.data;
  }

  async getContentByGenre(genre: string, limit?: number): Promise<ApiResponse> {
    const params = limit ? { limit } : {};
    const response = await this.client.get(`/content/genre/${genre}`, { params });
    return response.data;
  }

  // Script methods
  async generateScript(scriptData: any): Promise<ApiResponse> {
    const response = await this.client.post('/scripts/generate', scriptData);
    return response.data;
  }

  async getScript(id: string): Promise<ApiResponse> {
    const response = await this.client.get(`/scripts/${id}`);
    return response.data;
  }

  async updateScript(id: string, scriptData: any): Promise<ApiResponse> {
    const response = await this.client.patch(`/scripts/${id}`, scriptData);
    return response.data;
  }

  async approveScript(id: string, note?: string): Promise<ApiResponse> {
    const response = await this.client.patch(`/scripts/${id}/approve`, { note });
    return response.data;
  }

  // Voice methods
  async generateVoice(voiceData: any): Promise<ApiResponse> {
    const response = await this.client.post('/voice/generate', voiceData);
    return response.data;
  }

  async getVoice(id: string): Promise<ApiResponse> {
    const response = await this.client.get(`/voice/${id}`);
    return response.data;
  }

  async getVoiceByScriptId(scriptId: string): Promise<ApiResponse> {
    const response = await this.client.get(`/voice/script/${scriptId}`);
    return response.data;
  }

  // Video methods
  async generateVideo(videoData: any): Promise<ApiResponse> {
    const response = await this.client.post('/videos/generate', videoData);
    return response.data;
  }

  async getVideo(id: string): Promise<ApiResponse> {
    const response = await this.client.get(`/videos/${id}`);
    return response.data;
  }

  async getVideos(params?: {
    status?: string;
    playlistId?: string;
    type?: string;
  }): Promise<ApiResponse> {
    const response = await this.client.get('/videos', { params });
    return response.data;
  }

  async getPublishedVideos(type?: string): Promise<ApiResponse> {
    const params = type ? { type } : {};
    const response = await this.client.get('/videos/published', { params });
    return response.data;
  }

  // Editor methods
  async getProject(videoId: string): Promise<ApiResponse> {
    const response = await this.client.get(`/editor/project/${videoId}`);
    return response.data;
  }

  async updateProject(videoId: string, projectData: any): Promise<ApiResponse> {
    const response = await this.client.patch(`/editor/project/${videoId}`, projectData);
    return response.data;
  }

  async rerenderProject(videoId: string): Promise<ApiResponse> {
    const response = await this.client.post(`/editor/project/${videoId}/rerender`);
    return response.data;
  }

  // Review methods
  async getReviewQueue(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    const response = await this.client.get('/review/queue', { params });
    return response.data;
  }

  async startReview(videoId: string): Promise<ApiResponse> {
    const response = await this.client.patch(`/review/${videoId}/start`);
    return response.data;
  }

  async approveVideo(videoId: string, data?: {
    note?: string;
    publishNow?: boolean;
    autoUploadYoutube?: boolean;
  }): Promise<ApiResponse> {
    const response = await this.client.patch(`/review/${videoId}/approve`, data);
    return response.data;
  }

  async rejectVideo(videoId: string, note: string): Promise<ApiResponse> {
    const response = await this.client.patch(`/review/${videoId}/reject`, { note });
    return response.data;
  }

  async getReviewHistory(videoId: string): Promise<ApiResponse> {
    const response = await this.client.get(`/review/${videoId}/history`);
    return response.data;
  }

  // YouTube methods
  async getYouTubeAuthUrl(): Promise<ApiResponse> {
    const response = await this.client.get('/youtube/auth-url');
    return response.data;
  }

  async uploadToYouTube(uploadData: any): Promise<ApiResponse> {
    const response = await this.client.post('/youtube/upload', uploadData);
    return response.data;
  }

  async getYouTubeUploads(status?: string): Promise<ApiResponse> {
    const params = status ? { status } : {};
    const response = await this.client.get('/youtube', { params });
    return response.data;
  }

  // Cron methods (admin only)
  async runCronJob(job: string): Promise<ApiResponse> {
    const response = await this.client.post('/cron/run-now', { job });
    return response.data;
  }

  async getCronJobStatus(): Promise<ApiResponse> {
    const response = await this.client.get('/cron/status');
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;

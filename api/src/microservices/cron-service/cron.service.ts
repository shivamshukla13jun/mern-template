import * as cron from 'node-cron';
import { ContentService } from '../content-service/content.service';
import { AniListService } from '../content-service/anilist.service';
import logger from '../../utils/logger';

export class CronService {
  private contentService: ContentService;
  private anilistService: AniListService;
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  constructor() {
    this.contentService = new ContentService();
    this.anilistService = new AniListService();
  }

  startAllJobs(): void {
    this.startDailyTrendingJob();
    this.startSixHourRefreshJob();
    this.startWeeklyGenreJob();
    logger.info('All cron jobs started');
  }

  stopAllJobs(): void {
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`Cron job '${name}' stopped`);
    });
    this.jobs.clear();
  }

  private startDailyTrendingJob(): void {
    const job = cron.schedule('0 1 * * *', async () => {
      logger.info('Running daily trending job');
      try {
        await this.fetchTrendingAnime();
        await this.fetchTrendingManga();
        logger.info('Daily trending job completed successfully');
      } catch (error) {
        logger.error('Daily trending job failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    this.jobs.set('dailyTrending', job);
    job.start();
  }

  private startSixHourRefreshJob(): void {
    const job = cron.schedule('0 */6 * * *', async () => {
      logger.info('Running 6-hour refresh job');
      try {
        await this.contentService.updateTrendScores();
        logger.info('6-hour refresh job completed successfully');
      } catch (error) {
        logger.error('6-hour refresh job failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    this.jobs.set('sixHourRefresh', job);
    job.start();
  }

  private startWeeklyGenreJob(): void {
    const job = cron.schedule('0 3 * * 0', async () => {
      logger.info('Running weekly genre job');
      try {
        const genres = ['action', 'romance', 'comedy', 'thriller', 'fantasy'];
        for (const genre of genres) {
          await this.fetchTopByGenre(genre, 'anime');
          await this.fetchTopByGenre(genre, 'manga');
        }
        logger.info('Weekly genre job completed successfully');
      } catch (error) {
        logger.error('Weekly genre job failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    this.jobs.set('weeklyGenre', job);
    job.start();
  }

  async runJobManually(jobName: string): Promise<void> {
    logger.info(`Manually running job: ${jobName}`);
    
    switch (jobName) {
      case 'trendingAnime':
        await this.fetchTrendingAnime();
        break;
      case 'trendingManga':
        await this.fetchTrendingManga();
        break;
      case 'refresh':
        await this.contentService.updateTrendScores();
        break;
      case 'genres':
        const genres = ['action', 'romance', 'comedy', 'thriller', 'fantasy'];
        for (const genre of genres) {
          await this.fetchTopByGenre(genre, 'anime');
          await this.fetchTopByGenre(genre, 'manga');
        }
        break;
      default:
        throw new Error(`Unknown job: ${jobName}`);
    }
    
    logger.info(`Job '${jobName}' completed successfully`);
  }

  private async fetchTrendingAnime(): Promise<void> {
    const trendingAnime = await this.anilistService.getTrendingAnime();
    
    for (const anime of trendingAnime) {
      const existing = await this.contentService.getContentByExternalId(
        anime.id.toString(),
        'anilist'
      );

      if (!existing) {
        await this.contentService.createContentItem({
          externalId: anime.id.toString(),
          source: 'anilist',
          type: 'anime',
          title: anime.title.romaji || anime.title.english,
          synopsis: anime.description,
          posterUrl: anime.coverImage.large,
          genres: anime.genres,
          rating: anime.averageScore ? anime.averageScore / 10 : 0,
          popularity: anime.popularity,
          releaseYear: new Date(anime.startDate?.year || 2024).getFullYear(),
          trendScore: 0, // Will be calculated by updateTrendScores
          raw: anime,
        });
      }
    }
  }

  private async fetchTrendingManga(): Promise<void> {
    const trendingManga = await this.anilistService.getTrendingManga();
    
    for (const manga of trendingManga) {
      const existing = await this.contentService.getContentByExternalId(
        manga.id.toString(),
        'anilist'
      );

      if (!existing) {
        await this.contentService.createContentItem({
          externalId: manga.id.toString(),
          source: 'anilist',
          type: 'manga',
          title: manga.title.romaji || manga.title.english,
          synopsis: manga.description,
          posterUrl: manga.coverImage.large,
          genres: manga.genres,
          rating: manga.averageScore ? manga.averageScore / 10 : 0,
          popularity: manga.popularity,
          releaseYear: new Date(manga.startDate?.year || 2024).getFullYear(),
          trendScore: 0, // Will be calculated by updateTrendScores
          raw: manga,
        });
      }
    }
  }

  private async fetchTopByGenre(genre: string, type: 'anime' | 'manga'): Promise<void> {
    const content = type === 'anime' 
      ? await this.anilistService.getAnimeByGenre(genre)
      : await this.anilistService.getMangaByGenre(genre);
    
    for (const item of content) {
      const existing = await this.contentService.getContentByExternalId(
        item.id.toString(),
        'anilist'
      );

      if (!existing) {
        await this.contentService.createContentItem({
          externalId: item.id.toString(),
          source: 'anilist',
          type,
          title: item.title.romaji || item.title.english,
          synopsis: item.description,
          posterUrl: item.coverImage.large,
          genres: item.genres,
          rating: item.averageScore ? item.averageScore / 10 : 0,
          popularity: item.popularity,
          releaseYear: new Date(item.startDate?.year || 2024).getFullYear(),
          trendScore: 0, // Will be calculated by updateTrendScores
          raw: item,
        });
      }
    }
  }

  getJobStatus(): Array<{ name: string; status: string }> {
    return Array.from(this.jobs.entries()).map(([name, job]) => ({
      name,
      status: 'scheduled', // node-cron doesn't have a running property, so we assume it's scheduled
    }));
  }
}

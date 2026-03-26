/**
 * Centralized microservices configuration
 * Imports all microservice config.json files and organizes them by service key
 */

// Import all microservice configs
import authServiceConfig from 'microservices/auth-service/config.json';
import userServiceConfig from 'microservices/user-service/config.json';
// Define the interface for microservice config
interface MicroserviceConfig {
  baseUrl: string;
  author: string;
  service: string;
  CreatedAt: string;
  UpdateddAt: string;
}

// Centralized microservices configuration object
export const microservicesConfig: Record<string, MicroserviceConfig> = {
 
  auth: authServiceConfig  as MicroserviceConfig,
  user: userServiceConfig  as MicroserviceConfig,
};
// Default export
export default microservicesConfig;

import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

interface NominatimReverseResponse {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

interface NominatimSearchResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
}

export interface ReverseGeocodeResult {
  city: string;
  country: string;
  displayName: string;
}

export interface SearchResult {
  displayName: string;
  lat: number;
  lon: number;
  type: string;
}

export class GeocodingService {
  private client: AxiosInstance;
  private readonly baseURL = 'https://nominatim.openstreetmap.org';
  private readonly userAgent = 'LoveLogger/1.0';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'User-Agent': this.userAgent,
      },
    });
  }

  /**
   * Reverse geocode coordinates to get the nearest city
   */
  async reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodeResult | null> {
    try {
      const response = await this.client.get<NominatimReverseResponse>('/reverse', {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1,
          zoom: 10, // City level
        },
      });

      const { address, display_name } = response.data;

      // Try to extract city name from various possible fields
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        'Unknown Location';

      const country = address.country || '';

      return {
        city,
        country,
        displayName: display_name,
      };
    } catch (error) {
      logger.error('Reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Search for locations by query string
   */
  async search(query: string, limit: number = 5): Promise<SearchResult[]> {
    try {
      const response = await this.client.get<NominatimSearchResult[]>('/search', {
        params: {
          q: query,
          format: 'json',
          limit,
          addressdetails: 0,
        },
      });

      return response.data.map((result) => ({
        displayName: result.display_name,
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        type: result.type,
      }));
    } catch (error) {
      logger.error('Geocoding search error:', error);
      return [];
    }
  }

  /**
   * Get coordinates for a location name
   */
  async geocode(location: string): Promise<{ lat: number; lon: number } | null> {
    try {
      const results = await this.search(location, 1);
      if (results.length > 0) {
        return {
          lat: results[0].lat,
          lon: results[0].lon,
        };
      }
      return null;
    } catch (error) {
      logger.error('Geocoding error:', error);
      return null;
    }
  }
}

export const geocodingService = new GeocodingService();

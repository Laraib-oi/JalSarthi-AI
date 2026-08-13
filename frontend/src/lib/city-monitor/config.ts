import "server-only";

import type { CityMonitorCityConfig } from "@/lib/city-monitor/types";

/**
 * The radius is intentionally a small, configurable scan area. It
 * must not be interpreted as the administrative boundary of Lucknow.
 */
export const CITY_MONITOR_CONFIGS: readonly CityMonitorCityConfig[] = [
  {
    id: "lucknow",
    name: "Lucknow",
    country: "India",
    center: {
      latitude: 26.8467,
      longitude: 80.9462,
    },
    radiusMeters: 1_000,
    enabled: true,
  },
];

export function getCityMonitorConfig(cityId: string): CityMonitorCityConfig | undefined {
  return CITY_MONITOR_CONFIGS.find((city) => city.enabled && city.id === cityId);
}

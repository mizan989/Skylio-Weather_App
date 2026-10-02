import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import { Loader2 } from 'lucide-react';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import SearchBar from './components/SearchBar';
import SavedLocations from './components/SavedLocations';
import HeroWeatherCard from './components/HeroWeatherCard';
import HourlyChart from './components/HourlyChart';
import HighlightsPanel from './components/HighlightsPanel';
import DailyList from './components/DailyList';
import AirQualityView from './components/AirQualityView';
import DetailsView from './components/DetailsView';
import SettingsView from './components/SettingsView';
import WeatherBackground from './components/WeatherBackground';
import Footer from './components/Footer';
import LegalModal, { type LegalTab } from './components/legal/LegalModal';
import { Meteors } from './components/inspira/Meteors';
import { useWeather } from './hooks/useWeather';
import { useAirQuality } from './hooks/useAirQuality';
import { useGeolocation } from './hooks/useGeolocation';
import { usePreferences } from './hooks/usePreferences';
import { getConditionFamily } from './lib/weatherCodes';
import { horizonGradient, skyGradient } from './lib/horizon';
import type { PrimaryDestination, WeatherLocation } from './types/weather';

const DEFAULT_LOCATION: WeatherLocation = {
  name: 'Kolkata',
  admin1: 'West Bengal',
  country: 'India',
  latitude: 22.5726,
  longitude: 88.3639,
};

const DEFAULT_SAVED_LOCATIONS: WeatherLocation[] = [
  { name: 'Kolkata', admin1: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639 },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917 },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { name: 'New York', admin1: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
];

export default function App() {
  const [location, setLocation] = useState<WeatherLocation>(() => {
    const saved = localStorage.getItem('skylio-current-location') || localStorage.getItem('neoweather-current-location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_LOCATION;
      }
    }
    return DEFAULT_LOCATION;
  });

  const [savedLocations, setSavedLocations] = useState<WeatherLocation[]>(() => {
    const stored = localStorage.getItem('skylio-bookmarks') || localStorage.getItem('neoweather-bookmarks');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_SAVED_LOCATIONS;
      }
    }
    return DEFAULT_SAVED_LOCATIONS;
  });

  const {
    preferences,
    setTempUnit,
    setWindUnit,
    setPrecipUnit,
    setTimeFormat,
  } = usePreferences();

  const [destination, setDestination] = useState<PrimaryDestination>('weather');

  const handleOpenSearch = useCallback(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }));
  }, []);

  const { locate, locating, error: geoError } = useGeolocation();
  const { data: weatherData, loading: weatherLoading, error: weatherError, reload: reloadWeather } = useWeather(
    location,
    preferences.tempUnit
  );
  const { data: airQualityData, loading: aqLoading, error: aqError, reload: reloadAirQuality } = useAirQuality(
    location
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('privacy');

  // Handle URL hash routing for legal documents (#privacy, #terms)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#privacy') {
        setLegalTab('privacy');
        setIsLegalOpen(true);
      } else if (hash === '#terms') {
        setLegalTab('terms');
        setIsLegalOpen(true);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openLegal = useCallback((tab: LegalTab) => {
    setLegalTab(tab);
    setIsLegalOpen(true);
    window.location.hash = tab === 'privacy' ? '#privacy' : '#terms';
  }, []);

  const closeLegal = useCallback(() => {
    setIsLegalOpen(false);
    if (window.location.hash === '#privacy' || window.location.hash === '#terms') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('skylio-current-location', JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    localStorage.setItem('skylio-bookmarks', JSON.stringify(savedLocations));
  }, [savedLocations]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    reloadWeather();
    reloadAirQuality();
    setTimeout(() => setIsRefreshing(false), 600);
  }, [reloadWeather, reloadAirQuality]);

  const toggleBookmark = useCallback(() => {
    setSavedLocations((prev) => {
      const exists = prev.some(
        (l) =>
          l.name.toLowerCase() === location.name.toLowerCase() &&
          Math.abs(l.latitude - location.latitude) < 0.1
      );
      if (exists) {
        return prev.filter(
          (l) =>
            !(
              l.name.toLowerCase() === location.name.toLowerCase() &&
              Math.abs(l.latitude - location.latitude) < 0.1
            )
        );
      } else {
        return [location, ...prev];
      }
    });
  }, [location]);

  const removeBookmark = useCallback((name: string) => {
    setSavedLocations((prev) => prev.filter((l) => l.name.toLowerCase() !== name.toLowerCase()));
  }, []);

  const isBookmarked = savedLocations.some(
    (l) =>
      l.name.toLowerCase() === location.name.toLowerCase() &&
      Math.abs(l.latitude - location.latitude) < 0.1
  );

  const family = weatherData ? getConditionFamily(weatherData.current.weather_code) : 'clear';
  const isDay = weatherData ? weatherData.current.is_day === 1 : true;

  useEffect(() => {
    if (weatherData) {
      const gradient = skyGradient(family, isDay);
      document.documentElement.style.setProperty('--horizon-gradient', horizonGradient(family, isDay));
      document.documentElement.style.setProperty('--sky-bg', gradient);
      document.body.style.backgroundImage = gradient;
    }
  }, [weatherData, family, isDay]);

  const handleLocationSelect = useCallback((newLoc: WeatherLocation) => {
    setLocation(newLoc);
  }, []);

  const handleToggleUnit = useCallback(() => {
    setTempUnit(preferences.tempUnit === 'celsius' ? 'fahrenheit' : 'celsius');
  }, [preferences.tempUnit, setTempUnit]);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.0, smoothWheel: true }}>
      {/* Dynamic atmospheric sky background */}
      <div
        className="pointer-events-none fixed inset-0 -z-20 will-change-transform transition-[background] duration-1000"
        style={{
          background: weatherData ? skyGradient(family, isDay) : '#080C14',
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Atmospheric Particle Canvas */}
      {weatherData && <WeatherBackground family={family} isDay={isDay} />}

      {/* Subtle Meteors for Night/Clear sky */}
      {(!isDay || family === 'clear') && <Meteors number={6} />}

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-5 sm:px-6 md:px-8"
      >
        {/* Navigation & Brand Header */}
        <Header
          currentDestination={destination}
          onSelectDestination={setDestination}
          location={location}
          onOpenSearch={handleOpenSearch}
          onLocate={() => locate(setLocation)}
          locating={locating}
          unit={preferences.tempUnit}
          onToggleUnit={handleToggleUnit}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          isLoading={weatherLoading}
        />

        {/* Search & Pinned Bar */}
        <div className="flex flex-col gap-2.5 mb-5">
          <SearchBar
            onSelect={handleLocationSelect}
            onUseLocation={() => locate(setLocation)}
            locating={locating}
          />

          {geoError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-xs text-[var(--gold)]"
            >
              {geoError}
            </motion.p>
          )}

          <SavedLocations
            locations={savedLocations}
            currentLocation={location}
            onSelect={setLocation}
            onRemove={removeBookmark}
          />
        </div>

        {/* Signature Horizon Hairline */}
        <div className="mb-6 horizon-line" />

        {/* Loading State (initial only) */}
        {weatherLoading && !weatherData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 flex-col items-center justify-center py-28 text-center"
          >
            <Loader2 className="animate-spin text-[var(--sky)] mb-3" size={28} />
            <p className="font-mono text-xs text-white/50">
              Retrieving forecast for {location.name}...
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {weatherError && !weatherData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-12 rounded-3xl border border-rose-500/20 bg-rose-950/20 p-8 text-center text-xs font-mono text-rose-200 backdrop-blur-md"
          >
            <p className="text-sm font-sans font-medium text-white mb-1">
              Could not retrieve forecast for {location.name}
            </p>
            <p className="text-rose-300/80 mb-4">{weatherError}</p>
            <button
              type="button"
              onClick={handleRefresh}
              className="rounded-full border border-rose-500/30 bg-white/5 px-4 py-1.5 text-white hover:bg-white/10"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Destination Content Views */}
        {weatherData && (
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {/* Destination A: Weather (Main Page) */}
              {destination === 'weather' && (
                <motion.div
                  key="weather-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-6"
                >
                  <HeroWeatherCard
                    location={location}
                    current={weatherData.current}
                    daily={weatherData.daily}
                    unit={preferences.tempUnit}
                    windUnit={preferences.windUnit}
                    timeFormat={preferences.timeFormat}
                    isBookmarked={isBookmarked}
                    onToggleBookmark={toggleBookmark}
                    timezone={weatherData.timezone}
                  />

                  <HourlyChart
                    hourly={weatherData.hourly}
                    timezone={weatherData.timezone}
                    unit={preferences.tempUnit}
                    timeFormat={preferences.timeFormat}
                  />

                  <HighlightsPanel
                    current={weatherData.current}
                    daily={weatherData.daily}
                    windUnit={preferences.windUnit}
                    timeFormat={preferences.timeFormat}
                    timezone={weatherData.timezone}
                  />

                  <DailyList
                    daily={weatherData.daily}
                    timezone={weatherData.timezone}
                    windUnit={preferences.windUnit}
                    precipUnit={preferences.precipUnit}
                    timeFormat={preferences.timeFormat}
                  />
                </motion.div>
              )}

              {/* Destination B: Air Quality */}
              {destination === 'airquality' && (
                <motion.div
                  key="airquality-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <AirQualityView
                    location={location}
                    data={airQualityData}
                    loading={aqLoading}
                    error={aqError}
                    onRefresh={reloadAirQuality}
                    timeFormat={preferences.timeFormat}
                  />
                </motion.div>
              )}

              {/* Destination C: Details / Explore */}
              {destination === 'details' && (
                <motion.div
                  key="details-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <DetailsView
                    location={location}
                    current={weatherData.current}
                    daily={weatherData.daily}
                    unit={preferences.tempUnit}
                    windUnit={preferences.windUnit}
                    precipUnit={preferences.precipUnit}
                    timeFormat={preferences.timeFormat}
                    timezone={weatherData.timezone}
                  />
                </motion.div>
              )}

              {/* Destination D: Settings */}
              {destination === 'settings' && (
                <motion.div
                  key="settings-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <SettingsView
                    preferences={preferences}
                    onUpdateTempUnit={setTempUnit}
                    onUpdateWindUnit={setWindUnit}
                    onUpdatePrecipUnit={setPrecipUnit}
                    onUpdateTimeFormat={setTimeFormat}
                    onOpenLegal={openLegal}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        )}

        {/* Footer */}
        <Footer
          onOpenLegal={openLegal}
          onNavigateDestination={(dest) => setDestination(dest)}
        />

        {/* Mobile Docked Bottom Navigation */}
        <MobileNav
          currentDestination={destination}
          onSelectDestination={setDestination}
        />

        {/* Legal Modal (Privacy Policy & Terms of Service) */}
        <LegalModal
          isOpen={isLegalOpen}
          onClose={closeLegal}
          initialTab={legalTab}
          onTabChange={setLegalTab}
        />
      </motion.div>
    </ReactLenis>
  );
}

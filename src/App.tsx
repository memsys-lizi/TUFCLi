import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import SearchBox from './components/SearchBox.js';
import LevelList from './components/LevelList.js';
import LevelDetail from './components/LevelDetail.js';
import FilterPanel, { FilterOptions } from './components/FilterPanel.js';
import { Level, SearchParams } from './api/types.js';
import { searchLevels } from './api/levels.js';
import { getTheme, borderStyle, spacing } from './theme.js';

type Screen = 'search' | 'detail';
type FocusTarget = 'search' | 'filter' | 'list';

interface AppState {
  // Screen management
  screen: Screen;
  focusTarget: FocusTarget;
  showFilters: boolean;
  
  // Search state
  searchQuery: string;
  filters: FilterOptions;
  searchParams: SearchParams;
  
  // Data state
  levels: Level[];
  selectedLevel: Level | null;
  
  // UI state
  loading: boolean;
  error: string | null;
}

const App: React.FC = () => {
  const theme = getTheme();
  
  const [state, setState] = useState<AppState>({
    screen: 'search',
    focusTarget: 'search',
    showFilters: false,
    searchQuery: '',
    filters: { sort: 'id', order: 'desc' },
    searchParams: { limit: 20, offset: 0 },
    levels: [],
    selectedLevel: null,
    loading: false,
    error: null,
  });

  // Load initial levels on mount
  useEffect(() => {
    handleSearch('');
  }, []);

  // Global keyboard shortcuts
  useInput((input, key) => {
    if (input === 'q') {
      process.exit(0);
    }
    if (key.escape) {
      if (state.screen === 'detail') {
        handleBack();
      } else if (state.showFilters) {
        setState(prev => ({ ...prev, showFilters: false, focusTarget: 'search' }));
      }
    }
    // Toggle filters with 'f' key
    if (input === 'f' && state.screen === 'search' && !state.loading) {
      setState(prev => ({
        ...prev,
        showFilters: !prev.showFilters,
        focusTarget: prev.showFilters ? 'search' : 'filter',
      }));
    }
  });

  const handleSearch = async (query: string, customFilters?: FilterOptions) => {
    const filtersToUse = customFilters || state.filters;
    
    setState(prev => ({
      ...prev,
      searchQuery: query,
      loading: true,
      error: null,
      focusTarget: 'list',
    }));

    try {
      // Build search params with filters
      const params: SearchParams = {
        ...state.searchParams,
        query: query || undefined,
        sort: filtersToUse.sort,
        order: filtersToUse.order,
        pguRange: filtersToUse.pguRange,
      };

      // Add tags to facetQuery if present
      if (filtersToUse.tags && filtersToUse.tags.length > 0) {
        params.facetQuery = JSON.stringify({ tags: filtersToUse.tags });
      }

      const result = await searchLevels(params);
      setState(prev => ({
        ...prev,
        levels: result.results,
        loading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Unknown error',
        loading: false,
      }));
    }
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setState(prev => ({
      ...prev,
      filters,
      showFilters: false,
      focusTarget: 'search',
    }));
    // Re-run search with new filters
    handleSearch(state.searchQuery, filters);
  };

  const handleSelectLevel = (level: Level) => {
    setState(prev => ({
      ...prev,
      selectedLevel: level,
      screen: 'detail',
    }));
  };

  const handleBack = () => {
    setState(prev => ({
      ...prev,
      screen: 'search',
      selectedLevel: null,
      focusTarget: 'search',
    }));
  };

  const handleDownload = async (levelId: number): Promise<string> => {
    const { downloadLevel } = await import('./api/levels.js');
    const filePath = await downloadLevel(levelId);
    return filePath;
  };

  return (
    <Box flexDirection="column" padding={spacing.sm}>
      {/* Header */}
      <Box borderStyle={borderStyle} borderColor={theme.primary} paddingX={spacing.md} paddingY={spacing.sm}>
        <Text bold color={theme.primary}>
          TUF CLI - The Universal Forums Level Downloader
        </Text>
      </Box>

      {/* Main Content */}
      {state.screen === 'search' && (
        <Box flexDirection="column" marginTop={spacing.sm}>
          <SearchBox
            value={state.searchQuery}
            onSearch={handleSearch}
            disabled={state.loading}
          />

          {/* Filter Panel */}
          {state.showFilters && (
            <FilterPanel
              onFilterChange={handleFilterChange}
              visible={state.showFilters}
            />
          )}

          {/* Current Filter Display */}
          {!state.showFilters && (state.filters.pguRange || (state.filters.tags && state.filters.tags.length > 0)) && (
            <Box marginTop={spacing.sm} borderStyle={borderStyle} borderColor={theme.accent} padding={spacing.xs}>
              <Text dimColor>
                Active Filters: 
                {state.filters.pguRange && <Text color={theme.info}> Difficulty: {state.filters.pguRange}</Text>}
                {state.filters.tags && state.filters.tags.length > 0 && <Text color={theme.success}> Tags: {state.filters.tags.join(', ')}</Text>}
                <Text color={theme.textMuted}> (Press F to edit)</Text>
              </Text>
            </Box>
          )}

          {state.loading && (
            <Box marginTop={spacing.sm}>
              <Text color={theme.warning}>
                <Spinner type="dots" /> Loading levels...
              </Text>
            </Box>
          )}

          {state.error && (
            <Box marginTop={spacing.sm} borderStyle={borderStyle} borderColor={theme.error} padding={spacing.sm}>
              <Text color={theme.error}>Error: {state.error}</Text>
            </Box>
          )}

          {!state.loading && !state.error && !state.showFilters && (
            <LevelList
              levels={state.levels}
              onSelect={handleSelectLevel}
              focused={state.focusTarget === 'list'}
            />
          )}
        </Box>
      )}

      {state.screen === 'detail' && state.selectedLevel && (
        <LevelDetail
          level={state.selectedLevel}
          onBack={handleBack}
          onDownload={handleDownload}
        />
      )}

      {/* Footer with shortcuts */}
      <Box borderStyle={borderStyle} borderColor={theme.borderMuted} marginTop={spacing.sm} paddingX={spacing.md}>
        <Text dimColor>
          {state.screen === 'search'
            ? '↑↓ Navigate | Enter Select | F Filters | Q Quit'
            : 'D Download | Esc Back | Q Quit'}
        </Text>
      </Box>
    </Box>
  );
};

export default App;

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { getTheme, borderStyle, spacing } from '../theme.js';

export interface FilterOptions {
  pguRange?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  tags?: string[];
}

interface Props {
  onFilterChange: (filters: FilterOptions) => void;
  visible: boolean;
}

const SORT_OPTIONS = [
  { label: 'ID (Default)', value: 'id' },
  { label: 'Favorites', value: 'favorites' },
  { label: 'Total Clears', value: 'totalClears' },
  { label: 'Pass Records', value: 'passRecords' },
  { label: 'BPM', value: 'bpm' },
  { label: 'Duration', value: 'duration' },
  { label: 'Tile Count', value: 'tileCount' },
  { label: 'Base Score', value: 'baseScore' },
  { label: 'Random', value: 'random' },
];

const DIFFICULTY_RANGES = [
  { label: 'All Difficulties', value: undefined },
  { label: 'Easy (0-50)', value: '0-50' },
  { label: 'Medium (50-100)', value: '50-100' },
  { label: 'Hard (100-150)', value: '100-150' },
  { label: 'Expert (150-200)', value: '150-200' },
  { label: 'Ultra (200+)', value: '200-999' },
];

const POPULAR_TAGS = [
  { label: 'Tech', value: 'Tech' },
  { label: 'Pseudo', value: 'Pseudo' },
  { label: 'Rolling', value: 'Rolling' },
  { label: 'Full VFX', value: 'Full VFX' },
  { label: 'Free Roam', value: 'Free Roam' },
  { label: 'Multi Track', value: 'Multi Track' },
  { label: 'Hold', value: 'Hold' },
  { label: 'Key Count', value: 'Key Count' },
];

type FilterSection = 'sort' | 'difficulty' | 'tags';

const FilterPanel: React.FC<Props> = ({ onFilterChange, visible }) => {
  const theme = getTheme();
  const [currentSection, setCurrentSection] = useState<FilterSection>('sort');
  const [filters, setFilters] = useState<FilterOptions>({
    sort: 'id',
    order: 'desc',
  });

  useInput((input, key) => {
    if (!visible) return;

    // Tab to switch sections
    if (key.tab) {
      if (currentSection === 'sort') setCurrentSection('difficulty');
      else if (currentSection === 'difficulty') setCurrentSection('tags');
      else setCurrentSection('sort');
    }

    // Enter to apply filters
    if (key.return) {
      onFilterChange(filters);
    }

    // Toggle order with 'o' key
    if (input === 'o' && currentSection === 'sort') {
      const newOrder = filters.order === 'asc' ? 'desc' : 'asc';
      setFilters({ ...filters, order: newOrder });
    }
  });

  const handleSortChange = (item: { value: string }) => {
    setFilters({ ...filters, sort: item.value });
  };

  const handleDifficultyChange = (item: { value?: string }) => {
    setFilters({ ...filters, pguRange: item.value });
  };

  const handleTagToggle = (item: { value: string }) => {
    const currentTags = filters.tags || [];
    const tagValue = item.value;
    
    if (currentTags.includes(tagValue)) {
      // Remove tag
      setFilters({ ...filters, tags: currentTags.filter(t => t !== tagValue) });
    } else {
      // Add tag
      setFilters({ ...filters, tags: [...currentTags, tagValue] });
    }
  };

  if (!visible) return null;

  return (
    <Box 
      marginTop={spacing.sm} 
      borderStyle={borderStyle} 
      borderColor={theme.accent} 
      padding={spacing.sm} 
      flexDirection="column"
    >
      <Text bold color={theme.accent}>
        Filters (Tab to switch, Enter to apply)
      </Text>

      <Box marginTop={spacing.xs} flexDirection="row" gap={2}>
        <Text color={currentSection === 'sort' ? theme.primary : theme.textMuted}>
          [Sort]
        </Text>
        <Text color={currentSection === 'difficulty' ? theme.primary : theme.textMuted}>
          [Difficulty]
        </Text>
        <Text color={currentSection === 'tags' ? theme.primary : theme.textMuted}>
          [Tags]
        </Text>
      </Box>

      {/* Sort Section */}
      {currentSection === 'sort' && (
        <Box marginTop={spacing.sm} flexDirection="column">
          <Text dimColor>Sort by:</Text>
          <SelectInput 
            items={SORT_OPTIONS} 
            onSelect={handleSortChange}
            initialIndex={SORT_OPTIONS.findIndex(opt => opt.value === filters.sort)}
          />
          <Box marginTop={spacing.xs}>
            <Text dimColor>
              Order: <Text color={theme.warning}>{filters.order === 'asc' ? '↑ Ascending' : '↓ Descending'}</Text> (Press 'o' to toggle)
            </Text>
          </Box>
        </Box>
      )}

      {/* Difficulty Section */}
      {currentSection === 'difficulty' && (
        <Box marginTop={spacing.sm} flexDirection="column">
          <Text dimColor>Difficulty Range:</Text>
          <SelectInput 
            items={DIFFICULTY_RANGES} 
            onSelect={handleDifficultyChange}
          />
        </Box>
      )}

      {/* Tags Section */}
      {currentSection === 'tags' && (
        <Box marginTop={spacing.sm} flexDirection="column">
          <Text dimColor>Popular Tags (select to toggle):</Text>
          {filters.tags && filters.tags.length > 0 && (
            <Box marginBottom={spacing.xs}>
              <Text color={theme.success}>Selected: {filters.tags.join(', ')}</Text>
            </Box>
          )}
          <SelectInput 
            items={POPULAR_TAGS.map(tag => ({
              ...tag,
              label: (filters.tags || []).includes(tag.value) 
                ? `✓ ${tag.label}` 
                : `  ${tag.label}`
            }))}
            onSelect={handleTagToggle}
          />
        </Box>
      )}

      {/* Help Text */}
      <Box marginTop={spacing.sm} borderColor={theme.borderMuted} borderStyle="single" paddingX={1}>
        <Text dimColor>
          Tab: Switch Section | Enter: Apply Filters | Esc: Close
        </Text>
      </Box>
    </Box>
  );
};

export default FilterPanel;

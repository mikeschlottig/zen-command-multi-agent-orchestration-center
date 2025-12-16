// This file can be used for Zen-specific utility functions.
// For now, it's a placeholder.
export const getConfidenceColor = (confidence: number): string => {
  if (confidence > 80) return 'text-emerald-400';
  if (confidence > 60) return 'text-yellow-400';
  return 'text-red-400';
};
export const formatTokenCount = (count: number): string => {
  if (count > 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count > 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toString();
};
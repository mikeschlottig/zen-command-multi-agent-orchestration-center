/**
 * LocalStorage utility for Zen Command settings persistence
 */
const PREFS_KEY = 'zenToolPreferences';
export interface ToolPreferences {
  [toolId: string]: boolean;
}
export const getToolPreferences = (): ToolPreferences => {
  try {
    const stored = localStorage.getItem(PREFS_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse tool preferences from localStorage:', error);
    return {};
  }
};
export const setToolPreferences = (toolId: string, enabled: boolean): void => {
  try {
    const current = getToolPreferences();
    const updated = { ...current, [toolId]: enabled };
    localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save tool preferences to localStorage:', error);
  }
};
export const clearToolPreferences = (): void => {
  localStorage.removeItem(PREFS_KEY);
};
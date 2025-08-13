export type VersionType = 'patch' | 'minor' | 'major';

export interface VersionSelectorProps {
  onSelect?: (_nextVersion: string) => void;
  error?: boolean;
  latestVersion?: string;
}

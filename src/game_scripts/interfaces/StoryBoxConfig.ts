// Interface is not implemented - it just manages the config

export interface StoryBoxConfig {
  texts: string[];
  style?: {
    fontSize?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    borderRadius?: string;
    fontFamily?: string;
    fontWeight?: string;
    border?: string;
    bottom?: string;
    transition?: string;
    width?: string;
    height?: string;
    overflow?: string;
    marginBottom?: string; // added for bottom margin
  };
  revealSpeed?: number; // milliseconds per character
  onComplete?: () => void;
}

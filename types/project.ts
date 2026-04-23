export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  size: 'small' | 'wide' | 'big';
  tags?: string[];
  bg?: string; // Tailwind class or hex
  icon?: string; // Lucide icon name
  isLive?: boolean;
}

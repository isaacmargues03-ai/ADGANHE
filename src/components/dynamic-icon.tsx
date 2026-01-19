"use client";

import { Clapperboard, Award, TrendingUp, Users, type LucideProps } from 'lucide-react';
import type { FunctionComponent } from 'react';

const icons = {
  clapperboard: Clapperboard,
  award: Award,
  'trending-up': TrendingUp,
  users: Users,
};

export type IconName = keyof typeof icons;

interface DynamicIconProps extends LucideProps {
    name: IconName;
}

export const DynamicIcon: FunctionComponent<DynamicIconProps> = ({ name, ...props }) => {
  const LucideIcon = icons[name];
  if (!LucideIcon) return null;
  return <LucideIcon {...props} />;
};

// 简单的CSS类名合并函数替代clsx和tailwind-merge
export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// 格式化时间为分:秒格式
export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// 限制数值在指定范围内
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
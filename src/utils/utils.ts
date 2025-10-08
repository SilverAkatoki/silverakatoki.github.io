export const calcDaysDiff = (dateStr: string): number => {
  const targetDate = new Date(dateStr);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - targetDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

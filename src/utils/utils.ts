/* eslint-disable @typescript-eslint/no-explicit-any */
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

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const waitSec = (sec: number) => wait(sec * 1000);
export const waitMillisec = (ms: number) => wait(ms);

export function calculateDaysSince(dateStr: string): number {
  const targetDate = new Date(dateStr);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - targetDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getRandomSentence(sentences: ReadonlyArray<string>): string {
  return sentences[Math.floor(Math.random() * sentences.length)];
}

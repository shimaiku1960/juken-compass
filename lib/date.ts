// 受験日まであと何日かを返す（今日=0、過去はマイナス）
export function daysUntil(date: Date | string): number {
  const target = new Date(date);
  const today = new Date();
  // 時刻を切り捨てて「日付」単位で差を取る
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

// 受験日を「2027年2月20日」形式で返す
export function formatExamDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 사용 예시
// const result = parseDate("2024-11-15T11:00:00.000Z");
// console.log(result); // { month: 11, day: 15, hours: 11, minutes: 0 }
function parseDate(dateString: string) {
  const date = new Date(dateString);

  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줌
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return { month, day, hours, minutes };
}


// 주말 및 공휴일 체크 함수
export const isWeekendOrHoliday = (
  date,
  holidays = []
) => {
  const day = date.getDay();
  const dateString = date.toISOString().split("T")[0];

  // 기본 공휴일 목록(필요 시 추가 가능)
  const defaultHolidays2025 = [
    "2025-01-01",
    "2025-01-27",
    "2025-01-28",
    "2025-01-29",
    "2025-01-30",
    "2025-03-01",
    "2025-05-05",
    "2025-06-06",
    "2025-08-15",
    "2025-10-03",
    "2025-10-09",
    "2025-12-25",
  ];

  // 주말(토, 일) 또는 공휴일 여부 반환
  return day === 0 || day === 6 || [...defaultHolidays2025, ...holidays].includes(dateString)
}

// 휴가 일수 계산 함수
export const calculateBusinessDays = (
  startDate,
  endDate,
  holidays =[]
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let businessDays = 0;

  while (start <= end) {
    if (!isWeekendOrHoliday(start, holidays)) {
      businessDays++;
    }
    start.setDate(start.getDate() + 1);
  }

  return businessDays;
}
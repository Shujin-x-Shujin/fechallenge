import dayjs from "dayjs";

export function timeDiff(startDate, endDate) {
  if (!startDate || !endDate) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const diffMs = end.diff(start);

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));


  return {days, hours, minutes}
}

import dayjs from "dayjs";

export function formatDate(dateString, format = "MMMM DD, YYYY, h:mm A") {
  if (!dateString) return "";
  return dayjs(dateString).format(format);
}

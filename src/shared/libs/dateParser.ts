export const dateParser = (dateString: string) => {
  const day = dateString.split("T")[0].split("-")[2];
  const month = dateString.split("T")[0].split("-")[1];
  const year = dateString.split("T")[0].split("-")[0];

  let dayWithCardinal;
  if (day.endsWith("1")) {
    dayWithCardinal = day + "st";
  } else if (day.endsWith("2")) {
    dayWithCardinal = day + "nd";
  } else if (day.endsWith("3")) {
    dayWithCardinal = day + "rd";
  } else {
    dayWithCardinal = day + "th";
  }

  let monthString;
  switch (month) {
    case "01":
      monthString = "January";
      break;
    case "02":
      monthString = "February";
      break;
    case "03":
      monthString = "March";
      break;
    case "04":
      monthString = "April";
      break;
    case "05":
      monthString = "May";
      break;
    case "06":
      monthString = "June";
      break;
    case "07":
      monthString = "July";
      break;
    case "08":
      monthString = "August";
      break;
    case "09":
      monthString = "September";
      break;
    case "10":
      monthString = "October";
      break;
    case "11":
      monthString = "November";
      break;
    case "12":
      monthString = "December";
      break;
  }

  const hours = dateString.split("T")[1].split(":")[0];
  const minutes = dateString.split("T")[1].split(":")[1];

  return { day: dayWithCardinal, month: monthString, year, hours, minutes };
};

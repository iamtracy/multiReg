function formatTime(date, timeZone) {
  let yearTime = date.split(' ');
  let year = getYear(yearTime[0].split('-'));
  let time = getTime(yearTime[1].split(':'), timeZone);
  return {
    year: `${year}`,
    time: `${time} ${timeZone}`
  };
}

function getYear(year) {
  let months = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
  };
  return `${months[year[1]]} ${year[2]}, ${year[0]}`;
}

function getTime(time, timeZone) {
  let bigHand = time[0];
  let littleHand = time[1];
  let amPM;
  if (bigHand <= 12) {
    amPM = 'am';
  } else {
    bigHand = bigHand - 12;
    amPM = 'pm';
  }
  return `${bigHand}:${littleHand}${amPM}`;
}

function trimEmptyTags() {
  $('p').filter(function() { return $.trim(this.innerHTML) == "" }).remove();
}
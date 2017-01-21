function formatTime(date, timeZone) {
  console.log(date);
  var yearTime = date.split(' ');
  var year = getYear(yearTime[0].split('-'));
  var time = getTime(yearTime[1].split(':'), timeZone);
  return `${year} ${time} ${timeZone}`;
}

function getYear(year) {
  var months = {
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
  var month = year[1];
  return months[month] + ' ' + year[2] + ', ' + year[0];
}

function getTime(time, timeZone) {
  var bigHand = time[0];
  var littleHand = time[1];
  var amPM;
  if (bigHand <= 12) {
    amPM = 'AM'
  } else {
    bigHand = bigHand - 12;
    amPM = 'PM'
  }
  return bigHand + ':' + littleHand + ' ' + amPM;
}

function speakerPresent(speaker) {
  let speakers = speaker.split('||');
  let response = speakers.map(item => {
    let ind = item.split('^');
    if (ind[0] !== '') {
      return {
        name: ind[0] || '',
        img: ind[1] || '',
        bio: ind[2] || ''
      };
    }
  }).filter(item => item !== undefined);
  return response;
}
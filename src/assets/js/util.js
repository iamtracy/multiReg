function formatTime(date, timeZone) {
  let yearTime = date.split(' ');
  let year = getYear(yearTime[0].split('-'));
  let time = getTime(yearTime[1].split(':'), timeZone);
  return `${year} ${time} ${timeZone}`;
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
  let month = year[1];
  return `${months[month]} ${year[2]}, ${year[0]}`;
}

function getTime(time, timeZone) {
  let bigHand = time[0];
  let littleHand = time[1];
  let amPM;
  if (bigHand <= 12) {
    amPM = 'AM';
  } else {
    bigHand = bigHand - 12;
    amPM = 'PM';
  }
  return `${bigHand}:${littleHand} ${amPM}`;
}

function speakerPresent(speaker) {
  let speakers = speaker.split('||');
  let response = speakers.map((item, index) => {
    let ind = item.split('^');
    if (ind[index] !== '') {
      return {
        name: ind[0] || '',
        img: ind[1] || '',
        bio: ind[2] || ''
      };
    }
  }).filter(item => item !== undefined);
  return response;
}
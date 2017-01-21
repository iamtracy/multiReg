function formatDate(date) {
  var dateArray = date.split(/[ ,]+/);
  var ymd = date.split(/[ -]+/);
  var time = dateArray[1].split(/[ :]+/);
  var date = ymd[1] + ' ' + ymd[2] + ' ' + ymd[0] + ' ' + time[0] + ':' + time[1];
  console.log(date);
  return date;
}

function speakerPresent(speaker) {
  let speakers = speaker.split('||');
  let response = speakers.map(item => {
    let ind = item.split('^');
    if (ind[0] !== '') {
      //console.log('ind', ind)
      return {
        name: ind[0] || '',
        img: ind[1] || '',
        bio: ind[2] || ''
      };
    }
  }).filter(item => item !== undefined);
  return response;
}
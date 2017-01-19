function formatDate(date) {
  var dateArray = date.split(/[ ,]+/);
  var ymd = date.split(/[ -]+/);
  var time = dateArray[1].split(/[ :]+/);
  var date = ymd[1] + ' ' + ymd[2] + ' ' + ymd[0] + ' ' + time[0] + ':' + time[1];
  console.log(date);
  return date;
}

function speakerPresent(speaker) {
  console.log(speaker);
}
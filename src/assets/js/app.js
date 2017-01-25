const cardData = filterData(getData());
const showStatus = showStatuses(cardData);
const buttonsContainer = $('[data-event-group]');
const cardsContainer = $('[data-cards]');

function getData() {
  const data = mockAjax();
  return data;
}

function filterData(data) {
  const filteredData =
    data.filter(item => {
      return item.ShowTypeDesc === searchSettings().ShowTypeDesc
    });
  return filteredData;
}

function showStatuses(data) {
  const livePresent = checkItemStatus(data, 'live', '1');
  const upcomingPresent = checkItemStatus(data, 'upcoming', '0');
  const ondemandPresent = checkItemStatus(data, 'ondemand', '1');
  return {
    livePresent: livePresent,
    upcomingPresent: upcomingPresent,
    ondemandPresent: ondemandPresent
  }
}

function initCardSection(data, showStatus, array) {
  const buttons = buildButtons(showStatus);
  buttonsContainer.append(buttons);
  cardsContainer.append('Dat boi');
  $('[data-status]')[0].className += ' is-active'
  data.map((item, index) => {
    item
  });
}

//     .map((item, index) => {

//       //const date = formatTime(item.FromDateTime, item.TZAbbrev);
//       
//       //const isAvail = 
//       
//       const speakerImg = (item.ShowImage === '' ? '' : `${item.ShowImage}`);
//       let speakerDisplay = speakerPresent(item.WCSpeakerList)
//         .map((item, index) => {
//           return buildSpeaker(item, index)
//         })
//         .join('');
//       //Iterate through objects to build card(s)
//       array.push(buildCard(item, index, date, speakerImg, speakerDisplay));
//     });
//   return array;
// }
//const data = data => data.map(data => cardsContainer.innerHTML += data);

$(document).ready(function() {
  initCardSection(cardData, showStatus, []);
  listeners();
  trimEmptyTags();
  $(document).foundation();
});
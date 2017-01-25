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
  $('[data-status]')[0].className += ' is-active'
  data.map((item, index) => {
    const date = formatTime(item.FromDateTime, item.TZAbbrev);
    let speakerDisplay = speakerPresent(item.WCSpeakerList)
      .map((item, index) => buildSpeaker(item, index))
      .join('');
    array.push(buildCard(item, index, date, speakerDisplay));
  });
  return array;
}

function card(data) {
  cardsContainer.html(data.join(''));
}

$(document).ready(function() {
  const cardHTML = initCardSection(cardData, showStatus, []);
  card(cardHTML);
  listeners();
  trimEmptyTags();
  $(document).foundation();
});
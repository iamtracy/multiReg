function getShowData() {
  const data = mockAjax();
  return data;
}

function filterShowData(data) {
  const filteredData =
    data.filter(item => {
      return item.ShowTypeDesc === searchSettings().ShowTypeDesc;
    });
  return filteredData;
}

function getShowStatus(data) {
  const showTypeKey = ['live', 'upcoming', 'ondemand'];
  const livePresent = checkItemStatus(data, 'live', showTypeKey, '1');
  const upcomingPresent = checkItemStatus(data, 'upcoming', showTypeKey, '0');
  const ondemandPresent = checkItemStatus(data, 'ondemand', showTypeKey, '1');
  return {
    livePresent: livePresent,
    upcomingPresent: upcomingPresent,
    ondemandPresent: ondemandPresent
  }
}

function getCardData(data, showStatus, array) {
  const buttonsContainer = $('[data-event-group]');
  const buttons = buildButtons(showStatus);
  buttonsContainer.append(buttons);
  $('[data-status]')[0].className += ' is-active';
  data.map((item, index) => {
    const date = formatTime(item.FromDateTime, item.TZAbbrev);
    let speakerData = speakerPresent(item.WCSpeakerList)
      .map((item, index) => speakerContent(item, index))
      .join('');
    array.push(cardContent(item, index, date, speakerData));
  });
  return array;
}

function buildCards(data) {
  const cardsContainer = $('[data-cards]');
  cardsContainer.html(data.join(''));
}

$(document).ready(function() {
  const showData = filterShowData(getShowData());
  const showStatus = getShowStatus(showData);
  const cardData = getCardData(showData, showStatus, []);
  buildCards(cardData);
  listeners();
  trimEmptyPTags();
  $(document).foundation();
});
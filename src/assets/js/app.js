const userSettings = searchSettings();
let firstButton;

function getJSON(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = handleResponse;
    xhr.onerror = e => console.log(e);
    xhr.send();

    function handleResponse() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          dataInit(data.ResultSet[1]);
        } else {
          reject(console.log(this.statusText))
        }
      }
    }
  });
}

const ajaxPromise = getJSON(`
   https://vts.inxpo.com/scripts/
   Server.nxp?LASCmd=AI:4;F:LBSEXPORT!JSON&SQLID=1550
   &CompanyKey=${userSettings.CompanyKey}
   ${userSettings.IncludeRelatedTenants ? '&IncludeRelatedTenants=1' : '&IncludeRelatedTenants=0'}
   ${'&NumDays='+userSettings.NumDays}
   ${userSettings.SortBySoonest ? '&SortBySoonest=1' : '&SortBySoonest=0'}
`);

function dataInit(data) {
  const filteredData = filterShowData(data)
  const showStatus = getShowStatus(filteredData);
  const cardData = getCardData(filteredData, showStatus, []);
  buildCards(cardData);
  $('#RegisterBTN').removeAttr("disabled");
  listeners();
  trimEmptyPTags();
  $(document).foundation();
}

function filterShowData(data) {
  const filteredData =
    data.filter(item => {
      return item.ShowTypeDesc === userSettings.ShowTypeDesc;
    });
  return filteredData;
}

function getShowStatus(data) {
  const livePresent = checkItemStatus(data, 'live');
  const upcomingPresent = checkItemStatus(data, 'upcoming');
  const ondemandPresent = checkItemStatus(data, 'ondemand');
  console.log(livePresent, upcomingPresent, ondemandPresent);
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
  firstButton = $('[data-status]')[0];
  firstButton.className += ' is-active';
  const initLoadStatus = firstButton.dataset.status;
  data.map((item, index) => {
    const date = formatTime(item.FromDateTime, item.TZAbbrev);
    let speakerArray = speakerData(item.WCSpeakerList)
      .map((item, index) => speakerContent(item, index))
      .join('');
    array.push(
      cardContent(item, index, date, speakerArray, initLoadStatus)
    );
  });
  return array;
}

function buildCards(data) {
  const cardsContainer = $('[data-cards]');
  cardsContainer.html(data.join(''));
}
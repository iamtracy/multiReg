let firstButton;
const userSettings = searchSettings();

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
          var data = JSON.parse(xhr.responseText);
          console.log(data.ResultSet[1]);
          dataInit(data.ResultSet[1]);
        } else {
          reject(this.statusText)
        }
      }
    }
  });
}

const ajaxPromise = getJSON(
  `https://vts.inxpo.com/scripts/Server.nxp?LASCmd=AI:4;F:LBSEXPORT!JSON&SQLID=1550&CompanyKey=${userSettings.CompanyKey}${userSettings.IncludeRelatedTenants ? '&IncludeRelatedTenants=1' : '&IncludeRelatedTenants=0'}${'&NumDays='+userSettings.NumDays}${userSettings.SortBySoonest ? '&SortBySoonest=1' : '&SortBySoonest=0'}`);
// ajaxPromise
// .then()
// .then()
// .catch(e => console.log(e))




//Takes initial JSON object and return filtered array of objects
function filterShowData(data) {
  const filteredData =
    data.filter(item => {
      return item.ShowTypeDesc === searchSettings().ShowTypeDesc;
    });
  console.log(filteredData);
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
  firstButton = $('[data-status]')[0];
  firstButton.className += ' is-active';
  const initLoadStatus = firstButton.dataset.status;
  data.map((item, index) => {
    const date = formatTime(item.FromDateTime, item.TZAbbrev);
    let speakerData = speakerPresent(item.WCSpeakerList)
      .map((item, index) => speakerContent(item, index))
      .join('');
    array.push(cardContent(item, index, date, speakerData, initLoadStatus));
  });
  return array;
}

function buildCards(data) {
  const cardsContainer = $('[data-cards]');
  cardsContainer.html(data.join(''));
}

function dataInit(data) {
  const filteredData = filterShowData(data)
  const showStatus = getShowStatus(filteredData);
  const cardData = getCardData(filteredData, showStatus, []);
  buildCards(cardData);
  listeners();
  trimEmptyPTags();
  $(document).foundation();
}
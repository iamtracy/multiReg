function checkItemStatus(data, keytoMatch, showTypeKey, showTypeValue) {
  let status = false;
  data.map(item => {
    if (
      keytoMatch === showTypeKey[0] && item.OpenNow == showTypeValue ||
      keytoMatch === showTypeKey[1] && item.OpenNow == showTypeValue ||
      keytoMatch === showTypeKey[2] && item.IsOnDemand == showTypeValue
    ) {
      status = true;
    }
  });
  return status;
}

function buildButtons(showStatus) {
  const buttons = `
    <div class="button-group">
      ${showStatus.livePresent ? '<a class="button" data-status="live">Live</a>' : ''}
      ${showStatus.upcomingPresent ? '<a class="button" data-status="upcoming">Upcoming</a>' : ''}
      ${showStatus.ondemandPresent ? '<a class="button" data-status="ondemand">On Demand</a>' : ''}
    </div>
    <blockquote>
      <div class="small-12 custom-checkbox">
        <label class="customCheckboxControl customCheckboxTick">
            <input type="checkbox" name="selectAll">
            <div class="customCheckbox"></div>
            <div class="select-event">Select all events below or check individual events you would like to register for.</div>
        </label>
      </div>
    </blockquote>`;
  return buttons;
}

function speakerPresent(data) {
  let speakers = data.split('||');
  let speaker = speakers.map((item, index) => {
    let about = item.split('^');
    if (about[0] !== "") {
      return {
        name: about[0],
        img: about[1],
        bio: about[2]
      };
    }
  }).filter(item => item !== undefined);
  return speaker;
}

function speakerContent(item, index) {
  return `<div class="media-object-section">
            <div class="thumbnail">
              <img src="${item.img}" alt="Space">
            </div>
          </div>
          <div class="media-object-section">
            <h4>${item.name}</h4>
            <p>${item.bio}</p>
          </div>`;
}

function cardContent(item, index, date, speakerData, initLoadStatus) {
  let itemStatus;
  let showImage;
  console.log(typeof item.OpenNow);
  switch (item.OpenNow) {
    case 1:
      itemStatus = 'live';
      break;
    case 0:
      itemStatus = 'upcoming';
      break;
    default:
      switch (item.IsOnDemand) {
        case 1:
          itemStatus = 'ondemand';
          break;
        default:
          break;
      }
  }

  if (item.ShowImage === '') {
    showImage = ''
  } else {
    showImage = `<img src="${item.ShowImage}" alt="${item.ShowTypeDesc} Image">`
  }

  console.log('item.OpenNow: ' + item.OpenNow, initLoadStatus, itemStatus);
  return `<div class="card ${initLoadStatus === itemStatus ? '' : 'hide'}" data-live="${item.OpenNow}" data-ondemand="${item.IsOnDemand}">
            <div class="ShowCheckbox">
              <label class="customCheckboxControl customCheckboxTick">
                <input type="checkbox" name="ShowKey" data-showkey="${item.ShowKey}" data-packagekey="${item.ShowPackageKey}">
                <div class="customCheckbox"></div>
                <span class="select-event">Select this event</span>
              </label>
            </div>
            ${showImage}
            <div class="card-section">
              <div class="card-desc">
                <h4>${item.ShowTitle}</h4>
                <h6><b>Date</b>: ${date.year}</h6>
                <h6><b>Time</b>: ${date.time}</h6>
              </div>
              <p>${item.Comments}</p>
              <section>
                <div class="dropdown-pane top hide" id="speaker${index}" data-speaker-toggler>
                  ${speakerData}
                </div>
              </section>
              <button class="hollow button ${(speakerData.length === 0 ? 'hide' : '')}" type="button" data-speaker-toggler="speaker${index}" data-speaker>
                View Speakers
              </button>
            </div>
          </div>`;
}
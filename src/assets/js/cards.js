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

function checkItemStatus(data, type) {
  let status = false;
  data.map(item => {
    if (type === 'live') {
      if (item.OpenNow === 1 && item.IsOnDemand === 0) {
        status = true;
      }
    } else if (type === 'upcoming') {
      if (item.OpenNow === 0 && item.IsOnDemand === 0) {
        status = true;
      }
    } else if (type === 'ondemand') {
      if (item.IsOnDemand === 1) {
        status = true;
      }
    }
  });
  return status;
}

function getImage(imageUrl, desc) {
  let img;
  if (imageUrl === '') {
    img = '';
  } else {
    img = `<img src="${imageUrl}" alt="${desc} Image">`;
  }
  return img;
}

function getStatus(openStatus, onDemandStatus) {
  let itemStatus;
  if (openStatus === 1 && onDemandStatus === 0) {
    itemStatus = 'live';
  } else if (openStatus === 0) {
    itemStatus = 'upcoming';
  } else if (onDemandStatus === 1) {
    itemStatus = 'ondemand';
  }
  return itemStatus;
}

function getcheckBox(data) {
  if (data.IsRegistrationOpen === 1) {
    return `
      <div class="ShowCheckbox">
        <label class="customCheckboxControl customCheckboxTick">
          <input type="checkbox" name="ShowKey" data-showkey="${data.ShowKey}" data-packagekey="${data.ShowPackageKey}">
          <div class="customCheckbox"></div>
          <span class="select-event">Select this event</span>
        </label>
      </div>
    `;
  }
  return '';
}

function speakerData(data) {
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

function speakerContent(item) {
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
  const itemStatus = getStatus(item.OpenNow, item.IsOnDemand);
  const showImage = getImage(item.ShowImage, item.ShowTypeDesc);
  const checkBoxToDisplay = getcheckBox(item);
  return `<div class="card ${initLoadStatus === itemStatus ? '' : 'hide'}" data-live="${item.OpenNow}" data-ondemand="${item.IsOnDemand}">
            ${checkBoxToDisplay}
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
              <div class="button-group">
                <a class="hollow button ${(speakerData.length === 0 ? 'hide' : '')}" type="button" data-speaker-toggler="speaker${index}" data-speaker>
                  View Speakers
                </a>
                <a class="hollow button success ${(itemStatus === 'live' || itemStatus === 'ondemand' ? '' : 'hide')}" type="button" href="https://vts.inxpo.com/Launch/QReg.htm?ShowKey=${item.ShowKey}" target="_blank">
                  Login
                </a>
              </div>
            </div>
          </div>`;
}
let liveIsPresent = false;
let upcomingIsPresent = false;
let onDemandIsPresent = false;

function checkItemStatus(data, object, value) {
  let status = false;
  data.map(item => {
    if (object === 'live' && item.OpenNow == 1 || object === 'upcoming' && item.OpenNow == 0 || object === 'ondemand' && item.IsOnDemand == 1) {
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
            <span class="select-event">Select all events below or check individual events you would like to register for.</span>
        </label>
      </div>
    </blockquote>`;
  return buttons;
}

function speakerPresent(speaker) {
  let speakers = speaker.split('||');
  let response = speakers.map((item, index) => {
    let about = item.split('^');
    if (about[0] !== "") {
      return {
        name: about[0],
        img: about[1],
        bio: about[2]
      };
    }
  }).filter(item => item !== undefined);
  return response;
}

function buildSpeaker(item, index) {
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

function buildCard(item, index, date, speakerDisplay) {
  return `<div class="card ${(item.OpenNow === 0 ? 'hide' : '')}" data-live="${item.OpenNow}" data-ondemand="${item.IsOnDemand}">
            <div class="ShowCheckbox">
              <label class="customCheckboxControl customCheckboxTick">
                <input type="checkbox" name="ShowKey" data-showkey="${item.ShowKey}" data-packagekey="${item.ShowPackageKey}">
                <div class="customCheckbox"></div>
                <span class="select-event">Select this event</span>
              </label>
            </div>
            <img src="${item.ShowImage}" alt="${item.ShowTypeDesc} Image">
            <div class="card-section">
              <div class="card-desc">
                <h4>${item.ShowTitle}</h4>
                <h6><b>Date</b>: ${date.year}</h6>
                <h6><b>Time</b>: ${date.time}</h6>
              </div>
              <p>${item.Comments}</p>
              <section>
                <div class="dropdown-pane top hide" id="speaker${index}" data-speaker-toggler>
                  ${speakerDisplay}
                </div>
              </section>
              <button class="hollow button ${(speakerDisplay.length === 0 ? 'hide' : '')}" type="button" data-speaker-toggler="speaker${index}" data-speaker>
                View Speakers
              </button>
            </div>
          </div>`;
}
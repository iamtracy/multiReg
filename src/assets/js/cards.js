let liveIsPresent = false;
let upcomingIsPresent = false;
let onDemandIsPresent = false;

function checkItemStatus(item) {
  if (item.OpenNow === 1) liveIsPresent = true;
  if (item.OpenNow === 0) upcomingIsPresent = true;
  if (item.IsOnDemand === 1) onDemandIsPresent = true;
  return {
    liveIsPresent: liveIsPresent,
    upcomingIsPresent: upcomingIsPresent,
    onDemandIsPresent: onDemandIsPresent
  }
}

function buildButton() {
  return `<a class="button ${(liveIsPresent ? 'is-active' : 'hide')}" data-status="live">Live</a>
           <a class="button ${(upcomingIsPresent  ? '' : 'hide')}${(liveIsPresent ? '' : 'is-active')}" data-status="upcoming">Upcoming</a>
           <a class="button ${(onDemandIsPresent ? '' : 'hide')}${(upcomingIsPresent ? '' : 'is-active')}" data-status="ondemand">On Demand</a>`
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

function buildCard(item, index, date, speakerImg, speakerDisplay) {

  return `<div class="card ${(item.OpenNow === 0 ? 'hide' : '')}" data-live="${item.OpenNow}" data-ondemand="${item.IsOnDemand}">
            <div class="ShowCheckbox">
              <label class="customCheckboxControl customCheckboxTick">
                <input type="checkbox" name="ShowKey" data-showkey="${item.ShowKey}" data-packagekey="${item.ShowPackageKey}">
                <div class="customCheckbox"></div>
                <span class="select-event">Select this event</span>
              </label>
            </div>
            <img src="${speakerImg}" alt="${item.ShowTypeDesc} Image">
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
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
  return `<div class="card ${(item.OpenNow === 0 ? 'hide' : '')}" data-live=${item.OpenNow} data-ondemand=${item.IsOnDemand}>
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
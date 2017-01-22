let speakerHTML = `<div class="orbit" role="region" aria-label="Favorite Space Pictures" data-orbit>
                    <ul class="orbit-container">
                      button class="orbit-previous"><span class="show-for-sr">Previous Slide</span>&#9664;&#xFE0E;</button>
                      <button class="orbit-next"><span class="show-for-sr">Next Slide</span>&#9654;&#xFE0E;</button>`;

const initCards = (data, array) => {
  data.filter(item => item.ShowTypeDesc === searchSettings().ShowTypeDesc)
    .map((item, index) => {
      let date = formatTime(item.FromDateTime, item.TZAbbrev);
      let speakerImg = (item.ShowImage === '' ? '' : `${item.ShowImage}`);
      let speakerDisplay = speakerPresent(item.WCSpeakerList)
        .map((item, index) => buildSpeaker(item, index))
        .join(' ');
      array.push(buildCard(item, index, date, speakerImg, speakerDisplay));
    });
  return array;
}

function buildSpeaker(item, index) {
  return `<li class="${(index === 0 ? 'is-active' : '')} orbit-slide">
            <img class="orbit-image" src="${item.img}" alt="Space">
            <div class="media-object-section">
              <h4>${item.name}</h4>
              <p>${item.bio}</p>
            </div>
          </li>`;
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
              <button 
                class="hollow button ${(speakerDisplay.length === 0 ? 'hide' : '')}" 
                type="button" data-speaker-toggler="speaker${index}" 
                data-speaker>
                View Speakers
              </button>
            </div>
          </div>`;
}

speakerHTML += `</ul>
                  <nav class="orbit-bullets">
                    <button class="is-active" data-slide="0"><span class="show-for-sr">First slide details.</span><span class="show-for-sr">Current Slide</span></button>
                    <button data-slide="1"><span class="show-for-sr">Second slide details.</span></button>
                    <button data-slide="2"><span class="show-for-sr">Third slide details.</span></button>
                    <button data-slide="3"><span class="show-for-sr">Fourth slide details.</span></button>
                  </nav>
                </div>`
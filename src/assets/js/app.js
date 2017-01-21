(function(formSettings, searchSettings) {
  const companyKey = searchSettings.CompanyKey;
  const showDesc = searchSettings.ShowTypeDesc;
  const cardContainer = $('#cards')[0];

  const results = fakeAjax();
  const initData = (data, array) => {
    data
      .filter(item => item.ShowTypeDesc === showDesc)
      .map((item, index) => {
        let date = formatTime(item.FromDateTime, item.TZAbbrev);
        let speakerDisplay =
          speakerPresent(item.WCSpeakerList)
          .map(item => {
            return `<div class="media-object">
                      <div class="media-object-section">
                        <img src="${item.img}">
                      </div>
                      <div class="media-object-section">
                        <h4>${item.name}</h4>
                        <p>${item.bio}</p>
                      </div>
                    </div>`
          }).join(' ');
        array.push(
          `<div class="card ${(item.OpenNow === 0 ? 'hide' : '')}" data-live=${item.OpenNow} data-ondemand=${item.IsOnDemand}>
            <div class="ShowCheckbox">
              <label class="customCheckboxControl customCheckboxTick">
                <input type="checkbox" name="ShowKey" data-showkey="${item.ShowKey}" data-packagekey="${item.ShowPackageKey}">
                <div class="customCheckbox"></div>
                <span class="select-event">Select this event</span>
              </label>
            </div>
            <img src="${item.ShowImage}" alt="">
            <div class="card-section">
              <h4>${item.ShowTitle}</h4>
              <h6><b>Date</b>: ${date.year}</h6>
              <h6><b>Time</b>: ${date.time}</h6>
              <p>${item.Comments}</p>
              <button 
                class="hollow button ${(speakerDisplay.length === 0 ? 'hide' : '')}" 
                type="button" data-toggle="speaker${index}" 
                data-speaker>
                View Speakers
              </button>
              <section>
                <div class="dropdown-pane top hide" id="speaker${index}" data-toggler=".hide">
                  ${speakerDisplay}
                </div>
              </section>
            </div>
          </div>`);
      });
    return array;
  }

  const data = initData(results, []);

  const init = data => data.map(data => cardContainer.innerHTML += data);

  $(document).ready(function() {
    init(data);
    listeners();
    $(document).foundation();
  });

})(formSettings(), searchSettings());
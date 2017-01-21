let cardCheckBoxes;
let checkAllCheckbox;
let speakerButtons;
let cardButtons;
let submit;

function speakerPresent(speaker) {
  let speakers = speaker.split('||');
  let response = speakers.map((item, index) => {
    let ind = item.split('^');
    if (ind[0] !== "") {
      return {
        name: ind[0],
        img: ind[1],
        bio: ind[2]
      };
    }
  }).filter(item => item !== undefined);
  return response;
}

function readMoreLess() {
  if ($(this)[0].innerText === "View Speakers") {
    $(this)[0].innerText = "Hide Speakers";
  } else {
    $(this)[0].innerText = "View Speakers";
  }
}

function cardGroupSelect() {
  const cards = $('.card').toArray();
  console.log($(this)[0].hash == "#cardsLive")
  if ($(this)[0].hash == "#cardsLive") {
    cards.map(item => {
      if (item.dataset.live === '1') {
        item.classList = "card"
      } else {
        item.classList = "card hide";
      }
    })
  }

  if ($(this)[0].hash == "#cardsUpcoming") {
    cards.map(item => {
      if (item.dataset.live === '0') {
        item.classList = "card"
      } else {
        item.classList = "card hide";
      }
    })
  }

  if ($(this)[0].hash == "#cardsOnDemand") {
    cards.map(item => {
      if (item.dataset.ondemand === '1') {
        item.classList = "card"
      } else {
        item.classList = "card hide";
      }
    })
  }

  console.log($(this)[0].hash, cards);
}

function checkAll() {
  console.log('check all');
  let selectedListArray = selectedElemList.toArray();
  if (this.checked) {
    selectedListArray.forEach(item => item.checked = true)
  } else {
    selectedListArray.forEach(item => item.checked = false)
  }
  selectionState();
}

function selectionState() {
  console.log('selectState')
    //   let selectedListArray = selectedElemList.toArray();
    //   selected = [];
    //   selectedListArray.
    //   filter(item => item.checked === true).
    //   forEach(item => {
    //     selected.push({
    //       showKey: item.dataset.showkey,
    //       showPackageKey: item.dataset.packagekey
    //     });
    //   });
    //   console.log(selected);
    //   return selected;
}

function listeners() {
  cardCheckBoxes = $('input[name="ShowKey"]');
  checkAllCheckbox = $('input[name="selectAll"]');
  speakerButtons = $('[data-speaker]');
  cardButtons = $('.button-group .button');
  submit = $('#RegisterBTN');
  cardCheckBoxes.change(selectionState);
  checkAllCheckbox.change(checkAll);
  speakerButtons.click(readMoreLess)
  cardButtons.click(cardGroupSelect);
  submit.click(onSubmit);
}

function onSubmit() {
  let formData = $('#MainForm').serialize();
  let cUrl = `Server.nxp?LASCmd=AI:4;F:LBSEXPORT!JSON&SQLID=1550&CompanyKey=${searchSettings().CompanyKey}&${formData}`;
  console.log(cUrl);
}
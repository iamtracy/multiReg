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

function cardButtonClick(e) {
  let activeState = $('[data-event-group] .button');
  activeState.removeClass('is-active');
  $(this).addClass('is-active');
  if ($(this)[0].hash == "#cardsLive") cardSort('live', true, '1');
  if ($(this)[0].hash == "#cardsUpcoming") cardSort('live', true, '0');
  if ($(this)[0].hash == "#cardsOnDemand") cardSort('ondemand', false, '1');
}

function cardSort(dataAttr, boolean, number) {
  const cards = $('.card').toArray();
  cards.map(item => {
    if (boolean) {
      if (item.dataset[dataAttr] === number) {
        item.classList = "card"
      } else {
        item.classList = "card hide";
      }
    } else {
      if (item.dataset[dataAttr] === number) {
        item.classList = "card"
      } else {
        item.classList = "card hide";
      }
    }
  });
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
  cardButtons = $('[data-event-group] .button');
  submit = $('#RegisterBTN');
  cardCheckBoxes.change(selectionState);
  checkAllCheckbox.change(checkAll);
  speakerButtons.click(readMoreLess)
  cardButtons.click(cardButtonClick);
  submit.click(onSubmit);
}

function onSubmit() {
  let formData = $('#MainForm').serialize();
  let cUrl = `Server.nxp?LASCmd=AI:4;F:LBSEXPORT!JSON&SQLID=1550&CompanyKey=${searchSettings().CompanyKey}&${formData}`;
  console.log(cUrl);
}
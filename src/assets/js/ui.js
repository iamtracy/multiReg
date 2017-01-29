let cardCheckBoxes;

function readMoreLess() {
  let elem = $(this)[0];
  let speakerID = $(elem.dataset.speakerToggler).selector;
  let speakerElem = $(`#${speakerID}`);
  speakerElem.toggleClass('hide');
  if (elem.innerText === "View Speakers") {
    elem.innerText = "Hide Speakers";
  } else {
    elem.innerText = "View Speakers";
  }
}

function cardClickToSort() {
  let elem = $(this)[0];
  let activeState = $('[data-event-group] .button');
  activeState.removeClass('is-active');
  $(this).addClass('is-active');
  if (elem.dataset.status === "live") cardSort('live');
  if (elem.dataset.status === "upcoming") cardSort('upcoming');
  if (elem.dataset.status === "ondemand") cardSort('ondemand');
}

function cardSort(type) {
  const cards = $('.card').toArray();
  cards.map(item => {
    if (type === 'live') {
      if (item.dataset.live === '1' && item.dataset.ondemand === '0') {
        item.classList = "card";
      } else {
        item.classList = "card hide";
      }
    }
    if (type === 'upcoming') {
      if (item.dataset.live === '0' && item.dataset.ondemand === '0') {
        item.classList = "card";
      } else {
        item.classList = "card hide";
      }
    }
    if (type === 'ondemand') {
      if (item.dataset.ondemand === '1') {
        item.classList = "card";
      } else {
        item.classList = "card hide";
      }
    }
  });
}

function checkAll() {
  let selectedListArray = cardCheckBoxes.toArray();
  if (this.checked) selectedListArray.forEach(item => item.checked = true);
  else selectedListArray.forEach(item => item.checked = false);
  selectionState();
}

function selectionState() {
  let selectedListArray = cardCheckBoxes.toArray();
  let selected = [];
  selectedListArray.
  filter(item => item.checked === true).
  forEach(item => {
    selected.push({
      showKey: item.dataset.showkey,
      showPackageKey: item.dataset.packagekey
    });
  });
  console.log(selected);
  return selected;
}

function listeners() {
  const checkAllCheckbox = $('input[name="selectAll"]');
  checkAllCheckbox.change(checkAll);
  const speakerButtons = $('[data-speaker]');
  speakerButtons.click(readMoreLess)
  const cardButtons = $('[data-event-group] .button');
  cardButtons.click(cardClickToSort);
  const submit = $('#RegisterBTN');
  submit.click(onSubmit);
  cardCheckBoxes = $('input[name="ShowKey"]');
  cardCheckBoxes.change(selectionState);
}

function onSubmit() {
  let formData = $('#MainForm').serialize();
  let cUrl = `Server.nxp?LASCmd=AI:4;F:LBSEXPORT!JSON&SQLID=1550&CompanyKey=${searchSettings().CompanyKey}&${formData}`;
  console.log(cUrl);
}
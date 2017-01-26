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
  if (elem.dataset.status === "live") cardSort('live', true, '1');
  if (elem.dataset.status === "upcoming") cardSort('live', true, '0');
  if (elem.dataset.status === "ondemand") cardSort('ondemand', false, '1');
}

function cardSort(dataAttr, boolean, number) {
  console.log('sort')
  const cards = $('.card').toArray();
  cards.map(item => {
    if (boolean) {
      if (item.dataset[dataAttr] === number) item.classList = "card"
      else item.classList = "card hide";
    } else {
      if (item.dataset[dataAttr] === number) item.classList = "card"
      else item.classList = "card hide";
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
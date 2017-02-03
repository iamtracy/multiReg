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
  $.map(cards, function(item) {
    if (type === 'live') {
      if (item.dataset.live === '1' && item.dataset.ondemand === '0') {
        $(item).removeClass("hide");
      } else {
        $(item).addClass('hide');
      }
    }
    if (type === 'upcoming') {
      if (item.dataset.live === '0' && item.dataset.ondemand === '0') {
        $(item).removeClass("hide");
      } else {
        $(item).addClass('hide');
      }
    }
    if (type === 'ondemand') {
      if (item.dataset.ondemand === '1') {
        $(item).removeClass("hide");
      } else {
        $(item).addClass('hide');
      }
    }
  });
}

function checkAll() {
  let selectedListArray;
  if (cardCheckBoxes !== "undefined") {
    selectedListArray = cardCheckBoxes.toArray();
    console.log(selectedListArray.length);
    if (this.checked) selectedListArray.forEach(item => item.checked = true);
    else selectedListArray.forEach(item => item.checked = false);
    selectionState();
  }
}

function selectionState() {
  let selectedListArray;
  let selected = [];
  if (cardCheckBoxes !== "undefined") {
    selectedListArray = cardCheckBoxes.toArray();
    selectedListArray.
    filter(item => item.checked === true).
    forEach(item => {
      selected.push({
        showKey: item.dataset.showkey,
        showPackageKey: item.dataset.packagekey
      });
    });
  }
  if(selected.length !== selectedListArray.length){
    $('input[name="selectAll"]').prop('checked', false);
  }
  if(selected.length === selectedListArray.length) {
    $('input[name="selectAll"]').prop('checked', true);
  }
  console.log(selected);
  return selected;
}

function inputsChanged(){
  let value = $.trim($(this).val());
  if(value.length < 1) {
    $(this).siblings('.placeholder').removeClass('hide');
  } else {
    $(this).siblings('.placeholder').addClass('hide');
    console.log('more than 0')
  }
}

function listeners() {
  const checkAllCheckbox = $('input[name="selectAll"]');
  checkAllCheckbox.change(checkAll);
  const speakerButtons = $('[data-speaker]');
  speakerButtons.click(readMoreLess);
  const cardButtons = $('[data-event-group] .button');
  cardButtons.click(cardClickToSort);
  const inputs = $('#formFields input[type="text"]');
  inputs.change(inputsChanged)
  cardCheckBoxes = $('input[name="ShowKey"]');
  cardCheckBoxes.change(selectionState);
}

function trimEmptyPTags() {
  $('p').filter(function() { return $.trim(this.innerHTML) == "" }).remove();
}
let cardCheckBoxes;

function readMoreLess() {
  let elem = $(this);
  let speakerID = $(elem.data('speakerToggler')).selector;
  let speakerElem = $(`#${speakerID}`);
  speakerElem.toggleClass('hide');
  if (elem.text() === "View Speakers") {
    elem.text("Hide Speakers");
  } else {
    elem.text("View Speakers");
  }
}

function cardClickToSort() {
  let elem = $(this);
  let activeState = $('[data-event-group] .button');
  activeState.removeClass('is-active');
  elem.addClass('is-active');
  if (elem.data('status') === "live") cardSort('live');
  if (elem.data('status') === "upcoming") cardSort('upcoming');
  if (elem.data('status') === "ondemand") cardSort('ondemand');
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
  if (selected.length > 0) {
    $('#RegisterBTN').removeAttr("disabled");
  } else {
    $('#RegisterBTN').attr("disabled", true);
  }
  if (selected.length !== selectedListArray.length) {
    $('input[name="selectAll"]').prop('checked', false);
  }
  if (selected.length === selectedListArray.length) {
    $('input[name="selectAll"]').prop('checked', true);
  }
  return selected;
}

function inputsChanged() {
  let value = $.trim($(this).val());
  if (value.length < 1) {
    $(this).siblings('.placeholder').removeClass('hide');
  } else {
    $(this).siblings('.placeholder').addClass('hide');
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
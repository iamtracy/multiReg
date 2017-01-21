function speakerPresent(speaker) {
  let speakers = speaker.split('||');
  let response = speakers.map((item, index) => {
    let ind = item.split('^');
    if (ind[index] !== '') {
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
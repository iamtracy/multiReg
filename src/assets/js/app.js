(function(formSettings) {
  const cardsContainer = $('#cards')[0];

  function getData() {
    const data = mockAjax();
    return data;
  }

  function filterInitData(data) {
    const filteredData =
      data.filter(item => {
        return item.ShowTypeDesc === searchSettings().ShowTypeDesc
      });
    return filteredData;
  }

  function initCards(data, array) {
    data.map((item, index) => {
      //const date = formatTime(item.FromDateTime, item.TZAbbrev);
      const status = checkItemStatus(item);
      console.log(status);
      item
    });
  }

  //     .map((item, index) => {

  //       
  //       const buttons = buildButtons(item);
  //       //const isAvail = 
  //       $('[data-event-group]').html(buttons.html);
  //       const speakerImg = (item.ShowImage === '' ? '' : `${item.ShowImage}`);
  //       let speakerDisplay = speakerPresent(item.WCSpeakerList)
  //         .map((item, index) => {
  //           return buildSpeaker(item, index)
  //         })
  //         .join('');
  //       //Iterate through objects to build card(s)
  //       array.push(buildCard(item, index, date, speakerImg, speakerDisplay));
  //     });
  //   return array;
  // }
  // const data = initCards(results, []);
  //const data = data => data.map(data => cardsContainer.innerHTML += data);

  $(document).ready(function() {
    const cardData = filterInitData(getData());
    initCards(cardData, []);
    listeners();
    trimEmptyTags();
    $(document).foundation();
  });

})(formSettings());
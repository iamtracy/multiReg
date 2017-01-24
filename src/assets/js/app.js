(function(formSettings) {
  const results = mockAjax();
  const cardsContainer = $('#cards')[0];

  const initCards = (data, array) => {
    data.filter(item => item.ShowTypeDesc === searchSettings().ShowTypeDesc)
      .map((item, index) => {
        const date = formatTime(item.FromDateTime, item.TZAbbrev);
        const buttons = buildButtons(item);
        let speakerImg = (item.ShowImage === '' ? '' : `${item.ShowImage}`);
        let speakerDisplay = speakerPresent(item.WCSpeakerList)
          .map((item, index) => buildSpeaker(item, index))
          .join('');
        //Iterate through objects to build card(s)
        array.push(buildCard(item, index, date, speakerImg, speakerDisplay));
      });
    return array;
  }
  const data = initCards(results, []);
  const init = data => data.map(data => cardsContainer.innerHTML += data);

  $(document).ready(function() {
    init(data);
    listeners();
    trimEmptyTags();
    $(document).foundation();
  });

})(formSettings());
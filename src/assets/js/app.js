(function(formSettings) {
  const cardsContainer = $('#cards')[0];

  const results = fakeAjax();

  const data = initCards(results, []);

  const init = data => data.map(data => cardsContainer.innerHTML += data);

  $(document).ready(function() {
    init(data);
    listeners();
    trimEmptyTags();
    $(document).foundation();
  });

})(formSettings());
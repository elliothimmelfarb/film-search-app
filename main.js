$(document).ready(init);

function init() {
  $('.searchButton').click(search);
}

function search() {
  var title = $('.title').val();
  var year = $('.year').val();
  var type = $('.typeSelect').val()
  if (title) {
    var req = buildRequestStr(title, year, type);
    $('.searchButton').text("Loading..");
    sendRequest(req);
  } else {
    console.log("no title"); // TODO: what if all inputs are empty?
  }
}

function sendRequest(req) {
  $.get(req)
    .done(data => {
      displaySearchResults(data);
    })
    .fail(error => {
      console.log('error:', error);
    })
    .always(() => {
      console.log("finished")
      $('.searchButton').text("Search");
    });
}

function displaySearchResults(data) {
  var $resultCards = data.Search.map(result => {
    var $resultCard = $('.searchResultTemplate').clone();
    $resultCard.removeClass('hidden searchResultTemplate');
    $resultCard.find('.title').text(result.Title);
    $resultCard.find('.year').text(`Year: ${result.Year}`);
    $resultCard.find('.type').text(`Type: ${result.Type}`);
    return $resultCard;
  });
  $('.displayArea').empty().append($resultCards);

}

function buildRequestStr(title, year, type) {
  var req = `http://www.omdbapi.com/?s=${title}`;
  if(year) {
    req += `&y=${year}`;
  }
  if (type !== 'none') {
    req += `&type=${type}`;
  }
  return req;
}

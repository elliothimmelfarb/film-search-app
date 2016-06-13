'strict';

$(document).ready(init);

function init() {
  $('.searchButton').click(search);
  $('.displayArea').on('click', '.resultCard', getInfo)
}

function search() {
  var title = $('.titleInput').val();
  var year = $('.year').val();
  var type = $('.typeSelect').val()
  if (title) {
    var req = buildSearchRequestStr(title, year, type);
    $('.searchButton').text("Loading..");
    sendSearchRequest(req);
  } else {
    console.log("no title"); // TODO: what if all inputs are empty?
  }
}

function buildSearchRequestStr(title, year, type) {
  var req = `http://www.omdbapi.com/?s=${title}`;
  if(year) {
    req += `&y=${year}`;
  }
  if (type !== 'none') {
    req += `&type=${type}`;
  }
  return req;
}

function sendSearchRequest(req) {
  $.get(req)
    .done(data => {
      displaySearchResults(data);
      console.log(data);
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
    $resultCard.data('infoRequest', `http://www.omdbapi.com/?t=${result.Title}&plot=full&tomatoes=true`);
    return $resultCard;
  });
  $('.displayArea').empty().append($resultCards);
}

function getInfo() {
  var req = $(this).data('infoRequest');
  // TODO: change something to show that data is loading
  sendInfoRequest(req);
  $('.infoModal').modal();
}

function sendInfoRequest(req) {
  $.get(req)
    .done(data => {
      displayInfoResults(data);
    })
    .fail(error => {
      console.log('error:', error);
    })
    .always(() => {
      console.log("finished")
    });
}

function displayInfoResults(data) {
  console.log(data);
}

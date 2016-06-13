'strict';

$(document).ready(init);

function init() {
  $('.searchButton').click(search);
  $('.displayArea').on('click', '.resultCard', getInfo);
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
    $resultCard.data('infoRequest', `http://www.omdbapi.com/?t=${result.Title}&tomatoes=true`);
    return $resultCard;
  });
  $('.displayArea').empty().append($resultCards);
}

function getInfo() {
  var req = $(this).data('infoRequest');
  $('.infoModal').modal()
  $('.modal-content').text("Loading...")
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
  $('.modal-content').empty();
  var $modal = $('.mContentTemplate').clone();
  $modal.removeClass('mContentTemplate');
  var altPoster = 'http://www.moviesnow4u.com/images/default_poster.jpg';
  if (data.Poster !== "N/A") {
    $modal.find('.imgDiv').find('img').attr('src', data.Poster);
  } else {
    $modal.find('.imgDiv').find('img').attr('src', altPoster);
  }
  $modal.find('.mTitle').text(data.Title);
  $modal.find('.director').text(data.Director);
  $modal.find('.released').text(data.Released);
  $modal.find('.actors').text(data.Actors);
  $modal.find('.awards').text(data.Awards);
  $modal.find('.language').text(data.Language);
  $modal.find('.genre').text(data.Genre);
  $modal.find('.plot').text(data.Plot);
  $modal.find('.runtime').text(data.Runtime);
  $modal.find('.production').text(data.Production);
  $modal.find('.imdbScore').text(data.imdbRating);
  $modal.find('.reviewDiv').find('.tomatoesScore').text(data.tomatoRating);
  $modal.find('.metaScore').text(data.MetaScore);
  debugger;

  $('.modal-content').append($modal);
}

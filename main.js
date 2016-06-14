'strict';

var currentPage = 0;
var pageCount = 0;

$(document).ready(init);

function init() {
  $('.searchButton').click(search);
  $('.displayArea').on('click', '.resultCard', getInfo);
  $('.app').on('click', '.pageNext', pageNext);
  $('.app').on('click', '.pageBack', pageBack);
}

function search() {
  currentPage = 0;
  localStorage.pages = '[]';
  var title = $('.titleInput').val();
  $('.titleInput').val('');
  var year = $('.year').val();
  var type = $('.typeSelect').val()
  if (title) {
    var req = buildSearchRequestStr(title, year, type);
    $(this).data('searchRequest', req);
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
      if (!retrievePage(currentPage)) cachePage(data);
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
  pageCount = Math.ceil(data.totalResults / 10);
  var $resultCards = data.Search.map(result => {
    var $resultCard = $('.searchResultTemplate').clone();
    $resultCard.removeClass('hidden searchResultTemplate');
    $resultCard.find('.title').text(result.Title);
    $resultCard.find('.year').text(`Year: ${result.Year}`);
    $resultCard.find('.type').text(`Type: ${result.Type}`);
    $resultCard.data('infoRequest', `http://www.omdbapi.com/?t=${result.Title}&tomatoes=true`);
    return $resultCard;
  });
  if (pageCount > 1) $('.paginationDiv').removeClass('hidden');
  if (currentPage === 0) $('.pageBack').hide();
  else $('.pageBack').show();
  if ((currentPage + 1) === pageCount) $('.pageNext').hide();
  else $('.pageNext').show();
  $('.pageNext').find('i').removeClass('glyphicon glyphicon-refresh').addClass('glyphicon glyphicon-arrow-right');
  $('.pageBack').find('i').removeClass('glyphicon glyphicon-refresh').addClass('glyphicon glyphicon-arrow-left')
  $('.currentPage').text(`${currentPage + 1} of ${pageCount}`)
  $('.pageLoading').text('');
  $('.displayArea').empty().append($resultCards);
}

function getInfo() {
  var req = $(this).data('infoRequest');
  $('.infoModal').modal()
  $('.modal-content').text("Loading...")
  sendInfoRequest(req);
  //$('.infoModal').modal();
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
  $modal.find('.tomatoesScore').text(data.tomatoRating);
  $modal.find('.metaScore').text(data.Metascore);
  $('.modal-content').append($modal);
}

function cachePage(data) {
  let pages = JSON.parse(localStorage.pages);
  pages.push(data);
  localStorage.pages = JSON.stringify(pages);
}

function retrievePage(index) {
  let pages = JSON.parse(localStorage.pages);
  return pages[index];
}

function pageNext() {
  $('.pageNext').find('i').removeClass('glyphicon glyphicon-arrow-right').addClass('glyphicon glyphicon-refresh');
  $('.pageBack').find('i').removeClass('glyphicon glyphicon-arrow-left').addClass('glyphicon glyphicon-refresh');
  currentPage++;
  if (retrievePage(currentPage)) displaySearchResults(retrievePage(currentPage));
  else {
    let req = $('.searchButton').data('searchRequest');
    req += `&page=${currentPage + 1}`
    console.log(req);
    sendSearchRequest(req);
  }
}

function pageBack() {
  $('.pageNext').find('i').removeClass('glyphicon glyphicon-arrow-right').addClass('glyphicon glyphicon-refresh');
  $('.pageBack').find('i').removeClass('glyphicon glyphicon-arrow-left').addClass('glyphicon glyphicon-refresh');
  currentPage--;
  displaySearchResults(retrievePage(currentPage));
}

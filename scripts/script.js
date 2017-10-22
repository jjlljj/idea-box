var $titleInput = $('#title-input');
var $bodyInput = $('#body-input');
var $saveButton = $('.button-save');

var $searchInput = $('#search-input');
var $cardsContainer = $('#cards-container')

// don't actually need these yet.. may later though
var $ideaCard = $('.idea-card')
var $cardDeleteButtons = $('.card-delete-button');
var $cardHeader = $('.card-header');
var $cardContent = $('.card-content');
//

var $upvoteButton = $('.upvote-button');
var $downvoteButton = $('.downvote-button');
var $ideaQuality = $('.idea-quality');

$(document).ready( function() {
  displayStorage();
})

$saveButton.on('click', makeCard);

$searchInput.keyup(searchCards)

$cardsContainer.on('click', '.idea-card .card-delete-button', function() {
  deleteCard(this)
});

$cardsContainer.on('click', '.idea-card .upvote-button', function() {
  setIdeaQuality(this, 'upvote') 
});

$cardsContainer.on('click', '.idea-card .downvote-button', function() {
  setIdeaQuality(this, 'downvote') 
});

function makeCard(e) {
  e.preventDefault();

  var cardKey = Date.now();
  var titleVal = $titleInput.val();
  var bodyVal = $bodyInput.val();
  var ideaQuality = 'plausible';
  prependCards(cardKey, titleVal, bodyVal, ideaQuality);
  addToStorage(cardKey, titleVal, bodyVal, ideaQuality);

  resetInputs();
}

function prependCards(key, title, body, quality) {
  $cardsContainer.prepend(
    $(  `<article class="idea-card" id="${key}">
      <header class="card-header-container">
        <h3 class="card-header">${title}</h3>
        <button class="card-delete-button">DEL</button>
      </header>
      <p class="card-content"> ${body}</p>
      <footer class="card-footer-container">
        <button class="upvote-button">UP</button>
        <button class="downvote-button">DO</button>
        <h4 class="quality-header">quality: <span class="idea-quality">${quality}</span></h4>
      </footer>
    </article> `
    )
  );
}

function IdeaObject (cardKey, title, body, quality ){
  this.cardKey = cardKey;
  this.title = title;
  this.body = body;
  this.quality = quality;
}

function addToStorage(key, title, body, quality) {
  var newIdea = new IdeaObject(key, title, body, quality);
  localStorage.setItem(key, JSON.stringify(newIdea))
}

function displayStorage () {
  for (i=0; i < localStorage.length; i++){
    var thisCardKey = JSON.parse(Object.values(localStorage)[i]).cardKey;
    var thisCardTitle = JSON.parse(Object.values(localStorage)[i]).title;
    var thisCardBody = JSON.parse(Object.values(localStorage)[i]).body;
    var thisIdeaQuality = JSON.parse(Object.values(localStorage)[i]).quality;

    prependCards(thisCardKey, thisCardTitle, thisCardBody, thisIdeaQuality)
  }
}

function deleteCard (card) {
  thisKey = $(card).closest('.idea-card').attr('id');
  card.closest('.idea-card').remove();
  localStorage.removeItem(thisKey);
}

function resetInputs () {
  $titleInput.val("");
  $bodyInput.val("");
  $searchInput.val("");
}

function searchCards(e) {
  e.preventDefault();
  // build search functionality here
  console.log($searchInput.val())
}

function setIdeaQuality (card, vote) {
  var thisKey = $(card).closest('.idea-card').attr('id');
  var $thisIdea = JSON.parse(localStorage.getItem(thisKey))

  if ($thisIdea.quality === 'plausible' && vote === 'upvote') {
    $(`#${thisKey} .idea-quality`).text('genius')
    $thisIdea.quality = "genius";
  } else if ($thisIdea.quality === 'plausible' && vote === 'downvote') {
    $(`#${thisKey} .idea-quality`).text('swill')
    $thisIdea.quality = "swill";
  } else if ($thisIdea.quality === 'swill' && vote === 'upvote') {
    $(`#${thisKey} .idea-quality`).text('plausible')
    $thisIdea.quality = "plausible";
  } else if ($thisIdea.quality === 'genius' && vote === 'downvote') {
    $(`#${thisKey} .idea-quality`).text('plausible')
    $thisIdea.quality = "plausible";
  };

  localStorage.setItem(thisKey, JSON.stringify($thisIdea))
}

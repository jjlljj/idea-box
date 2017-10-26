var $titleInput = $('#title-input');
var $bodyInput = $('#body-input');
var $saveButton = $('.button-save');

var $searchInput = $('#search-input');
var $cardsContainer = $('#cards-container')

var $upvoteButton = $('.upvote-button');
var $downvoteButton = $('.downvote-button');
var $ideaQuality = $('.idea-quality');

var sortState = 0;

$(document).ready( function() {
  displayStorage();
})

$searchInput.keyup(searchCards)

$bodyInput.keyup( function() {
    sizeInput(this)
});

$('#button-sort').click(sortCards);

$saveButton.on('click', makeCard);

$cardsContainer.on('click', '.idea-card .card-delete-button', function() {
  deleteCard(this)
});

$cardsContainer.on('click', '.idea-card .upvote-button', function() {
  setIdeaQuality(this, 'upvote') 
});

$cardsContainer.on('click', '.idea-card .downvote-button', function() {
  setIdeaQuality(this, 'downvote') 
});

$cardsContainer.on('blur', '.idea-card .card-header', function() {
  saveCardTitle(this);
});

$cardsContainer.on('blur', '.idea-card .card-content', function() {
  saveCardBody(this);
});


function addToStorage(key, title, body, quality) {
  var newIdea = new IdeaObject(key, title, body, quality);
  localStorage.setItem(key, JSON.stringify(newIdea))
}

function deleteCard (card) {
  thisKey = $(card).closest('.idea-card').attr('id');
  card.closest('.idea-card').remove();
  localStorage.removeItem(thisKey);
}

function displayStorage () {
  for (i=0; i < localStorage.length; i++){
    var $thisCard = JSON.parse(localStorage.getItem(localStorage.key(i)));
    prependCards($thisCard.cardKey, $thisCard.title, $thisCard.body, $thisCard.quality)
  }
}

function IdeaObject (cardKey, title, body, quality ){
  this.cardKey = cardKey;
  this.title = title;
  this.body = body;
  this.quality = quality;
}

function makeCard(e) {
  e.preventDefault();

  var cardKey = Date.now();
  var titleVal = $titleInput.val();
  var bodyVal = $bodyInput.val();
  var ideaQuality = 'swill';

  if (titleVal === "" || bodyVal === "") {
    $saveButton.text("please enter an idea");
    setTimeout(function(){ $saveButton.text("save"); }, 2500);
    return false;
  }

  prependCards(cardKey, titleVal, bodyVal, ideaQuality);
  addToStorage(cardKey, titleVal, bodyVal, ideaQuality);

  resetInputs();
}

function prependCards(key, title, body, quality) {
  $cardsContainer.prepend(
    $(  `<article class="idea-card" id="${key}">
      <header class="card-header-container">
        <h3 class="card-header" contenteditable="true">${title}</h3>
        <button class="card-delete-button"></button>
      </header>
      <p class="card-content" contenteditable="true">${body}</p>
      <footer class="card-footer-container">
        <button class="upvote-button"></button>
        <button class="downvote-button"></button>
        <h4 class="quality-header">quality: <span class="idea-quality">${quality}</span></h4>
      </footer>
    </article> `
    )
  );
}

function resetInputs () {
  $titleInput.val("");
  $bodyInput.val("");
  $searchInput.val("");
}

function saveCardBody (card) {
  var bodyVal = $(card).text();
  var thisKey = $(card).closest('.idea-card').attr('id');
  var $thisIdea = JSON.parse(localStorage.getItem(thisKey));

  $thisIdea.body = bodyVal;
  localStorage.setItem(thisKey, JSON.stringify($thisIdea));
}

function saveCardTitle (card) {
  var titleVal = $(card).text();
  var thisKey = $(card).closest('.idea-card').attr('id');
  var $thisIdea = JSON.parse(localStorage.getItem(thisKey));
  $thisIdea.title = titleVal;

  localStorage.setItem(thisKey, JSON.stringify($thisIdea))
};

function searchCards(e) {
  $('.idea-card').addClass('hidden')

  for (i=0; i < localStorage.length; i++){
    var $thisCard = JSON.parse(localStorage.getItem(localStorage.key(i)));
     if ($thisCard.title.includes($searchInput.val()) || $thisCard.body.includes($searchInput.val())) {
      var keyId = "#" + $thisCard.cardKey
      $(keyId).removeClass('hidden');
    }
  }
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

function sizeInput(element) {
 $(element).height(0).height(element.scrollHeight)
}

function sortCards(e) {
  console.log('click')
  e.preventDefault();
  if (sortState === 0) {
    for (i=0; i < localStorage.length; i++){
      var $thisCard = JSON.parse(localStorage.getItem(localStorage.key(i)));
      if ($thisCard.quality === 'genius'){
        $(`#${$thisCard.cardKey}`).css('order', 1);
      } else if ($thisCard.quality === 'plausible'){
        $(`#${$thisCard.cardKey}`).css('order', 2);
      } else {
        $(`#${$thisCard.cardKey}`).css('order', 3)
      }
    } 
    $('#button-sort').text('reverse order')
    sortState = 1 
    console.log('sort')
  } else if (sortState === 1) {
    $('.cards-container').css('flex-direction', 'column-reverse');
    $('#button-sort').text('un-sort')
    sortState = 2;
  } else {
    $('#button-sort').text('sort')
    $('.cards-container').css('flex-direction', 'column')
    sortState = 0;

    for (i=0; i < localStorage.length; i++){
      var $thisCard = JSON.parse(localStorage.getItem(localStorage.key(i)));
      $(`#${$thisCard.cardKey}`).css('order', 0);
    }
  } 
}
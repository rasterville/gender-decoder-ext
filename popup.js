
Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

var feminine_coded_words = [
    "agree",
    "affectionate",
    "child",
    "cheer",
    "collab",
    "commit",
    "communal",
    "compassion",
    "connect",
    "considerate",
    "cooperat",
    "co-operat",
    "depend",
    "emotiona",
    "empath",
    "feel",
    "flatterable",
    "gentle",
    "honest",
    "interpersonal",
    "interdependen",
    "interpersona",
    "inter-personal",
    "inter-dependen",
    "inter-persona",
    "kind",
    "kinship",
    "loyal",
    "modesty",
    "nag",
    "nurtur",
    "pleasant",
    "polite",
    "quiet",
    "respon",
    "sensitiv",
    "submissive",
    "support",
    "sympath",
    "tender",
    "together",
    "trust",
    "understand",
    "warm",
    "whin",
    "enthusias",
    "inclusive",
    "yield",
    "shar"];

var masculine_coded_words = [
    "active",
    "adventurous",
    "aggress",
    "ambitio",
    "analy",
    "assert",
    "athlet",
    "autonom",
    "battle",
    "boast",
    "challeng",
    "champion",
    "compet",
    "confident",
    "courag",
    "decid",
    "decision",
    "decisive",
    "defend",
    "determin",
    "domina",
    "dominant",
    "driven",
    "fearless",
    "fight",
    "force",
    "greedy",
    "head-strong",
    "headstrong",
    "hierarch",
    "hostil",
    "implusive",
    "independen",
    "individual",
    "intellect",
    "lead",
    "logic",
    "objective",
    "opinion",
    "outspoken",
    "persist",
    "principle",
    "reckless",
    "self-confiden",
    "self-relian",
    "self-sufficien",
    "selfconfiden",
    "selfrelian",
    "selfsufficien",
    "stubborn",
    "superior",
    "unreasonab"];

function findHits( targetWords, searchWord ) {
  var hits = [];
  var numTargetWords = targetWords.length;
  for ( var i = 0; i < numTargetWords; i++ ) {
    if ( targetWords[i].toLowerCase().startsWith( searchWord.toLowerCase() ) ) {
      hits.push( targetWords[i].toLowerCase() );
    }
  }
  return hits;
}

function onAssessText(info, tab) {
  var coding;
  var masculineCodedWordHitList = [];
  var feminineCodedWordHitList = [];
  var wordsInAd = info.selectionText.split(/\s+/);

  var femWordArrayLength = feminine_coded_words.length;
  for (var i = 0; i < femWordArrayLength; i++) {
    var hits = findHits( wordsInAd, feminine_coded_words[i] );
    if ( hits.length ) {
      feminineCodedWordHitList = feminineCodedWordHitList.concat( hits );
    }
  }
  chrome.extension.getBackgroundPage().console.log('Feminine hits (' + feminineCodedWordHitList.length + '): ' + feminineCodedWordHitList);

  var mascWordArrayLength = masculine_coded_words.length;
  for (var i = 0; i < mascWordArrayLength; i++) {
    var hits = findHits( wordsInAd, masculine_coded_words[i] );
    if ( hits.length ) {
      masculineCodedWordHitList = masculineCodedWordHitList.concat( hits );
    }
  }
  chrome.extension.getBackgroundPage().console.log('Masculine hits (' + masculineCodedWordHitList.length + '): ' + masculineCodedWordHitList);

  if ( feminineCodedWordHitList.length > 2 && !masculineCodedWordHitList.length ) {
    coding = "strongly feminine-coded";
  }
  else if ( feminineCodedWordHitList.length && !masculineCodedWordHitList.length ) {
    coding = "feminine-coded";
  }
  else if ( masculineCodedWordHitList.length > 2 && !feminineCodedWordHitList.length ) {
    coding = "strongly masculine-coded";
  }
  else if ( masculineCodedWordHitList.length && !feminineCodedWordHitList.length ) {
    coding = "masculine-coded";
  }
  else if ( !masculineCodedWordHitList.length && !feminineCodedWordHitList.length ) {
    coding = "neutral";
  }
  else {
    if ( feminineCodedWordHitList.length == masculineCodedWordHitList.length ) {
      coding = "neutral";
    }
    if ( ( feminineCodedWordHitList.length / masculineCodedWordHitList.length ) >= 2 && feminineCodedWordHitList.length > 5 ) {
      coding = "strongly feminine-coded";
    }
    if ( ( masculineCodedWordHitList.length / feminineCodedWordHitList.length ) >= 2 && masculineCodedWordHitList.length > 5 ) {
      coding = "strongly masculine-coded";
    }
    if ( feminineCodedWordHitList.length > masculineCodedWordHitList.length ) {
      coding = "feminine-coded";
    }
    if ( masculineCodedWordHitList.length > feminineCodedWordHitList.length ) {
      coding = "masculine-coded";
    }
  }

  chrome.extension.getBackgroundPage().console.log('This ad is ' + coding + '.');
  chrome.extension.getBackgroundPage().console.log('----------------------------------------');
}

chrome.contextMenus.create({
    "title": "Gender Decode selection",
    "contexts": ["selection"],
    "onclick" : onAssessText
  });

// grab an element
var myElement = document.querySelector("header");
// construct an instance of Headroom, passing the element
var headroom  = new Headroom(myElement, {
  "offset": 205,
  "tolerance": 5,
  "classes": {
    "initial": "animated",
    "pinned": "slideDown",
    "unpinned": "slideUp"
  }
});
// initialise
headroom.init();

// console.log('hello from js');

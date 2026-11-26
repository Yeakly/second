/* MOENG, Monymatin's part */

var mainImage = document.getElementById("mainImage");
var thumbs = document.querySelectorAll(".thumb");
var switchButtons = document.querySelectorAll(".switch-opt");
var colorButtons = document.querySelectorAll(".color-opt");
var switchName = document.getElementById("switchName");
var colorName = document.getElementById("colorName");
var quantityText = document.getElementById("quantity");
var priceText = document.getElementById("priceNow");
var cartCount = document.getElementById("cartCount");
var toast = document.getElementById("toast");
var buyModal = document.getElementById("modal");
var reviewModal = document.getElementById("reviewModal");
var lightbox = document.getElementById("lightbox");
var reviewList = document.querySelector(".review-list");
var basePrice = 198;       
var quantity = 1;          
var cartItems = Number(cartCount.textContent); 
var toastTimer;            

function formatPrice(number) {
  return "$" + number.toFixed(2);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

function updatePrice() {
  priceText.textContent = formatPrice(basePrice * quantity);
}

function getThumbImage(thumb) {
  return thumb.querySelector("img").getAttribute("src");
}

function showImage(path) {
  mainImage.classList.add("fade");

  setTimeout(function () {
    mainImage.src = path;
    mainImage.classList.remove("fade");
  }, 200);
}

if (thumbs.length > 0) {
  mainImage.src = getThumbImage(thumbs[0]);
}

for (var i = 0; i < thumbs.length; i++) {
  thumbs[i].addEventListener("click", function () {
    for (var j = 0; j < thumbs.length; j++) {
      thumbs[j].classList.remove("active");
    }

    this.classList.add("active");
    showImage(getThumbImage(this));
  });
}

var placeholder =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">' +
      '<rect width="800" height="600" fill="#f2e6e2"/>' +
      '<text x="400" y="305" font-family="Arial" font-size="32" fill="#8b7264" text-anchor="middle">Add image</text>' +
      "</svg>"
  );

var allImages = document.querySelectorAll("img");

for (var k = 0; k < allImages.length; k++) {
  allImages[k].addEventListener("error", function () {
    // only replace once, so it does not loop forever
    if (this.src !== placeholder) {
      this.src = placeholder;
    }
  });
}

//Zoom//
document.getElementById("zoomBtn").addEventListener("click", function () {
  document.getElementById("lightboxImg").src = mainImage.src;
  lightbox.classList.add("open");
});

lightbox.addEventListener("click", function () {
  lightbox.classList.remove("open");
});


// Switch //
for (var s = 0; s < switchButtons.length; s++) {
  switchButtons[s].addEventListener("click", function () {
  
    for (var t = 0; t < switchButtons.length; t++) {
      switchButtons[t].classList.remove("active");
    }

    this.classList.add("active");

    switchName.textContent = this.dataset.name;

    if (this.dataset.price) {
      basePrice = Number(this.dataset.price);
    } else {
      basePrice = 198;
    }
    updatePrice();

    showToast("Switch: " + this.dataset.name);
  });
}

// color btn//
for (var c = 0; c < colorButtons.length; c++) {
  colorButtons[c].addEventListener("click", function () {
    for (var d = 0; d < colorButtons.length; d++) {
      colorButtons[d].classList.remove("active");
    }
    this.classList.add("active");

    colorName.textContent = this.dataset.name;

    // optional: if the button has data-image, change the big picture //
    if (this.dataset.image) {
      showImage(this.dataset.image);
    }

    showToast("Colorway: " + this.dataset.name);
  });
}


// Quantity //
document.getElementById("increase").addEventListener("click", function () {
  if (quantity < 99) {
    quantity = quantity + 1;
  }
  quantityText.textContent = quantity;
  updatePrice();
});

document.getElementById("decrease").addEventListener("click", function () {
  if (quantity > 1) {
    quantity = quantity - 1;
  }
  quantityText.textContent = quantity;
  updatePrice();
});

// Cart //
function addToCart(amount, message) {
  cartItems = cartItems + amount;
  cartCount.textContent = cartItems;

  // small bounce animation on the number
  cartCount.classList.add("bump");
  setTimeout(function () {
    cartCount.classList.remove("bump");
  }, 300);

  showToast(message);
}

// "Add to Cart" button //
document.getElementById("addToCart").addEventListener("click", function () {
  addToCart(
    quantity,
    quantity + " x Keychron Q1 Pro (" + colorName.textContent + ") added to cart"
  );
});

// + //
var accessoryButtons = document.querySelectorAll(".add-accessory");

for (var a = 0; a < accessoryButtons.length; a++) {
  accessoryButtons[a].addEventListener("click", function () {
    addToCart(1, this.dataset.name + " added to cart");
  });
}

//Buy Now //
document.getElementById("buyNow").addEventListener("click", function () {
  var total = formatPrice(basePrice * quantity);
  var summary =
    quantity + " x Keychron Q1 Pro (" +
    colorName.textContent + ", " + switchName.textContent + "). Total: " + total;

  document.getElementById("modalText").textContent = summary;
  buyModal.classList.add("open");
});

document.getElementById("closeModal").addEventListener("click", function () {
  buyModal.classList.remove("open");
});

var wishlistBtn = document.getElementById("wishlistBtn");

wishlistBtn.addEventListener("click", function () {
  wishlistBtn.classList.toggle("active");

  if (wishlistBtn.classList.contains("active")) {
    showToast("Added to wishlist");
  } else {
    showToast("Removed from wishlist");
  }
});

// Accordion (open / close sections) //
var accordionButtons = document.querySelectorAll(".acc-toggle");
for (var b = 0; b < accordionButtons.length; b++) {
  accordionButtons[b].addEventListener("click", function () {
    // this.parentElement is the whole section box
    this.parentElement.classList.toggle("open");
  });
}

// Open the review form //
document.getElementById("writeReview").addEventListener("click", function () {
  reviewModal.classList.add("open");
  document.getElementById("reviewName").focus();
});

// Cancel button //
document.getElementById("cancelReview").addEventListener("click", function () {
  reviewModal.classList.remove("open");
});

// Text safe before putting it into the page //
function makeSafe(text) {
  var box = document.createElement("div");
  box.textContent = text;
  return box.innerHTML;
}

// submitted //
document.getElementById("reviewForm").addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  var name = document.getElementById("reviewName").value.trim();
  var rating = Number(document.getElementById("reviewRating").value);
  var title = document.getElementById("reviewTitle").value.trim();
  var text = document.getElementById("reviewText").value.trim();

  if (title === "") {
    title = "Great product";
  }

  var words = name.split(" ");
  var initials = words[0].charAt(0);
  if (words.length > 1) {
    initials = initials + words[1].charAt(0);
  }
  initials = initials.toUpperCase();

  var stars = "";
  for (var n = 0; n < 5; n++) {
    if (n < rating) {
      stars = stars + "★";
    } else {
      stars = stars + "☆";
    }
  }

  // New review box //
  var review = document.createElement("article");
  review.className = "review";
  review.innerHTML =
    '<div class="review-head">' +
      '<div class="reviewer">' +
        '<span class="avatar-sm">' + makeSafe(initials) + "</span> " +
        "<b>" + makeSafe(name) + "</b> " +
        '<span class="tag">Verified Purchase</span>' +
      "</div>" +
      "<small>Just now</small>" +
    "</div>" +
    '<div class="stars">' + stars +
      ' <small class="review-title">' + makeSafe(title) + "</small></div>" +
    '<p>"' + makeSafe(text) + '"</p>' +
    '<small class="helpful">0 people found this helpful</small>';

  reviewList.prepend(review);
  this.reset();
  reviewModal.classList.remove("open");
  showToast("Thanks! Your review was added");
});

reviewList.addEventListener("click", function (event) {
  var clicked = event.target;

  if (!clicked.classList.contains("helpful")) {
    return;
  }

  if (clicked.classList.contains("voted")) {
    return;
  }

  var count = parseInt(clicked.textContent); // reads the number at the start
  clicked.textContent = (count + 1) + " people found this helpful";
  clicked.classList.add("voted");
  showToast("Thanks for your feedback");
});

document.querySelector('[aria-label="Notifications"]').addEventListener("click", function () {
  var dot = document.querySelector(".notif-dot");

  if (dot.style.display === "none") {
    showToast("No new notifications");
  } else {
    showToast("You have 1 new notification");
    dot.style.display = "none"; // hide the red dot
  }
});

// Cart icon //
document.querySelector('[aria-label="Cart"]').addEventListener("click", function () {
  showToast("You have " + cartItems + " item(s) in your cart");
});

// Account icon //
document.querySelector('[aria-label="Account"]').addEventListener("click", function () {
  showToast("Account page is not built yet (demo)");
});

// Search box: press Enter //
document.querySelector(".search input").addEventListener("keydown", function (event) {
  if (event.key === "Enter" && this.value.trim() !== "") {
    showToast('Searching for "' + this.value.trim() + '"...');
  }
});

// Links //
var emptyLinks = document.querySelectorAll('a[href="#"]');

for (var m = 0; m < emptyLinks.length; m++) {
  emptyLinks[m].addEventListener("click", function (event) {
    event.preventDefault(); // stop the page jumping to the top
    document.getElementById("navLinks").classList.remove("open");
    showToast('"' + this.textContent.trim() + '" page is not built yet (demo)');
  });
}

// Mobile Menun //
document.getElementById("menuBtn").addEventListener("click", function () {
  document.getElementById("navLinks").classList.toggle("open");
});

buyModal.addEventListener("click", function (event) {
  if (event.target === buyModal) {
    buyModal.classList.remove("open");
  }
});

reviewModal.addEventListener("click", function (event) {
  if (event.target === reviewModal) {
    reviewModal.classList.remove("open");
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    buyModal.classList.remove("open");
    reviewModal.classList.remove("open");
    lightbox.classList.remove("open");
  }
});
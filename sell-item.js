const itemName = document.getElementById("itemName");
const category = document.getElementById("category");
const price = document.getElementById("price");
const description = document.getElementById("description");
const locationInput = document.getElementById("location");
const photoInput = document.getElementById("photos");

const previewTitle = document.getElementById("previewTitle");
const previewCategory = document.getElementById("previewCategory");
const previewPrice = document.getElementById("previewPrice");
const previewLocation = document.getElementById("previewLocation");
const previewCondition = document.getElementById("previewCondition");
const previewImage = document.getElementById("previewImage");
const previewThumbnails = document.getElementById("previewThumbnails");
const photoPreview = document.getElementById("photoPreview");

// Keep track of all valid photos added across multiple selections
let uploadedPhotos = [];

function updatePreview() {
    previewTitle.textContent =
        itemName.value.trim() || "Your product name";

    previewCategory.textContent =
        category.value || "YOUR CATEGORY";

    previewPrice.textContent =
        "$" + (Number(price.value) || 0).toFixed(2);

    previewLocation.textContent =
        locationInput.value.trim() || "Your location";

    const selectedCondition =
        document.querySelector('input[name="condition"]:checked');

    previewCondition.textContent =
        selectedCondition ? selectedCondition.value : "Product condition will appear here";

    document.getElementById("charCount").textContent =
        description.value.length;

    const sellingPrice = Number(price.value) || 0;
    const sellerPayout = sellingPrice * 0.90;

    document.getElementById("payout").textContent =
        "$" + sellerPayout.toFixed(2);
}

[itemName, category, price, description, locationInput].forEach(function(field) {
    field.addEventListener("input", updatePreview);
    field.addEventListener("change", updatePreview);
});

document.querySelectorAll('input[name="condition"]').forEach(function(input) {
    input.addEventListener("change", updatePreview);
});

// Handle adding new photos (up to 8 total)
photoInput.addEventListener("change", function() {
    const newFiles = Array.from(photoInput.files);

    newFiles.forEach(function(file) {
        if (uploadedPhotos.length >= 8) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert(file.name + " is larger than 5 MB.");
            return;
        }

        uploadedPhotos.push(URL.createObjectURL(file));
    });

    if (newFiles.length > 0 && uploadedPhotos.length >= 8) {
        alert("Maximum of 8 photos reached.");
    }

    // Reset input so the user can pick the same file again if needed
    photoInput.value = "";
    renderPhotoPreviews();
});

// Render all uploaded photos in both the form and "Your Listing" sidebar
function renderPhotoPreviews() {
    photoPreview.innerHTML = "";
    previewThumbnails.innerHTML = "";

    if (uploadedPhotos.length === 0) {
        previewImage.innerHTML = `
            <span class="material-symbols-outlined">image</span>
            <small>Your product photo will appear here</small>
        `;
        return;
    }

    // Set the first photo as the main "Your Listing" image
    previewImage.innerHTML = `<img src="${uploadedPhotos[0]}" alt="Product preview">`;

    uploadedPhotos.forEach(function(imageUrl, index) {
        // 1. Add thumbnail to the form's #photoPreview box
        const formThumb = document.createElement("img");
        formThumb.src = imageUrl;
        formThumb.alt = "Selected product photo " + (index + 1);
        photoPreview.appendChild(formThumb);

        // 2. Add thumbnail to the "Your Listing" sidebar gallery
        const sidebarThumb = document.createElement("img");
        sidebarThumb.src = imageUrl;
        sidebarThumb.alt = "Listing thumbnail " + (index + 1);
        if (index === 0) sidebarThumb.classList.add("active");

        // Allow clicking any thumbnail in "Your Listing" to view it large
        sidebarThumb.addEventListener("click", function() {
            previewImage.innerHTML = `<img src="${imageUrl}" alt="Product preview">`;
            previewThumbnails.querySelectorAll("img").forEach(function(img) {
                img.classList.remove("active");
            });
            sidebarThumb.classList.add("active");
        });

        previewThumbnails.appendChild(sidebarThumb);
    });
}

// Demo form submission
document.getElementById("sellForm").addEventListener("submit", function(event) {
    event.preventDefault();

    if (!this.reportValidity()) return;

    document.getElementById("formMessage").textContent =
        "Your listing information is ready for review! This is a front-end demo; it has not been published or saved.";
});

updatePreview();
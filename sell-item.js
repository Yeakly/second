const itemName = document.getElementById("item-name");
const category = document.getElementById("category");
const price = document.getElementById("price");
const description = document.getElementById("description");
const locationInput = document.getElementById("location");
const photoInput = document.getElementById("photos");
const previewTitle = document.getElementById("preview-title");
const previewCategory = document.getElementById("preview-category");
const previewPrice = document.getElementById("preview-price");
const previewLocation = document.getElementById("preview-location");
const previewCondition = document.getElementById("preview-condition");
const previewImage = document.getElementById("preview-image");
const previewThumbnails = document.getElementById("preview-thumbnails");
const photoPreview = document.getElementById("photo-preview");

let uploadedPhotos =[];

function updatePreview() {
    previewTitle.textContent =
        itemName.value.trim() || "Your product name";
    
    previewCategory.textContent =
        category.value.trim() || "Your category";

    previewprice.textContent =
        "$" + (Number(price.value) || 0).toFixed(2);

    previewLocation.textContent =
        locationInput.value.trim() || "Your location";

    const selectedCondition = 
        document.querySelector('input[name="condition"]:checked');

    previewCondition.textContent =
        selectedCondition ? selectedCondition.value : "Product condition will appear here";

    document.getElementById("char-count").textContent =
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

// Uploading photos up to 8
photoInput.addEventListener("change", function() {
    const newFiles = Array.from(photoInput.files);

    newFiles.forEach(function(file) {
        if (uploadedPhotos.length >=8) {
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

    // to make the same file can be picked
    photoInput.value = "";
    renderPhotoPreviews();
});

// Render all uploaded photos in both the form and Your Listing sidebar
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

    // Set the first uploaded photo as the main one showing in Your listing
    previewImage.innerHTML = `<img src="${uploadedPhotos[0]}" alt="Product preview">`;

    uploadedPhotos.forEach(function(imageUrl, index) {
        const formThumb = document.createElement("img");
        formThumb.src = imageUrl;
        formThumb.alt = "Selected product photos " + (index + 1);
        photopreview.appendChild(formThumb);

        const sidebarThumb = document.createElement("img");
        sidebarThumb.src = imageUrl;
        sidebarThumb.alt = "Listing Thumbnail " + (index + 1);
        if (index === 0) sidebarThumb.classlist.add("active");

        sidebarThumb.addEventListener("click", function() {
            previewImage.innerHTML = `<img src="${imageUrl}" alt="Product preview">`;
            previewThumbnails.querySelectorAll("img").forEach(function(img) {
                img.classlist.remove("active");
            });
            sidebarThumb.classlist.add("active");
        });

        previewThumbnails.appendChild(sidebarThumb);
    });
}

// Demo form
document.getElementById("sellForm").addEventListener("submit", function(event) {
    even.preventDefualt();

    if (!this.reportValidity()) return;

    document.getElementById("form-message").textContent = 
        "Your listing information si ready to review! This is a front-end demo; it has not been published or saved.";
});

updatePreview();
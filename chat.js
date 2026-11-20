const chatHero = document.querySelector("#chat-hero");
const chatHeader = document.querySelector("#chat-header h3");
const chatItems = document.querySelectorAll("#chat-list .chat");
const backButton = document.querySelector("#chat-back-button");

function selectChat(chat) {
    if (window.matchMedia("(max-width: 1032px)").matches && chat !== chatItems[0]) {
        chatHero.classList.remove("is-chat-open");
        return;
    }

    chatItems.forEach((item) => {
        const isSelected = item === chat;
        item.classList.toggle("active", isSelected);
        item.setAttribute("aria-pressed", String(isSelected));
    });

    chatHeader.textContent = chat.querySelector(".chat-name").textContent;
    chatHero.classList.add("is-chat-open");
}

chatItems.forEach((chat) => {
    chat.addEventListener("click", () => selectChat(chat));
    chat.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectChat(chat);
        }
    });
});

backButton.addEventListener("click", () => {
    chatHero.classList.remove("is-chat-open");
});

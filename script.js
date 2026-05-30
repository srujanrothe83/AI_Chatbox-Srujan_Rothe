const chatbox = document.getElementById("cb");
const input = document.getElementById("input");

function addmessage(chat, classname) {
    const div = document.createElement("DIV");
    div.classList.add(classname, "message");
    div.innerHTML = chat;
    chatbox.appendChild(div)
    chatbox.scrollTop = chatbox.scrollHeight;
}

async function getbotreply(chat) {
    try {

        const response = await fetch(
            "https://ai-chatbox-srujan-rothe.onrender.com/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: chat
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return `Error ${response.status}`;
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    } catch (error) {

        console.error(error);

        return "Something went wrong!";
    }
}
function showTyping() {

    const typingDiv = document.createElement("div");

    typingDiv.classList.add("bot", "message");

    typingDiv.id = "typing";

    typingDiv.innerHTML = "Typing...";

    chatbox.appendChild(typingDiv);

    chatbox.scrollTop = chatbox.scrollHeight;
}

function removeTyping() {

    const typingDiv = document.getElementById("typing");

    if (typingDiv) {
        typingDiv.remove();
    }
}

async function send() {
    const message = input.value.trim();
    if (message === "") {
        return;
    }
    input.value = "";
    addmessage(message, "user");
    showTyping();
    const botreply = await getbotreply(message);
    removeTyping();
    addmessage(botreply, "bot");
    saved();
}

function saved() {
    localStorage.setItem("savedchat", chatbox.innerHTML);
}
function load() {
    const savedchat = localStorage.getItem("savedchat");
    if (savedchat) {
        chatbox.innerHTML = savedchat;
        chatbox.scrollTop = chatbox.scrollHeight;
    }
}
window.onload = () => {
    load();
}
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        send();
    }
})

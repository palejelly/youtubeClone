const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");
const videoContainer = document.getElementById("videoContainer");

const handleSubmit = (event) => {
    event.preventDefault();
    const text = textarea.value;
    const video = videoContainer.dataset.id;
}

form.addEventListener("submit", handleSubmit);
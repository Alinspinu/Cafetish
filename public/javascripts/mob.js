const titlu = document.querySelector("h1");
const cont = document.querySelector(".cont");
const box = document.querySelector(".box");
const urlLocal = "http://localhost:3000/blog/apiArt";
const url = "https://cafetish.com/blog/apiArt";
const urlHeroku = "http://www.cafetish.com/blog/apiArt";

window.addEventListener("DOMContentLoaded", (event) => {
  fetch(urlHeroku)
    .then((res) => res.json())
    .then((data) => {
      data.forEach(function (art) {
        const subT = document.createElement("h3");
        const text = document.createElement("p");
        subT.innerHTML = art.titlu;
        text.innerHTML = art.text;
        box.append(subT);
        box.append(text);
      });
      // cont.innerHTML = `${data[0].text}<br>${data[1].titlu}<br><br>${data[1].text}`
    });
});

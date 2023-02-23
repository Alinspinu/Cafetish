const borcan = document.querySelectorAll(".borcan");
const delivery = document.querySelectorAll(".delivery");
const img = document.querySelectorAll(".img");
const text = document.querySelector("p");
const content = document.querySelector(".content");
const clsBtn = document.querySelector("#close");
const anim = document.querySelector(".anim");
const titlu = document.querySelector("h2");
const modifica = document.querySelector(".modifica");
const artImg = document.querySelector("#artImg");
const h1 = document.querySelector("h1");
const urlLocal = "http://localhost:3000/blog/apiArt";
const url = "https://cafetish.com/blog/apiArt";
const urlHeroku = "http://www.cafetish.com/blog/apiArt";
const container = document.querySelector(".container");

// container.classList.add('mx-0')
content.classList.add("hide");
// text.classList.add('hide');
img[14].classList.add("show");

img[14].addEventListener("mouseover", (e) => {
  img.forEach(function (el) {
    el.classList.add("shadow");
  });

  const notShowArr = [
    img[5],
    img[16],
    img[2],
    img[11],
    img[4],
    img[6],
    img[7],
    img[8],
    img[17],
    img[18],
    img[0],
    img[1],
    img[9],
    img[10],
    img[12],
  ];
  const showArr = [img[15], img[13], img[19], img[3]];
  Show(showArr);
  Hide(notShowArr);
});

img[15].addEventListener("mouseover", (e) => {
  const showArr = [img[15], img[16], img[5]];
  const notShowArr = [
    img[4],
    img[6],
    img[7],
    img[8],
    img[17],
    img[18],
    img[19],
    img[13],
    img[3],
  ];
  Show(showArr);
  Hide(notShowArr);
});

img[5].addEventListener("mouseover", (e) => {
  const showArr = [img[5], img[4], img[6]];
  const notShowArr = [img[7], img[8], img[16], img[17], img[18]];
  Show(showArr);
  Hide(notShowArr);
});

img[16].addEventListener("mouseover", (e) => {
  const notShowArr = [img[6], img[4], img[5]];
  const showArr = [img[16], img[7], img[8], img[17], img[18]];
  Show(showArr);
  Hide(notShowArr);
});

img[13].addEventListener("mouseover", (e) => {
  const notShowArr = [
    img[3],
    img[15],
    img[19],
    img[1],
    img[0],
    img[9],
    img[10],
    img[12],
  ];
  const showArr = [img[13], img[11], img[2]];
  Show(showArr);
  Hide(notShowArr);
});

img[11].addEventListener("mouseover", (e) => {
  const notShowArr = [img[2]];
  const showArr = [img[11], img[1], img[0], img[9], img[10], img[12]];
  Show(showArr);
  Hide(notShowArr);
});

clsBtn.addEventListener("click", (e) => {
  content.classList.add("hide");
  anim.classList.remove("hide");
  h1.classList.remove("hide");
  titlu.innerHTML = "...";
});

window.addEventListener("DOMContentLoaded", (event) => {
  fetch(urlHeroku)
    .then((res) => res.json())
    .then((data) => {
      img[14].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[0].titlu}`;
        text.innerHTML = `${data[0].text}`;
        modifica.href = `/blog/articol/${data[0]._id}/edit`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673897980/ProduseI/Untitled_design_19_jtghzb.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[15].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[1].titlu}`;
        text.innerHTML = `${data[1].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673899810/ProduseI/Untitled_design_24_xltgol.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[5].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[2].titlu}`;
        text.innerHTML = `${data[2].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673900511/ProduseI/Arabica_2_tceimq.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[4].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[3].titlu}`;
        text.innerHTML = `${data[3].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673900670/ProduseI/Arabica_3_wdgytd.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[6].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[4].titlu}`;
        text.innerHTML = `${data[4].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673900792/ProduseI/Arabica_4_utt8zx.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[16].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[5].titlu}`;
        text.innerHTML = `${data[5].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673901588/ProduseI/Arabica_5_vumtvo.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[7].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[6].titlu}`;
        text.innerHTML = `${data[6].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673902118/ProduseI/Arabica_7_awhzkg.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[8].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[7].titlu}`;
        text.innerHTML = `${data[7].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673942200/ProduseI/Co2_rpsyyr.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[17].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[8].titlu}`;
        text.innerHTML = `${data[8].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673943116/ProduseI/Co2_3_pgyg5m.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[18].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[9].titlu}`;
        text.innerHTML = `${data[9].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673954773/ProduseI/W_H_I_T_E_4_ulji50.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[3].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[10].titlu}`;
        text.innerHTML = `${data[10].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673955280/ProduseI/W_H_I_T_E_6_jquqat.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[19].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[11].titlu}`;
        text.innerHTML = `${data[11].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673957284/ProduseI/W_H_I_T_E_16_dsg3a0.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[13].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[12].titlu}`;
        text.innerHTML = `${data[12].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673956053/ProduseI/W_H_I_T_E_9_fy8cft.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[2].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[13].titlu}`;
        text.innerHTML = `${data[13].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673957840/ProduseI/W_H_I_T_E_20_msdlf9.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[11].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[14].titlu}`;
        text.innerHTML = `${data[14].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673958301/ProduseI/W_H_I_T_E_23_t6vtcr.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[1].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[15].titlu}`;
        text.innerHTML = `${data[15].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673959318/ProduseI/W_H_I_T_E_28_fxmous.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[0].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[16].titlu}`;
        text.innerHTML = `${data[16].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673959752/ProduseI/W_H_I_T_E_31_tujqa0.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[9].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[17].titlu}`;
        text.innerHTML = `${data[17].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673960997/ProduseI/W_H_I_T_E_37_r6wtyi.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[10].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[18].titlu}`;
        text.innerHTML = `${data[18].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673961212/ProduseI/W_H_I_T_E_39_kphk3i.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
      img[12].addEventListener("click", (e) => {
        h1.classList.add("hide");
        titlu.innerHTML = `${data[19].titlu}`;
        text.innerHTML = `${data[19].text}`;
        content.style.backgroundImage =
          "url('https://res.cloudinary.com/dhetxk68c/image/upload/v1673961425/ProduseI/W_H_I_T_E_41_wmcc9r.png')";
        content.style.backgroundSize = "cover";
        content.classList.remove("hide");
        anim.classList.add("hide");
      });
    });
});

function Show(arr) {
  arr.forEach(function (img, i) {
    if (img.classList[4] === "notShow" || img.classList[3] === "notShow") {
      img.classList.remove("notShow");
      img.classList.remove("show");
    }
    setTimeout(() => {
      img.classList.add("show");
    }, 120 * i);
  });
}

function Hide(arr) {
  arr.forEach(function (img, i) {
    setTimeout(() => {
      img.classList.add("notShow");
    }, 30 * i);
  });
}

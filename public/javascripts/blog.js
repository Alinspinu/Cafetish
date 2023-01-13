const borcan = document.querySelectorAll('.borcan');
const delivery = document.querySelectorAll('.delivery');
const img = document.querySelectorAll('.img');
const text = document.querySelector('p');
const content = document.querySelector('.content');
const clsBtn = document.querySelector('#close')
const anim = document.querySelector('.anim')
const titlu = document.querySelector('h2')
const urlLocal = 'http://localhost:3000/blog/apiArt'
const url = 'https://cafetish.com/blog/apiArt'


content.classList.add('hide');
// text.classList.add('hide');
img[14].classList.add('show');

img[14].addEventListener('mouseover', (e) => {
    img.forEach(function(el){
        el.classList.add('shadow')
    })
    
    const notShowArr = [img[5], img[16], img[2], img[11], img[4],img[6],img[7],img[8],img[17],img[18],img[0],img[1],img[9],img[10],img[12]]
    const showArr = [img[15],img[13],img[19],img[3]]
    Show(showArr)
    Hide(notShowArr)    
})

img[15].addEventListener('mouseover', (e)=> {
    const showArr = [img[15],img[16],img[5]]
    const notShowArr = [img[4], img[6], img[7], img[8], img[17],img[18], img[19], img[13],img[3]]
    Show(showArr)
    Hide(notShowArr)
})


img[5].addEventListener('mouseover', (e) => {
    const showArr = [img[5],img[4],img[6]]
    const notShowArr = [img[7],img[8],img[16],img[17],img[18]]
    Show(showArr)
    Hide(notShowArr)
})


img[16].addEventListener('mouseover', (e) => {
    const notShowArr = [img[6],img[4],img[5]]
    const showArr = [img[16],img[7],img[8],img[17],img[18]]
    Show(showArr)
    Hide(notShowArr)
})

img[13].addEventListener('mouseover', (e) => {
    const notShowArr = [img[3],img[15],img[19],img[1],img[0],img[9], img[10], img[12]]
    const showArr = [img[13],img[11],img[2]]
    Show(showArr)
    Hide(notShowArr)
})

img[11].addEventListener('mouseover', (e) => {
    const notShowArr = [img[2]]
    const showArr = [img[11],img[1],img[0],img[9], img[10], img[12]]
    Show(showArr)
    Hide(notShowArr)
})



clsBtn.addEventListener('click', (e)=> {
    content.classList.add('hide')
    anim.classList.remove('hide')
    titlu.innerHTML = '...'
})

window.addEventListener('DOMContentLoaded', (event) => {
    fetch(url).then(res => res.json()).then((data) => {
        img[14].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[0].titlu}`
            text.innerHTML = `${data[0].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[15].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[1].titlu}`
            text.innerHTML = `${data[1].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[5].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[2].titlu}`
            text.innerHTML = `${data[2].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[4].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[3].titlu}`
            text.innerHTML = `${data[3].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[6].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[4].titlu}`
            text.innerHTML = `${data[4].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[16].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[5].titlu}`
            text.innerHTML = `${data[5].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[7].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[6].titlu}`
            text.innerHTML = `${data[6].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[8].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[7].titlu}`
            text.innerHTML = `${data[7].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[17].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[8].titlu}`
            text.innerHTML = `${data[8].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[18].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[9].titlu}`
            text.innerHTML = `${data[9].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[3].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[10].titlu}`
            text.innerHTML = `${data[10].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[19].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[11].titlu}`
            text.innerHTML = `${data[11].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[13].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[12].titlu}`
            text.innerHTML = `${data[12].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[2].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[13].titlu}`
            text.innerHTML = `${data[13].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[11].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[14].titlu}`
            text.innerHTML = `${data[14].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[1].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[15].titlu}`
            text.innerHTML = `${data[15].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[0].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[16].titlu}`
            text.innerHTML = `${data[16].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[9].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[17].titlu}`
            text.innerHTML = `${data[17].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[10].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[18].titlu}`
            text.innerHTML = `${data[18].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
        img[12].addEventListener('click', (e) =>{
            titlu.innerHTML = `${data[19].titlu}`
            text.innerHTML = `${data[19].text}`
            content.classList.remove('hide')
            anim.classList.add('hide')
        })
    })
})











function Show(arr){
    arr.forEach(function(img,i){
        if(img.classList[4] === "notShow" || img.classList[3] === "notShow" ){
            img.classList.remove('notShow')
            img.classList.remove('show')
        }
        setTimeout(()=>{
            img.classList.add('show')
        },120*i);
    })
}

function Hide(arr){
    arr.forEach(function(img, i){
        setTimeout(()=>{
            img.classList.add('notShow')
        }, 30*i);
    })
}
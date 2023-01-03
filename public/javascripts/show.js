const output = document.querySelector('.output');
const output1 = document.querySelector('.output1');
const urlIdLcl = window.location.href.slice(27, 51);
const urlId = window.location.href.slice(26, 50);
const url = `https://cafetish.com/user/${urlId}/api`;
const urlLocal = `http://localhost:3000/user/${urlIdLcl}/api`;





window.addEventListener('DOMContentLoaded', (event) => {
    fetch(urlLocal).then(res => res.json()).then((data) => {
        if (data) {
            console.log(data)
            var cart;
            data.orders.slice().reverse().forEach((el, i) => {
                cart = new Cart(el.cart)
                el.items = cart.generateArray();
                const div = document.createElement('div')
                const spam = document.createElement('span')
                spam.innerHTML = `<hr class="hrMargin"> ${el.date}| ${el.time}| Total:${el.cart.totalPrice} Lei<br><hr class="hrMargin">`
                spam.classList.add("fs-6", "fw400", 'pointer')
                output.append(div)
                div.append(spam)
                function addListner() {
                    spam.addEventListener('click', e => {
                        const divRow = document.createElement('div');
                        const div1 = document.createElement('div');
                        const div2 = document.createElement('div');
                        divRow.classList.add('row', '123');
                        div1.classList.add('col-7');
                        div2.classList.add('col-4', 'position-relative');
                        div.append(divRow);
                        divRow.append(div1);
                        divRow.append(div2);
                        const closeButton = document.createElement('i')
                        closeButton.innerHTML = "<br>"
                        closeButton.classList.add('bi', 'bi-x', 'position-absolute', 'top-50', 'start-0', 'translate-middle', 'fs-3', 'pointer')
                        div2.append(closeButton)
                        const items = el.items
                        for (let item of items) {
                            const info = document.createElement('span')
                            info.classList.add('ms-2')
                            info.innerHTML = `${item.qty} x ${item.nume} <br>`
                            div1.append(info)
                        }
                        closeButton.addEventListener('click', e => {
                            divRow.parentNode.removeChild(divRow)
                            addListner()
                        })
                    }, { once: true, passive: true })
                }
                addListner()
            });
            if (data.giftCard) {
                for (let item of data.giftCard) {
                    console.log(item)
                    const divGift = document.createElement('div')
                    const spam1 = document.createElement('span')
                    spam1.innerHTML = `<hr class="hrMargin">${item.nume} / ${item.valoare} Lei <br><hr class="hrMargin">`
                    spam1.classList.add("fs-6", "fw400", 'pointer')
                    output1.append(divGift)
                    divGift.append(spam1)
                    function addListnerQ() {
                        spam1.addEventListener('click', e => {
                            const divRow1 = document.createElement('div');
                            const div3 = document.createElement('div');
                            const div4 = document.createElement('div');
                            divRow1.classList.add('row', '123');
                            div3.classList.add('col-7');
                            div4.classList.add('col-4', 'position-relative');
                            divGift.append(divRow1);
                            divRow1.append(div3);
                            divRow1.append(div4);
                            const closeButtonQ = document.createElement('i')
                            closeButtonQ.innerHTML = "<br>"
                            closeButtonQ.classList.add('bi', 'bi-x', 'position-absolute', 'top-50', 'start-50', 'translate-middle', 'fs-3', 'pointer')
                            div4.append(closeButtonQ)
                            const qr = document.createElement('img')
                            const id = document.createElement('span')
                            id.classList.add('cod')
                            id.innerHTML = `<br>${item._id}`
                            qr.src = `https://api.qrserver.com/v1/create-qr-code/?data=${item._id}&size=60x60`
                            qr.classList.add('ms-5', 'pointer')
                            div3.append(qr)
                            div3.append(id)
                            closeButtonQ.addEventListener('click', e => {
                                divRow1.parentNode.removeChild(divRow1)
                                addListnerQ()
                            })

                        }, { once: true, passive: true })
                    }
                    addListnerQ()

                }

            }
        }
    })

})

function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.add = function (item, id) {
        let storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] =
            {
                item: item,
                qty: 0,
                pret: 0,
                img: item.imagine.path,
                nume: item.nume,
            };
        }
        storedItem.qty++;
        storedItem.pret = storedItem.item.pret * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.pret;
    };

    this.generateArray = function () {
        const arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
}
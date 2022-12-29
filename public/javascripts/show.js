const output = document.querySelector('.output')
const urlID = window.location.href.slice(27,51)
const url = `http://www.cafetish.com/user/${urlID}/api`




window.addEventListener('DOMContentLoaded', (event)=> {
    fetch(url).then(res => res.json()).then((data) => {
        if(data){
            var cart;
            data.orders.slice().reverse().forEach((el, i) => {
                cart = new Cart(el.cart)
                el.items = cart.generateArray();
                const div = document.createElement('div')
                div.classList.add('div')
                const spam = document.createElement('span')
                spam.innerHTML = `<hr class="hrMargin"> ${el.date}| ${el.time}| Total:${el.cart.totalPrice} Lei<br><hr class="hrMargin">`
                spam.classList.add("fs-6", "fw400", 'pointer')
                output.append(div)
                div.append(spam)
                function addListner(){
                    spam.addEventListener('click', e => {
                            const hr = document.querySelector('hr')
                            // hr.remove()
                            const divRow = document.createElement('div');
                            const div1 = document.createElement('div');
                            const div2 = document.createElement('div');
                            divRow.classList.add('row','123');
                            div1.classList.add('col-7');
                            div2.classList.add('col-4', 'position-relative');
                            div.append(divRow);
                            divRow.append(div1);
                            divRow.append(div2);
                            const closeButton = document.createElement('i')
                            closeButton.innerHTML = "<br>"
                            closeButton.classList.add('bi','bi-x','position-absolute','top-50','start-0', 'translate-middle', 'fs-3', 'pointer')
                            div2.append(closeButton)
                            const items = el.items
                            for(let item of items){
                            const info = document.createElement('span')
                            info.classList.add('ms-2')
                            info.innerHTML = `${item.qty} x ${item.nume} <br>`
                            div1.append(info)
                            }  
                            closeButton.addEventListener('click', e => {
                                divRow.parentNode.removeChild(divRow)
                                addListner()
                            })
                    },{once: true, passive: true})
                }
                addListner()
            });
        }
    })
})


function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.add = function(item, id) {
        let storedItem = this.items[id];
        if(!storedItem) {
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
        storedItem.pret = storedItem.item.pret*storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.pret;
    };

    this.generateArray = function() {
        const arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
}
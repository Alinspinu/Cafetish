

let baseUrlLocal = 'http://localhost:8090/'
const baseUrlHeroku = 'https://www.cafetish.com/'

// const currentUrl = window.location.href;
// if (currentUrl.startsWith(baseUrlLocal)) {
//     baseUrlLocal = baseUrlLocal;
// } else {
//     baseUrlLocal = baseUrlHeroku;
// }



const getOrdersUrl = `${baseUrlLocal}api/get-order-done`;
fetch(getOrdersUrl)
    .then((res) => res.json())
    .then(orders => {
        console.log(orders)
        for (const order of orders) {
            addOrder(order);
        }
    });




//MANAGE ORDERS WHEN ARE ARIVE FROM DB

const newOrdersDiv = document.getElementById("new-orders");


function addOrder(order) {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add('col-sm-6', 'col-md-6', 'col-lg-4', "mb-4", 'order', "appear");

    const date = new Date(order.createdAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const localTimeString = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
    const endDate = new Date(order.updatedAt)
    const endHours = endDate.getHours();
    const endMinutes = endDate.getMinutes();
    const formEndDate = endHours.toString().padStart(2, "0") + ":" + endMinutes.toString().padStart(2, "0");

    const now = new Date(Date.now())
    const timeToBeReady = (date.getTime() + order.completetime) - now


    const productList = order.products.map(product => `<li class="list-group-item">
    <div class="product-wrapper">
    <span class='prod-name'>${product.quantity} X ${product.name}</span>
    <span class='prod-price'>${product.total} Lei</span>
    </div>
    </li>`).join('');

    orderDiv.innerHTML = `

    <ul class="list-group">
    <div class="hide-wrapper hide">
    <i class="bi bi-eye-slash"></i>
    <span class="hide-text">Arată</span>
    </div>
    <li class="list-group-item">
    <div class="wrapper">
    <span class="bold">Nr: ${order.index}</span>
    <span class="bold" id="table">Masa: ${order.masa}</span>
    <span class="bold hide" id="pick">Pick UP</span>
    </div>
    </li>
    <li class="list-group-item">
    <div class="wrapper">
    <div> <span>Primită: </span><span class="bold">${localTimeString}</span></div>
    <div class="bold hide" id="toGo"><span>La Pachet</span></div>
    <div><span>Terminată: </span><span class="bold">${formEndDate}</span></div>
    </div>
    </li>
 
    <li class="list-group-item hide order-id">${order._id}</li>

    <ul class="list-group to-hide">${productList}</ul>

    <li class="list-group-item bold to-hide">
    <div class="wrapper">
    <span>Total Produse</span>
    <span>${order.totalProducts} Lei</span>
    </div>
    </li>
  
    <li class="list-group-item to-hide">
    <div class="wrapper">
    <span>Tips</span>
    <span>${order.tips} Lei</span>
    </div>
    </li>

    <li class="list-group-item to-hide">
    <div class="wrapper">
    <span>Cash Back</span> 
    <span>${order.cashBack} Lei</span>
    </div>
    </li>

    <li class="list-group-item bold to-hide">
    <div class="wrapper">
    <span>Total</span>
    <span>${order.total} Lei</span>
    </div>
    </li>
     </ul>`;

    const hideOrderButton = orderDiv.querySelector('.hide-wrapper');
    const hideIcon = orderDiv.querySelector('i')
    const hideText = orderDiv.querySelector('.hide-text');
    const elementsToHide = orderDiv.querySelectorAll('.to-hide');
    const pick = orderDiv.querySelector("#pick")
    const table = orderDiv.querySelector("#table")
    const toGo = orderDiv.querySelector('#toGo')

    if(order.pickUp){
        pick.classList.remove('hide');
        table.classList.add('hide')
    } 
    if(order.toGo){
        console.log('ceva')
        toGo.classList.remove('hide')
    }

    hideOrderButton.classList.remove('hide');
    elementsToHide.forEach((el) => {
        el.classList.add('hide')
    });
    showHideElements(hideOrderButton, hideIcon, hideText, elementsToHide);
    newOrdersDiv.appendChild(orderDiv);
}


function showHideElements(hideOrderButton, hideIcon, hideText, elementsToHide) {
    hideOrderButton.addEventListener('click', () => {
        if (hideText.innerText === 'Ascunde') {
            hideIcon.classList.remove('bi-eye');
            hideIcon.classList.add('bi-eye-slash');
            hideText.innerText = 'Arată';
            hideOrderButton.classList.remove('actives')
            elementsToHide.forEach((el) => {
                el.classList.add('hide')
            })
        } else {
            hideIcon.classList.remove('bi-eye-slash');
            hideIcon.classList.add('bi-eye');
            hideText.innerText = 'Ascunde';
            hideOrderButton.classList.add('actives')
            elementsToHide.forEach((el) => {
                el.classList.remove('hide')
            })
        }

    })
}











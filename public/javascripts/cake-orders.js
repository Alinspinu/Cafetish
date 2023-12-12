

let baseUrlLocal = 'http://localhost:8090/'

// const currentUrl = window.location.href;
// if (currentUrl.startsWith(baseUrlLocal)) {
//     baseUrlLocal = baseUrlLocal;
// } else {
//     baseUrlLocal = baseUrlHeroku;
// }



const getOrdersUrl = `${baseUrlLocal}api/get-cake-orders`;
fetch(getOrdersUrl)
    .then((res) => res.json())
    .then(orders => {
        for (const order of orders) {
            addOrder(order);
        }
    });




//MANAGE ORDERS WHEN ARE ARIVE FROM DB

const newOrdersDiv = document.getElementById("new-orders");

function formatedDateToShow(date){
    if(date.length){
      const inputDate = new Date(date);
      const monthNames = [
        "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
        "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
      ];
      return `${inputDate.getDate().toString().padStart(2, '0')}-${monthNames[inputDate.getMonth()]}-${inputDate.getFullYear()}`
    } else {
      return ''
    }
    }




function addOrder(order) {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add('col-sm-6', 'col-md-6', 'col-lg-4', "mb-4", 'order', "appear");

    const date = new Date(order.createdAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const hour = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");

    const localTimeString = formatedDateToShow(order.createdAt) + ' '+ 'ora'+ ' ' + hour
    const formEndDate = formatedDateToShow(order.preOrderPickUpDate)
    const productList = order.products.map(product => `<li class="list-group-item">
    <div class="product-wrapper">
    <span class='prod-name'>${product.quantity} X ${product.name}</span>
    <span class='prod-price'>${product.total} Lei</span>
    </div>
    <div>
    <span class='bold toppings'>${product.toppings.map(topping => topping.name).join('')}</span>
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
    <span class="bold">Name: ${order.userName}</span>
    <span class="bold">Tel: ${order.userTel}</span>
    </div>
    </li>

    <li class="list-group-item">
    <div class="wrapper">
    <span class="bold">Nr: ${order.index}</span>
    </div>
    </li>
    <li class="list-group-item">
    <div class="wrapper-time">
    <div> <span>Primită: </span><span class="bold">${localTimeString}</span></div>
    <div><span>Ridicare: </span><span class="bold">${formEndDate}</span></div>
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
    <button id="pickUpButton" class="btn accept btn-success">PREDĂ COMANDA</button>
     </ul>`;

    const hideOrderButton = orderDiv.querySelector('.hide-wrapper');
    const hideIcon = orderDiv.querySelector('i')
    const hideText = orderDiv.querySelector('.hide-text');
    const elementsToHide = orderDiv.querySelectorAll('.to-hide');
    const table = orderDiv.querySelector("#table")
    const pickUpButton = orderDiv.querySelector('#pickUpButton')



    hideOrderButton.classList.remove('hide');
    elementsToHide.forEach((el) => {
        el.classList.add('hide')
    });
    showHideElements(hideOrderButton, hideIcon, hideText, elementsToHide);
    newOrdersDiv.appendChild(orderDiv);

    pickUpButton.addEventListener('click', function () {
       const alerts =  confirm('Camanda va fi salvată ca și predată, ești sigur ca vres sa faci asta?')
        if(alerts){
            fetch(`${baseUrlLocal}api/set-delivered?id=${order._id}`).then(res => res.json()).then(data => {
                const message = data.message
                alert(message)
                orderDiv.remove()
            })
        } else {
            console.log('cancel')
        }
   
    }); 
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











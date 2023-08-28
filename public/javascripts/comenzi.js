

let baseUrlLocal = 'http://localhost:8090/'
const baseUrlHeroku = 'https://www.cafetish.com/'

const currentUrl = window.location.href;
if (currentUrl.startsWith(baseUrlLocal)) {
    baseUrlLocal = baseUrlLocal;
} else {
    baseUrlLocal = baseUrlHeroku;
}


const url = `${baseUrlLocal}order/recive-order`;
const urlLocalSend = `${baseUrlLocal}order/order-done`;
const eventSource = new EventSource(url);
console.log(eventSource)

eventSource.onopen = () => {
    console.log('EventSource connection is open.');
};

eventSource.onmessage = (event) => {
    const order = JSON.parse(event.data);
    if (!order || order.message === 'No Orders') {
        console.log('hit the no orders')
    } else {
        addOrder(order, true);
    }
};

eventSource.onerror = (event) => {
    console.error('Error occurred with the EventSource connection:', event);
};

const getOrdersUrl = `${baseUrlLocal}order/get-order`;
fetch(getOrdersUrl)
    .then((res) => res.json())
    .then(orders => {
        console.log(orders)
        for (const order of orders) {
            addOrder(order);
        }
    });

const dingSound = new Audio(`${baseUrlLocal}sounds/ding.mp3`);


//MANAGE ORDERS WHEN ARE ARIVE FROM DB

const newOrdersDiv = document.getElementById("new-orders");



newOrdersDiv.addEventListener("click", (event) => {
    if (event.target.classList.contains("acceptata")) {
        const btnsTer = event.target;
        const orderId = btnsTer.closest(".list-group").querySelector(".hide").textContent;
        fetch(`${urlLocalSend}?cmdId=${orderId}`).then(response => console.log(response));
        btnsTer.parentElement.remove()
    }
});



function addOrder(order, withding) {
    // const newOrdersDiv = document.getElementById("new-orders");
    const orderDiv = document.createElement("div");
    orderDiv.classList.add('col-sm-6', 'col-md-6', 'col-lg-4', 'order', "appear");

    const date = new Date(order.createdAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const localTimeString = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");

    const productList = order.products.map(product => `<li class="list-group-item">${product.quantity} X ${product.name}  -  ${product.total} Lei</li>`).join('');

    orderDiv.innerHTML = `
    <ul class="list-group">
    <li class="list-group-item">Masa Nr: ${order.masa}</li>
  <li class="list-group-item">Comanda Nr: ${order.index}</li>
  <li class="list-group-item hide">${order._id}</li>
  <li class="list-group-item">Ora: ${localTimeString}</li>
  <li class="list-group-item"><strong style="font-size:19px;">Produse:</strong></li>
  <ul class="list-group">${productList}</ul>
  <ul class="list-group-item fw-bold">Total Produse:  ${order.totalProducts} Lei</ul>
  <li class="list-group-item">Tips:  ${order.tips} Lei</li>
  <li class="list-group-item">Cash Back: - ${order.cashBack} Lei</li>
  <li class="list-group-item fw-bold">Total:  ${order.total} Lei</li>
  <button class="btn pending btn-danger">Accepta</button>
  <select class="form-select form-select-lg hide timeSelect" aria-label="Send-time-select">
  <option selected>Trimite timp</option>
  <option value="300000">5 Min</option>
  <option value="420000">7 Min</option>
  <option value="540000">9 Min</option>
  <option value="720000">12 Min</option>
  <option value="900000">15 Min</option>
  <option value="1200000">20 Min</option>
  <option value="1500000">25 Min</option>
  <option value="1800000">30 Min</option>
</select>
  <button disabled="true" class="btn hide time btn-success">Trimite Timp</button>
  <button class="btn acceptata hide btn-success">Terminat</button>
  </ul>
  `;
    if (withding) {
        //SET INTERVAL FOR ANIMATION
        const intervalId = setInterval(() => {
            orderDiv.classList.add('appear');
            setTimeout(() => {
                orderDiv.classList.remove('appear');
            }, 1000); // Hide the div after 1 second
        }, 1500);

        dingSound.addEventListener('ended', () => {
            dingSound.currentTime = 0;
            dingSound.play();
        });

        dingSound.play();

        const acceptaButton = orderDiv.querySelector('.pending');
        const timeSendButton = orderDiv.querySelector('.time');
        const terminatButton = orderDiv.querySelector('.acceptata');
        const timeSelect = orderDiv.querySelector('.timeSelect');

        timeSelect.addEventListener('change', function () {
            console.log(timeSelect.value)
            if (timeSelect.value !== '') {
                timeSendButton.removeAttribute('disabled');
            } else {
                timeSendButton.setAttribute('disabled', true);
            }
        });
        acceptaButton.addEventListener('click', () => {
            clearInterval(intervalId);
            dingSound.pause();
            dingSound.currentTime = 0;
            orderDiv.classList.remove('appear');

            // acceptaButton.classList.remove('pending');
            acceptaButton.classList.add('hide');


            timeSelect.classList.remove('hide');
            timeSendButton.classList.remove('hide');
            timeSendButton.addEventListener('click', () => {
                const time = timeSelect.value
                const orderId = order._id
                fetch(`${baseUrlHeroku}order/set-order-time?orderId=${orderId}&time=${time}`).then(res => res.json()).then(data => {
                    console.log(data)
                    terminatButton.classList.remove('hide');
                    timeSelect.classList.add('hide');
                    timeSendButton.classList.add('hide');
                })
            })
        });
        newOrdersDiv.appendChild(orderDiv);
    } else {
        const acceptaButton = orderDiv.querySelector('.pending');
        // acceptaButton.classList.remove('pending');
        acceptaButton.classList.add('hide');
        const terminatButton = orderDiv.querySelector('.acceptata');
        terminatButton.classList.remove('hide');
        newOrdersDiv.appendChild(orderDiv);
    }
}







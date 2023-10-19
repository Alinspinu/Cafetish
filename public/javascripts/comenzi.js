

let baseUrlLocal = 'http://localhost:8090/'
const baseUrlHeroku = 'https://www.cafetish.com/'

const currentUrl = window.location.href;
if (currentUrl.startsWith(baseUrlLocal)) {
    baseUrlLocal = baseUrlLocal;
} else {
    baseUrlLocal = baseUrlHeroku;
}


const url = `${baseUrlLocal}api/recive-order`;
const urlLocalSend = `${baseUrlLocal}api/order-done`;
const eventSource = new EventSource(url);

eventSource.onopen = () => {
    console.log('EventSource connection is open.');
};

eventSource.onmessage = (event) => {
    const order = JSON.parse(event.data);
    if (!order || order.message === 'No Orders') {
        console.log('hit the no orders')
    } else {
        console.log(order)
        addOrder(order, true);
    }
};

eventSource.onerror = (event) => {
    console.error('Error occurred with the EventSource connection:', event);
};

const getOrdersUrl = `${baseUrlLocal}api/get-order`;
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
    if (event.target.classList.contains("accept")) {
        const btnsTer = event.target;
        const orderId = btnsTer.closest(".list-group").querySelector(".order-id").textContent;
        fetch(`${urlLocalSend}?cmdId=${orderId}`).then(response => console.log(response));
        const elementToRemove = btnsTer.parentNode.parentNode
        if (elementToRemove.parentNode) {
            elementToRemove.parentNode.removeChild(elementToRemove)
        }
    }
});

function topping(product){
    let toppings 
    if(product.toppings.length > 0){
        toppings = product.toppings.join(', ')
    } else {
        toppings = product.toppings[0]
    }
    console.log(toppings)
    return toppings
}

function addOrder(order, withding) {
    console.log(order.products)
    console.log('hit the create order fuction')
    const orderDiv = document.createElement("div");
    orderDiv.classList.add('col-sm-6', 'col-md-6', 'col-lg-4', "mb-4", 'order', "appear");

    const date = new Date(order.createdAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const localTimeString = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
    const now = new Date(Date.now())
    const timeToBeReady = (date.getTime() + order.completetime) - now;
   
    const productList = order.products.map(product => `<li class="list-group-item">
    <div class="product-wrapper">
    <span class='prod-name'>${product.quantity} X ${product.name}</span>
    <span class='prod-price'>${product.total} Lei</span>
    </div>
    <div>
    <span class='bold'>+${product.toppings.join(', ')}</span>
    </div>
    </li>`).join('');

    orderDiv.innerHTML = `

    <ul class="list-group">
    <div class="hide-wrapper hide">
    <i class="bi bi-eye"></i>
    <span class="hide-text">Ascunde</span>
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
    <div class="bold" id="firstTimer"></div>
    <div class="bold hide" id="timer"></div>
    <span class="bold" id="table">Masa: ${order.masa}</span>
    <span class="bold hide" id="pick">Pick UP</span>
    </div>
    </li>
    <li class="list-group-item">
    <div class="wrapper">
    <div> <span>Primită: </span><span class="bold">${localTimeString}</span></div>
    <div class="bold hide" id="toGo"><span>La Pachet</span></div>
    <div><span>ETA: </span><span class="bold" id="end"></span></div>
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
    <span>Plătit cu Cash Back</span> 
    <span>- ${order.cashBack} Lei</span>
    </div>
    </li>


    <li class="list-group-item bold to-hide">
    <div class="wrapper">
    <span id="payOnline">Plătit Online</span> 
    <span id="payOnSite" class="hide">Rest de plata</span>
    <span>${order.total} Lei</span>
    </div>
    </li>

    <li class="list-group-item bold to-hide hide" id="zero">
    <div class="wrapper">
    <span>Rest de plata</span>
    <span> 0 Lei</span>
    </div>
    </li>

    <li class="list-group-item p-0 hide time-li">
    <div class="time-group-wrapper">
    <span class="time-title">Selectează timpul de așteptare!</span>
    <div class="time-wrapper">
    <span style="color:#1a4301;" class="time-button">5 Min</span>
    <span style="color:#245501;" class="time-button">7 Min</span>
    </div>
    <div class="time-wrapper">
    <span style="color:#2b9348;" class="time-button">9 Min</span>
    <span style="color:#007f5f;" class="time-button">12 Min</span>
    </div>
    <div class="time-wrapper">
    <span style="color:#ffaa00;" class="time-button">15 Min</span>
    <span style="color:#ff8800;" class="time-button">20 Min</span>
    </div>
    <div class="time-wrapper">
    <span style="color:#ff7b00;" class="time-button">25 Min</span>
    <span style="color:#ff4800;" class="time-button">30 Min</span>
    </div>
    </div>
    </li>   
    <button class="btn pending btn-danger">Accepta</button>
    <button class="btn accept hide btn-success">Terminat</button>
     </ul>`;

    const acceptaButton = orderDiv.querySelector('.pending');
    const terminatButton = orderDiv.querySelector('.accept');
    const timeLi = orderDiv.querySelector('.time-li');
    const timeButtons = orderDiv.querySelectorAll('.time-button');
    const timer = orderDiv.querySelector('#timer');
    const firstTimer = orderDiv.querySelector('#firstTimer')
    const hideOrderButton = orderDiv.querySelector('.hide-wrapper');
    const hideIcon = orderDiv.querySelector('i')
    const hideText = orderDiv.querySelector('.hide-text');
    const elementsToHide = orderDiv.querySelectorAll('.to-hide');
    const end = orderDiv.querySelector('#end');
    const pick = orderDiv.querySelector("#pick");
    const table = orderDiv.querySelector("#table");
    const toGo = orderDiv.querySelector('#toGo');
    const payOnline = orderDiv.querySelector('#payOnline');
    const payOnSite = orderDiv.querySelector('#payOnSite');
    const zero = orderDiv.querySelector('#zero')
    console.log(order)
    if(!order.payOnline){
        payOnline.classList.add('hide');
        payOnSite.classList.remove('hide');
    } else {
        zero.classList.remove('hide')
    }

    if(order.pickUp){
        pick.classList.remove('hide');
        table.classList.add('hide')
    } 
    if(order.toGo){
        console.log('ceva')
        toGo.classList.remove('hide')
    }

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

        let hitOnTime = true;
   
        setTimeout(()=>{
            hitOnTime = false
            console.log('inside timeout', hitOnTime)
        }, 23000)

        setupCountdownTimerBeforeAccept(firstTimer)
        
        acceptaButton.addEventListener('click', () => {
            if(hitOnTime){
                console.log("true", hitOnTime)
                clearInterval(intervalId);
                dingSound.pause();
                dingSound.currentTime = 0;
                orderDiv.classList.remove('appear');
                timeLi.classList.remove('hide');
                acceptaButton.classList.remove('pending');
                acceptaButton.classList.add('hide');
    
                console.log('before click')
                timeButtons.forEach((el) => {
                    el.addEventListener('click', () => {
                        const timeTo = parseFloat(el.innerText.slice(0, -3)) * 60 * 1000
                        console.log('ceva');
                        setupCountdownTimer(timeTo, timer);
                        calcEndTime(date, timeTo, end)
                        const orderId = order._id;
                        fetch(`${baseUrlHeroku}api/set-order-time?orderId=${orderId}&time=${timeTo}`).then(res => res.json()).then(data => {
                            terminatButton.classList.remove('hide');
                            timer.classList.remove('hide');
                            firstTimer.classList.add('hide');
                            timeLi.classList.add('hide');
                            hideOrderButton.classList.remove('hide')
                        })
                    })
                })
            } else {
                console.log("false",hitOnTime)
                setupCountdownTimer(0, timer);
                clearInterval(intervalId);
                dingSound.pause();
                dingSound.currentTime = 0;
                orderDiv.classList.remove('appear');
                timeLi.classList.remove('hide');
                acceptaButton.classList.remove('pending');
                acceptaButton.classList.add('hide');
                terminatButton.classList.remove('hide');
                timeLi.classList.add('hide');
                hideOrderButton.classList.remove('hide')
            }
        });
        showHideElements(hideOrderButton, hideIcon, hideText, elementsToHide);
        newOrdersDiv.appendChild(orderDiv);
    } else {
        hideOrderButton.classList.remove('hide');
        calcEndTime(date, order.completetime, end)
        setupCountdownTimer(timeToBeReady, timer);
        showHideElements(hideOrderButton, hideIcon, hideText, elementsToHide);
        const acceptaButton = orderDiv.querySelector('.pending');
        acceptaButton.classList.add('hide');
        const terminatButton = orderDiv.querySelector('.accept');
        terminatButton.classList.remove('hide');
        timer.classList.remove('hide');
        firstTimer.classList.add('hide');
        newOrdersDiv.appendChild(orderDiv);
    }
}

function calcEndTime(startTime, givenTime, element) {
    const endTimeMiliseconds = startTime.getTime() + givenTime
    const date = new Date(endTimeMiliseconds)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const endTime = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
    element.innerText = endTime;
}


function setupCountdownTimerBeforeAccept(timerElement) {
    console.log('hit timer before function')
        let timeToSend = 23
        function updateTimer() {
            if (timeToSend <= 0) {
                clearInterval(interval);
                timerElement.textContent = "NU A FOST DAT TIMP!";
                return;
            }
            timerElement.textContent = timeToSend
            timeToSend -= 1;
        }
        const interval = setInterval(updateTimer, 1000);
}




function setupCountdownTimer(timeToBeReady, timerElement) {
    if(timeToBeReady <= 0){
        timerElement.textContent = "NU A FOST DAT TIMP!"
    } else {
        let timeToSend = timeToBeReady;
        function updateTimer() {
            if (timeToSend <= 0) {
                clearInterval(interval);
                timerElement.textContent = "TIMPUL A EXPIRAT!";
                return;
            }
            const minutes = Math.floor(timeToSend / 60000);
            const seconds = Math.floor((timeToSend % 60000) / 1000);
            const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.textContent = formattedTime;
            timeToSend -= 1000;
        }
        const interval = setInterval(updateTimer, 1000);
    }
}


function showHideElements(hideOrderButton, hideIcon, hideText, elementsToHide) {
    hideOrderButton.addEventListener('click', () => {
        if (hideText.innerText === 'Ascunde') {
            hideIcon.classList.remove('bi-eye');
            hideIcon.classList.add('bi-eye-slash');
            hideText.innerText = 'Arată';
            elementsToHide.forEach((el) => {
                el.classList.add('hide')
            })
        } else {
            hideIcon.classList.remove('bi-eye-slash');
            hideIcon.classList.add('bi-eye');
            hideText.innerText = 'Ascunde';
            elementsToHide.forEach((el) => {
                el.classList.remove('hide')
            })
        }

    })
}











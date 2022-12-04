
if(document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
}else {
    ready()
}

function ready() {
    const removeCartItemBt =  document.getElementsByClassName('btn-danger');
    for( let i = 0; i<removeCartItemBt.length; i++){
        const button = removeCartItemBt[i]
        button.addEventListener('click', removeCartItem)
    }

    const qtyInputs = document.getElementsByClassName('qty')
    for( let i = 0; i<qtyInputs.length; i++){
        const input =qtyInputs[i]
        input.addEventListener('change', quantityChanged)
    }

   
}

function purchaseClecked() {
    const priceElement = cartRow.getElementsByClassName('label')[0]
    const price = parseFloat(priceElement.innerText.replace('Lei', ''))
    stripeHandler.open({
        amount: price
    })
}

function removeCartItem(event) {
    const buttonCliked = event.target
    buttonCliked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    const input = event.target
    if(isNaN(input.value) || input.value <= 0) {
        input.value = 1
    } 
    updateCartTotal()
}


function updateCartTotal() {
    const container = document.getElementsByClassName('list-group')[0]
    const cartRows = document.getElementsByClassName('list-group-item')
    let total = 0 
    for( let i = 0; i< cartRows.length; i++){
        const cartRow = cartRows[i]
        const priceElement = cartRow.getElementsByClassName('label')[0]
        const qtyElement = cartRow.getElementsByClassName('qty')[0]
        const qty = qtyElement.value
        const price = parseFloat(priceElement.innerText.replace('Lei', ''))
        total = total + (price*qty)
    }
    
    document.getElementsByClassName('total')[0].innerText ='TOTAL ' + total + ' Lei'

}
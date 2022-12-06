module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id) {
        let storedItem = this.items[id];
        if(!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, pret: 0, img: item.imagine.path, nume: item.nume };
        }
        storedItem.qty++;
        storedItem.pret = storedItem.item.pret*storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.pret;

    };

    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].pret -= this.items[id].item.pret;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.pret;
        
        if(this.items[id].qty <= 0) {
            delete this.items[id]
        }

    }
    this.addByOne = function(id) {
        this.items[id].qty++;
        this.items[id].pret += this.items[id].item.pret;
        this.totalQty++;
        this.totalPrice += this.items[id].item.pret;
    }

    this.generateArray = function() {
        const arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
}
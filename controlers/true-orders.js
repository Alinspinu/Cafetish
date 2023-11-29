if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const TrueOrder = require('../models/order-true')



module.exports.sendLiveOrders = async (req, res, next) => {
    const since = req.query.since
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    const changeStream = TrueOrder.watch({ fullDocument: "updateLookup" });
    changeStream.on("change", async (change) => {
        if (
            change.operationType === "insert" &&
            change.fullDocument.status === 'open' &&
            change.fullDocument.production === false 
        ) {
            const newOrder = await TrueOrder.findOne({ _id: change.fullDocument._id, production: false }).exec();
            res.write(`data: ${JSON.stringify(newOrder)}\n\n`);
        }
    })
    console.log('hit the message')
    const message = { message: 'No Orders' }
    res.write(`data: ${JSON.stringify(message)}\n\n`);
}


module.exports.getOrder = async (req, res, next) => {
    const orders = await TrueOrder.find({ status: "open" })
    res.json(orders)
}


module.exports.orderDone = async (req, res, next) => {
    const { cmdId } = req.query
    const doc = await TrueOrder.findByIdAndUpdate(cmdId, { status: 'done' })
    res.status(200)
}

module.exports.setOrderTime = async (req, res, next) => {
    try {
        const time = parseFloat(req.query.time);
        const orderId = (req.query.orderId);
        const order = await TrueOrder.findOneAndUpdate({ _id: orderId }, { completetime: time }, { new: true });
        res.status(200).json({ message: 'time set' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.error.message })
    }
}

module.exports.renderTrueOrders = (req, res) => {
    res.render('orders-true/comenzi')
}


module.exports.renderTrueOrdesTerminat = (req, res) => {
    res.render('orders-true/comenzi-terminate')
}

module.exports.getOrderDone = async (req, res, next) => {
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0)
        const orders = await TrueOrder.find({ createdAt: { $gte: currentDate }, status: 'done' })
        res.status(200).json(orders)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.error.message })
    }
}



function comparePasswords(password, hashedPassword) {
    const [salt, originalHash] = hashedPassword.split("$");
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
    return hash === originalHash;
}

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
    return [salt, hash].join("$");
}

const Day = require('../models/day')
const Entry = require('../models/entry')
const createCashRegisterDay = require('../utilities/createDay')



module.exports.renderRegister = async (req, res, next) => {
    createCashRegisterDay()
    res.render('orders-true/register')
}

module.exports.sendEntry = async (req, res, next) => {
    const data = req.query.data
    const dateParts = data.split(".")
    const year = parseInt(dateParts[2]) + 2000
    const month = parseInt(dateParts[1]) - 1
    const day = parseInt(dateParts[0])
    const dateObject = new Date();
    dateObject.setFullYear(year);
    dateObject.setMonth(month);
    dateObject.setDate(day);
    dateObject.setUTCHours(0,0,0,0)
    const nextDay = new Date(dateObject);
    nextDay.setDate(dateObject.getDate() + 1);
    const regDay = await Day.findOne({ date:{ $gte: dateObject, $lt: nextDay} }).populate({ path: 'entry' });
    res.json({ regDay })
}

module.exports.addEntry = async (req, res, next) => {
    const { tip, date, description, amount } = req.body.entry
    if(tip && date && description && amount){
        const entryDate = new Date(date)
        const newEntry = new Entry({
            tip: tip,
            date: entryDate,
            description: description,
            amount: tip === 'expense' ? -amount : amount,
        })
        newEntry.save()
        const nextDay = new Date(entryDate);
        nextDay.setDate(entryDate.getDate() + 1);
        const day = await Day.findOne({ date: { $gte: entryDate, $lt: nextDay} }).populate({ path: 'entry' })
        if (day) {
            const daySum = day.entry.reduce((total, doc) => total + doc.amount, 0)
            day.entry.push(newEntry)
            const dayTotal = daySum + newEntry.amount + day.cashIn
            day.cashOut = dayTotal
            await day.save()
        } else {
            entryDate.setUTCHours(0,0,0,0)
            const newDay = new Day({
                date: entryDate,
                cashOut: newEntry.amount
            })
            newDay.entry.push(newEntry)
            await newDay.save()
            console.log('first day created')
        }
        res.redirect('back')
    } else {
        res.status(226).json({message: 'Nu ai completat toate campurile mai incearca.. :)'})
    }
}

module.exports.deleteEntry = async (req, res, next) => {
    const { id } = req.body;
    try {
        const entry = await Entry.findById(id)
        const day = await Day.findOne({ date: entry.date })
        await entry.deleteOne();
        await Day.findOneAndUpdate({ _id: day._id }, { $pull: { entry: entry._id } }).exec()
        day.cashOut = day.cashOut - entry.amount
        if(!day.entry.length){
            console.log("ceva")
            day.cashOut = day.cashIn
        }
        day.save()
        res.status(200).json({ message: `Entry ${entry.description}, with the amount ${entry.amount} was deleted` })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}
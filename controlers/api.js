const Product = require('../models/product-true')
const Cat = require('../models/cat-true')
const { cloudinary } = require('../cloudinary');


module.exports.sendCats = async (req, res, next) => {
    const { mainCat } = req.query
    const cats = await Cat.find({ mainCat: mainCat })
    res.status(200).json(cats)
}

module.exports.sendCat = async (req, res, next) => {
    const { id } = req.query
    const cat = await Cat.findById(id).populate({
        path: 'product'
    })
    console.log(cat)
    res.status(200).json(cat)
}


module.exports.addCat = async (req, res, next) => {
    const cat = new Cat(req.body)
    if (req.file) {
        const { path, filename } = req.file
        cat.image.filename = filename
        cat.image.path = path
    }
    await cat.save()
    res.status(200).json({ message: `Category ${cat.name} was created!` })
}

module.exports.addProd = async (req, res, next) => {
    const { category } = req.body
    const cat = await Cat.findById(category)
    const product = new Product(req.body)
    if (req.file) {
        const { path, filename } = req.file
        product.image.filename = filename
        product.image.path = path
    }
    cat.product.push(product)
    await product.save()
    await cat.save()
    res.status(200).json({ message: `Product ${product.name} was created!` })
}
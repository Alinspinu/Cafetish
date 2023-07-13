const Product = require('../models/product-true')
const SubProduct = require('../models/product-true')
const Cat = require('../models/cat-true')
const User = require('../models/user-true')
const { cloudinary } = require('../cloudinary');
const crypto = require('crypto')
const jwt = require('jsonwebtoken')


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
    res.status(200).json(cat)
}

module.exports.saveSubProd = async (req, res, next) => {
    const { id, name, price } = req.query
    const product = await Product.findById(id)
    console.log(product)
    product.subProducts.push({ name: name, price: price })
    console.log(product)
    await product.save()
    res.status(200).json({ message: `${name}, was saved in ${product.name}` })
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
    console.log(cat)
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


module.exports.login = async (req, res, next) => {
    const { name, password } = req.body;
    const user = await User.findOne({ name: name });
    if (!user || !comparePasswords(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '12h' });
    const sendData = { token: token, name: user.name }
    res.json(sendData);
}


// module.exports.register = async (req, res, next) => {
//     const hashedPassword = hashPassword('VefcemltfC');
//     const newUser = new User({
//         password: hashedPassword,
//         name: 'allisone',
//     });
//     await newUser.save()
//     res.status(200).json({ message: `allisone and allisdone ${newUser.password}` });

// }

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

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const Product = require('../models/product-true')
const SubProduct = require('../models/sub-product')
const Cat = require('../models/cat-true')
const User = require('../models/user-true')
const Order = require('../models/order-true')
const { cloudinary } = require('../cloudinary');
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const querystring = require('querystring');
const { json } = require('body-parser');



module.exports.sendCats = async (req, res, next) => {
    const { mainCat } = req.query
    const cats = await Cat.find().populate({
        path: 'product',
        populate: [
            { path: 'category' },
            {
                path: 'subProducts',
                populate: {
                    path: 'product',

                }
            }]
    })
    res.status(200).json(cats)
}

module.exports.sendCat = async (req, res, next) => {
    const { id } = req.query
    const cat = await Cat.findById(id).populate({
        path: 'product',
        populate: {
            path: 'subProducts'
        }
    })
    res.status(200).json(cat)
}

module.exports.saveSubProd = async (req, res, next) => {
    const { id, name, price } = req.query
    const product = await Product.findById(id)
    const newSubProduct = new SubProduct({
        name: name,
        price: price,
        product: id
    })
    product.subProducts.push(newSubProduct)
    await newSubProduct.save()
    await product.save()
    res.status(200).json({ message: `${name}, was saved in ${product.name}` })
}

module.exports.addCat = async (req, res, next) => {
    const cat = new Cat(req.body)
    console.log(req.file)
    if (req.file) {
        const { path, filename } = req.file
        cat.image.filename = filename
        cat.image.path = path
    }

    await cat.save()
    console.log(cat)
    res.status(200).json({ message: `Category ${cat.name} was created!` })
}

module.exports.addProd = async (req, res, next) => {
    const { category } = req.body
    const cat = await Cat.findById(category)

    const product = new Product(req.body)
    product.price = parseFloat(req.body.price)
    console.log(product, req.body)
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

module.exports.getToken = async (req, res, next) => {
    try {
        const clientId = process.env.VIVA_CLIENT_ID_DEMO;
        const clientSecret = process.env.VIVA_CLIENT_SECRET_DEMO;
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const url = 'https://demo-accounts.vivapayments.com/connect/token';
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`
        };
        const total = parseInt(req.query.total) * 100
        const response = await axios.post(url, 'grant_type=client_credentials', { headers });
        const requestBody = {
            amount: total,
            customerTrns: 'Produse Delicioase',
            customer: {
                email: '',
                fullName: '',
                phone: '',
                countryCode: 'RO',
                requestLang: 'ro-RO'
            },
            paymentTimeout: 300,
            preauth: false,
            allowRecurring: false,
            maxInstallments: 12,
            paymentNotification: true,
            tipAmount: 100,
            disableExactAmount: false,
            disableCash: true,
            disableWallet: true,
            sourceCode: '1341',
            merchantTrns: '',
            tags: [

            ],
            cardTokens: [

            ]
        };
        const urlPayment = 'https://demo-api.vivapayments.com/checkout/v2/orders'
        const response2 = await axios.post(urlPayment, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${response.data.access_token}`,
            }
        });
        res.status(200).json(response2.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.saveOrder = async (req, res, next) => {
    const newOrder = new Order(req.body)
    await newOrder.save()
    res.status(200).json({ message: `Order ${newOrder.index} was created` })
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

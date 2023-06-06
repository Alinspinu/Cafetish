const { cloudinary } = require('../cloudinary');
const Recipe = require('../models/recipe')


module.exports.renderSearchRecipes = async (req, res) => {
    const recipes = await Recipe.find({})
    console.log(req.session.userId)
    res.render('recipe/recipes-search', { recipes, session: req.session })
}

module.exports.renderAddRecipe = async (req, res) => {
    res.render('recipe/recipe-add')
}

module.exports.renderRecipeShow = async (req, res) => {
    const recipe = await Recipe.findById(req.params.id)
    res.render('recipe/recipe-show', { recipe, session: req.session })
}

module.exports.createRecipe = async (req, res) => {
    try {
        const {
            name,
            totalVolume,
            method,
            grinderStep,
            waterTemp,
            brewTime,
            recipent,
            garnish,
        } = req.body.recipe
        const author = req.session.userId
        const newRecipe = new Recipe({
            name: name,
            totalVolume: totalVolume,
            method: method,
            grinderStep: grinderStep,
            waterTemp: waterTemp,
            brewTime: brewTime,
            recipent: recipent,
            garnish: garnish,
            author: author
        })
        const ingredients = req.body.recipe.ingredients
        const nameArray = ingredients.name
        if (Array.isArray(nameArray)) {
            for (let i = 0; i < nameArray.length; i++) {
                const newIng = {
                    name: ingredients.name[i],
                    um: ingredients.um[i],
                    quantity: ingredients.quantity[i]
                }
                newRecipe.ingredients.push(newIng)
            }
        } else {
            newRecipe.ingredients.push(ingredients)
        }
        if (req.file) {
            const { filename, path } = req.file
            newRecipe.image.filename = filename
            newRecipe.image.path = path
        }
        await newRecipe.save()
        console.log(newRecipe)
        res.redirect('back')
    } catch (err) {
        console.log(err)
        res.redirect('back')
    }
}

module.exports.renderEditRecipe = async (req, res) => {
    try {
        const id = req.params.id
        const recipe = await Recipe.findById(id)
        res.render('recipe/recipe-edit', { recipe })
    } catch (err) {
        console.log(err)
        res.redirect('/recipes')
    }
}

module.exports.editRecipe = async (req, res) => {
    const id = req.params.id
    const {
        name,
        totalVolume,
        method,
        grinderStep,
        waterTemp,
        brewTime,
        recipent,
        garnish,
    } = req.body.recipe
    const recipe = await Recipe.findById(id)
    recipe.name = name;
    recipe.totalVolume = totalVolume;
    recipe.method = method
    recipe.grinderStep = grinderStep;
    recipe.waterTemp = waterTemp;
    recipe.brewTime = brewTime;
    recipe.recipent = recipent;
    recipe.garnish = garnish;

    const ingredients = req.body.recipe.ingredients
    const nameArray = ingredients.name
    if (Array.isArray(nameArray)) {
        let ingArr = []
        for (let i = 0; i < nameArray.length; i++) {
            const newIng = {
                name: ingredients.name[i],
                um: ingredients.um[i],
                quantity: ingredients.quantity[i]
            }
            ingArr.push(newIng)
        }
        recipe.ingredients = ingArr
    } else {
        recipe.ingredients.length = 0
        recipe.ingredients.push(ingredients)
    }
    await recipe.save()
    console.log(recipe)
    res.redirect(`/recipes/${id}`)
}

module.exports.deleteRecepie = async (req, res) => {
    try {
        const { id } = req.params
        const recipe = await Recipe.findOne({ _id: id })
        const { image } = recipe
        if (image.filename) {
            await cloudinary.uploader.destroy(image.filename)
        }
        await Recipe.findByIdAndDelete(id)
        res.redirect('/recipes');
    } catch (err) {
        console.log(err)
        res.redirect('/recipes')
    }
}





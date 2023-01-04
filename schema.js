const BaseJoi = require('joi')
const sanitizeHTML = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML',{ value })
                return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension)

    module.exports.produsSchema = Joi.object({
        produs: Joi.object({
            nume: Joi.string().required().escapeHTML(),
            gramaj: Joi.string().required().escapeHTML(),
            categorie: Joi.string().required().escapeHTML(),
            pret: Joi.number().required(),
            descriere: Joi.string().required().escapeHTML()
        }).required()
    })

    module.exports.catSchema = Joi.object({
        categorie: Joi.object({
            nume: Joi.string().required().escapeHTML(),
            descriere: Joi.string().required().escapeHTML(),
        }).required()
    })

    module.exports.comandaSchema = Joi.object({
        comanda: Joi.object({
        nume: Joi.string().required().escapeHTML(),
        email: Joi.string().required().escapeHTML(),
        telefon: Joi.string().required().escapeHTML(),
        mesaj: Joi.string().required().escapeHTML(),
        timp: Joi.number()
        }).required()
    })

    module.exports.cafeaSchema = Joi.object({
        cafea: Joi.object({
            nume: Joi.string().required().escapeHTML(),
            descriere: Joi.string().required().escapeHTML(),
            // profilEsp: Joi.string(),
            // profilFil: Joi.string()
        }).required()
    })
 
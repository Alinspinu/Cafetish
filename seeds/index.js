const mongoose = require('mongoose');
const Categorie = require('../models/categorie');
const produs = require('../models/produs');

const Produs = require('../models/produs');


mongoose.connect('mongodb://localhost:27017/Cafetish');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


// aceasta functie da un element neutru dintr-un array
const sample = array => array[Math.floor(Math.random() * array.length)]



const seedDB = async () => {
    await Produs.deleteMany({});
    await Categorie.deleteMany({})
    
   for (let i = 0; i< 30; i++) {
        const prod = new Produs({
            nume: 'Cafea Buna',
            descriere: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga, excepturi consectetur enim odit pariatur dolores amet, soluta, nemo mollitia illo aperiam quis distinctio similique aut sit illum obcaecati? Libero, ea.',
            pret: '66 lei',
            gramaj: '123 ml',
            imagine: {
                  path: 'https://res.cloudinary.com/dhetxk68c/image/upload/v1668264513/ProduseI/kzolzsad3gujlpfgvzhp.jpg',
                  filename: 'ProduseI/kzolzsad3gujlpfgvzhp'
            },
            video: {
              path: 'https://res.cloudinary.com/dhetxk68c/video/upload/v1668269160/ProduseI/New_Project_edit_pduwyg.mp4',
              filename: 'ProduseI/New_Project_edit_pduwyg'
            }
        })
        await prod.save()
   }
   const prod = await Produs.find({})
   const produsId = await prod.map(f => ({_id: f._id}));
//    console.log(produsId)
    const cat = new Categorie({
    nume: 'Cafea cu Lapte',
    imagine: 
        {
            path: 'https://res.cloudinary.com/dhetxk68c/image/upload/v1668264513/ProduseI/kzolzsad3gujlpfgvzhp.jpg',
            filename:'ProduseI/kzolzsad3gujlpfgvzhp'
        },
        produs: produsId,
        descriere: "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas cum ipsum distinctio doloremque deserunt dolorum voluptates consectetur officia nulla non obcaecati, similique error ipsa excepturi, quam necessitatibus, accusantium asperiores laboriosam!"
})
await cat.save()
} 
seedDB().then(() => {
    mongoose.connection.close();
})


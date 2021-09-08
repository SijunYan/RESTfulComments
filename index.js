const express = require("express");
const path = require('path')
const data = require('./data.json')
const methodOverride = require('method-override')

const app = express();
console.log(app)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


// litsen the port
app.listen('3000', () => {
    console.log('Server turn on now,  start to listen to port 3000!!!!')
})


// Home page
app.get('/animal', (req, res) => {
    // res.render('animalhome', { pet1: 'dog', pet2: 'cat' });
    let petcollections = [];
    for (let i in data) {
        console.log(i);
        petcollections.push(i);
    }
    console.log(petcollections);
    res.render('animalhome', { pet: petcollections });
})

// show specific pet page
app.get('/animal/:pet', (req, res) => {
    // get req.params = {pet : dog}; or req.params.pet = dog
    // console.log(`Client ask for data of ${req.params.pet} -------------------------------------------------------->`);
    const resdata = Object.values(data).find(e => e.name.toLowerCase() == req.params.pet.toLowerCase());
    // console.log(resdata);
    res.render('petshome', resdata);

})


//open the new post page for pet 
app.get('/animal/:pet/new', (req, res) => {
    // console.log(req.params)
    res.render('new', req.params);
})


// post new post
app.post('/animal/:pet', (req, res) => {
    // console.log(req.body, req.params.pet);
    const dataArray = Object.values(data);
    const tData = dataArray.find(e => e.name.toLowerCase() == req.params.pet.toLowerCase());
    tData.posts.push(req.body);
    // console.log(tData);
    res.redirect(`/animal/${req.params.pet}`)
})

// open edit page, display the original text content
app.get('/animal/:pet/:author/edit', (req, res) => {
    // console.log(req.params);
    const eData = Object.values(data).find(e => e.name.toLowerCase() == req.params.pet.toLowerCase());
    let titleDate = eData.posts.find(e => e.author.toLowerCase() == req.params.author.toLowerCase());
    // console.log(titleDate);
    res.render('edit', { title: titleDate.title, author: titleDate.author, pet: req.params.pet });
});

//patch and post the edited content , creat a new array, and update it by iterate through
app.patch('/animal/:pet/:author', (req, res) => {
    // console.log('----------------new content-----------------')
    // console.log(req.body, req.params);
    const targetPet = Object.values(data).find((e, i) => e.name.toLowerCase() == req.params.pet.toLowerCase());

    // console.log('----------------original data-----------------')
    // console.log(targetPet);


    for (let e of targetPet.posts) {
        if (e.author == req.params.author) {
            e.title = req.body.title;
            e.author = req.body.author;
        }
    }

    // console.log('----------------edited data-----------------')
    // console.log(newPet)

    res.redirect(`/animal/${req.params.pet}`)
})


// delete

app.delete('/animal/:pet/:author', (req, res) => {
    console.log(req.params);
    const dPet = Object.values(data).find((e, i) => e.name.toLowerCase() == req.params.pet.toLowerCase());

    dPet.posts = dPet.posts.filter(e => e.author !== req.params.author);
    console.log(dPet.posts)

    res.redirect(`/animal/${req.params.pet}`)
})
require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const User = require('../models/user');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    const user = await User.findOne();
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: user._id,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
            type: "Point",
            coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude,
                ]
            },

            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            price,
            url: 'https://res.cloudinary.com/djnblmfgn/image/upload/v1780001311/YelpCamp/luojdk3w2jeo2bt53q8p.jpg',
            images: [{
                        url: 'https://res.cloudinary.com/djnblmfgn/image/upload/v1780001311/YelpCamp/luojdk3w2jeo2bt53q8p.jpg',
                        filename: 'YelpCamp/luojdk3w2jeo2bt53q8p',
                        },
                        {
                        url: 'https://res.cloudinary.com/djnblmfgn/image/upload/v1780001310/YelpCamp/qcsmyr5tjrhfmy8usrpq.jpg',
                        filename: 'YelpCamp/qcsmyr5tjrhfmy8usrpq',
                        },
                        {
                        url: 'https://res.cloudinary.com/djnblmfgn/image/upload/v1780001310/YelpCamp/maljgj2wcuopjs4nds9c.jpg',
                        filename: 'YelpCamp/maljgj2wcuopjs4nds9c',
                        }
                    ],

        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com",
    "https://js.stripe.com/v3/",
    "https://connect.facebook.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css",
    "https://api.mapbox.com/",
    "https://kit-free.fontawesome.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const fontSrcUrls = [
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com",
    "https://cdn.jsdelivr.net",
];
const helmetConfig = {
    directives: {
        defaultSrc: [],
        mediaSrc: ["https://res.cloudinary.com/", "http://localhost:8080/", "https://localhost:8080/", "https://www.cafetish.com", "http://localhost:8090", "https://172.20.110.62:8090"],
        connectSrc: [
            "https://172.20.110.62:8090",
            "https://localhost:8080",
            "http://localhost:8090",
            "https://localhost:8090",
            "https://www.cafetish.com/order/order-done",
            "http://localhost:8080/",
            "https://cafetish.com",
            "https://connect.facebook.net",
            "https://www.facebook.com",
            "https://www.cafetish.com",
        ],
        formAction: ["'self'", "https://checkout.stripe.com"],
        scriptSrcAttr: ["'unsafe-inline'"],
        scriptSrc: ["'unsafe-inline'", "'unsafe-eval'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        frameSrc: [
            "'self'",
            "blob:",
            "data:",
            "https://www.youtube.com",
            "https://js.stripe.com",
            "https://www.facebook.com",
        ],
        objectSrc: [],
        imgSrc: [
            "'self'",
            "blob:",
            "data:",
            "https://res.cloudinary.com/dhetxk68c/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
            "https://images.unsplash.com/",
            "https://q.stripe.com",
            "https://api.qrserver.com",
            "https://www.facebook.com",
            "https://platform-lookaside.fbsbx.com",
            "https://lh3.googleusercontent.com/",
            "https://upload.wikimedia.org",
            "https://s3-us-west-2.amazonaws.com/",
        ],
        fontSrc: ["'self'", ...fontSrcUrls],
    },
}

module.exports = helmetConfig;




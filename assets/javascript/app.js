var characters = ["bugs bunny", "sonic", "daffy duck", "voltron"];
var apiKey = "Q0KTalTKqslOmd7bSnjhPegnvKzJVgDw";
// make the button elements
for (var i = 0; i < characters.length; i++) {
    var toonName = characters[i];
    var nameNoSpaces = removeSpaces(toonName);
    var myButton = $('<button>' + toonName + '</button>');
    myButton.attr('value', toonName).attr('text', toonName).attr('name', nameNoSpaces);
    myButton.attr('class', 'character');
    $('#cartoonButtons').append(myButton);
}

//create a listener to handle button clicks
$('.character').click(function () {
    var toonName = this.name;
    doApiCall(toonName);
});

$('#cartoonForm').submit(function (event) {
    // console.log("form submitted");
    var toonName = $('#cartoonInput').val();
    var myButton = $('<button>' + toonName + '</button>');
    myButton.attr('value', toonName).attr('text', toonName).attr('name', removeSpaces(toonName));
    myButton.attr('class', 'character');
    myButton.attr('onclick', 'doApiCall("' + removeSpaces(toonName) + '")');
    $('#cartoonButtons').append(myButton);
    $('#cartoonInput').val("");
    return false; // avoid to execute the actual submit of the form.
});

//create a function here to remove spaces in a text string with + signs
function removeSpaces(name) {
    var newName = "";
    for (var i=0; i<name.length; i++) {
        if (name[i] === " ") {
            newName = newName + "+";
        }
        else {
            newName = newName + name[i];
        }
    }
    return newName;
}
//code here the ApiCall feature
function doApiCall(toonName) {
    var xhr = $.get("https://api.giphy.com/v1/gifs/search?q=" + toonName + "&api_key=" + apiKey + "&limit=10&rating=g");
    xhr.done(function(data) {
        for (var i=0; i< data.data.length; i++) {
            // console.log(data.data[i]);
            var gifMotionInfo = data.data[i].images.fixed_height.url;
            var gifStillInfo = data.data[i].images.original_still.url;
            var rating = data.data[i].rating;
            attachGif(gifStillInfo, gifMotionInfo, rating);
        }
    });
}

//this function takes a url of a gif image and attaches it to the page
function attachGif(stillUrl, motionUrl, rating) {
    //create a div tag
    var newDiv = $('<div>');
    newDiv.attr('class', 'toon');
    //create an image tag
    var newImage = $('<img>');
    //add url to tag
    newImage.attr('src', stillUrl);
    newImage.attr('data-still', stillUrl);
    newImage.attr('data-animate', motionUrl);
    newImage.attr('data-state', 'still');
    newImage.attr('height', "200");
    newImage.attr('onclick', 'changeState(this)')
    //create a p tag
    var newP = $('<p>');
    var rating = "rating: " + rating;
    newP.text(rating);
    //attach img to div
    newDiv.append(newImage);
    //attach p to div
    newDiv.append(newP);
    //attach div
    $('#cartoons').prepend(newDiv);
}

function changeState(imageClicked) {;
    var image = $(imageClicked);
    var state = image.attr('data-state');
    if (state === "still") {
        // update the state of the image
        image.attr('data-state', 'animate')
        //update the source of the image
        image.attr('src', image.attr('data-animate'))
    }
    else {
        // update the state of the image
        image.attr('data-state', 'still')
        //update the source of the image
        image.attr('src', image.attr('data-still'))
    }
}


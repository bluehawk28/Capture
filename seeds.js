var mongoose    = require("mongoose"),
    Galleries =   require("./models/gallery"),
    Comment =   require("./models/comments"),
    Users =   require("./models/users");
  
//Add a few photos
var data = [
    {
        image:"https://squadracorse.lamborghini.com/sites/lamborghinisc/files/dam/__release/Academy%20-%20Winter/Gallery/best-of-WA-Livigno-2016-0332.jpg",
        caption:"Lamborghini"
    },
    {
        image:"https://assets.bugatti.com/fileadmin/user_upload/Web/Pages/Models/Grand_Sport/BUG_grand_sport_05.jpg", 
        caption:"Buggati"
    },
    {
        image:"http://es.chevrolet.com/content/dam/chevrolet/na/us/english/index/vehicles/2018/performance/corvette-stingray/mov/01-images/2018-corvette-shared01.jpg?imwidth=1200",
        caption:"Corvette"
    }
    ];
//Add some comments  
  
    
function seedDB(){
//Remove Gallery
Galleries.remove({},function(err){
    if(err){
        throw err;
    }
    console.log("Cleaned");
        data.forEach(function(seed){
        Galleries.create(seed,function(err, photos){
            if(err){
                throw err;
            }else{
                console.log("Added Photos");
                //Add Comments
                Comment.create(
                    {
                        text:"Stupendous",
                        author: "Mitaksh"
                    },function(err, comment){
                        if(err){
                            throw err;
                        }else{
                            photos.comments.push(comment);
                            photos.save();
                            console.log("Create Comment");
                        }
                });
            }
        });
    });
});    
}
module.exports = seedDB;
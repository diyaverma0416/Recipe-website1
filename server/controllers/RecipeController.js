require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipes');

/*
* get /homepage
*/
 exports.homepage= async(req,res)=>{
try{
  const limitNumber = 5;
  const categories = await Category.find({}).limit(limitNumber);
  const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
  const Starter = await Recipe.find({ 'category': 'Starter' }).limit(limitNumber);
  const Lunch = await Recipe.find({ 'category': 'Lunch' }).limit(limitNumber);
  const Dinner = await Recipe.find({ 'category': 'Dinner' }).limit(limitNumber);

  const food = { latest, Lunch,Starter,Dinner };
  res.render('index',{title :'Recipe website-homepage'});
}
catch(error){
  res.status(500).send({message: error.message || "error is there"})
}

 }



 exports.recipesfinds=async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }
    res.render('RecipesPage', { recipe });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};


//searching recipe
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Cooking Blog - Search', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
  
}
 exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categories', categories } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}

// /**
//  * GET /submit-recipe
//  * Submit Recipe
// */
// exports.submitRecipe = async(req, res) => {
//   const infoErrorsObj = req.flash('infoErrors');
//   const infoSubmitObj = req.flash('infoSubmit');
//   res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
// }

// // /**
// //  * POST /submit-recipe
// //  * Submit Recipe
// // */
// // exports.submitRecipeOnPost = async(req, res) => {
// //   try {

// //     let imageUploadFile;
// //     let uploadPath;
// //     let newImageName;

// //     if(!req.files || Object.keys(req.files).length === 0){
// //       console.log('No Files where uploaded.');
// //     } else {

// //       imageUploadFile = req.files.image;
// //       newImageName = Date.now() + imageUploadFile.name;

// //       uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

// //       imageUploadFile.mv(uploadPath, function(err){
// //         if(err) return res.status(500).send(err);
// //       })

// //     }

// //     const newRecipe = new Recipe({
// //       name: req.body.name,
// //       description: req.body.description,
// //       email: req.body.email,
// //       ingredients: req.body.ingredients,
// //       category: req.body.category,
// //       image: newImageName
// //     });
    
// //     await newRecipe.save();

// //     req.flash('infoSubmit', 'Recipe has been added.')
// //     res.redirect('/submit-recipe');
// //   } catch (error) {
// //     // res.json(error);
// //     req.flash('infoErrors', error);
// //     res.redirect('/submit-recipe');
// //   }
// // }
// exports.submitRecipeOnPost = async (req, res) => {
//   try {
//     let imageUploadFile;
//     let uploadPath;
//     let newImageName;

//     if (!req.files || Object.keys(req.files).length === 0) {
//       console.log('No Files were uploaded.');
//     } else {
//       imageUploadFile = req.files.image;
//       newImageName = Date.now() + imageUploadFile.name;
//       uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

//       imageUploadFile.mv(uploadPath, function(err){
//         if (err) {
//           // Handle the file upload error
//           return res.status(500).send(err);
//         }
//       });
//     }

//     const newRecipe = new Recipe({
//       name: req.body.name,
//       description: req.body.description,
//       email: req.body.email,
//       ingredients: req.body.ingredients,
//       category: req.body.category,
//       image: newImageName,
//     });
//     await newRecipe.save();

//     req.flash('infoSubmit', 'Recipe has been added.')
//     return res.redirect('/submit-recipe');
//   } catch (error) {
  
//     req.flash('infoErrors', error.message);
//     return res.redirect('/submit-recipe');
//   }
// }
// //     await newRecipe.save();
// //     req.session.flashMessages.push({ type: 'success', message: 'Recipe has been added.' });
// //     return res.redirect('/submit-recipe');
// //   } catch (error) {
// //     req.session.flashMessages.push({ type: 'error', message: error.message });
// //     return res.redirect('/submit-recipe');
// //   }
// // };

// // async function insertDymmyRecipeData(){
// //   try {
// //     await Recipe.insertMany([
// //       { 
// //         "name": "Recipe Name Goes Here",
// //         "description": `Recipe Description Goes Here`,
// //         "email": "recipeemail@raddy.co.uk",
// //         "ingredients": [
// //           "1 level teaspoon baking powder",
// //           "1 level teaspoon cayenne pepper",
// //           "1 level teaspoon hot smoked paprika",
// //         ],
// //         "category": "Dinner", 
// //         "image": "southern-friend-chicken.jpg"
// //       },
// //       { 
// //         "name": "Recipe Name Goes Here",
// //         "description": `Recipe Description Goes Here`,
// //         "email": "recipeemail@raddy.co.uk",
// //         "ingredients": [
// //           "1 level teaspoon baking powder",
// //           "1 level teaspoon cayenne pepper",
// //           "1 level teaspoon hot smoked paprika",
// //         ],
// //         "category": "Lunch", 
// //         "image": "southern-friend-chicken.jpg"
// //       },
// //     ]);
// //   } catch (error) {
// //     console.log('err' + error)
// //   }
// // }

// // insertDymmyRecipeData();

// // async function insertDymmyCategoryData(){
// //   try {
// //     await Category.insertMany([
// //       {
// //         "name": "Thai",
// //         "image": "thai-food.jpg"
// //       },
// //       {
// //         "name": "American",
// //         "image": "american-food.jpg"
// //       }, 
// //       {
// //         "name": "Chinese",
// //         "image": "chinese-food.jpg"
// //       },
// //       {
// //         "name": "Mexican",
// //         "image": "mexican-food.jpg"
// //       }, 
// //       {
// //         "name": "Indian",
// //         "image": "indian-food.jpg"
// //       },
// //       {
// //         "name": "Spanish",
// //         "image": "spanish-food.jpg"
// //       }
// //     ]);
// //   } catch (error) {
// //     console.log('err', + error)
// //   }
// // }

// // insertDymmyCategoryData();





// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();


/**
 * Dummy Data Example 
*/

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();


// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();


const getDatabase = require('../util/database').getDatabase;

class Product{
  constructor(title, price, description, imageURL) {
this.title = title;
this.price = price;
this.description = description;
this.imageURL = imageURL;
  }
save(){

}
}




module.exports = Product;
// task 2:basic crud operations
db.books.find({ genre: "Fantasy" });
// find book by year published
 db.books.find({ published_year: { $gt: 2000 } });
//  fint books by auther
  db.books.find({ author: "J.R.R. Tolkien" });
//   update book
db.books.updateOne(
  { title: "The Great Gatsby" }, 
  { $set: { price: 13.50 } }    
);
// delete bool by its title
db.books.deleteOne({ title: "1984" });

// task 3:advanced queries

// find books in stock and published after 2010
db.books.find({
  in_stock: true,          
  published_year: { $gt: 2010 } 
});

// 2. Use projection to return only the title, author, and price fields
 db.books.find(
  {}, 
  { title: 1, author: 1, price: 1, _id: 0 } 
);
// Implement sorting to display books by price (both ascending and descending)
// ascending order
db.books.find().sort({ price: 1 });
// descending order
db.books.find().sort({ price: -1 });

// Use the `limit` and `skip` methods to implement pagination (5 books per page)
db.books.find().limit(5).skip(0);

// Page 2 (next 5 books)
db.books.find().limit(5).skip(5);

// Page 3 (next 5 books)
db.books.find().limit(5).skip(10);

// task4:aggregation queries
// Create an aggregation pipeline to calculate the average price of books by genre

db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      average_price: { $avg: "$price" },
      total_books: { $sum: 1 }
    }
  },
  {
    $sort: { average_price: -1 }
  },
  {
    $project: {
      _id: 0,
      genre: "$_id",
      average_price: 1,
      total_books: 1
    }
  }
]);

//- Create an aggregation pipeline to calculate the average price of books by genre
//- Create an aggregation pipeline to calculate the average price of books by genre

db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      average_price: { $avg: "$price" },
      total_books: { $sum: 1 }
    }
  },
  {
    $sort: { average_price: -1 }
  },
  {
    $project: {
      _id: 0,
      genre: "$_id",
      average_price: 1,
      total_books: 1
    }
  }
]);

// Implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {
    $addFields: {
      decade: {
        $multiply: [
          { $floor: { $divide: ["$published_year", 10] } },
          10
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      book_count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  },
  {
    $project: {
      _id: 0,
      publication_decade: "$_id",
      number_of_books: "$book_count"
    }
  }
]);
// task 5: indexes
// - Create a compound index on `author` and `published_year`
db.books.createIndex({ title: 1 });

// - Create an index on the `title` field for faster searches
db.books.createIndex({ author: 1, published_year: -1 });
// Use the `explain()` method to demonstrate the performance improvement with your indexes
db.books.find({ author: "J.R.R. Tolkien", published_year: { $lte: 1954 } }).explain("executionStats");

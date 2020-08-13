function restaurants(app) {
  
    // Getting some restaurants for the location
    // Append this below the main get locationID code in locations.js
    
  var options_for_rest = {
    method: "GET",
    price_level: "https://tripadvisor1.p.rapidapi.com/restaurants/list",
    qs: {
      restaurant_tagcategory_standalone : "10591",
      restaurant_tagcategory : "10591",
      lang: "en_US",
      lunit: "km",
      currency: "USD",
      limit: "30",
      location_id: locationId,
    },
    headers: {
      "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
      "x-rapidapi-key": "498e1b27camshc4cc7fcfd3fd06cp1c6b58jsnc3d33dff5f94",
    },
  };

  console.log("locationId is: " + locationId);

  request(options_for_rest, function(error, response, body) {
    if (error) {
      throw new Error(error);
    }
    var rest_data = JSON.parse(body);
    var restaurants = [1, 2, 3, 4, 5];
    for (i = 0; i < 5; i++) {
      restaurants[i] = [
        restaurants_data.data[i].name,
        restaurants_data.data[i].ranking,
        restaurants_data.data[i].price_level,
      ];
    }

    // Clean up five JSON responses

    restaurant_one_name = restaurants[0][0];
    restaurant_one_ranking = restaurants[0][1];
    restaurant_one_price_level = restaurants[0][2];

    restaurant_two_name = restaurants[1][0];
    restaurant_two_ranking = restaurants[1][1];
    restaurant_two_price_level = restaurants[1][2];

    restaurant_three_name = restaurants[2][0];
    restaurant_three_ranking = restaurants[2][1];
    restaurant_three_price_level = restaurants[2][2];

    restaurant_four_name = restaurants[3][0];
    restaurant_four_ranking = restaurants[3][1];
    restaurant_four_price_level = restaurants[3][2];

    restaurant_five_name = restaurants[4][0];
    restaurant_five_ranking = restaurants[4][1];
    restaurant_five_price_level = restaurants[4][2];

    res.render("traveler.handlebars", {
      layout: "main",
      restaurant_one: restaurant_one_name,
      restaurant_one_ranking: restaurant_one_ranking,
      restaurant_one_price_level: restaurant_one_price_level,

      restaurant_two: restaurant_two_name,
      restaurant_two_ranking: restaurant_two_ranking,
      restaurant_two_price_level: restaurant_two_price_level,

      restaurant_three: restaurant_three_name,
      restaurant_three_ranking: restaurant_three_ranking,
      restaurant_three_price_level: restaurant_three_price_level,

      restaurant_four: restaurant_four_name,
      restaurant_four_ranking: restaurant_four_ranking,
      restaurant_four_price_level: restaurant_four_price_level,

      restaurant_five: restaurant_five_name,
      restaurant_five_ranking: restaurant_five_ranking,
      restaurant_five_price_level: restaurant_five_price_level,
    });
  });
}
module.exports = restaurants;

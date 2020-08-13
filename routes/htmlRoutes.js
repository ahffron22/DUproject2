var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Destination.findAll({
      include: [db.User, db.Activity],
      order: [["createdAt", "DESC"]]
    }).then(function(destinations) {
      var destinations = destinations;
      db.User.findAll({
        order: [["milesTraveled", "DESC"]]
      }).then(function(users) {
        res.render("index", {
          destination: destinations,
          user: users
        });
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/trip/:id", function(req, res) {
    db.Destination.findOne({
      where: { id: req.params.id },
      include: [db.Activity, db.User]
    }).then(function(destinations) {
      console.log(destinations.Activities);
      res.render("trip", {
        destination: destinations
      });
    });
  });
  app.get("/traveler/:id", function(req, res) {
    db.User.findOne({
      where: { id: req.params.id },
      include: [db.Destination, db.Activity],
      order: [["createdAt", "DESC"]]
    }).then(function(user) {
      var destinations = user.Destinations;

      for (var i = 0; i < user.Destinations.length; i++) {
        var activities = [];
        for (var j = 0; j < user.Activities.length; j++) {
          if (user.Destinations[i].id === user.Activities[j].DestinationId) {
            activities.push({
              id: user.Activities[j].id,
              activityName: user.Activities[j].activityName,
              activityDescripiton: user.Activities[j].activityDescription
            });
          }
        }
        destinations[i] = {
          id: user.Destinations[i].id,
          departureCity: user.Destinations[i].departureCity,
          departureState: user.Destinations[i].departureState,
          departureCountry: user.Destinations[i].departureCountry,
          arrivalCity: user.Destinations[i].arrivalCity,
          arrivalState: user.Destinations[i].arrivalState,
          arrivalCountry: user.Destinations[i].arrivalCountry,
          savedTrip: user.Destinations[i].savedTrip,
          tripDistance: user.Destinations[i].tripDistance,
          startDate: user.Destinations[i].startDate,
          endDate: user.Destinations[i].endDate,
          activities: activities
        };
      }

      res.render("traveler", {
        destination: destinations,
        user: user
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
 
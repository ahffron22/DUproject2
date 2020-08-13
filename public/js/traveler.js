var API = {
  saveTrip: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "../api/trips",
      data: JSON.stringify(example)
    });
  },
  getActivities: function(type) {
    $.get("/api/activities/" + type, function(response) {
      for (var i = 0; i < response.length; i++) {
        if (response[i].Activities.length > 0) {
          for (var j = 0; j < response[i].Activities.length; j++) {
            var match = false;
            for (var k = 0; k < activityArray.length; k++) {
              if (response[i].Activities[j].activityName === activityArray[k]) {
                match = true;
              }
            }
            if (match === false) {
              addActivity(
                response[i].Activities[j].activityName,
                response[i].Activities[j].activityDescription
              );
            }
          }
        }
      }
    });
  },
  saveActivities: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/activities",
      data: JSON.stringify(example)
    });
  },
  getTrips: function(userId) {
    $.get("/api/trips/" + userId, function(response) {
      var countriesVisited = [];
      for (var i = 0; i < response.length; i++) {
        if (response[i].savedTrip === false) {
          API.deleteTrip(response[i].id);
        } else {
          var match = false;
          for (var j = 0; j < countriesVisited.length; j++) {
            if (response[i].arrivalCountry === countriesVisited[j]) {
              match = true;
            }
          }
          if (match === false) {
            countriesVisited.push(response[i].arrivalCountry);
          }
        }
      }
      countriesVisited.join(" , ");
      $("#countries-visited").text("Countries Visited: " + countriesVisited);
    });
  },

  deleteTrip: function(id) {
    return $.ajax({
      url: "/api/trips/" + id,
      type: "DELETE"
    });
  }
};
var activityArray = [];
var userMiles = parseInt($("#miles").attr("value"));
var userId = $("#user-name").attr("value");
API.getTrips(userId);
var startTrip = function(event) {
  event.preventDefault();
  var home = $("#departure")
    .val()
    .trim();
  var destination = $("#arrival")
    .val()
    .trim();
  var user = $("#submit").val();
  var startDate = $("#from").val();
  var endDate = $("#to").val();
  $("#start-trip-form").empty();
  queryLocations(home, destination, user, startDate, endDate);
};

var saveTripActivities = function(activity, description, tripData, i) {
  activity = {
    activityName: activity,
    activityDescription: description,
    DestinationId: tripData.id,
    UserId: tripData.UserId
  };
  API.saveActivities(activity).then(function() {
    return;
  });
};

var addActivity = function(activity, description) {
  activityArray.push(activity);
  console.log(activityArray);
  var activityId = activity.replace(/\s+/g, "-").toLowerCase();
  var row = $("<tr>").addClass("row");
  var activityDiv = $("<td>")
    .addClass("activity col-5 form-check-label")
    .text(activity);
  var descriptionDiv = $("<td>")
    .addClass("activity col-5")
    .text("Description: " + description);
  var check = $("<td>")
    .addClass("col-2")
    .append(
      $("<input>")
        .attr("type", "checkbox")
        .addClass("form-check-input")
        .val(activity)
        .attr("id", activityId)
        .attr("data-description", description)
    );
  row.append(check);
  row.append(activityDiv);
  row.append(descriptionDiv);
  $("#activities").append(row);
};

var queryLocations = function(home, destination, user, startDate, endDate) {
  $.get("/distances/" + home + "/" + destination, function(response) {
    home = response.depart;
    destination = response.arrive;
    API.getActivities(destination.city);
    var departureLon = response.depart.longitude;
    var departureLat = response.depart.latitude;
    var arrivalLon = response.arrive.longitude;
    var arrivalLat = response.arrive.latitude;

    var distance = getDistance(
      departureLat,
      arrivalLat,
      departureLon,
      arrivalLon
    );
    $("#depart-text")
      .text(
        "Departure City: " + home.city + "," + home.state + "," + home.country
      )
      .attr("data-name", home);
    $("#arrive-text")
      .text(
        "Arrival City:  " +
          destination.city +
          ", " +
          destination.state +
          "," +
          destination.country
      )
      .attr("data-name", destination);
    $("#dates-text").text("Dates:" + startDate + "-" + endDate);

    $("#distance-text").text("Travel Distance:  " + parseInt(distance));
    var trip = {
      departureCity: home.city,
      departureState: home.state,
      departureCountry: home.country,
      arrivalCity: destination.city,
      arrivalState: destination.state,
      arrivalCountry: destination.country,
      tripDistance: distance,
      UserId: user,

      startDate: startDate,
      endDate: endDate
    };
    console.log(trip);
    API.saveTrip(trip).then(function(data) {
      printActivityDiv(data);
    });
  });
};

var printActivityDiv = function(data) {
  var tripData = data;
  console.log(userMiles);
  var activityLabel = $("<label>").text("Activity");
  var activityInput = $("<input>")
    .attr("type", "text")
    .attr("id", "activity-input")
    .addClass("form-control");
  var activityDescLabel = $("<label>").text("Description");
  var activityDesc = $("<input>")
    .attr("type", "text")
    .attr("id", "activity-description")
    .addClass("form-control");
  var button = $("<button>")
    .attr("type", "button")
    .attr("id", "add-activity")
    .addClass("btn btn-danger")
    .text("Add Activity");
  $("#activity-input-div").append(activityLabel);
  $("#activity-input-div").append(activityInput);
  $("#activity-des-div").append(activityDescLabel);
  $("#activity-des-div").append(activityDesc);
  $("#activity-button-div").append(button);
  var blogText = $("<textarea>")
    .attr("type", "textarea")
    .attr("id", "trip-blog")
    .addClass("form-control")
    .attr("rows", "3");
  var button2 = $("<button>")
    .attr("type", "button")
    .attr("id", "submit-trip")
    .addClass("btn btn-danger")
    .text("Finish Trip");
  $("#finish-trip").append($("<label>").text("Travel Log"));
  $("#finish-trip").append(blogText);
  $("#finish-trip").append(button2);

  $("#add-activity").on("click", function() {
    var activity = $("#activity-input")
      .val()
      .trim();
    var description = $("#activity-description")
      .val()
      .trim();
    $("#activity-input").val("");
    $("#activity-description").val("");
    addActivity(activity, description);
  });
  $("#submit-trip").on("click", function() {
    console.log(tripData);
    for (var i = 0; i < activityArray.length; i++) {
      var buttonId = activityArray[i].replace(/\s+/g, "-").toLowerCase();
      if ($("#" + buttonId).prop("checked") === true) {
        var activity = $("#" + buttonId).val();
        var description = $("#" + buttonId).attr("data-description");
        saveTripActivities(activity, description, tripData);
      }
    }
    var blog = {
      id: tripData.id,
      tripBlog: $("#trip-blog").val(),
      savedTrip: true
    };
    userMiles += parseInt(tripData.tripDistance);
    var newMiles = {
      id: tripData.UserId,
      milesTraveled: userMiles
    };
    userMiles += tripData.tripDistance;
    $.ajax("/api/users/" + tripData.UserId, {
      type: "PUT",
      data: newMiles
    }).then(function() {
      console.log(blog);
      $.ajax("/api/trips/" + tripData.id, {
        type: "PUT",

        data: blog
      }).then(function() {
        location.reload();
      });
    });
  });
};
var getDistance = function(lat1, lat2, lon1, lon2) {
  var R = 3958.8; // metres
  var φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  var φ2 = (lat2 * Math.PI) / 180;
  var Δφ = ((lat2 - lat1) * Math.PI) / 180;
  var Δλ = ((lon2 - lon1) * Math.PI) / 180;

  var a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  var d = R * c;
  return d;
};
var deleteTrip = function() {
  var idToDelete = $(this).attr("id");
  userMiles -= parseInt($(this).attr("data-miles"));
  console.log(user);
  var newMiles = {
    id: userId,
    milesTraveled: userMiles
  };
  console.log(newMiles);
  API.deleteTrip(idToDelete).then(function() {
    $.ajax("/api/users/" + newMiles.id, {
      type: "PUT",
      data: newMiles
    }).then(function() {
      location.reload();
    });
  });
};
$("#submit").on("click", startTrip);
$(".delete").on("click", deleteTrip);

$(function() {
  var dateFormat = "mm/dd/yy",
    from = $("#from")
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3
      })
      .on("change", function() {
        to.datepicker("option", "minDate", getDate(this));
      }),
    to = $("#to")
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3
      })
      .on("change", function() {
        from.datepicker("option", "maxDate", getDate(this));
      });

  function getDate(element) {
    var date;
    try {
      date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
      date = null;
    }

    return date;
  }
});

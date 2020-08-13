// Get references to page elements
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json",
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example),
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET",
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE",
    });
  },
  saveUser: function(user) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json",
      },
      type: "POST",
      url: "api/users",
      data: JSON.stringify(user),
    });
  },
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $row = $("div")
        .addClass("row")
        .attr("data-id", example.id);
      var $col1 = $("<div>")
        .addClass("col-4")
        .append($("<p>").text("Departure City: " + example.departureCity))
        .append($("<p>").text("Arrival City: " + example.arrivalCity))
        .append($("<p>").text("Trip Distance: " + example.tripDistance));

      var $col2 = $("<div>").addClass("col-4");
      var $col3 = $("<div>").addClass("col-4");
      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .attr("href", "/example/" + example.id)
        .text("view");

      $col3.append($button);
      $row
        .append($col1)
        .append($col2)
        .append($col3);

      return $row;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list

var createNewTraveller = function(event) {
  event.preventDefault();
  var newUser = {
    userName: $("#traveler-name")
      .val()
      .trim(),
    homeTown: $("#hometown")
      .val()
      .trim(),

    favoriteActivity: $("#fav-activity")
      .val()
      .trim(),
    favoriteDestination: $("#fav-destination")
      .val()
      .trim()

  };
  API.saveUser(newUser).then(function() {
    location.reload();
  });
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};
var goToPage = function() {
  var user = $("#traveler").val();
  var url = "/traveler/" + user;
  window.location.assign(url);
};
// Add event listeners to the submit and delete buttons
$("#submit-user").on("click", createNewTraveller);
$submitBtn.on("click", goToPage);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

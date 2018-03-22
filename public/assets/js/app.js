

function showcomment(event) {
    event.preventDefault();
    var id = $(this).attr("value");
    $("#addcomment").fadeIn(300).css("display", "flex");
    $("#add-comment").attr("value", id);
    $.get("/" + id, function(data) {
        $("#article-title").text(data.title);
        $.get("/comment/" + id, function(data) {
            if (data) {
                $("#comment-title").val(data.title);
                $("#comment-body").val(data.body);
            }
        });
    });

}

function addcomment(event) {
    event.preventDefault();
    var id = $(this).attr("value");
    var obj = {
        title: $("#comment-title").val().trim(),
        body: $("#comment-body").val().trim()
    };
    $.post("/comment/" + id, obj, function(data) {
        window.location.href = "/saved";
    });
}



function changestatus() {
    var status = $(this).attr("value");
    if (status === "Saved") {
        $(this).html("Unsave");
    }
};

function changeback() {
    $(this).html($(this).attr("value"));
}


    

    $(document).on("click", ".addcomment-button", showcomment);
$(document).on("click", "#add-comment", addcomment);
$(".status").hover(changestatus, changeback);
$("#close-comment").on("click", function() {
    $("#addcomment").fadeOut(300);
});





// function showModal() {
//     console.log("working");
//     $("#modal_" + $(this).attr("data-id")).show();

//     function closeModal() {
//         $("#modal_" + $(this).attr("data-id")).hide();
//     };

//     $(document).on("click", ".modalClose", closeModal);
// };
// $(document).on("click", ".comment-button", showModal);


// $(document).on("click", "#savecomment", function() {
//   // Grab the id associated with the article from the submit button
//   console.log("click firing");
//   var thisId = $(this).attr("data-id");
//   console.log("pre-comment-body");
//   var commentBody = $("#bodyinput-"+$(this).attr("data-id")).val();
//   console.log(commentBody);

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       body: commentBody
//     }
//   })
//     // With that done
//     .done(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       location.reload();
//     });
    
// });

// $(document).on("click", "#deletecomment", function() {
//   console.log("working");
//   var id = $(this).attr("data-comment");
//   $.ajax({
//     method: "POST",
//     url: "/articles/delete/" + id,
//     data: {
//     }
//   })

//     .done(function(data) {

//       console.log(data);

//       location.reload();
//     });
// });

// $(document).on("click", ".save-button", function() {
//   var id = $(this).attr("data-id");
//   $.ajax({
//     method: "POST",
//     url: "/articles/save/" + id,
//     data: {
//     }
//   })

//     .done(function(data) {

//       console.log(data);

//       location.reload();
//     });
// });

// $(document).on("click", ".unsave-button", function() {
//   var id = $(this).attr("data-id");
//   $.ajax({
//     method: "POST",
//     url: "/articles/unsave/" + id,
//     data: {
//     }
//   })

//     .done(function(data) {

//       console.log(data);

//       location.reload();
//     });
// });
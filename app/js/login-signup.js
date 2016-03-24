$(document).ready(function(){
  if(localStorage.getItem("isLoggedIn") == "true"){
    window.location.replace("dashboard1.html");
  }
})

$(function() {

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

	$('#login-form').validate({
		submitHandler: function (form) {
        	var username = $('#loginusername').val();
        	var password = $('#loginpassword').val();
        	var data = {
        		username: username, 
        		password: password
        	};
        	var dataStr = JSON.stringify(data);
            $.ajax({
                 type: "GET",
                 url: "http://ec2-54-84-109-19.compute-1.amazonaws.com:5000/signin.json?data="+dataStr,
                 success: function (data) {
                    var result = JSON.parse(data);
                    if(result["status"]){
                        var response = result["response"];
                        localStorage.setItem("business_type", response.business_type);
                     	localStorage.setItem("username", response.username);
                        localStorage.setItem("full_name",response.full_name);
                        localStorage.setItem("business_name", response.business_name);
                        localStorage.setItem("website_url", response.website_url);
                     	localStorage.setItem("isLoggedIn", "true");
                     	window.location.href = "dashboard1.html";
                    } else {
                        $("#message").removeClass("alert-info");
                        $("#message").removeClass("alert-success");
                        $("#message").addClass("alert-danger");
                        $("#message_text").text("login error: User doesn't exist. Please register or recheck your details.");
                    }
                 },
                 error: function(error) {
                 	console.log("response: "+error);
                 	$("#message").removeClass("alert-info");
                    $("#message").removeClass("alert-success");
                    $("#message").addClass("alert-danger");
                    $("#message_text").text("login error: "+error);
                 }
            });
            return false;
        }
	});

	$('#register-form').validate({
		rules: {
           	password: { 
             	required: true,
                minlength: 6,
                maxlength: 10,

           	}, 
            confirmpassword: { 
                equalTo: "#password",
                minlength: 6,
                maxlength: 10
           	},
           	website: {
           		required: false,
           		url: true
           	}
        },
        submitHandler: function (form) {
        	var full_name = $('#fullname').val();
        	var business_name = $('#businessname').val();
        	var business_type = $('#businesstype').val();
        	var username = $('#username').val();
        	var create_password = $('#password').val();
        	var confirm_password = $('#confirmpassword').val();
        	var website_url = "";
        	if($('#website').val())
        		website_url = $('#website').val();
        	var data = {
        		full_name: full_name, 
        		business_name: business_name, 
        		business_type: business_type, 
        		username: username, 
        		create_password: create_password,
        		confirm_password: confirm_password,
        		website_url: website_url
        	};
        	var dataStr = JSON.stringify(data);
            $.ajax({
                 type: "GET",
                 url: "http://ec2-54-84-109-19.compute-1.amazonaws.com:5000/signup.json?data="+dataStr,
                 success: function (data) {
                 	console.log("response: "+data);
                    $("#message").removeClass("alert-info");
                    $("#message").removeClass("alert-danger");
                    $("#message").addClass("alert-success");
                    $("#message_text").text("Registration successful! Please login to continue.");
                 },
                 error: function(error) {
                 	console.log("response: "+error);
                 	$("#message").removeClass("alert-info");
                    $("#message").removeClass("alert-success");
                    $("#message").addClass("alert-danger");
                    $("#message_text").text("Registration error: "+error);
                 }
            });
            return false;
        }
	});

});
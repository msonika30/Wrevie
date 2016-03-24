var reviewCount;
var reviewIndex;
var reviews;
var btypes;
var defaultBtype;
var userRatingKeys;
var wrevieTestRatings = false;
var urlPath = "http://54.84.109.19:5000/demo/";
$.fn.stars = function() {
    return $(this).each(function() {
        // Get the value
        var val = parseFloat($(this).html());
        // Make sure that the value is in 0 - 5 range, multiply to get width
        val = Math.round(val * 4) / 4; /* To round to nearest quarter */
		val = Math.round(val * 2) / 2; /* To round to nearest half */
        var size = Math.max(0, (Math.min(5, val))) * 16;
        // Create stars holder
        var $span = $('<span />').width(size);
        // Replace the numerical value with stars
        $(this).html($span);
    });
}
function initDemoPage(){
	$( '#sampleReview' ).bind( 'mousewheel DOMMouseScroll', function ( e ) {
		var div= document.getElementById('sampleReview');
		var hasVerticalScrollbar= div.scrollHeight>div.clientHeight;
		if(hasVerticalScrollbar){
		    var e0 = e.originalEvent,
		        delta = e0.wheelDelta || -e0.detail;
		    
		    this.scrollTop += ( delta < 0 ? 1 : -1 ) * 1;
		    e.preventDefault();
		}
	});

	//Check to see if the window is top if not then display button
	$(window).scroll(function(){
		if ($(this).scrollTop() > 200) {
			$('#scrollTop').fadeIn();
		} else {
			$('#scrollTop').fadeOut();
		}
	});
	
	//Click event to scroll to top
	$('#scrollTop').click(function(){
		$('html, body').animate({scrollTop : 0},400);
		return false;
	});
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function getText(elementId) {
    var element = document.getElementById(elementId);
    var caretOffset = 0;
    if (typeof window.getSelection != "undefined") {
        var range = window.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
        var textRange = document.selection.createRange();
        var preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    var divStr = $('#'+elementId).text();
    return divStr.substring(0, caretOffset);
}

function loadNextReview(force) {
	var reviewHTML = reviews[reviewIndex]['review'];
	$('#sampleReview').empty();
	$('#sampleReview').append(reviewHTML);
	$('#loaderAnimation').hide();
	$('#sampleReview').show();
	$('#ratings-div').hide();
	$("#ratings-table tbody").empty();
		var userRatings = reviews[reviewIndex].assigned_ratings;	
    var systemRatings = reviews[reviewIndex].predicted_ratings;
		for(var key in userRatings){
			var ratingKey = key;
			var ratingKeyId = key.replace(/\s+/g, '-').toLowerCase();
			var rating = userRatings[key];
			if(systemRatings[ratingKey] !== undefined){
				var $ratingHTML = $('<tr id="table-'+ratingKeyId+'"><td>'+ratingKey+'</td><td id="table-rating-user-'+ratingKey+'"><span class="stars">'+rating+'</span></td></tr>');
			}else{
				var $ratingHTML = $('<tr id="table-'+ratingKeyId+'"><td>'+ratingKey+'</td><td id="table-rating-user-'+ratingKey+'"><span class="stars">'+rating+'</span></td><td id="table-rating-wrevie-'+ratingKey+'">-</td></tr>');
			}
			$("#ratings-table tbody").append($ratingHTML);
		}
	for(var key in systemRatings){
		var ratingKey = key;
		var ratingKeyId = ratingKey.replace(/\s+/g, '-').toLowerCase();
		var rating = systemRatings[key];
		if($('#table-'+ratingKeyId).length){
			var $ratingHTML = $('<td id="table-rating-wrevie-'+ratingKey+'"><span class="stars">'+rating+'</span></td>');
				$('#table-'+ratingKeyId).append($ratingHTML);
		}else{
			var $ratingHTML = $('<tr id="table-'+ratingKeyId+'"><td>'+ratingKey+'</td><td id="table-rating-user-'+ratingKey+'">-</td><td id="table-rating-wrevie-'+ratingKey+'"><span class="stars">'+rating+'</span></td></tr>');
				$("#ratings-table tbody").append($ratingHTML);
		}
		}
	$('#ratings-table span.stars').stars();
		if(reviewIndex === reviewCount-1){
			reviewIndex = 0;
		}else{
			reviewIndex++;
		}
		$('#ratings-div').show();
		$('#reviewContent').show();
		$('#try-wrevie-mobile').show();
		$('#sampleReview').stop().animate({
            scrollTop: 0
        }, 300);
		if(force){
			$('html, body').stop().animate({
	            scrollTop: ($('#reviewContent').offset().top - 150)
	        }, 1500, 'easeInOutExpo');
		}
}

function showError() {
	$('#loaderAnimation').hide();
	$('#loaderAnimationTest').hide();
	$('#mainError').css('display', 'block');
	setTimeout(function() {
		$('#mainError').css('display', 'none');
	}, 5000);
}

function showUserTestRatings(){
	var checked = document.getElementById('userTestRatings').checked;
	if(checked){
		if(!wrevieTestRatings){
			$('#ratings-div-test').show();
		}
		$('#ratings-table-test th:nth-child(2)').show();
		$('#ratings-table-test td:nth-child(2)').show();
	}else{
		if(!wrevieTestRatings){
			$('#ratings-div-test').hide();
		}
		$('#ratings-table-test th:nth-child(2)').hide();
		$('#ratings-table-test td:nth-child(2)').hide();
	}
}

function getReviews(force){
	try{
		var forceVar = force;
		$('#try-wrevie-mobile').hide();
		$('#reviewContent').hide();
		$('#loaderAnimation').show();
		var data = {};
		data["business_type"] = defaultBtype;
		data["show_manual_rating"] = true;
	    var url = urlPath+"get_k_random_review_and_ratings.json?data="+encodeURIComponent(JSON.stringify(data));
	    $.ajax({
	       url: url,
	       headers: {},
	       error: function(error) {
	       	console.log("Error: "+error);
	       	showError();
	       },
	       success: function(data) {
	       	var resp = JSON.parse(data);
       		reviews = resp.response;
       		reviewCount = reviews.length;
       		reviewIndex = 0;
       		if(reviewCount > 0){
       			loadNextReview(forceVar);
       		}
	       },
	       method: 'GET'
	    });
	}catch(err) {
		console.log('Error: '+err);
	    showError();
	}
}

function reset(){
	$('#review').empty();
	$('#ratings-table-test th:nth-child(3)').hide();
	$('#ratings-div-test').hide();
	$('#ratings-table-test tbody').empty();
	loadBtypeKeys(defaultBtype);
	wrevieTestRatings = false;
	showUserTestRatings();
	$('html, body').stop().animate({
        scrollTop: 0
    }, 1000);
}

function loadBtypeKeys(btypeKey){
	if(btypeKey){
    	var keys = btypes[btypeKey];
    	if(keys){
	        userRatingKeys = [];
			for(var index in keys){
				var ratingKey = keys[index];
				var ratingKeyId = ratingKey.replace(/\s+/g, '-').toLowerCase();
				userRatingKeys.push('rating-input-'+index);
       			var $btypeRatingHTML = $('<tr id="table-test-'+ratingKeyId+'"><td>'+ratingKey+'</td><td style="display:none;"><span class="rating"> <input type="radio" class="rating-input" id="rating-input-'+index+'-5" name="rating-input-'+index+'"/> <label for="rating-input-'+index+'-5" class="rating-star"></label> <input type="radio" class="rating-input" id="rating-input-'+index+'-4" name="rating-input-'+index+'"/> <label for="rating-input-'+index+'-4" class="rating-star"></label> <input type="radio" class="rating-input" id="rating-input-'+index+'-3" name="rating-input-'+index+'"/> <label for="rating-input-'+index+'-3" class="rating-star"></label> <input type="radio" class="rating-input" id="rating-input-'+index+'-2" name="rating-input-'+index+'"/> <label for="rating-input-'+index+'-2" class="rating-star"></label> <input type="radio" class="rating-input" id="rating-input-'+index+'-1" name="rating-input-'+index+'"/> <label for="rating-input-'+index+'-1" class="rating-star"></label> </span></td></tr>');
       			$('#ratings-table-test tbody').append($btypeRatingHTML);
       		}
    	}
	}
}

function getBtypes(succCallBack, errCallBack){
	try {
		$('#loaderAnimation').show();
		var data = {};
		var url = urlPath+"get_business_types_and_attributes.json?data="+encodeURIComponent(JSON.stringify(data));
    	$.ajax({
	       url: url,
	       headers: {},
	       error: function(error) {
	       	console.log('Error: '+error);
	       	showError();
	       },
	       success: function(data) {
	       	var resp = JSON.parse(data);
       		btypes = resp.response;
       		for(var key in btypes){
       			if(!defaultBtype){
       				defaultBtype = key;
       			}
       		}
       		loadBtypeKeys(defaultBtype);
       		if(defaultBtype){
       			succCallBack();
       		}else{
       			errCallBack();
       		}
	       },
	       method: 'GET'
	    });
	}catch(err) {
		console.log('Error: '+err);
	    showError();
	}
}

function tryWrevie(){
	var url = window.location.href;    
	if (url.indexOf('?') > -1){
	   url += '&try=true'
	}else{
	   url += '?try=true'
	}
	location.href = url;
}

function testWrevie(){
	try {
		var data = {};
		var url = urlPath+"get_business_types_and_attributes.json?data="+encodeURIComponent(JSON.stringify(data));
    	$.ajax({
	       url: url,
	       headers: {},
	       error: function(error) {
	       	console.log('Error: '+error);
	       	showError();
	       },
	       success: function(data) {
	       	var resp = JSON.parse(data);
       		btypes = resp.response;
       		for(var key in btypes){
       			if(!defaultBtype){
       				defaultBtype = key;
       			}
       		}
			$('#reviewsMain').css('display', 'none');
       		$('#tryWrevie').css('display', 'block');
       		loadBtypeKeys(defaultBtype);
	       },
	       method: 'GET'
	    });
	}catch(err) {
		console.log('Error: '+err);
	    showError();
	}
}

function loadSampleReviews(){
	history.back();
}

function showWreviewRatings(ratings){
	for(var key in ratings){
		var ratingKey = key;
		var ratingKeyId = ratingKey.replace(/\s+/g, '-').toLowerCase();
		var rating = ratings[key];
    	if($('#table-test-'+ratingKeyId).length){
			var $ratingHTML = $('<td id="table-rating-wrevie-'+ratingKey+'"><span class="stars">'+rating+'</span></td>');
				$('#table-test-'+ratingKeyId).append($ratingHTML);
		}else{
			var $ratingHTML = $('<tr id="table-test-'+ratingKeyId+'"><td>'+ratingKey+'</td><td id="table-rating-user-'+ratingKey+'">-</td><td id="table-rating-wrevie-'+ratingKey+'"><span class="stars">'+rating+'</span></td></tr>');
				$("#ratings-table-test tbody").append($ratingHTML);
		}
		}
}

function wreview(){
	try{
		$('#ratings-div-test').hide();
		$('#loaderAnimationTest').show();
		$('#ratings-table-test tbody td:nth-child(3)').remove();
	    var reviewText = getText('review');
	    var btype = defaultBtype;
	    var data = {};
	    data["business_type"] = btype;
	    data["review"] = reviewText;
	    var url = urlPath+"get_ratings_for_review.json?data="+encodeURIComponent(JSON.stringify(data));
	    if(reviewText){
		    $.ajax({
		       url: url,
		       error: function(error) {
		       	console.log("Error: "+error);
		       	showError();
		       },
		       success: function(data) {
		       	var resp = JSON.parse(data);
       			var attributes = resp.response.ratings;
       			showWreviewRatings(attributes);
	       		wrevieTestRatings = true;
				$('#ratings-table-test span.stars').stars();
				$('#ratings-table-test th:nth-child(3)').show();
				$('#loaderAnimationTest').hide();
				$('#ratings-div-test').show();
				$('html, body').stop().animate({
		            scrollTop: ($('#table-test-header').offset().top - 150)
		        }, 1500, 'easeInOutExpo');
				// $("html, body").animate({ scrollTop: $(document).height() }, 1000);
		       },
		       method: 'GET'
		    });
	    }
	}catch(err) {
		console.log('Error: '+err);
	    showError();
	}
}
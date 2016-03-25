$(document).ready(function(){
  var monthNames = ["Jan", "Feb", "March", "April", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  $('#datetimepicker1').datetimepicker({
    format: "yyyy-mm-dd",
    autoclose: true,
    todayBtn: true,
    pickerPosition: "bottom-left",
    todayHighlight: true,
    minView: 2
  });
  $('#datetimepicker2').datetimepicker({
      format: "yyyy-mm-dd",
      autoclose: true,
      todayBtn: true,
      pickerPosition: "bottom-left",
      todayHighlight: true,
      minView: 2
  });
  $("#datetimepicker1").on("dp.change", function (e) {
      $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
  });
  $("#datetimepicker2").on("dp.change", function (e) {
      $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
  });

  $('#from_date').val('2015-12-24');
  $('#to_date').val('2016-03-24');

  //SERVICE DROPDOWN
  $('#servicefilterinputdropdown').val("overall");
  $('.dropdown-menu-service-filters > li').click(function(){
  	$('#servicefilterinputdropdown').val($(this).text());
  });

  //SERVICES IN DROPDOWN
  var data = {
    business_type: localStorage.getItem("business_type")
  };
  var dataStr = JSON.stringify(data);
  $.ajax({
     type: "GET",
     url: 'http://ec2-54-84-109-19.compute-1.amazonaws.com:5000/demo/get_attribute_names_for_business.json?data='+dataStr,
     success: function (data) {
        var result = JSON.parse(data);
        console.log(data);
        if(result.status){
          for(var i in result.response.attr_names){
            $('.dropdown-menu-service-filters').append('<li><a href="#">'+result.response.attr_names[i].toLowerCase()+'</a></li>');
          }
        } else {
          alert(result.messages[0]);
        }
        $('.dropdown-menu-service-filters > li').click(function(){
		  	$('#servicefilterinputdropdown').val($(this).text());
		});
     },
     error: function(error) {
      console.log("error: "+error);
     }
  })

  //GET REVIEWS
  var data = {
  	"business_type": localStorage.getItem("business_type"), 
  	"business_id": localStorage.getItem("business_name"),//"100407", 
  	"start_time": new Date($('#from_date').val()).getTime()/1000,//"1456252200", 
  	"end_time": new Date($('#to_date').val()).getTime()/1000,//"1458757800", 
  	"max_number": "50"
  };
  var dataStr = JSON.stringify(data);
  $.ajax({
	 type: "GET",
	 url: 'http://ec2-54-84-109-19.compute-1.amazonaws.com:5000/dashboard/get_reviews.json?data='+dataStr,
	 success: function (data) {
	    var result = JSON.parse(data);
	    //console.log(data);
	    if(result.status){
	      //console.log(result.response);
	      var reviewlist = $('.reviewlist');
	      for(var i in result.response.reviews){
	      	reviewlist.append('<li class="list-group-item"><fieldset class="staticrating" style="margin-left: 10px; margin-right: 35px; width:80px;"><input type="radio" name="txt_urating" value="5" /><label id="star5" for="star5" title="Rocks!">5 stars</label><input type="radio" name="txt_urating" value="4" /><label id="star4" for="star4" title="Pretty good">4 stars</label><input type="radio" name="txt_urating" value="3" /><label id="star3" for="star3" title="Good">3 stars</label><input type="radio" name="txt_urating" value="2" /><label id="star2" for="star2" title="Kinda bad">2 stars</label><input type="radio" name="txt_urating" value="1" /><label id="star1" for="star1" title="Bad">1 star</label></fieldset>'+result.response.reviews[i]+'</li>')
	      	for(var j = 1; j <= result.response.ratings[i]; j++){
	            $(".reviewlist > li:last > fieldset > #star"+j).addClass("isChecked");
	        }
	      }
	    } else {
	      alert(result.messages[0]);
	    }
	 },
	 error: function(error) {
	  console.log("error: "+error);
	 }
	})

  	//LINE CHART
  	$('#getData').click(function(){
	    var fromDate = $('#from_date').val();
	    var toDate = $('#to_date').val();
	    if(fromDate == ""){
	      alert("Select a from date in time range!");
	    } else if(toDate == ""){
	      alert("Select a to date in time range!");
	    } else {
	      var fromTime = new Date(fromDate).getTime();
	      var toTime = new Date(toDate).getTime();
	      var data = {
	        business_type: localStorage.getItem("business_type"), 
	        business_id: localStorage.getItem("business_name"),//"100407", 
	        attr_name: $('#servicefilterinputdropdown').val(),//"overall", 
	        start_time: new Date($('#from_date').val()).getTime()/1000,//"1450895400",//"1311922600",//fromTime, 
	        end_time: new Date($('#to_date').val()).getTime()/1000,//"1458936371",//"1311923800"//toTime
	        max_data_points: "50"
	      };
	      var dataStr = JSON.stringify(data);
	      console.log(dataStr);
	      $.ajax({
	         type: "GET",
	         url: 'http://ec2-54-84-109-19.compute-1.amazonaws.com:5000/dashboard/get_attribute_wise_ratings.json?data='+dataStr,
	         success: function (data) {
	            var result = JSON.parse(data);
	            console.log(data);
	            if(result.status){
	              console.log(result.response);
	              var labels = [];
	              var dataPoints = [];
	              for(var rating in result.response.ratings){
	                var d = new Date(result.response.ratings[rating][0]*1000);
	                labels.push(monthNames[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear());
	                dataPoints.push(result.response.ratings[rating][1]);
	              }
	              drawLineGraph(labels,dataPoints);
	            } else {
	              alert(result.messages[0]);
	            }
	         },
	         error: function(error) {
	          console.log("error: "+error);
	         }
	      })
	    }
	  })

  	var drawLineGraph = function(labels, dataPoints){
		var areaChartData = {
		  labels: labels,
		  datasets: [
		    {
		      label: "Electronics",
		      fillColor: "rgba(60,141,188,0.9)",
		      strokeColor: "rgba(60,141,188,0.8)",
		      pointColor: "#3b8bba",
		      pointStrokeColor: "#rgba(60,141,188,1)",
		      pointHighlightFill: "#fff",
		      pointHighlightStroke: "rgba(60,141,188,1)",
		      data: dataPoints
		    }
		  ]
		};

		var areaChartOptions = {
		  //Boolean - If we should show the scale at all
		  showScale: true,
		  //Boolean - Whether grid lines are shown across the chart
		  scaleShowGridLines: false,
		  //String - Colour of the grid lines
		  scaleGridLineColor: "rgba(0,0,0,.05)",
		  //Number - Width of the grid lines
		  scaleGridLineWidth: 1,
		  //Boolean - Whether to show horizontal lines (except X axis)
		  scaleShowHorizontalLines: true,
		  //Boolean - Whether to show vertical lines (except Y axis)
		  scaleShowVerticalLines: true,
		  //Boolean - Whether the line is curved between points
		  bezierCurve: true,
		  //Number - Tension of the bezier curve between points
		  bezierCurveTension: 0,
		  //Boolean - Whether to show a dot for each point
		  pointDot: true,
		  //Number - Radius of each point dot in pixels
		  pointDotRadius: 4,
		  //Number - Pixel width of point dot stroke
		  pointDotStrokeWidth: 1,
		  //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
		  pointHitDetectionRadius: 20,
		  //Boolean - Whether to show a stroke for datasets
		  datasetStroke: true,
		  //Number - Pixel width of dataset stroke
		  datasetStrokeWidth: 2,
		  //Boolean - Whether to fill the dataset with a color
		  datasetFill: true,
		  //String - A legend template
		  legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
		  //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
		  maintainAspectRatio: true,
		  //Boolean - whether to make the chart responsive to window resizing
		  responsive: true
		};

		//- LINE CHART -
		$('#lineChart').remove();
		$('#linechartarea').append('<canvas id="lineChart" style="height:250px"></canvas>');
		var canvas = $("#lineChart").get(0);
		var lineChartCanvas = canvas.getContext("2d");
		lineChartCanvas.clearRect(0, 0, canvas.width, canvas.height);
		var lineChart = new Chart(lineChartCanvas);
		var lineChartOptions = areaChartOptions;
		lineChartOptions.datasetFill = false;
		lineChart.Line(areaChartData, lineChartOptions);
	}

	//LINE CHART
	//drawLineGraph(monthNames, [1, 2, 6, 3, 8, 4, 9, 2, 3, 1, 9, 2]);

	$('#getData').click();
});
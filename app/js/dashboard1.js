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

  var updateServices = function() {
    var data = {
      business_type: localStorage.getItem("business_type")
    };
    var dataStr = JSON.stringify(data);
    $.ajax({
       type: "GET",
       url: 'http://ec2-54-84-109-19.compute-1.amazonaws.com:5000/demo/get_attribute_names_for_business.json?data='+dataStr,
       success: function (data) {
          var result = JSON.parse(data);
          //console.log(data);
          if(result.status){
            //console.log(result.response);
            //TODO : icons
            var attrprefdata = {
              business_type: localStorage.getItem("business_type"), 
              business_id: localStorage.getItem("business_name"), 
              attr_name: "overall", 
              start_time: new Date($('#from_date').val()).getTime()/1000,//"1450895400",//"1311922600",//fromTime, 
              end_time: new Date($('#to_date').val()).getTime()/1000//"1458757800"//"1311923800"//toTime
            };
            var attrprefdataStr = JSON.stringify(attrprefdata);
            $.ajax({
              type: "GET",
              url: 'http://ec2-54-84-109-19.compute-1.amazonaws.com:5000/dashboard/get_performance_for_business.json?data='+attrprefdataStr,
              success: function (attrperfdatares) {
                var attrprefresult = JSON.parse(attrperfdatares);
                //console.log(attrperfdatares);
                if(attrprefresult.status){
                  console.log(attrprefresult.response);
                  $("#servicesDiv").children().remove();
                  for(var i in result.response.attr_names){
                    if(result.response.attr_names[i] == "Rooms"){
                      var val = attrprefresult.response.proportion_change.rooms*100;
                      val = val.toFixed(3);
                      if(val >= 0)
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-building faiconscustom"></i><div class="servicesboxratings"><div><span>Rooms</span></div><div><i class="fa fa-arrow-up servicesboxratingsicons servicesup"></i><span>'+val+'%</span></div></div></div>');
                      else
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-building faiconscustom"></i><div class="servicesboxratings"><div><span>Rooms</span></div><div><i class="fa fa-arrow-down servicesboxratingsicons servicesdown"></i><span>'+(-1*val)+'%</span></div></div></div>');
                    } else if(result.response.attr_names[i] == "Service"){
                      var val = attrprefresult.response.proportion_change.service*100;
                      val = val.toFixed(3);
                      if(val >= 0)
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-users faiconscustom"></i><div class="servicesboxratings"><div><span>Service</span></div><div><i class="fa fa-arrow-up servicesboxratingsicons servicesup"></i><span>'+val+'%</span></div></div></div>');
                      else
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-users faiconscustom"></i><div class="servicesboxratings"><div><span>Service</span></div><div><i class="fa fa-arrow-down servicesboxratingsicons servicesdown"></i><span>'+(-1*val)+'%</span></div></div></div>');
                    } else if(result.response.attr_names[i] == "Cleanliness"){
                      var val = attrprefresult.response.proportion_change.cleanliness*100;
                      val = val.toFixed(3);
                      if(val >= 0)
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-star faiconscustom"></i><div class="servicesboxratings"><div><span>Cleaniliness</span></div><div><i class="fa fa-arrow-up servicesboxratingsicons servicesup"></i><span>'+val+'%</span></div></div></div>');
                      else
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-star faiconscustom"></i><div class="servicesboxratings"><div><span>Cleaniliness</span></div><div><i class="fa fa-arrow-down servicesboxratingsicons servicesdown"></i><span>'+(-1*val)+'%</span></div></div></div>');
                    } else if(result.response.attr_names[i] == "Overall"){
                      var val = attrprefresult.response.proportion_change.overall*100;
                      val = val.toFixed(3);
                      if(val >= 0)
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-smile-o faiconscustom"></i><div class="servicesboxratings"><div><span>Overall</span></div><div><i class="fa fa-arrow-up servicesboxratingsicons servicesup"></i><span>'+val+'%</span></div></div></div>');
                      else 
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-smile-o faiconscustom"></i><div class="servicesboxratings"><div><span>Overall</span></div><div><i class="fa fa-arrow-down servicesboxratingsicons servicesdown"></i><span>'+(-1*val)+'%</span></div></div></div>');
                    } else if(result.response.attr_names[i] == "Value"){
                      var val = attrprefresult.response.proportion_change.value*100;
                      val = val.toFixed(3);
                      if(val >= 0)
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-money faiconscustom"></i><div class="servicesboxratings"><div><span>Value</span></div><div><i class="fa fa-arrow-up servicesboxratingsicons servicesup"></i><span>'+val+'%</span></div></div></div>');
                      else
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-money faiconscustom"></i><div class="servicesboxratings"><div><span>Value</span></div><div><i class="fa fa-arrow-down servicesboxratingsicons servicesdown"></i><span>'+(-1*val)+'%</span></div></div></div>');
                    } else if(result.response.attr_names[i] == "Food"){
                      var val = attrprefresult.response.proportion_change.food*100;
                      val = val.toFixed(3);
                      if(val >= 0)
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-cutlery faiconscustom"></i><div class="servicesboxratings"><div><span>Food</span></div><div><i class="fa fa-arrow-up servicesboxratingsicons servicesup"></i><span>'+val+'%</span></div></div></div>');
                      else
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-cutlery faiconscustom"></i><div class="servicesboxratings"><div><span>Food</span></div><div><i class="fa fa-arrow-down servicesboxratingsicons servicesdown"></i><span>'+(-1*val)+'%</span></div></div></div>');
                    } else if(result.response.attr_names[i] == "Sleep Quality"){
                      var val = attrprefresult.response.proportion_change['sleep quality']*100;
                      val = val.toFixed(3);
                      if(val >= 0)
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-eye-slash faiconscustom"></i><div class="servicesboxratings"><div><span>Sleep Quality</span></div><div><i class="fa fa-arrow-up servicesboxratingsicons servicesup"></i><span>'+val+'%</span></div></div></div>');
                      else
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-eye-slash faiconscustom"></i><div class="servicesboxratings"><div><span>Sleep Quality</span></div><div><i class="fa fa-arrow-down servicesboxratingsicons servicesdown"></i><span>'+(-1*val)+'%</span></div></div></div>');
                    } else if(result.response.attr_names[i] == "Location"){
                      var val = attrprefresult.response.proportion_change.location*100;
                      val = val.toFixed(3);
                      if(val >= 0)
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-road faiconscustom"></i><div class="servicesboxratings"><div><span>Location</span></div><div><i class="fa fa-arrow-up servicesboxratingsicons servicesup"></i><span>'+val+'%</span></div></div></div>');
                      else
                        $("#servicesDiv").append('<div class="servicesbox"><i class="fa fa-road faiconscustom"></i><div class="servicesboxratings"><div><span>Location</span></div><div><i class="fa fa-arrow-down servicesboxratingsicons servicesdown"></i><span>'+(-1*val)+'%</span></div></div></div>');
                    }
                    // $('.dropdown-menu-service-filters').append('<li><a href="#">'+result.response.attr_names[i].toLowerCase()+'</a></li>');
                  }
                  // $('.dropdown-menu-service-filters > li').click(function(){
                  //   $('#servicefilterinputdropdown').val($(this).text());
                  //   localStorage.setItem("servicefilter",$(this).text());
                  //   filterReviews();
                  // });
                } else {
                  alert(attrprefresult.messages[0]);
                }
              },
              error: function(error) {
                console.log("error: "+error);
              }
            })
          } else {
            alert(result.messages[0]);
          }
       },
       error: function(error) {
        console.log("error: "+error);
       }
    })
  }

  var data = {
    business_type: localStorage.getItem("business_type")
  };
  var dataStr = JSON.stringify(data);
  $.ajax({
     type: "GET",
     url: 'http://ec2-54-84-109-19.compute-1.amazonaws.com:5000/demo/get_attribute_names_for_business.json?data='+dataStr,
     success: function (data) {
        var result = JSON.parse(data);
        //console.log(data);
        if(result.status){
          for(var i in result.response.attr_names){
            $('.dropdown-menu-service-filters').append('<li><a href="#">'+result.response.attr_names[i].toLowerCase()+'</a></li>');
          }
          $('.dropdown-menu-service-filters > li').click(function(){
            $('#servicefilterinputdropdown').val($(this).text());
            localStorage.setItem("servicefilter",$(this).text());
            filterReviews();
          });
        } else {
          alert(result.messages[0]);
        }
     },
     error: function(error) {
      console.log("error: "+error);
     }
  })

  var drawBarGraph = function(labels, dataPoints) {
    $('#barChart').remove();
    $('#barchartarea').append('<canvas id="barChart" style="height:230px"></canvas>');
    var canvas = $("#barChart").get(0);
    var barChartCanvas = canvas.getContext("2d");
    barChartCanvas.clearRect(0, 0, canvas.width, canvas.height);
    var barChart = new Chart(barChartCanvas);
    var barChartData = {
      labels: labels,
      datasets: [
        {
          label: "Electronics",
          fillColor: "rgba(60,141,188,0.9)",
          strokeColor: "rgba(60,141,188,0.8)",
          pointColor: "#3b8bba",
          pointStrokeColor: "rgba(60,141,188,1)",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(60,141,188,1)",
          data: dataPoints
        }
      ]
    };
    var barChartOptions = {
      //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero: true,
      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines: true,
      //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)",
      //Number - Width of the grid lines
      scaleGridLineWidth: 1,
      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,
      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,
      //Boolean - If there is a stroke on each bar
      barShowStroke: true,
      //Number - Pixel width of the bar stroke
      barStrokeWidth: 2,
      //Number - Spacing between each of the X value sets
      barValueSpacing: 5,
      //Number - Spacing between data sets within X values
      barDatasetSpacing: 1,
      //String - A legend template
      legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
      //Boolean - whether to make the chart responsive
      responsive: true,
      maintainAspectRatio: true
    };

    barChartOptions.datasetFill = false;
    barChart.Bar(barChartData, barChartOptions);
  }

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
        business_id: localStorage.getItem("business_name"), 
        attr_name: "overall", 
        start_time: new Date($('#from_date').val()).getTime()/1000,//"1450895400",//"1451606400",//"1311922600",//fromTime, 
        end_time: new Date($('#to_date').val()).getTime()/1000,//"1458757800",//"1458936371",//"1311923800"//toTime
        max_data_points: "50"
      };
      var dataStr = JSON.stringify(data);
      //console.log(dataStr);
      $.ajax({
         type: "GET",
         url: 'http://ec2-54-84-109-19.compute-1.amazonaws.com:5000/dashboard/get_attribute_wise_ratings.json?data='+dataStr,
         success: function (data) {
            var result = JSON.parse(data);
            //console.log(data);
            if(result.status){
              console.log(result.response);
              var labels = [];
              var dataPoints = [];
              for(var rating in result.response.ratings){
                var d = new Date(result.response.ratings[rating][0]*1000);
                labels.push(monthNames[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear());
                dataPoints.push(result.response.ratings[rating][1]);
              }
              updateServices();
              drawBarGraph(labels,dataPoints);
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

  //BAR GRAPH
  //drawBarGraph(monthNames, [1, 2, 6, 3, 8, 4, 9, 2, 3, 1, 9, 2]);
  //NOTIFICATIONS
  localStorage.setItem("reviewfilter","allreview");
  localStorage.setItem("servicefilter","overall");
  $($('.reviewfilter').get(0)).addClass('reviewfilteractive');
  $('#servicefilterinputdropdown').val('overall');
  //REVIEW FILTERS
  $('.reviewfilter').click(function(){
    $('.reviewfilter').each(function(){
      $(this).removeClass('reviewfilteractive');
    })
    $(this).addClass('reviewfilteractive');
    if($(this).hasClass('allreview')){
      localStorage.setItem("reviewfilter","allreview");
    } else if($(this).hasClass('goodreview')){
      localStorage.setItem("reviewfilter","goodreview");
    } else if($(this).hasClass('neutralreview')){
      localStorage.setItem("reviewfilter","neutralreview");
    } else if($(this).hasClass('badreview')){
      localStorage.setItem("reviewfilter","badreview");
    }
    filterReviews();
  });
  //SERVICE FILTERS
  $('.dropdown-menu-service-filters > li').click(function(){
    $('#servicefilterinputdropdown').val($(this).text());
    localStorage.setItem("servicefilter",$(this).text());
    filterReviews();
  });


  var filterReviews = function(){
    var reviewfilter = localStorage.getItem("reviewfilter");
    var servicefilter = localStorage.getItem("servicefilter");
    if(servicefilter == "overall" && reviewfilter != "allreview"){
      $('.allreviews > li').each(function(){
        if($(this).hasClass(reviewfilter)){
          $(this).removeClass('displayNone');
        } else {
          $(this).addClass('displayNone');
        }
      });
    } else if(reviewfilter == "allreview" && servicefilter != "overall"){
      $('.allreviews > li').each(function(){
        if($(this).hasClass(servicefilter)){
          $(this).removeClass('displayNone');
        } else {
          $(this).addClass('displayNone');
        }
      });
    } else if(reviewfilter == "allreview" && servicefilter == "overall"){
      $('.allreviews > li').each(function(){
        $(this).removeClass('displayNone');
      });
    } else {
      $('.allreviews > li').each(function(){
        if($(this).hasClass(reviewfilter) && $(this).hasClass(servicefilter)){
          $(this).removeClass('displayNone');
        } else {
          $(this).addClass('displayNone');
        }
      });
    }
  }

  var notificationdata = {
    business_type: localStorage.getItem("business_type"), 
    business_id: localStorage.getItem("business_name"), 
    start_time: "1199145600",//"1390507571",//"1311922600",//fromTime, 
    end_time: "1464566400"//"1458936371"//"1311923800"//toTime
  };
  var notificationStr = JSON.stringify(notificationdata);
  $.ajax({
    type: "GET",
    url: 'http://ec2-54-84-109-19.compute-1.amazonaws.com:5000/dashboard/get_notifications.json?data='+notificationStr,
    success: function (notificationdatares) {
      var notificationresult = JSON.parse(notificationdatares);
      //console.log(attrperfdatares);
      if(notificationresult.status){
        console.log(notificationresult.response);
        for(var i in notificationresult.response.notifications){
          var n = notificationresult.response.notifications[i];
          var review_type = "goodreview";
          var review_color = "bg-green";
          if(n.notification_type == "ok"){
            review_type = "neutralreview";
            review_color = "bg-yellow";
          } else if(n.notification_type == "bad"){
            review_type = "badreview";
            review_color = "bg-red";
          }
          $('.allreviews').append('<li class="'+review_type+' '+n.attr_name+'"><a href="javascript::;"><i class="menu-icon fa fa-envelope '+review_color+'"></i><div class="menu-info"><h4 class="control-sidebar-subheading">'+n.text+'</h4><p>'+n.attr_name+'</p></div></a></li>')
        }
      } else {
        alert(notificationresult.messages[0]);
      }
    },
    error: function(error) {
      console.log("error: "+error);
    }
  })

  $('#getData').click();

  $('.services').mousedown(function(e){
    localStorage.setItem("mousedown",true);
    localStorage.setItem("mouseX",e.pageX);
  });
  $('.services').mousemove(function(e){
    if(localStorage.getItem("mousedown") == "true"){
      var x = e.pageX;
      var left = parseInt(localStorage.getItem("mouseX")) - x;
      if(left > 0)
        $('.services').scrollLeft(left);
      else
        $('.services').scrollLeft($('.services').scrollLeft()+left);
    }
  });
  $('.services').mouseup(function(){
    localStorage.setItem("mousedown",false);
  })

  $('#notificationsheaderbutton').click(function(){
    if($('.content-wrapper').hasClass('margin-right')){
      $('.content-wrapper').removeClass('margin-right');
    } else {
      $('.content-wrapper').addClass('margin-right');
    }
  })
});
$(document).ready(function(){
	$('#results').hide();
	//Safari appears to have 9 objects in local storage by default, hence the odd if statement
	if(window.localStorage.length === 9){
	 $("#saved-co").hide();
	} else {
		//document.write(window.localStorage.length);
		$("#saved-co").append("<h3>Saved Companies</h3><ul></ul>");
		for(var s in localStorage){
			$('#saved-co ul').append('<li>'+localStorage[s].name+'</li>');
		}
	}


	var CompanyObj = function(name, desc){
		this.coName = name;
		this.coDescr = desc;
		this.coFounded = '';
		this.coLogo = '';
		this.empNo = '';
		this.coHQ = '';
		this.forProfit = '';
		this.focusAreas = [];
		this.coWebsite = '';
		this.coCBSite = '';
		this.competitors = [];
		
	};
	// var CompanyNews ={
	// 	headline : [],
	// 	link : []
	// };

	$("#search-form").on("submit", function(e){
		var company = $("#search-term").val();
		$("#search-term").val("");
		$('h3,h5,li,p,hr').remove(); //need to remove old search

		// $.ajax({
		// 	url:"https://api.crunchbase.com/v/2/organizations?user_key=7d6130439b66ee4856835a66ad3d07a0&name=" + company,
		// 	dataType: "json",
		// 	type: "GET",
		// 	success: function(info){
		// 		//console.log(info);
		// 		var items =info.data.items;
		// 		$('#results').hide();
		// 		//console.log(items);
		// 		$("li").remove();
		// 		for(var i=0; i < items.length; i++){
		// 				$("ul").append("<li>" + items[i].name + "</li>");
		// 		}
		// 		$('#results').fadeIn(500);
		// 	},
		// 	error: function(){ console.log("There has been an error!");}
		// });

		$.getJSON("https://api.crunchbase.com/v/2/organizations?&user_key=7d6130439b66ee4856835a66ad3d07a0&name=" + company,
			function(info){
				var items =info.data.items;
				var collection = [];
				console.log(info);
				$("#results li").remove();
				for(var i=0; i < items.length; i++){
					collection.push(items[i].name);
				}
				collection.forEach(function(n,i){
					if(i < 20){
						$("#results ul").append("<li>" + n + "</li>");
					}
				});
				$('#results').fadeIn(500);
				$('#results a').on("click", function(e){
					$('#results').hide();
					$('#results li').remove();
					collection.forEach(function(n){
						$("#results ul").append("<li>" + n + "</li>");
					});
					$('#results').fadeIn(100);
					$('#results a').fadeOut(0);
				});
					
			});
				
			});
		$("#results ul").on("click", "li", function(e){
		var selCompany = $(this).text();
		//var  = new CompanyObj;
		$("#results").fadeOut(200);
		
		$.getJSON("https://api.crunchbase.com/v/2/organization/" +selCompany +"?&user_key=7d6130439b66ee4856835a66ad3d07a0",
			function(detail){
				//general description div
				var props = detail.data.properties;
				$('#companyCB').append('<h3>' + selCompany +'<small> ' + props.also_known_as + '</small></h3><h5>Founded on: <small>'+props.founded_on+'</small></h5>');
				$('#companyCB').append('<p>' + props.description + '</p><br>');
				$('#companyCB').append('<hr><h5>Number of Employees: <small> '+props.number_of_employees+'</small></h5><h5>For Profit? <small>'+props.secondary_role_for_profit+'</small></h5>');
				//console.log( typeof detail === "array");

				//category div
				$(".co-focus ul").before("<h3>Areas of Focus</h3>");
				var cats = detail.data.relationships.categories.items;
				//console.log(cats);
				for(var i = 0; i < cats.length; i++){
					$(".co-focus ul").append('<li>' + cats[i].name +'</li>');
				}

				//news div
				$(".co-news ul").before("<h3>News: "+ selCompany +"</h3>");
				var news = detail.data.relationships.news.items;
				for(var n =0; n < news.length; n++){
					$(".co-news ul").append('<li><a href="'+news[n].url+'">' + news[n].title + ' </a>by '+news[n].author+' '+news[n].posted_on+'</li>');
				}


			});
		//$(".crunchbase iframe").attr("src", "https://www.crunchbase.com/organization/"+ selCompany).fadeIn(1500);
		
		});

		});
	

//where to find crunch base data: https://developer.crunchbase.com/docs
// crunch base : curl -v  -X GET "https://api.crunchbase.com/v/2/organizations?name=goldman+sachs&user_key=1289&page=1"
//<small></small>

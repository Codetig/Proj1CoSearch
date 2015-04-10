$(document).ready(function(){
	
	$('#results').hide();
	//Safari appears to have 9 objects in local storage by default, hence the odd if statement
	if(window.localStorage.length === 0){
	 $("#saved-co").hide();
	} else {
		//document.write(window.localStorage.length);
		$("#saved-co").append("<h3>Saved Companies</h3><ul></ul>");
		for(var s in window.localStorage){
			//console.log(window.localStorage.getItem(s).length);
			if(lsGetMe(s).empNo >= 0){
				$('#saved-co ul').append('<li><a class="old-co">'+ s +'</a></li>');
			}
		}
	}

	$('#saved-co ul').on('click','.old-co',function(e){
		$('#saved-co').fadeOut(1);
		displayDetails(lsGetMe($(this).text()));
	});


	var CompanyObj = function(name){
		this.coName = name;
		this.coAlias ='';
		this.coDescr = '';
		this.coFoundedOn = '';
		this.coLogoUrl = '';
		this.empNo = '';
		this.coHQCity = '';
		this.forProfit = '';
		this.focusAreas = [];
		this.coWebsite = '';
		this.coCBSite = '';
		this.competitors = [];
		this.coNews = {headline:[], url:[], author:[], postDate:[]};
		
	};



	function displayDetails(myObj){

		
		//general description div
				
		$('#companyCB').append('<h3>' + myObj.coName +'<small> ' + myObj.coAlias + '</small></h3><h5>Founded on: <small>'+myObj.coFoundedOn+'</small></h5>');
		$('#companyCB').append('<p>' + myObj.coDescr + '</p><br>');
		$('#companyCB').append('<hr><h5>Number of Employees: <small> '+myObj.empNo+'</small></h5><h5>For Profit? <small>'+myObj.forProfit+'</small></h5>');
		//console.log( typeof detail === "array");

		//category div
		$(".co-focus ul").before("<h3 class='focus-header'>Areas of Focus</h3>");
		//var cats = detail.data.relationships.categories.items;//remove
		//console.log(cats);
		for(var i = 0; i < myObj.focusAreas.length; i++){
			$(".co-focus ul").append('<li>' + myObj.focusAreas[i] +'</li>');
		}

		//news div
		$(".co-news ul").before("<h3>News: "+ myObj.coName +"</h3>");
		//var news = detail.data.relationships.news.items;//remove already at top
		for(var n =0; n < myObj.coNews.headline.length; n++){
			$(".co-news ul").append('<li><a target="_blank" href="'+myObj.coNews.url+'">' + myObj.coNews.headline[n] + ' </a>by '+myObj.coNews.author[n]+' '+myObj.coNews.postDate[n]+'</li>');
		}
		//return myObj;

		
	}

	function lsGetMe(obj1){
		return JSON.parse(window.localStorage.getItem(obj1));
	}
	
	var cbKey ="7d6130439b66ee4856835a66ad3d07a0";

	$("#search-form").on("submit", function(e){
		var company = $("#search-term").val();
		$("#search-term").val("");
		$('h3,h5,li,p,hr,#saveCo').remove(); //need to remove old search

		// $.ajax({
		// 	url:"https://api.crunchbase.com/v/2/organizations?user_key="+cbKey+"&name=" + company,
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

		$.getJSON("https://api.crunchbase.com/v/2/organizations?&user_key="+cbKey+"&name=" + company,
			function(info){
				var items =info.data.items;
				var collection = [];
				//console.log(info);
				$("#results li").remove();
				for(var i=0; i < items.length; i++){
					collection.push(items[i].name);
				}
				collection.forEach(function(n,i){
					if(i < 20){
						$("#results ul").append('<li><a>' + n + '</a></li>');
					}
				});
				$('#results').fadeIn(500);
				$('#results #full').on("click", function(e){
					$('#results').hide();
					$('#results li').remove();
					collection.forEach(function(n){
						$("#results ul").append("<li><a>" + n + "</a></li>");
					});
					$('#results').fadeIn(100);
					$('#results #full').fadeOut(0);
				});
					
			});
				
			});
		$("#results ul").on("click", "li", function(e){
		var selCompany = $(this).text();

		//console.log(eval('selCompany'));
		//var  = new CompanyObj;
		$("#results").fadeOut(200);
		
		$.getJSON("https://api.crunchbase.com/v/2/organization/" +selCompany +"?&user_key="+cbKey,
			function(detail){
				var props = detail.data.properties;
				var cats = detail.data.relationships.categories.items;
				var news = detail.data.relationships.news.items;

				//converting to my object
				var currentCo = new CompanyObj(props.name);
				currentCo.coAlias =  props.also_known_as || "";
				currentCo.coDescr = props.description;
				currentCo.coFoundedOn = props.founded_on;
				currentCo.empNo = props.number_of_employees;
				currentCo.coHQCity = detail.data.relationships.headquarters.items[0].city + detail.data.relationships.headquarters.items[0].region;
				currentCo.forProfit = props.secondary_role_for_profit;
				currentCo.focusAreas = cats.map(function(val){return val.name;});
				currentCo.coWebsite = props.homepage_url;
				currentCo.coCBSite = 'https://www.crunchbase.com/organization/' + currentCo.coName;
				currentCo.coLogoUrl = currentCo.coCBSite +detail.data.relationships.primary_image.items[0].path;
				currentCo.coNews.headline = news.map(function(val){return val.title;});
				currentCo.coNews.url = news.map(function(val){return val.url;});
				currentCo.coNews.author = news.map(function(val){return val.author;});
				currentCo.coNews.postDate = news.map(function(val){return val.posted_on;});
				
				displayDetails(currentCo);

				$('.co-focus').append('<br><a id="saveCo" class="btn btn-primary">Save Company</a>');
				$('#saveCo').on('click',function(){
					if(lsGetMe(currentCo.coName)||false){
						$('#saveCo').attr('class', 'btn btn-warning');
						if(confirm("Update this Company data?")){
							window.localStorage.setItem(currentCo.coName, JSON.stringify(currentCo));
							$('#saveCo').attr('class', 'btn btn-success');
							$('#saveCo').text('Saved');
							//alert(currentCo.coName + " has been saved.");
							//console.log(window.localStorage.getItem(currentCo.coName));
						}
					} else{
						window.localStorage.setItem(currentCo.coName, JSON.stringify(currentCo));
						$('#saveCo').attr('class', 'btn btn-success');
						$('#saveCo').text('Saved');
						//alert(currentCo.coName + " has been saved.");
						//console.log(window.localStorage.getItem(currentCo.coName));
					}
				});

				//console.log (detail);
				
				//general description div
				
				// $('#companyCB').append('<h3>' + currentCo.coName +'<small> ' + currentCo.coAlias + '</small></h3><h5>Founded on: <small>'+currentCo.coFoundedOn+'</small></h5>');
				// $('#companyCB').append('<p>' + currentCo.coDescr + '</p><br>');
				// $('#companyCB').append('<hr><h5>Number of Employees: <small> '+currentCo.empNo+'</small></h5><h5>For Profit? <small>'+currentCo.forProfit+'</small></h5>');
				// //console.log( typeof detail === "array");

				// //category div
				// $(".co-focus ul").before("<h3>Areas of Focus</h3>");
				// //var cats = detail.data.relationships.categories.items;//remove
				// //console.log(cats);
				// for(var i = 0; i < currentCo.focusAreas.length; i++){
				// 	$(".co-focus ul").append('<li>' + currentCo.focusAreas[i] +'</li>');
				// }

				// //news div
				// $(".co-news ul").before("<h3>News: "+ currentCo.coName +"</h3>");
				// //var news = detail.data.relationships.news.items;//remove already at top
				// for(var n =0; n < currentCo.coNews.headline.length; n++){
				// 	$(".co-news ul").append('<li><a href="'+currentCo.coNews.url+'">' + currentCo.coNews.headline[n] + ' </a>by '+currentCo.coNews.author[n]+' '+currentCo.coNews.postDate[n]+'</li>');
				// }


			});
		//$(".crunchbase iframe").attr("src", "https://www.crunchbase.com/organization/"+ selCompany).fadeIn(1500);
		
		});

		});
	

//where to find crunch base data: https://developer.crunchbase.com/docs
// crunch base : curl -v  -X GET "https://api.crunchbase.com/v/2/organizations?name=goldman+sachs&user_key=1289&page=1"
//<small></small>

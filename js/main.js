$(document).ready(function(){
    var yt_video_data_array = {};
    var output_to_array;
	var index_x = 0;

	//max video result, min=1 max=50
	var max_video_result = 20;								

	//youtube user playlist id
	YoutubeApiKey = "####";
	
	//youtube API key
	YoutubePlayListID = "####";

	$.get("https://www.googleapis.com/youtube/v3/playlistItems",{
		part: 'snippet',
		maxResults: max_video_result,
		playlistId: YoutubePlayListID, 
		key: YoutubeApiKey},
		function(data){
			$.each(data.items, function(i, item){
					videURL_val = item.snippet.resourceId.videoId;
					$.get("https://www.googleapis.com/youtube/v3/videos",{
				    	part: "snippet, statistics, contentDetails",
				 		key: YoutubeApiKey,
				    	id: videURL_val},
						function(getVideos){
							
							$.each(getVideos.items, function(ix, itemx){	
								vidiTime = ct(itemx.contentDetails.duration); //ct = ConvertTime
                   				viewCount = formatNumber(itemx.statistics.viewCount);
								publishedAt = itemx.snippet.publishedAt;


								videURL = item.snippet.resourceId.videoId;
								videTitle = item.snippet.title;
								videTumbnails = item.snippet.thumbnails.medium.url; // default:90x120 | high:360x480 | medium:180x320 | standard:480x640 | maxres:720x1280
								position = item.snippet.position;
								
								CommentCount = formatNumber(itemx.statistics.commentCount);
								LikeCount = formatNumber(itemx.statistics.likeCount);
								
								//title split
								if (videTitle.length > 30) {
									videTitle = videTitle.substring(0, 30).trim() + ' . . .';
								}
		
								output_to_array = 
										'<table border="0">'+
										'<td>'+
										'<a target="_blank" href="https://www.youtube.com/watch?v='+videURL+' ">' +
										'<img  class="videoImage"src="'+videTumbnails+'" "></img></a>' +
										'</td>'+
								
										'<td class="vr_content_bg" >'+
										'<a class="vidtitle">&nbsp; '+videTitle+' </a></br>'+
										'<a class="vidTime">&nbsp;&nbsp; '+vidiTime+' minute</a></br></br>'+
										'<a class="viewcount"><i class="fa fa-eye" aria-hidden="true"></i> '+viewCount+'</a> '+

										'<a class="viewcount"><i class="fa fa-comments" aria-hidden="true"></i> '+CommentCount+'</a> '+
										'<a class="viewcount"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i> '+LikeCount+'</a> '+

										'<a class="timeago"><i class="fa fa-clock-o" aria-hidden="true"></i><time class="timeago" datetime="'+publishedAt+'"></time> </a></br>'+
										'</td>'+
										'<table>'
								// push all data to array
								yt_video_data_array[position] = output_to_array;

				    			if (index_x == max_video_result -1) {
									// read all data from array
    								for (var id in yt_video_data_array) {
									$('#results').append(yt_video_data_array[id]);
									$("time.timeago").timeago();			
									}
                				}	

								index_x++;
							})
						}
					);							
				})
					
		}		
		);

    // Convert time		
	function ct(duration) {
		var a = duration.match(/\d+/g);

		if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
			a = [0, a[0], 0];
		}

		if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
			a = [a[0], 0, a[1]];
		}
		if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
			a = [a[0], 0, 0];
		}

		duration = 0;

		if (a.length == 3) {
			duration = duration + parseInt(a[0]) * 3600;
			duration = duration + parseInt(a[1]) * 60;
			duration = duration + parseInt(a[2]);
		}

		if (a.length == 2) {
			duration = duration + parseInt(a[0]) * 60;
			duration = duration + parseInt(a[1]);
		}

		if (a.length == 1) {
			duration = duration + parseInt(a[0]);
		}
		var h = Math.floor(duration / 3600);
		var m = Math.floor(duration % 3600 / 60);
		var s = Math.floor(duration % 3600 % 60);
		return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
	}


	// Number separating with DOT
	function formatNumber (num) {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
	}
});
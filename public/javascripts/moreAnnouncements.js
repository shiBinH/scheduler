$(function(){
	
$('#moreAnnouncements').on('click', function(e){
	e.preventDefault();
	var $last = $('a.list-group-item:last');
	var time = $last.find('input').attr('value');
	$.ajax({
		type: 'POST',
		url: window.location.href + '/more',
		data: {
			time: time
		},
		beforeSend: function() {
			console.log('\n\tAbout to make ajax request\n')
		},
		success: function(data) {
			console.log("\n\tsuccess\n");
			if (!data.announcements.length) {
				$('#moreAnnouncements').remove();
				return;
			}
			for (var i=0; i<data.announcements.length; i++) {
				var newAnnouncement = '<a class="list-group-item" href="'+data.href[i]+'">';
						newAnnouncement += '<h2 class="text-primary">' + data.announcements[i].title + '</h2>';
						newAnnouncement += '<hr>' + '<p class="col-sm-4"><i>' + data.announcements[i].summary + '</p>';
						newAnnouncement += '<footer class="text-muted text-right pull-right col-sm-4"><small>';
						newAnnouncement += data.announcements[i].author + '<br>' + data.announcements[i].time + '</footer>'+'<div class="clearfix"></div>';
						newAnnouncement += '<input type="hidden" value="' + data.announcements[i].createdAt + '">';	
						newAnnouncement += '</a>';
				$last = $('a.list-group-item:last');
				$last.after(newAnnouncement);
			}
		},
		fail: function() {
			console.log('\n\t\Failed\n');
		},
		complete: function() {
			console.log('\n\tComplete\n');
		}
	})
});
	
})
$(function() {
	$('#moreEvents').on('click', function(e) {
		e.preventDefault();
		var $last = $('a.list-group-item:last');
		var time = $last.find('input').attr('value');
		$.ajax({
			url: window.location.href + '/more',
			type: 'POST',
			data: {
				time: time
			},
			success: function(events) {
				console.log('\n\tSuccess\n');
				if (!events.events.length) {
					$('#moreEvents').remove();
					return;
				} 
				for (var i=0; i<events.events.length; i++) {
					$last = $('a.list-group-item:last');;
					var isOpen = events.events[i].nRegistered < events.events[i].capacity;
					var isOver = (new Date(events.events[i].time)).getTime() < Date.now();
					var registrationClosed = (new Date(events.events[i].time)).getTime() - (24*60*60*1000) < Date.now();
					var localeDate = (new Date(events.events[i].time)).toLocaleString();
					var when = localeDate.substring(0, localeDate.length-6) + localeDate.substring(localeDate.length-2);
					var nextEvent = '<a class="list-group-item" href="'+events.href[i] + '">';
							nextEvent += '<h2 class="text-primary">' + events.events[i].title + '<small>';
					if (isOver) 
							nextEvent += '<span class="label label-danger pull-right">EVENT OVER</span>';
					else if (isOpoen && !registrationClosed) 
							nextEvent += '<span class="label label-success pull-right>OPEN</span>';
					else nextEvent += '<span class="label label-danger pull-right">CLOSED</span>';
							nextEvent += '</small></h2><hr><p class="col-sm-8">When: ' + when + '<br>';
							nextEvent += 'Where: ' + events.events[i].location + '<br>';
							nextEvent += '<i><b>Description:</b></i>';
							nextEvent += '<div class="col-sm-5 col-sm-offset-1"><i>' + events.events[i].summary + '</i></div>';
							nextEvent += '<div class="clearfix"></div></p>';
							nextEvent += '<input type="hidden" value="' + events.events[i].time + '">';
							nextEvent += '</a>';
					$last.after(nextEvent);
				}
			}			
		})
	});
})
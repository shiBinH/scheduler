$(function(){
	
	$('#emailForm').on('submit', function(e) {
		e.preventDefault();
		var $emailForm = $('#emailForm');
		$.ajax({
			url: window.location.href + '/update',
			type: 'POST',
			data: {
				email: $emailForm.find('input[name="email"]').val(),
				password: $emailForm.find('input[name="password"]').val()
			},
			success: function(data) {
				var $fieldset = $('fieldset');
				if ("success" in data) {
					$fieldset.find('#emailMsg').html('<span class="text-success">'+data.message+'</span>');
					$fieldset.find('#emailBtn').html('<a href="'+data.link+'/login'+'"><button class="btn btn-primary pull-right" type="button">Done</button></a>');
					console.log('Success');
				}
				else {
					$fieldset.find('#emailMsg').html('<span class="text-danger">'+data.message+'</span>');
					console.log('Failed');
				}
			}
		});
	});
	
	$('#aboutForm').on('submit', function(e) {
		e.preventDefault();
		var $aboutForm = $('#aboutForm');
		$.ajax({
			url: window.location.href + '/update',
			type: 'POST',
			data: {
				bio: tinymce.get('bio').getContent(),
				password: $aboutForm.find('input[name="password"]').val()
			},
			success: function(data) {
				var $fieldset = $('fieldset');
				if ("success" in data) {
					$fieldset.find('#aboutMsg').html('<span class="text-success">'+data.message+'</span>');
					$fieldset.find('#aboutBtn').html('<a href="'+data.link+'/login'+'"><button class="btn btn-primary pull-right" type="button">Done</button></a>');
					console.log('Success');
				}
				else {
					$fieldset.find('#aboutMsg').html('<span class="text-danger">'+data.message+'</span>');
					console.log('Failed');
				}
			}
		});
	});
	
})
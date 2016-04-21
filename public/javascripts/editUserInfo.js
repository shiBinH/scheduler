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
					$fieldset.eq(0).find('label').html('<span class="text-success">'+data.message+'</span>');
					$fieldset.find('button').remove();
					$fieldset.find('.btn-toolbar').html('<a href="'+data.link+'/login'+'"><button class="btn btn-primary pull-right" type="button">Done</button></a>');
					console.log('Success');
				}
				else {
					$fieldset.eq(0).find('label').html('<span class="text-danger">'+data.message+'</span>');
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
					$fieldset.eq(0).find('label').html('<span class="text-success">'+data.message+'</span>');
					$fieldset.eq($fieldset.length-1).find('button').remove();
					$fieldset.eq($fieldset.length-1).html('<a href="'+data.link+'/logout'+'"><button class="btn btn-primary pull-right" type="button">Done</button></a>');
					console.log('Success');
				}
				else {
					$fieldset.eq(0).find('label').html('<span class="text-danger">'+data.message+'</span>');
					console.log('Failed');
				}
			}
		});
	});
	
})
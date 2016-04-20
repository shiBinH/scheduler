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
				console.log(data);
				if ("success" in data) {
					$('#userEmail').html($emailForm.find('input[name="email"]').val()+ ' ');
					$fieldset.eq(0).find('label').html('<span class="text-danger">'+data.message+'</span>');
					$fieldset.eq($fieldset.length-1).find('button').remove();
					$fieldset.eq($fieldset.length-1).html('<a href=""><button class="btn btn-primary pull-right" type="button">Done</button></a>');
					console.log('Success');
				}
				else {
					$fieldset.eq(0).find('label').html('<span class="text-danger">'+data.message+'</span>');
					$fieldset.eq($fieldset.length-1).find('button').remove();
					$fieldset.eq($fieldset.length-1).html('<a href=""><button class="btn btn-primary pull-right" type="button">Done</button></a>');
					console.log('Failed');
				}
			}
		});
	});
	
})
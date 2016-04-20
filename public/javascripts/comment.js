$(function(){
	$('#commentArea').hide();// hide and expand comment box
	var $commentLabel = $('#commentLabel');
	$commentLabel.on('click', function(e) {
		e.preventDefault();
		$(this).find('#commentArea').toggle();
	});
	
});
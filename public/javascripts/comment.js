$(function(){
	$('#commentArea').hide();// hide and expand comment box
	var $commentLabel = $('#commentLabel');
	$commentLabel.find('a').on('click', function(e) {
		e.preventDefault();
		$commentLabel.find('#commentArea').toggle();
	});
	
});
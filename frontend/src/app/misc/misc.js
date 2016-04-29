$(document).ready(function() {
	$('#stickyTopBar').on('sticky.zf.stuckto:top', function() {
		console.log('stuck!');
	})
});
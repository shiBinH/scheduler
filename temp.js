userModel
	.update(
		{id: req.query.userId}, 
		{$addToSet: {events: req.params.eventId}},
		function(err, response) {
			if (err) {
				console.log('\n\tDB Error\n');
				res.status(400);
				res.json(err);
			} else {
				console.log('\n\tSuccessfully updated user\n');
			}
		}
	)
eventModel
	.update(
		{id: req.params.eventId}, 
		{$addToSet: {
				participants: {id: req.query.userId} 
			},
		}
		function (err, response) {
			if (err) {
				console.log('\n\tDB Error\n');
				res.status(400);
				res.json(err);
			} else {
				console.log('\n\tSuccessfully updated event');
				res.status(200);
				res.json(response);
			}
		});
eventModel
	.find({id: req.params.evenId})
	.exec(function(err, event){
					event.fixNRegistered();
				}
	);
//
userModel
		.update({id: req.query._id}, {
			$addToSet: {
				events: req.params.eventId
			}
	}, function(err, response){
				if (err) {
					console.log('@@@@@\n@@@@@\tDB Error:\n@@@@@');
				}
				else {
					console.log('@@@@@\n@@@@@\tSuccessfully updated\n@@@@@')
				}
	});
	eventModel
		.findById(req.params.eventId)
		.exec(function(err, event) {
			if (err) {
				console.log('@@@@@\n@@@@@ API: Failed to query database\n@@@@@');
				res.status(400);
				res.json(err);
				return;
			}
			if (event.nRegistered===event.capacity) {
				console.log('@@@@@\n@@@@@ API: Event Full\n@@@@@')
				res.status(304);
				res.json({
					full: true
				});
			}
			else {
				event.add({//need to add role
					id: req.query.userId
				});
				event.save(function(err, data) {
					if (err) {
						console.log('@@@@@\n@@@@@	From API: failed to save changes to DB\n@@@@@');
						res.status(400);
						res.json(data);
					}
					else {
						console.log('@@@@@\n@@@@@ From API: successfully updated DB\n@@@@@');
						console.log(data);
						res.status(200);
						res.json(data);
					}
				});
			}
		});
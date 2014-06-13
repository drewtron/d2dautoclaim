var exec = require('child_process').exec;
var fs = require('fs');

var parts_file = process.env.HOME + '/parts.json';
var declined_file = process.env.HOME + '/declined.json';
var committed_file = process.env.HOME + '/committed.json';

exec('./get_uncommitted', function(error, stdout, stderr) {

	if (stdout.indexOf('401 - Unauthorized: Access is denied due to invalid credentials.') > -1){//unauthed
		//exec('./create_auth_cookie');
		return;
	}

	var data = JSON.parse(stdout);
	var parts_with_stop_sale = {};

	data.d.Committed.Parts.forEach ( function (part) {
		if (part.status == "Cancelled") {
			parts_with_stop_sale[part.PartNo] = true;
		}
	});

	if (data.d.Uncommitted.Parts.length > 0){
		//Log there is an uncommitted part available
		//var message = { time: new Date(), parts: data.d.Uncommitted.Parts, data: data };
		//fs.appendFile(parts_file, JSON.stringify(message));

		data.d.Uncommitted.Parts.forEach( function (part){
			
			if (parts_with_stop_sale[part.PartNo]){//The part has had a stop sale today, tell it not to remind us
				exec('./decline_sale ' + part.ELLocID + ' ' + part.ELTransID, function(error, stdout, stderr) {
					var message = { time: new Date(), part: part };
					fs.appendFile(declined_file, JSON.stringify(message) + '\n');
				});
			} else {//Attempt to commit sale of part
				exec('./commit_sale ' + part.ELLocID + ' ' + part.ELTransID, function(error, stdout, stderr) {
					var message = { time: new Date(), part: part };
					fs.appendFile(committed_file, JSON.stringify(message) + '\n');
				});
			}
		});
	}
});

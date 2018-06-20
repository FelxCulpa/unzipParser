const yauzl = require('yauzl');
const fs = require ('fs');
const path = require ('path');
const csv = require ('fast-csv');

const User = require('./parseModule/user.js');

const resultPath = path.join(__dirname, '/result', 'catalog.json');
const wrToJsonFile = fs.createWriteStream(resultPath);

let jsonArr = [];


wrToJsonFile.on('error', err => {
	console.error('Error Write to JSON file!');
})

wrToJsonFile.on('finish', () => {
	console.log('Finished. Please, check out the result folder');
})

yauzl.open ('data.zip', {lazyEntries: true}, (err, zipfile) => {     //open zip archive
	
	if (err) throw err;

	zipfile.readEntry();										//work with each file in archive, emit event 'entry'
	
	zipfile.on('entry', entry => {								
		zipfile.openReadStream(entry, (err, readStream) => {     //read file
			
			if (err) throw err;
			
			let csvStream = csv.fromStream(readStream, {headers: true, delimiter: '|'});  //parse csv file
			csvStream.on('data', data => {
				let {first_name, last_name, phone,
						 cc, amount, date} = data;
				user = new User (first_name, last_name, phone, cc, amount, date);   //format data
				jsonArr.push(user);
			});
			csvStream.on('data-invalid', () => {
			   	console.error('Invalid row in csv file!')
			   })

			readStream.on('end', () => {						//after reading each file move to next, emit event 'entry'
				zipfile.readEntry();
			});
			readStream.on ('error', () => {
				console.error('Error while reading file in archive!');
			});
		})
	})

	zipfile.on ('end', () => {
		wrToJsonFile.write(JSON.stringify(jsonArr), 'utf8');          //write full object with users data from memory to JSON file
		wrToJsonFile.end();
	});
	zipfile.on ('error', () => {
		console.error('Error while unzip!');
	});
})


const yauzl = require('yauzl');
const fs = require ('fs');
const readline = require ('readline');
const path = require ('path');

const User = require('./parseModule/user.js');

const resultPath = path.join(__dirname, '/result', 'catalog.json');
const wrToJsonFile = fs.createWriteStream(resultPath);


let jsonArr = [];


wrToJsonFile.on('error', err => {
	console.error('Error Write to JSON file!');
})

wrToJsonFile.on('end', () => {
	console.log('Finished. Please, check out result folder');
})

yauzl.open ('data.zip', {lazyEntries: true}, (err, zipfile) => {     //open zip archive
	
	if (err) throw err;
	zipfile.readEntry();										//work with each file in archive, emit event 'entry'
	
	zipfile.on('entry', entry => {								
		zipfile.openReadStream(entry, (err, readStream) => {     //read file
			
			if (err) throw err;
			
			const rl = readline.createInterface({				//interface to read each line in file
				input: readStream
			});
			
			rl.on('line', (line) => {
				let dataArray = line.split('||');
				dataArray = removeQuotes(dataArray);
				if (dataArray[0].toLowerCase().trim() !== 'first_name') {
						let [firstName, lastName, , , , phone,
						 costCenter, amount, date] = dataArray;
					user = new User (firstName, lastName, phone, costCenter, amount, date);   //parse data and fill in user object
					jsonArr.push(user);
				}
			})

			readStream.on('end', () => {						//after reading each file move to next, emit event entry
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

function removeQuotes (stringArr) {
	return stringArr.map(str => str.replace(/^"(.*)"$/, '$1'))
}

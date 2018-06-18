class User {
	constructor (firstName, lastName, phone, costCenter, amount, date) {
		this.name = `${firstName} ${lastName}`;
		this.phone = parsePhone (phone); ;
		this.person = {
			firstName: {
				type: firstName 
			},
			lastName: {
				type: lastName
			}
		};
		this.amount = amount;
		this.date = parseDateToISO (date);
		this.costCenterNum = removePrefix (costCenter);
	}
}

function parsePhone (strPhone) {
	return strPhone.replace(/\((\d+)\)\s(\d+)\-/, "$1$2");
}

function parseDateToISO (date) {
	let splitDate = date.split('/');
	let [dd, mm, yyyy] = splitDate;

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm; 

	return `${yyyy}-${mm}-${dd}`;
}

function removePrefix (cc) {
	return cc.slice(3, );
}

module.exports = User;
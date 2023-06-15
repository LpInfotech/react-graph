const fs = require('fs');
const path = require('path');

class ProfileController {

	async getCandidateData(keyword) {
	return fs.readFile(path.join(__dirname,'..','/db/SP_Manager_GetInternalCandidate-json.json'), 'utf8', async function (err, data) {
			if (err) {
				console.log('File read failed:', err);
				throw new Error('File read failed');
			}
      let clone = JSON.parse(JSON.stringify(data));
     let res =  new Promise((resolve, reject) => resolve(clone));
		  let x = res.then(data=>data)
			console.log(x+'pe')
			x.map(el=> console.log(x))
		});
	}


}

module.exports= ProfileController



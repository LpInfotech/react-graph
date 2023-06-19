const fs = require('fs');
const path = require('path');

class ProfileController {

	constructor(name) {
    this.name = name;
  }
  static hello() {
    return "Hello!!";
  }

	static getCandidateData(keyword) {
		let keywordArray = keyword.id.split(',')
 fs.readFile(path.join(__dirname,'..','/db/SP_Manager_GetInternalCandidate-json.json'), 'utf8', async function (err, data) {
			if (err) {
				console.log('File read failed:', err);
				throw new Error('File read failed');
			}
      let candidates = await JSON.parse(data);
  let n= JSON.stringify(candidates[0].response.data.colaboradores.filter(elm=> keywordArray.find(el=>el == elm.can_id)))

    console.log(this)
		});
	}

	handleData(n){
return console.log(n,'return')
	} 





}

module.exports= ProfileController



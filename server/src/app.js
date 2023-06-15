const http = require('http');
const fs = require('fs');
const url = require('url');
const ProfileController = require('./controllers/profile.controller');


// server
const server = http.createServer(async function (req, res) {
	let parseUrl = url.parse(req.url,true);

	switch (true) {
		// get norma razi
		case parseUrl.pathname === '/get/normarazi' && req.method === 'GET':
			{
				fs.readFile(__dirname + '/db/SP_NormaRazi.json', 'utf8', function (err, data) {
					if (err) {
						console.log('File read failed:', err);
						res.writeHead(500, {'Content-Type': 'application/json'});
						res.end(err);
						throw new Error('File read failed');
					}
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end(data);
				});
			}

			break;

		// get normal Apl
		case parseUrl.pathname === '/get/normalApl' && req.method === 'GET':
			{
				return fs.readFile(__dirname + '/db/SP_GetNormaApl.json', 'utf8', function (err, data) {
					if (err) {
						console.log('File read failed:', err);
						res.writeHead(500, {'Content-Type': 'application/json'});
						res.end(err);
						throw new Error('File read failed');
					}
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end(data);
				});
			}
			break;

		//  get profiles
		case parseUrl.pathname === '/get/profile' && req.method === 'GET':
			{
				return fs.readFile(__dirname + '/db/SP_GetProfile.json', 'utf8', function (err, data) {
					if (err) {
						console.log('File read failed:', err);
						res.writeHead(500, {'Content-Type': 'application/json'});
						res.end(err);
						throw new Error('File read failed');
					}
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end(data);
				});
			}

			break;

		//  get internal candidate
		case parseUrl.pathname === '/get/candidates' && req.method === 'GET' && Object.keys(parseUrl.query).length === 0:
			{
				return fs.readFile(__dirname + '/db/SP_Manager_GetInternalCandidate-json.json', 'utf8', function (err, data) {
					if (err) {
						console.log('File read failed:', err);
						res.writeHead(500, {'Content-Type': 'application/json'});
						res.end(err);
						throw new Error('File read failed');
					}
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end(data);
				});
			}

			break;

					//  get internal candidate
		case parseUrl.pathname === '/get/candidates' && req.method === 'GET' && Object.keys(parseUrl.query).length !== 0:
			{
				console.log('query')
			 let data = new ProfileController().getCandidateData(parseUrl.query);
			 res.end('Working'+data)
			}

			break;

      default: console.log(parseUrl.query,'wrong')
	}
});

// listening
server.listen('9000', () => {
	console.log('Server is live on http://localhost:9000/get/candidates');
});

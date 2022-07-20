var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

mongoose.Promise = Promise;

var dbUrl = process.env.DBURL;

Message = mongoose.model('Message', {
	"name": String,
	"message": String,
	"time": Number
})

app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		res.send(messages)
	})
})


app.post('/messages', async (req, res) => {

	const d = new Date();
	const time = d.getTime();
	req.body.time = time;

	try {
		var message = new Message(req.body);
		var savedMessage = await message.save()
		console.log('app mssg: New message posted & saved to mongodb!');

		// Censore implimentation start
		var censored = await Message.findOne({message: 'badword'})
		if(censored) {
				console.log('app mssg: Censored words found in message', censored)
			await Message.deleteOne({_id: censored.id})
				console.log('app mssg: Deleted censored message');
		} else {
			io.emit('message',req.body);
			res.sendStatus(200);
		}
		// Censore end

	} catch(error) {
		res.sendStatus(500)
		return console.error(error)
	} finally {
		console.log('app mssg: Message post called.');
	}
})

io.on('connection', (socket) => {
		console.log('app mssg: a new user has Joined');
	})

var mongoOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true
};

mongoose.connect(dbUrl, mongoOptions, (err) => {
	if(err) { throw err; }
	console.log('app mssg: mongodb connected successfully');
})

var server = http.listen(3000, () => console.log('app mssg: Server is listening on port', server.address().port) );
		// Zdefiniowanie modułów node.js //
var express = require('express');
var app = express();
var fs = require('fs');
var nodemailer = require("nodemailer");
var formidable = require('express-formidable');
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var bcrypt = require('bcryptjs');
var panel  = __dirname+'/views/panel';
var notice = '';

/*var S3FS = require('s3fs');

var fsImpl = new S3FS('gladisbucket', {
	accesKeyId: process.env.AWS_ACCESS_KEY,
	secretAccesKey: process.env.AWS_SECRET_KEY
});


var Dropbox = require("dropbox");
var client = new Dropbox.Client({
    key: "6glsrqjujyer3p8",
    secret: "g8m7anx88svfdjp"
});*/
var expressHbs = require('express3-handlebars');
var uristring =  process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||'mongodb://localhost/portal';
		// Ustawienie portu dla aplikacji //
app.set('port', (process.env.PORT || 5000));

		// Połączenie z bazą danych //
mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uristring);
      }
});

		// Stworzenie "szablonu" na użytkowników // 
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = mongoose.model('User', new Schema({
	email: {type: String, unique: true},
	passwd: String,
	name: {type: String, unique: true},
	adres: String, 
	avatar: String,
	quiz: String
}));

		// Stworzenie widoków //
app.engine('handlebars', expressHbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(formidable.parse());

		// zdefiniowanie sesjii, dla zalogowanych użytkowników //
app.use(sessions({
	cookieName: 'session',
	secret: 'sfad7sa61hsad717f12',
	durration: 60 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	httpOnly: true,
	secure: true,
	ephermal: true
}));

app.use(function(req,res,next){
	if(req.session && req.session.user){
		User.findOne({name: req.session.user.name}, function(err,user){
			if(user){
				req.user = user;
				delete req.user.passwd;
				req.session.user = req.user;
				res.locals.user = req.user
			}
			next();
		})
	}
	else{
		next();
	}
});

function requireLogin(req,res,next){
	if(!req.user){
		res.redirect('/');
	}
	else{
		next();
	}
}


		// Routing //
app.get('/',function(req, res){	
	if(req.user){
		res.redirect('/panel');	
	}	
	else{
		res.render(__dirname + '/views/index', {
			notice:notice
		});
	}	

	notice = '';			 
    
  });	

app.get('/panel', requireLogin,  function(req,res){
		//var taskMap = {};
		var quiz = req.session.user.quiz;
		var czyQuiz = false;
		var bad = false;
		var middle = false;
		var good = false
		if(quiz==-1){
			czyQuiz = true;
		}
		if(quiz==1){
			good = true;
		}
		else if(quiz ==2){
			middle = true;
		}
		else if(quiz ==3){
			bad = true;
		}
		res.render(panel, {
			avatar: req.session.user.avatar,
			email: req.session.user.email,
			result: czyQuiz,
			good: good,
			middle: middle,
			bad: bad,
			notice: notice
		});
		notice = '';

})	

app.post('/p', function(req,res){
	var points = req.body.points;
	var group;
	points = parseInt(points);
	if(points >= 0){
		group=1;		//pełnosprawna 
	}
	if(points > 3){
		group=2;		// średnio 
	}
	if(points > 7){
		group=3;		//niepełnosprawna 
	}

	console.log(points);
	User.findById(req.session.user.id, function(err, doc) {
		doc.quiz = group;
		doc.save(function(err) {
			if (err) throw err;
			console.log('User successfully updated!');
		});
	});
	req.session.user.quiz = points;
	res.redirect('/panel');
})


function myImagee(avatar){
	var oldPath = avatar.path;
	var name = avatar.name;
	var type = avatar.type;
	var size = avatar.size;
	var newPath = '/upload'+oldPath+name;
	if(type != 'image/jpeg' && type != 'image/png' && size >= 10000000){
		return false;
	}
	else{
		return newPath;
	}
}

		// Wysłanie formularza rejestracji // 	
	
app.post('/register',function(req,res){
		//zaszyfrowanie hasła//
	var hash = bcrypt.hashSync(req.body.passwd, bcrypt.genSaltSync(10));
		// Dodanie zdjęcia profilowego //
	var image  = req.body.avatar;
	var myImage = myImagee(image);
	if(myImage){
		fs.readFile(image.path, function (err, data) {
			fs.writeFile(__dirname +'/public'+ myImage, data,  function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    else{
			    	user.avatar = myImage;
			    	console.log("The file was saved!" + myImage);
			    }
			    
			});
		});
	}
	else{
		myImage = 'Brak';
	}

	var user = new User({
		email: req.body.email,
		passwd: hash,
		name: req.body.name,
		adres: req.body.adres,
		quiz: '-1',
		avatar: '..'+myImage
	});


	

				// Zapisanie użytkownika w bazie //
	user.save(function (err){
		if(err){
			var err = ' Coś nie działa :C';
			if(err.code === 11000){
				var err = 'Niestety, ten adres email, lub nazwa są już zajęte';
			}
		}
		else{
			res.redirect('/');
		}
	});
});

		// Wysłanie formularza logowania //

app.post('/login',function(req,res){
	User.findOne({name: req.body.name},function(err,user){
		if(err){
			console.log(err);
		}
		if(!user){
			console.log("Nie znaleziono usera");
			res.redirect('/');
		}
		else{
			if(bcrypt.compareSync(req.body.passwd, user.passwd)){
				console.log("Zalogowano");
				req.session.user = user;
				res.redirect('/panel');
			}
			else{
				console.log("Niepoprawne haslo");
				res.redirect('/');	
			}
		}
	});
});
		// Wylogowanie //
app.get('/logout',function(req,res){
	req.session.reset();
	res.redirect('/');
});


		// Nasłuchiwanie portu //
app.listen('port', function() {
  console.log('Node app is running on port', app.get('port'));
});

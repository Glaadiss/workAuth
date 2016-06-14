		// Zdefiniowanie modułów node.js //
		// framework na którym działa aplikacja
var express = require('express');
var app = express();
		//moduł wspomagający zapisywanie zdjęć
var fs = require('fs');  
		//moduł do przechytywania informacji z formularzy
var formidable = require('express-formidable');
		//moduł do bazy danych
var mongoose = require('mongoose');
		// moduł do sesji
var sessions = require('client-sessions');
		// moduł do "haszowania" hasła
var bcrypt = require('bcryptjs');
		// ścieżka do strony dla zalogowanych
var panel  = __dirname+'/views/panel';
var strona1  = __dirname+'/views/strona1';
var strona2  = __dirname+'/views/strona2';
var strona3  = __dirname+'/views/strona3';
var strona4  = __dirname+'/views/strona4';
		// wartości przechowujące powiadomienia dla użytkowników
var notice = '';
var goodNotice ='';
		// moduł do szablonów html
var expressHbs = require('express3-handlebars');

		// wartość przechowująca lokalizacje bazy danych
var uristring =  process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||'mongodb://localhost/portal';
		// Ustawienie portu dla aplikacji //
app.set('port', (process.env.PORT || 5000));

		// Połączenie z bazą danych //
mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      notice='Nie można połączyć z bazą danych !!!';
      } else {
      console.log ('Succeeded connected to: ' + uristring);
      }
});

		// Stworzenie "szablonu" na użytkowników // 
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = mongoose.model('User', new Schema({
	email: {type: String},
	passwd: String,
	pin: String,
	name: {type: String},
	adres: String, 
	avatar: String,
	quiz: String,
	wsp1: String,
	wsp2: String,
}));

		// Stworzenie widoków //
app.engine('handlebars', expressHbs({defaultLayout:'main'}));
		// zdefiniowanie szablonu dla html
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
		// funkcja przechwytująca dane z formularza rejestracji i logowania
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
		

	// Sprawdzanie czy użytkownik jest zalogowany
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

	// funkcja optymalizująca sprawdzenie czy użytkownik jest zalogowany
function requireLogin(req,res,next){
	if(!req.user){
		res.redirect('/');
	}
	else{
		next();
	}
}


		// Routing //

		// Strona startowa
app.get('/',function(req, res){	
	if(req.user){
		res.redirect('/panel');	
	}	
	else{

		// Wyświetlenie strony startowej
		res.render(__dirname + '/views/index', {
			notice:notice,
			goodNotice:goodNotice
		});
	}	

	notice = '';	
	goodNotice ='';		 
    
  });	

function quizWynik(quiz){

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

		return {czyQuiz: czyQuiz, bad: bad, middle: middle, good:good };

}


		// Strona dostępna po zalogowaniu
app.get('/panel', requireLogin,  function(req,res){
		var wynik = quizWynik(req.session.user.quiz);
			// WYświetlenie widoku panelu dla zalogowanych
		res.render(panel, {
			avatar: req.session.user.avatar,
			email: req.session.user.email,
			result: wynik.czyQuiz,
			good: wynik.good,
			middle: wynik.middle,
			bad: wynik.bad,
			notice: notice
		});
		notice = '';
		goodNotice ='';	
})	

app.get('/strona1', requireLogin,  function(req,res){
		var wynik = quizWynik(req.session.user.quiz);
			// WYświetlenie widoku panelu dla zalogowanych
		res.render(strona1, {
			avatar: req.session.user.avatar,
			email: req.session.user.email,
			result: wynik.czyQuiz,
			good: wynik.good,
			middle: wynik.middle,
			bad: wynik.bad,
			notice: notice
		});
		notice = '';
		goodNotice ='';	
})	

app.get('/strona2', requireLogin,  function(req,res){
		var wynik = quizWynik(req.session.user.quiz);
			// WYświetlenie widoku panelu dla zalogowanych
		res.render(strona2, {
			avatar: req.session.user.avatar,
			email: req.session.user.email,
			result: wynik.czyQuiz,
			good: wynik.good,
			middle: wynik.middle,
			bad: wynik.bad,
			notice: notice
		});
		notice = '';
		goodNotice ='';	
})

app.get('/strona3', requireLogin,  function(req,res){
		var wynik = quizWynik(req.session.user.quiz);
			// WYświetlenie widoku panelu dla zalogowanych
		res.render(strona3, {
			avatar: req.session.user.avatar,
			email: req.session.user.email,
			result: wynik.czyQuiz,
			good: wynik.good,
			middle: wynik.middle,
			bad: wynik.bad,
			notice: notice
		});
		notice = '';
		goodNotice ='';	
})




		// Przesłanie do bazy wyniku quizu
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
		// Wyszukanie użytkownika, który zostanie przesunięty do danej grupy
	User.findById(req.session.user.id, function(err, doc) {
		doc.quiz = group;
		doc.save(function(err) {
			if (err) throw err;
			console.log('User successfully updated!');
		});
	});
	req.session.user.quiz = points;
	res.redirect('/panel');
});


 	// Funkcja odbierająca od klienta "Pin" do autoryzacji głosowej 
app.post('/voice', function(req,res){
	var pin = req.body.pin;

	//Wyszukanie w bazie użytkownika o podanym pinie
	User.findOne({pin: pin},function(err,user){
		if(err){
			console.log(err);
			res.redirect('/');
			notice='Spróbuj jeszcze raz :(';
		}
		if(!user){
			console.log('Nie znaleziono usera o pinie ' + pin + ' .');
			notice='Nie znaleziono usera o podanym pinie';
			res.redirect('/');
		}
		else{
				console.log("Zalogowano");
				req.session.user = user;
				res.redirect('/panel');
		}
	});	
});


		// Weryfikacja poprzez porównanie twarzy z kamerki 
app.post('/face', function(req,res){
	var name = req.body.name;
	var wsp1 = req.body.wsp1;
	var wsp2 = req.body.wsp2;

		//Pobranie proporcji twarzy 
	if(wsp1 && wsp2){
			wsp1=parseFloat(wsp1);
			wsp2=parseFloat(wsp2);
			wsp1=wsp1*10000;
			wsp1=Math.floor(wsp1);
			wsp2=wsp2*10000;
			wsp2=Math.floor(wsp2);
	}
	else{
			console.log('Nie da rady');
			res.redirect('/');		
	}

		// Wyszukanie w bazie użytkownika o podanej nazwie
	User.findOne({name: name},function(err,user){
		if(err){
			console.log(err);
			res.redirect('/');
			notice='Spróbuj jeszcze raz :(';
		}
		if(!user){
			console.log('Nie znaleziono usera o nazwie ' + name + ' .');
			notice='Nie znaleziono usera o nazwie ' + name + ' .';
			res.redirect('/');
		}
		else{
			var wsp11 = user.wsp1;
			var wsp22 = user.wsp2;
				// Sprawdzenie czy użytkownik dodał zdjęcie 
			if(!wsp11 && !wsp22){
					console.log('User nie ma fotki');
					notice='Użytkownik nie posiada zdjęcia';
					res.redirect('/');				
			}
			else{
				wsp11 = wsp11.toString();
				wsp22 = wsp22.toString();

					//Porównywanie twarzy 
				if(Math.abs(wsp11-wsp1)<200 && Math.abs(wsp22-wsp2)<200){
					console.log("Witaj " + name);
					console.log('Twoje proporcje: ' + wsp1 + ', '+ wsp2+ ' Wymagane proporcje: '+ wsp11 + ', '+ wsp22);
					req.session.user = user;
					res.redirect('/panel');
				}
				else{
					console.log('To nie Ty! Twoje proporcje: ' + wsp1 + ', '+ wsp2+ ' Wymagane proporcje: '+ wsp11  + ', '+ wsp22);
					notice='Proporcje nie zgadzają się :(';
					res.redirect('/');
				}				
			}

		}
	});

});



		// Wysłanie formularza rejestracji // 	
	
app.post('/register',function(req,res){
	if(!req.body.name || !req.body.email || !req.body.adres || !req.body.passwd || !req.body.vpasswd){
		notice='Wszystkie pola muszą być wypełnione';
		return res.redirect('/');

	}
	if(req.body.passwd!= req.body.vpasswd){
		notice='Podane hasła nie są identyczne';
		return res.redirect('/');
	}


	var wsp1 = req.body.wsp1;
	var wsp2 = req.body.wsp2;
			// Dodanie współczynników twarzy pozwalających na późniejszą weryfikację.
	if(wsp1 && wsp2){
		wsp1=parseFloat(wsp1, 10);
		wsp2=parseFloat(wsp2, 10);
		wsp1=wsp1*10000;
		wsp1=Math.floor(wsp1);
		wsp2=wsp2*10000;
		wsp2=Math.floor(wsp2);
		wsp1=wsp1.toString();
		wsp2=wsp2.toString();

			// Dodanie zdjęcia profilowego //
		var image  = req.body.avatar;
		var newName = '/upload/tmp/'+req.body.name+'.jpeg';
		fs.writeFile(__dirname +'/public'+newName, image, 'base64', function(err) {
		    if(err) {
		        return console.log(err);
		    }
			else{
			    	user.avatar = newName;
			    	console.log("The file was saved!" + newName);
			}
		});		
	}
			//zaszyfrowanie hasła//
	var hash = bcrypt.hashSync(req.body.passwd, bcrypt.genSaltSync(10));
			//Wygenerowaniu pinu do weryfikacji głosowej
	var pin = Math.floor(Math.random()*1000000);

			//Utworzenie danych dla nowego użytkownika
	var user = new User({
		email: req.body.email,
		passwd: hash,
		pin: pin,
		name: req.body.name,
		adres: req.body.adres,
		quiz: '-1',
		avatar: '..'+newName,
		wsp1: wsp1,
		wsp2: wsp2
	});


	

				// Zapisanie użytkownika w bazie //
	user.save(function (err){
		if(err){
			console.log(err)
			notice = 'Niestety, ten adres email, lub nazwa są już zajęte';
			res.redirect('/');
		}
		else{
			console.log('Zarejestrowano nowego usera: '+ req.body.name);
			goodNotice+='Zarejestrowano pomyślnie! Twój pin do autoryzacji głosowej: '+ pin +' ';
			res.redirect('/');
		}
	});
});

		// Wysłanie formularza logowania //

app.post('/login',function(req,res){
	User.findOne({name: req.body.name},function(err,user){
		if(err){
			console.log(err);
			notice='Spróbuj jeszcze raz :(';
			res.redirect('/');
		}
		if(!user){
			console.log("Nie znaleziono usera");
			notice="Nie znaleziono usera";
			res.redirect('/');
		}
		else{

			// w celach bezpieczeństwa "zahaszowanie" hasła 
 			if(bcrypt.compareSync(req.body.passwd, user.passwd)){
				console.log("Zalogowano");
				req.session.user = user;
				res.redirect('/panel');
			}
			else{
				console.log("Niepoprawne haslo");
				notice="Niepoprawne haslo";
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
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

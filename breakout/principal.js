/* Voici le kit de lancement Kaboom js pour cette journée !

Voici quelques ressources pour vous aider
La documentation de Kaboom : https://kaboomjs.com/
Des codes d'exemple : https://kaboomjs.com/play?demo=add

Kaboom dispose de plusieurs fonctions pour créer de l'alétoire !
rand(), mais aussi randi(), choose(), chance(), randSeed()...
Et il y a bien d'autres manières de provoquer de l'incertitude !

Bon codage !

Isaac Pante

*/

// l'objet Kaboom
// définissez les propriétés générales ici
kaboom({
	background: [0,0,0],
	width : 800,
	height : 800
})

let palet;
let mur = 0;

// définir un chemin racine pour les ressources
// Ctte étape est facultative, elle sert juste
// à raccourcir les chemins suivants
loadRoot("assets/")

// charger les images
loadSprite("tuile","images/tuile.png")
loadSprite("coeur","images/coeur.png")
loadSprite("bckg", "images/background/tiled.png")
loadSprite("title", "images/title.gif")
//malus
loadSprite("blueScreen","images/malus/blueScreen.png")
loadSprite("bear","images/malus/polar_bear.gif")
//bonus
loadSprite("datBoi","images/bonus/datboi.gif")
loadSprite("furret","images/bonus/furret.gif")
//tuiles
loadSprite("tuileNormale","images/tuiles/tuileNormale.png")
loadSprite("tuileMalus","images/tuiles/tuileMalus.png")

// charger les sons
loadSound("musique", "audio/nyanuwu.ogg")
loadSound("reussite", "audio/reussite.wav")
loadSound("echec", "audio/echec.wav")
//malus
loadSound("error", "audio/sfx/error.wav")
loadSound("run", "audio/sfx/run.wav")
//bonus
loadSound("datBoiAppears", "audio/sfx/datboyappears.wav")
loadSound("furretAppears", "audio/sfx/furretappears.wav")
//tuiles
loadSound("okesuka", "audio/sfx/okesuka.wav")
loadSound("mail", "audio/sfx/mail.wav")
loadSound("gnome", "audio/sfx/gnome.wav")
loadSound("woah", "audio/sfx/woah.wav")

// déclaration d'une scène
// les scènes découpent le jeu
scene("accueil", () => {
	// lancer la musique
	const musique = play("musique")
	add([
		sprite("bckg"),
		pos(0,0),
	]);

	add([
		sprite("title"),
		origin("center"),
		pos(width()/2, 300),
	]);

	add([
		// créer un objet texte
		// le second paramètre permet de modifier son style
		text("Appuyez sur la barre d'espace pour jouer !",{
			width : 600
		}),
		// placer le point d'accroche au centre
		origin("center"),
		// placer le texte au centre
		pos(width()/2,600),
	]);


	// ajout d'un événement pour lancer l'autre scène
	onKeyPress("space",() =>{
		// charger la scène "jeu"
		go("jeu")
		musique.stop()
	})
})

// Définir la fonction deplacerPalette
function deplacerPalette(mur) {
	console.log("deplacerPalette activé");
	// Si pair, murs horizontaux
	if (mur%2 == 0) {
		// Dessiner la palette pour qu'elle soit horizontale
			palet.width = 120;
			palet.height = 20;

		// la placer en haut si x=2 et en bas si x=0
		if (mur == 2) {
			palet.pos = (vec2(width()/2 - 40, height() - 760));
		} else {
			palet.pos = (vec2(width()/2 - 40, height()-40));
		};
	// Si impair, murs verticaux
	} else if (mur%2 == 1){
		// Dessinner la palette verticalement
			palet.width = 20;
			palet.height = 120;

		// la placer à gauche si x=1 et droite si x=2
		if (mur == 1) {
			palet.pos = (vec2(width()-760, height()/2 - 40));
		} else {
			palet.pos = (vec2(width()-40, height()/2 - 40));
		}
	}
	// Retourner la valeur dur mur (entre 0 et 3)
	console.log("Position: ", palet.pos, "Mur: ", mur);
	return(mur);
}

// déclaration de la scène de jeu
scene("jeu",() => {
	add([
		sprite("bckg"),
		pos(0,0),
	]);
	// initialisation des variables globales
	// score à zéro et vies à 3
	let score = 0
	let vies = 3
	let vitesse = 800;
	// dessiner un niveau
	addLevel([
		"========",
		"==x=====",
		"==x=====",
		"======x=",
		"========",
		"========",
		"=xxx=x==",
		"========",
	], {
		// définir la taille de chaque élément
		width : 50,
		height : 50,
		// définir où positionner le début de la grille
		pos : vec2(200, 200),
		// associer chaque symbole à un composant
		"=" : () => [
			// joindre le sprite
			sprite("tuileNormale"),
			scale(.33),
			// donner une hitbox
			area(),
			// rendre l'élément réactif aux collisions
			solid(),
			// lui donner un identifiant
			// pour les interactions à venir
			"brique"
		],
		"x" : () => [
			sprite("tuileMalus"),
			scale(.33),
			area(),
			solid(),
			// ici on utilise deux identifiants
			// pour associer deux comportements
			// distincts
			"brique",
			"special"
		]
	})
	// le palet
	palet = add([
		pos(vec2(width()/2, height()-40)),
		rect(120, 20),
		outline(4),
		origin("center"),
		area(),
		"paddle",
	])

	// le texte pour le score
	add([
		text(score,{
			font : "sink",
			size : 48
		}),
		pos(100,100),
		origin("center"),
		z(50),
		// lier le texte au score
		// et le faire évoluer en fonction
		{update(){ this.text = score }}
		// notez que ce bloc est un simple objet
		// ajouter à notre composant de score
	])

	// vérifier le mouvement du paddle 60 fois par
	// seconde et y associer le mouvement de la souris
	onUpdate("paddle", (p) => {
		if (mur%2 == 0) {
		p.pos.x = mousePos().x
		} else {
		p.pos.y = mousePos().y
		}
	})

	// ajouter la balle
	const ball = add([
		pos(width()/2,height()-55),
		// créer un cercle de rayon 16
		circle(16),
		outline(4),
		area({
			width: 32,
			height: 32,
			offset: vec2(-16)
		}),
		{
			// dir extrait le vecteur de direction
			// à partir d'un angle donné
			velocite: dir(rand(-60,-40))
			// notez que nous définissons velocite ici
			// il n'appartient pas au langage
		},
	])

	// dès que la balle "change"
	// on effectue un certain nombre de tests
	ball.onUpdate(() => {
		if (mur == 0) {
			// déplacer la balle
			ball.move(ball.velocite.scale(vitesse))
			// gérer les rebonds sur les murs latéraux...
			if (ball.pos.x < 0 || ball.pos.x > width()) {
				// et renvoyer la balle
				ball.velocite.x = -ball.velocite.x
			}
			// si la balle tape au sommet...
			if(ball.pos.y < 0){
				// elle repart dans l'autre sens
				ball.velocite.y = -ball.velocite.y
			}
			// gérer le cas où la balle sort par le bas
			if (ball.pos.y > height()+60) {
				// secouer l'écran
				shake(30)
				play("echec")
				// réinitialiser la balle, sa vitesse, etc.
				ball.pos.x = width()/2
				ball.pos.y = height()-55
				vitesse = 320
				ball.velocite = dir(rand(220,290))
				// diminuer les vies
				vies--
				// s'il n'y en a plus...
				if(vies==0){
					// appel de la scène d'échec
					// et passage d'un paramètre qui sera récupéré
					// dans cette scène
					go("ohno",{score : score})
				}
			}
		} else if (mur == 1) {
			// déplacer la balle
			ball.move(ball.velocite.scale(vitesse))
			// gérer les rebonds sur le mur droit (3)...
			if (ball.pos.x > width()) {
				// et renvoyer la balle
				ball.velocite.x = -ball.velocite.x
			}
			// si la balle tape en bas ou en haut...
			if(ball.pos.y > width() || ball.pos.y < 0){
				// elle repart dans l'autre sens
				ball.velocite.y = -ball.velocite.y
			}
			// gérer le cas où la balle sort par la droite
			if (ball.pos.x < -60) {
				// secouer l'écran
				shake(30)
				play("echec")
				// réinitialiser la balle, sa vitesse, etc.
				ball.pos.x = width()/2
				ball.pos.y = height()-55
				vitesse = 320
				ball.velocite = dir(rand(220,290))
				// diminuer les vies
				vies--
				// s'il n'y en a plus...
				if(vies==0){
					// appel de la scène d'échec
					// et passage d'un paramètre qui sera récupéré
					// dans cette scène
					go("ohno",{score : score})
				}
			}
		} else if (mur == 2) {
			// déplacer la balle
			ball.move(ball.velocite.scale(vitesse))
			// gérer les rebonds sur les murs latéraux...
			if (ball.pos.x < 0 || ball.pos.x > width()) {
				// et renvoyer la balle
				ball.velocite.x = -ball.velocite.x
			}
			// si la balle tape en bas...
			if(ball.pos.y > height()){
				// elle repart dans l'autre sens
				ball.velocite.y = -ball.velocite.y
			}
			// gérer le cas où la balle sort par le haut
			if (ball.pos.y < -60) {
				// secouer l'écran
				shake(30)
				play("echec")
				// réinitialiser la balle, sa vitesse, etc.
				ball.pos.x = width()/2
				ball.pos.y = height()-55
				vitesse = 320
				ball.velocite = dir(rand(220,290))
				// diminuer les vies
				vies--
				// s'il n'y en a plus...
				if(vies==0){
					// appel de la scène d'échec
					// et passage d'un paramètre qui sera récupéré
					// dans cette scène
					go("ohno",{score : score})
				}
			}
		} else if (mur == 3) {
			// déplacer la balle
			ball.move(ball.velocite.scale(vitesse))
			// gérer les rebonds sur le mur gauche (1)...
			if (ball.pos.x < 0) {
				// et renvoyer la balle
				ball.velocite.x = -ball.velocite.x
			}
			// si la balle tape en bas ou en haut...
			if(ball.pos.y > height() || ball.pos.y < 0){
				// elle repart dans l'autre sens
				ball.velocite.y = -ball.velocite.y
			}
			// gérer le cas où la balle sort par la droite
			if (ball.pos.x > width()) {
				// secouer l'écran
				shake(30)
				play("echec")
				// réinitialiser la balle, sa vitesse, etc.
				ball.pos.x = width()/2
				ball.pos.y = height()-55
				vitesse = 320
				ball.velocite = dir(rand(220,290))
				// diminuer les vies
				vies--
				// s'il n'y en a plus...
				if(vies==0){
					// appel de la scène d'échec
					// et passage d'un paramètre qui sera récupéré
					// dans cette scène
					go("ohno",{score : score})
				}
			}
		}
	})

	// gérer les collisions
	// avec le paddle
	let compteur = 0;
	ball.onCollide("paddle", (p) => {
		vitesse += 60
		// renvoyer la balle avec le bon angle
		ball.velocite = dir(ball.pos.angle(p.pos));
		
		compteur+=1;
		console.log("compteur =", compteur);
		// Si la balle a touché deux fois la palette
		if (compteur == 2) {
			// Générer un nombre entre 0 et 3
			mur = randi(0, 4);
			// appeler la fonction de changement de mur avec ce chiffre
			deplacerPalette(mur);
			// réinitialiser le compteur
			compteur = 0;
		};
		
	})

	// avec tous les types de briques
	// grâce à l'identifiant "brique"
	ball.onCollide("brique", (b) => {
		console.log("ball.onCollide brique");
		let sfx = randi(0,4)
		switch(sfx){
			case 0:
				play("okesuka");
				break;
			case 1:
				play("mail");
				break;
			case 2:
				play("gnome");
				break;
			case 3:
				play("woah");
				break;
		}
		b.destroy()
		// augmenter le score
		score++
		ball.velocite = dir(ball.pos.angle(b.pos))
	})
	// avec les briques spéciales
	// grâce à l'identifiant "special"
	ball.onCollide("special", (b) => {
		console.log("ball.onCollide special");
		let malus = randi(0,2)
		switch(malus){
			case 0:
				running = 1;
				errorScreen = blueScreenOfDeathSpawn()
				wait(.5, () => kill(errorScreen))
				break;
			case 1:
				running = 1;
				bear = polarBearSpawn();
				wait(.5, () => kill(bear));
				break;
		}
		b.destroy()
		/* // Kaboom ne gère que le rgb, mais des fonctions
		// de conversions nous permettent d'utiliser du hsl !
		palet.color = hsl2rgb((time() * 0.2 + 1 * 0.1) % 1, 0.7, 0.8)
		// transformer aléatoirement la taille du palet
		palet.width = randi(50,200)
		palet.height = randi(20,100)
		ball.velocite = dir(ball.pos.angle(b.pos)) */
	})
})

function blueScreenOfDeathSpawn(){
	console.log('oh no a blue screen');
	play("error");

	const errorScreen = add([
			sprite("blueScreen"),
			origin("center"),
			pos(width()/2,height()/2),
			scale(.2),
		])

	return errorScreen;
}

function polarBearSpawn(){
	console.log('chased by a polar bear');
	play("run");

	const bear = add([
			sprite("bear"),
			origin("center"),
			pos(width()/2,height()/2),
			scale(2.5),
		])

	return bear;
}

function kill(object){
	console.log('destroying object');
	object.destroy();
	return 0;
}

function moveBonus(bonusObj, wall){
	/* wall numbering:
	 _____2____
	|          |
	1          3
	|          |
	 _____0____  
	*/
	switch(wall){
		case 0:
			break;
		case 1:
			break;
		case 2:
			break;
		case 3:
			break;
	}
}

// déclaration de la scène d'échec
scene("ohno", ({score}) => {
	add([
		text(`Vous avez perdu... \net fait ${score} points !`, {width : width()}),
		origin("center"),
		pos(center()),
	]);
	onKeyPress("space",() =>{
		mur = 0;
		go("accueil")
	})
})

// lancer le jeu
go('accueil');

/* Voilà, vous êtes au bout de la lecture de ce script !
A ce stade, je vous recommande de survoler l'entier
de la documentation Kaboom (elle est courte !).
Cela vous donnera un bon aperçu du système.

Et ensuite, pourquoi ne pas commencer par afficher les vies ?
D'ailleurs, une image "coeur.png" vous attend dans les assets.

Et ensuite, vous pourrez vous attacher aux conditions de victoire,
en faisant la part belle à l'incertitude !

*/
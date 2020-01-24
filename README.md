# TP MIF15 - alias MifMap

#### Binôme

* Yannis Hutt 
* Kévin Sadecki 


# Préambule

L'objectif de ce tp était de nous familiariser avec les technologies du web en JavaScript.
Ce tp nous a ammené à réaliser un "Shooter". A tour de rôle, les joureurs doivent essayer de se "tirer" dessus.

## Routes

Notre application comporte différentes routes : 

*  "/" qui est notre page d'accueil.
*  "/Game" qui est la page de déroulement du jeu.
*  "/Admin" qui est la page d'administration.

> Nous expliquerons par la suite comment sont composées les pages de chacune des routes.


## Composants 

L'application est composée de 3 grands composants.

*  L'Accueil permettant à un utilisateur ou un administrateur de se connecter.
*  Le Jeu affichant le Menu, le Minuteur, le Formulaire de jeu, et la Carte.
*  L'Admin affichant une console où les 20 derniers logs du serveur apparaissent et un bouton affichant un formulaire pour envoyer un message à l'ensemble des joueurs.

# Composition des routes

### /

L'accueil est composé du formulaire d'inscription.
Ce dernier se caractérise par un formulaire simple de 2 champs. Le premier pour le pseudo et le second pour l'image.

### /Game

Le jeu est la partie la plus complexe.
Elle est composé du composant Jeu qui, comme nous l'avons expliqué, affiche les composants Menu, Minuteur, Formulaire de jeu et la carte :

- Le Menu est un ensemble de `<li>` faisant appel au router de Vue pour rediriger sur les différentes pages de l'application.
- Le Minuteur affiche l'image (qui d'ailleurs est remplacée si jamais l'url d'image saisie est invalide) et le pseudo du joueur, mais aussi les différents messages s'affichant à l'utilisateur et le minuteur lorsque c'est au joueur de jouer
- Le Formulaire de jeu qui est un formulaire permettant d'attaquer via le bouton "attaquer". La valeur des champs peut être changer à la main, ou en cliquant directement sur la carte.
- La Carte qui est aussi basique qu'aux précédents TP. L'adresse postale où se situe le joueur n'est pas en bas de l'écran mais en bas à gauche de la Carte.

### /Admin

La partie Admin est plus simple que le jeu. Elle permet à quiconque qui se connecte sans image lors de l'inscription de devenir administrateur.
Elle est composée du Menu, et du composant Admin qui celui ci se découpe en 2 parties : La console et le formulaire de message.

- La Console remontera les 20 derniers logs du serveur (Qui s'est connecté et s'il est joueur ou administrateur, les tirs, les distances, qui se déconnecte, et les messages envoyés par le formulaires de messages ...)
- Le formulaire de message permet d'envoyer un message à tous les joueurs qui restera affiché 10 secondes puis disparaitra.

## Arborescence des fichiers de l'application

```

.
├── dist ---------------------------------------> Dossier exposé par le serveur
│   ├── favicon.ico ----------------------------> Favicon inutile mais qui supprime une erreur de Leaflet connue
│   ├── index.html -----------------------------> Fichier HTML qui représente la base de notre application
├── package.json -------------------------------> Fichier permettant à npm d'installer toutes les dépendances du projet
├── package-lock.json --------------------------> Autre fichier permettant à npm d'installer les dépendances
├── README.md ----------------------------------> Ce fichier
├── src ----------------------------------------> Dossier des sources
│   ├── assets ---------------------------------> Dossier d'inclusions des ressources statiques et nécessaires au projet
│   │   └── img --------------------------------> Dossier d'images
│   │       ├── bgsm.jpg
│   │       └── wp.jpg
│   │   └── markers ----------------------------> Dossier des marqueurs customs pour la carte
│   │       ├── blackMarker.svg
│   │       ├── blueMarker.svg
│   │       ├── greenMarker.svg
│   │       └── redMarker.svg
│   ├── css ------------------------------------> Dossier contenant les CSS propre au projet
│   │   └── style.css --------------------------> Fichier CSS du projet
│   └── js -------------------------------------> Dossier contenant les sources JavaScript Client et Serveur
│       ├── client -----------------------------> Dossier des sources JavaScript côté Client
│       │   ├── components ---------------------> Dossier des composants Vue
│       │   │   ├── accueil.js -----------------> Composant de la page d'accueil ( / )
│       │   │   ├── admin.js -------------------> Composant de la page d'administration ( /Admin )
│       │   │   ├── carte.js -------------------> Composant affichant la carte utilisée sur l'interface de jeu
│       │   │   ├── formulaireGame.js ----------> Composant affichant un formulaire permettant de saisir manuellement les coordonnées sur lesquelles le joueur souhaite tirer et fait appel au composant Minuteur
│       │   │   ├── formulaireInscription.js ---> Composant affichant le formulaire de la page d'accueil permettant de se connecter
│       │   │   ├── jeu.js ---------------------> Composant de la page de jeu ( /Game )
│       │   │   ├── menu.js --------------------> Composant affichant le menu sur les pages de jeu et d'administration
│       │   │   └── minuteur.js ----------------> Composant affichant l'image choisie par le joueur, son pseudo et les différents messages du jeu (temps restant pour jouer, message d'admin etc ...)
│       │   ├── includes -----------------------> Dossier contenant les fichiers JavaScript utile à l'ensemble de l'application
│       │   │   ├── constants.js ---------------> Fichier contenant les valeurs statiques au jeu comme les routes, ou encore les fonctions pratiques
│       │   │   ├── Modernizr.js ---------------> Fichier de Modernizr permettant de tester les différentes fonctionnalités accessibles selon le support
│       │   │   ├── Modernizr.notmin.js --------> Même fichier mais non minimifié
│       │   │   └── socket.js ------------------> Fichier contenant tous les évènements liés aux WebSockets
│       │   ├── index.js -----------------------> Fichier initialisant l'application, c'est le point d'entrée du code.
│       │   ├── router -------------------------> Dossier contenant le router de Vue
│       │   │   └── router.js
│       │   └── store --------------------------> Dossier contenant le store de Vue
│       │       └── store.js
│       └── serveur ----------------------------> Dossier contenant les codes côté Serveur
│           ├── model --------------------------> Dossier contenant tous les modèles utilisés (Utilisateur, Position et Application)
│           │   ├── application.js -------------> Fichier décrivant la logique métier de l'application 
│           │   ├── position.js ----------------> Fichier décrivant une Position
│           │   └── utilisateur.js -------------> Fichier décrivant un Utilisateur
│           ├── serveur.js ---------------------> Fichier permettant de lancer le serveur
│           └── utils --------------------------> Dossiers contenant les fichier JavaScript utiles au Serveur
│               └── timer.js -------------------> Fichier contenant la fonction de Timer pour savoir lorsqu'un utlisateur est déconnecté
└── webpack.config.js --------------------------> Fichier de configuration de WebPack


```

# Installation


Executez la commande suivante :

``` git clone https://forge.univ-lyon1.fr/p1408376/dev-web-mobile.git ```

Ce qui clonera ce projet dans le dossier courant.

Puis : 

``` npm install ``` 

Afin d'installer toutes les dépendances du projets.


Et enfin : 


``` node src/js/serveur/serveur.js ```

Afin de lancer le serveur.


# Mode de jeu 

Lorsque vous vous connectez sur l'application 2 choix s'offrent à vous : Jouer ou Administrer.

Pour jouer il vous suffit de vous connecter avec un pesudo et une url d'image et d'attendre que le joueur adverse soit connecté et la partie se lance.
Le premier connecté commence. Vous pourrez alors à tour de rôle essayer de tirer sur l'adversaire via la Carte.
Sur la Carte s'affichera lors du jeu votre position en bleue. Le dernier tir de l'ennemi s'il vous a raté en rouge et l'ensemble de vos essais en noir.
Vous aurez toutes fois accès à l'onglet d'administration vous permettant de voir les 20 derniers logs également et d'envoyer un message à votre adversaire. La position de votre adversaire apparaitra en adresse postale et non en coordonnées. (Mais ce n'est pas une raison pour tricher avec ;))


Pour administrer, il vous suffit de vous connecter sans saisir d'image.
Vous ne serez pas rediriger vers le jeu mais vers l'onglet d'aministration et s'affichera la console.
Sur la console vous pourrez voir les 20 dernières actions réalisées dans le jeu et via le bouton "Changer de vue" saisir un message d'un maximum de 500 caractères à l'ensemble des joueurs, comme le fait de devoir retourner à Nautibus.
Si depuis le menu, vous allez dans l'onglet de jeu. Vous verrez alors les 2 joueurs et leurs derniers essais respectifs. En passant votre souris sur les marqueurs, vous aurez plus de détails sur ce que représentent les marqueurs.


Amusez vous bien sur l'application de chasse humaine !
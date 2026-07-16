/*====================================================
 AIGLE ROYAL MANAGEMENT SYSTEM
 DASHBOARD JAVASCRIPT
 PARTIE 1/3
====================================================*/



// ============================================
// DATE ET HEURE AUTOMATIQUE
// ============================================


function updateDate(){


const dateElement = document.getElementById("date");


if(dateElement){


const now = new Date();


const options = {

weekday:"long",

year:"numeric",

month:"long",

day:"numeric"

};



dateElement.innerHTML = now.toLocaleDateString(
"fr-FR",
options
);


}


}



updateDate();






// ============================================
// MENU MOBILE
// ============================================


const menuToggle = document.querySelector(".menu-toggle");

const sidebar = document.querySelector(".sidebar");



if(menuToggle){


menuToggle.addEventListener(
"click",
()=>{


sidebar.classList.toggle("active");


}

);


}







// ============================================
// FERMER MENU APRÈS CLIC MOBILE
// ============================================


const menuLinks = document.querySelectorAll(
".sidebar nav a"
);



menuLinks.forEach(link=>{


link.addEventListener(
"click",
()=>{


if(window.innerWidth < 900){


sidebar.classList.remove("active");


}


});


});







// ============================================
// HORLOGE TEMPS RÉEL
// ============================================


function clock(){


const now = new Date();



const time =

now.toLocaleTimeString(
"fr-FR"
);



const clockElement =
document.getElementById("clock");



if(clockElement){


clockElement.innerHTML = time;


}


}



setInterval(clock,1000);
/*====================================================
        GRAPHIQUES DASHBOARD
        PARTIE 2/3
====================================================*/



// ============================================
// GRAPHIQUE DES PRESENCES
// ============================================


const presenceCanvas = document.getElementById(
"presenceChart"
);



if(presenceCanvas){



const presenceChart = new Chart(

presenceCanvas,

{


type:"line",



data:{


labels:[

"Lundi",

"Mardi",

"Mercredi",

"Jeudi",

"Vendredi",

"Samedi",

"Dimanche"

],



datasets:[{


label:"Présences",

data:[

75,

82,

90,

68,

95,

88,

98

],



borderWidth:3,

tension:.4,

fill:true



}]



},




options:{


responsive:true,


plugins:{


legend:{


labels:{


color:"white"


}


}


},



scales:{


x:{


ticks:{


color:"white"


}


},



y:{


ticks:{


color:"white"


}


}



}



}



}


);




}









// ============================================
// GRAPHIQUE DEPARTEMENTS
// ============================================


const departmentCanvas = document.getElementById(
"departmentChart"
);



if(departmentCanvas){



const departmentChart = new Chart(

departmentCanvas,

{


type:"doughnut",



data:{


labels:[

"Secrétariat",

"Médias",

"Musiciens",

"Artistes",

"Production"

],



datasets:[{


data:[

12,

18,

25,

20,

10

],



borderWidth:2



}]



},





options:{


responsive:true,


plugins:{


legend:{


position:"bottom",


labels:{


color:"white"


}


}


}



}



}

);



}










// ============================================
// COMPTEUR ANIME DES STATISTIQUES
// ============================================



const counters =
document.querySelectorAll(
".stat-card h2"
);



counters.forEach(counter=>{


let target =
parseInt(counter.innerText);



let current = 0;



const speed = target / 80;



function update(){



if(current < target){


current += speed;


counter.innerText =
Math.ceil(current);



setTimeout(
update,
20
);


}

else{


counter.innerText = target;


}



}



update();



});
/*====================================================
        FONCTIONS SYSTEME
        PARTIE 3/3
====================================================*/



// ============================================
// NOTIFICATIONS
// ============================================


const notificationButton = document.querySelector(
".notification"
);



if(notificationButton){


notificationButton.addEventListener(
"click",
()=>{


alert(

"Vous avez 5 nouvelles notifications"

);


}

);


}







// ============================================
// MESSAGES
// ============================================


const messageButton = document.querySelector(
".message"
);



if(messageButton){


messageButton.addEventListener(
"click",
()=>{


alert(

"Vous avez 3 nouveaux messages"

);


}

);


}








// ============================================
// RECHERCHE DANS LE DASHBOARD
// ============================================



const searchInput =
document.querySelector(
".search-box input"
);



if(searchInput){


searchInput.addEventListener(
"keyup",
function(){



let value =
this.value.toLowerCase();



const rows =
document.querySelectorAll(
"table tbody tr"
);



rows.forEach(row=>{


let text =
row.innerText.toLowerCase();



if(text.includes(value)){


row.style.display="";

}


else{


row.style.display="none";


}



});



}

);


}








// ============================================
// ANIMATION DES PANELS AU SCROLL
// ============================================



const panels =
document.querySelectorAll(
".panel, .stat-card, .department"
);



const observer =
new IntersectionObserver(

(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.classList.add(
"show"
);


}


});


},

{

threshold:.15

}



);





panels.forEach(panel=>{


observer.observe(panel);


});








// ============================================
// VERIFICATION SESSION UTILISATEUR
// PREPARATION FIREBASE
// ============================================



function checkUser(){



const user = {

name:
"IGUNDA BENEDICTION",


role:
"Administrateur"



};




console.log(

"Utilisateur connecté :",

user.name,

"-",

user.role


);



}



checkUser();







// ============================================
// MESSAGE SYSTEME
// ============================================


console.log(

"AIGLE ROYAL MANAGEMENT SYSTEM chargé avec succès"

);
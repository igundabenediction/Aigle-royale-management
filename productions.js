/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE 12
 PRODUCTIONS MUSICALES
 JAVASCRIPT PARTIE 1/5
 INITIALISATION FIREBASE
====================================================*/



//==============================================
// IMPORT FIREBASE
//==============================================


import {


collection,


addDoc,


getDocs,


onSnapshot,


doc,


getDoc,


updateDoc,


deleteDoc,


serverTimestamp



}

from


"https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";






import {


ref,


uploadBytes,


getDownloadURL



}

from


"https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";









//==============================================
// VARIABLES GLOBALES
//==============================================


const db = window.firebaseDB;


const storage = window.firebaseStorage;







const productionsCollection =

collection(

db,

"productions"

);







const artistsCollection =

collection(

db,

"artists"

);








let productions=[];


let artists=[];


let editingProduction=null;


let currentProduction=null;









// ELEMENTS HTML


const productionsGrid =

document.getElementById(

"productionsGrid"

);







const productionModal =

document.getElementById(

"productionModal"

);







const detailsModal =

document.getElementById(

"productionDetailsModal"

);







const productionForm =

document.getElementById(

"productionForm"

);









//==============================================
// INITIALISATION
//==============================================


window.addEventListener(

"DOMContentLoaded",

()=>{



loadArtists();



loadProductions();



setupEvents();



});









//==============================================
// EVENEMENTS GENERAUX
//==============================================


function setupEvents(){





// OUVRIR MODAL



document

.querySelector(

".new-production-btn"

)

.addEventListener(

"click",

()=>{



editingProduction=null;


productionForm.reset();


openProductionModal();



});








// FERMER MODAL



document

.getElementById(

"closeProductionModal"

)

.addEventListener(

"click",

closeProductionModal

);








document

.getElementById(

"cancelProduction"

)

.addEventListener(

"click",

closeProductionModal

);








// FERMER DETAIL



document

.getElementById(

"closeProductionDetails"

)

.addEventListener(

"click",

()=>{


detailsModal.classList.remove(

"active"

);



});






}









//==============================================
// OUVERTURE / FERMETURE MODAL
//==============================================


function openProductionModal(){



productionModal.classList.add(

"active"

);



}







function closeProductionModal(){



productionModal.classList.remove(

"active"

);



productionForm.reset();


editingProduction=null;



}








//==============================================
// NOTIFICATION
//==============================================


function showNotification(

message,

type="success"

){



const box =

document.createElement(

"div"

);





box.className=

"notification "+type;






box.innerHTML=`

<i class="fa fa-bell"></i>

${message}

`;







document.body.appendChild(box);








setTimeout(()=>{


box.remove();


},4000);



}
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE 12
 PRODUCTIONS MUSICALES
 JAVASCRIPT PARTIE 2/5
 CREATION + UPLOAD + FIRESTORE
====================================================*/



//==============================================
// CHARGER LES ARTISTES
//==============================================


async function loadArtists(){



try{



const snapshot =

await getDocs(

artistsCollection

);





artists=[];






snapshot.forEach((item)=>{



artists.push({



id:item.id,


...item.data()



});



});







fillArtistSelect();



}

catch(error){



console.error(error);



showNotification(

"Erreur chargement artistes",

"error"

);



}



}









//==============================================
// REMPLIR SELECT ARTISTE
//==============================================


function fillArtistSelect(){



const select =

document.getElementById(

"productionArtist"

);







select.innerHTML=`

<option>

Sélectionner un artiste

</option>

`;







artists.forEach((artist)=>{



select.innerHTML +=`



<option value="${artist.id}">

${artist.name}

</option>



`;



});



}









//==============================================
// FORMULAIRE SUBMIT
//==============================================


productionForm.addEventListener(

"submit",

async(e)=>{



e.preventDefault();







try{





const coverFile =

document.getElementById(

"productionCover"

)

.files[0];







const audioFile =

document.getElementById(

"productionAudio"

)

.files[0];







let coverURL="";


let audioURL="";








// UPLOAD COVER


if(coverFile){



coverURL =

await uploadFile(

coverFile,

"covers"

);



}








// UPLOAD AUDIO


if(audioFile){



audioURL =

await uploadFile(

audioFile,

"audio"

);



}








const productionData={





title:

document.getElementById(

"productionTitle"

)

.value,







artistId:

document.getElementById(

"productionArtist"

)

.value,







type:

document.getElementById(

"productionType"

)

.value,







status:

document.getElementById(

"productionStatus"

)

.value,







studio:

document.getElementById(

"studioName"

)

.value,







producer:

document.getElementById(

"producerName"

)

.value,







engineer:

document.getElementById(

"soundEngineer"

)

.value,







arranger:

document.getElementById(

"arrangerName"

)

.value,







budget:

Number(

document.getElementById(

"productionBudget"

)

.value

),







expenses:{





studio:

Number(

document.getElementById(

"studioCost"

)

.value

),





mix:

Number(

document.getElementById(

"mixCost"

)

.value

),





promotion:

Number(

document.getElementById(

"promotionCost"

)

.value

)



},







releaseDate:

document.getElementById(

"releaseDate"

)

.value,







description:

document.getElementById(

"productionDescription"

)

.value,







cover:

coverURL,







audio:

audioURL,







createdAt:

serverTimestamp()



};











// MODIFICATION



if(editingProduction){



await updateDoc(

doc(

db,

"productions",

editingProduction

),

productionData

);







showNotification(

"Production modifiée"

);



}







// NOUVELLE PRODUCTION



else{



await addDoc(

productionsCollection,

productionData

);







showNotification(

"Production enregistrée"

);



}








closeProductionModal();






}

catch(error){



console.error(error);



showNotification(

"Erreur enregistrement production",

"error"

);



}



});









//==============================================
// UPLOAD FIREBASE STORAGE
//==============================================


async function uploadFile(

file,

folder

){



const fileRef =

ref(

storage,

`productions/${folder}/${Date.now()}-${file.name}`

);







await uploadBytes(

fileRef,

file

);







return await getDownloadURL(

fileRef

);



}
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE 12
 PRODUCTIONS MUSICALES
 JAVASCRIPT PARTIE 3/5
 AFFICHAGE + FILTRES + STATISTIQUES
====================================================*/



//==============================================
// CHARGER LES PRODUCTIONS
//==============================================


function loadProductions(){



onSnapshot(

productionsCollection,

(snapshot)=>{



productions=[];






snapshot.forEach((item)=>{



productions.push({



id:item.id,

...item.data()



});



});







renderProductions(productions);



updateProductionStats();



});



}









//==============================================
// AFFICHAGE DES PRODUCTIONS
//==============================================


function renderProductions(data){



productionsGrid.innerHTML="";







if(data.length===0){



productionsGrid.innerHTML=`



<div class="empty-productions">



<i class="fa fa-music"></i>



<h3>

Aucune production

</h3>



<p>

Créez votre premier projet musical

</p>



</div>



`;



return;



}








data.forEach((production)=>{





const artist =

artists.find(

a=>a.id===production.artistId

);







const card =

document.createElement(

"div"

);






card.className=

"production-project";







card.innerHTML=`



<div class="production-cover">



<img src="${production.cover || '../assets/images/default-cover.jpg'}"

class="production-image">





<span class="production-status">


${production.status}


</span>



</div>







<div class="production-content">






<h3 class="production-title">


${production.title}


</h3>







<p class="production-artist">


<i class="fa fa-user"></i>


${artist?.name || "Artiste inconnu"}


</p>







<div class="production-meta">



<div>


<i class="fa fa-music"></i>


${production.type}


</div>






<div>


<i class="fa fa-calendar"></i>


${production.releaseDate || "-"}


</div>



</div>








<div class="progress-header">



<span>

Progression

</span>




<strong>

${calculateProgress(production.status)}%

</strong>



</div>







<div class="progress-bar">


<div class="progress-value"

style="width:${calculateProgress(production.status)}%">

</div>

</div>







<div class="production-actions">





<button

class="view-production"

data-id="${production.id}">


<i class="fa fa-eye"></i>


</button>






<button

class="edit-production"

data-id="${production.id}">


<i class="fa fa-edit"></i>


</button>






<button

class="delete-production"

data-id="${production.id}">


<i class="fa fa-trash"></i>


</button>





</div>







</div>



`;







productionsGrid.appendChild(card);



});



}









//==============================================
// PROGRESSION AUTOMATIQUE
//==============================================


function calculateProgress(status){



const steps={



"Composition":20,


"Enregistrement":40,


"Mixage":60,


"Mastering":80,


"Terminée":100,


"Publiée":100



};






return steps[status] || 0;



}









//==============================================
// STATISTIQUES
//==============================================


function updateProductionStats(){



document.getElementById(

"totalProductions"

).textContent =

productions.length;







document.getElementById(

"activeProductions"

).textContent =



productions.filter(

p=>

p.status !== "Terminée"

&&

p.status !== "Publiée"

).length;







document.getElementById(

"finishedProductions"

).textContent =



productions.filter(

p=>

p.status==="Terminée"

||

p.status==="Publiée"

).length;







const budget =

productions.reduce(

(sum,p)=>

sum+

Number(p.budget || 0),

0

);








document.getElementById(

"totalProductionBudget"

).textContent =

budget+" $";







document.getElementById(

"plannedReleases"

).textContent =



productions.filter(

p=>

p.releaseDate

).length;



}









//==============================================
// RECHERCHE
//==============================================


document

.getElementById(

"searchProduction"

)

.addEventListener(

"input",

filterProductions

);









//==============================================
// FILTRES
//==============================================


document

.getElementById(

"filterProductionStatus"

)

.addEventListener(

"change",

filterProductions

);







document

.getElementById(

"filterProductionType"

)

.addEventListener(

"change",

filterProductions

);









function filterProductions(){



const search =

document.getElementById(

"searchProduction"

)

.value

.toLowerCase();







const status =

document.getElementById(

"filterProductionStatus"

)

.value;







const type =

document.getElementById(

"filterProductionType"

)

.value;







const result =

productions.filter((p)=>{





const artist =

artists.find(

a=>a.id===p.artistId

);







const matchSearch =



p.title

.toLowerCase()

.includes(search)

||

artist?.name

.toLowerCase()

.includes(search);







const matchStatus =



status==="all"

||

p.status===status;







const matchType =



type==="all"

||

p.type===type;







return

matchSearch

&&

matchStatus

&&

matchType;



});







renderProductions(result);



}
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE 12
 PRODUCTIONS MUSICALES
 JAVASCRIPT PARTIE 4/5
 DETAIL + MODIFICATION + SUPPRESSION
====================================================*/



//==============================================
// ACTIONS SUR LES CARTES PRODUCTIONS
//==============================================


document.addEventListener(

"click",

async(e)=>{





const button =

e.target.closest("button");






if(!button)

return;






const id =

button.dataset.id;







if(!id)

return;









// VOIR DETAIL


if(

button.classList.contains(

"view-production"

)

){



showProductionDetails(id);



}









// MODIFIER


if(

button.classList.contains(

"edit-production"

)

){



editProduction(id);



}









// SUPPRIMER


if(

button.classList.contains(

"delete-production"

)

){



deleteProduction(id);



}



});









//==============================================
// AFFICHER DETAIL
//==============================================


function showProductionDetails(id){



const production =

productions.find(

p=>p.id===id

);






if(!production)

return;







currentProduction = production;







const artist =

artists.find(

a=>a.id===production.artistId

);








document.getElementById(

"detailProductionTitle"

).textContent =

production.title;








document.getElementById(

"detailProductionArtist"

).textContent =

artist?.name || "-";








document.getElementById(

"detailProductionType"

).textContent =

production.type;








document.getElementById(

"detailProductionStatus"

).textContent =

production.status;








document.getElementById(

"detailStudio"

).textContent =

production.studio || "-";








document.getElementById(

"detailProducer"

).textContent =

production.producer || "-";








document.getElementById(

"detailEngineer"

).textContent =

production.engineer || "-";








document.getElementById(

"detailBudget"

).textContent =

production.budget+" $";








document.getElementById(

"detailProductionDescription"

).textContent =

production.description || "Aucune description";








detailsModal.classList.add(

"active"

);



}









//==============================================
// MODIFIER PRODUCTION
//==============================================


function editProduction(id){



const production =

productions.find(

p=>p.id===id

);







if(!production)

return;







editingProduction=id;









document.getElementById(

"productionTitle"

).value =

production.title;








document.getElementById(

"productionArtist"

).value =

production.artistId;








document.getElementById(

"productionType"

).value =

production.type;








document.getElementById(

"productionStatus"

).value =

production.status;








document.getElementById(

"studioName"

).value =

production.studio || "";








document.getElementById(

"producerName"

).value =

production.producer || "";








document.getElementById(

"soundEngineer"

).value =

production.engineer || "";








document.getElementById(

"arrangerName"

).value =

production.arranger || "";








document.getElementById(

"productionBudget"

).value =

production.budget || 0;








document.getElementById(

"studioCost"

).value =

production.expenses?.studio || 0;








document.getElementById(

"mixCost"

).value =

production.expenses?.mix || 0;








document.getElementById(

"promotionCost"

).value =

production.expenses?.promotion || 0;








document.getElementById(

"releaseDate"

).value =

production.releaseDate || "";








document.getElementById(

"productionDescription"

).value =

production.description || "";








openProductionModal();



}









//==============================================
// SUPPRESSION PRODUCTION
//==============================================


async function deleteProduction(id){



const confirmation =

confirm(

"Voulez-vous supprimer cette production ?"

);







if(!confirmation)

return;








try{



await deleteDoc(

doc(

db,

"productions",

id

)

);








showNotification(

"Production supprimée"

);





}

catch(error){



console.error(error);



showNotification(

"Erreur suppression production",

"error"

);



}



}









//==============================================
// FERMER MODAL DETAIL EN CLIQUANT DEHORS
//==============================================


window.addEventListener(

"click",

(e)=>{



if(

e.target === detailsModal

){



detailsModal.classList.remove(

"active"

);



}







if(

e.target === productionModal

){



closeProductionModal();



}



});
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE 12
 PRODUCTIONS MUSICALES
 JAVASCRIPT PARTIE 5/5
 FINALISATION
====================================================*/



//==============================================
// CALCUL RAPPORT PRODUCTION
//==============================================


function generateProductionReport(){



const totalBudget =

productions.reduce(

(sum,p)=>

sum +

Number(p.budget || 0),

0

);








const totalExpenses =

productions.reduce(

(sum,p)=>{


const expenses =

p.expenses || {};





return sum +

Number(expenses.studio || 0)

+

Number(expenses.mix || 0)

+

Number(expenses.promotion || 0);



},

0

);








return {



totalProjects:

productions.length,







completed:

productions.filter(

p=>

p.status==="Terminée"

||

p.status==="Publiée"

).length,







inProgress:

productions.filter(

p=>

p.status!=="Terminée"

&&

p.status!=="Publiée"

).length,







budget:

totalBudget,







expenses:

totalExpenses,







profit:

totalBudget-totalExpenses



};



}









//==============================================
// HISTORIQUE DES ACTIONS
//==============================================


function saveProductionHistory(

action,

production

){



let history =

JSON.parse(

localStorage.getItem(

"production_history"

)

)

|| [];








history.unshift({



action,





title:

production.title,





artist:

production.artistId,





date:

new Date()

.toLocaleString()



});








localStorage.setItem(

"production_history",

JSON.stringify(history)

);



}









//==============================================
// EXPORT PRODUCTIONS
//==============================================


function exportProductions(){



const file =

new Blob(

[

JSON.stringify(

productions,

null,

2

)

],

{

type:"application/json"

}

);








const link =

document.createElement(

"a"

);







link.href =

URL.createObjectURL(

file

);







link.download =

"aigle-royal-productions.json";








link.click();



}









//==============================================
// SYNCHRONISATION DASHBOARD
//==============================================


function syncProductionDashboard(){



const report =

generateProductionReport();







localStorage.setItem(

"production_dashboard",

JSON.stringify(

report

)

);



}









//==============================================
// STATISTIQUES AVANCEES
//==============================================


function advancedProductionStats(){



return {



albums:

productions.filter(

p=>

p.type==="Album"

).length,







singles:

productions.filter(

p=>

p.type==="Single"

).length,







published:

productions.filter(

p=>

p.status==="Publiée"

).length,







averageBudget:

productions.length

?

(

productions.reduce(

(sum,p)=>

sum+

Number(p.budget||0),

0

)

/ productions.length

)

.toFixed(2)

:

0



};



}









//==============================================
// INITIALISATION FINALE
//==============================================


window.addEventListener(

"load",

()=>{



setTimeout(()=>{



syncProductionDashboard();







console.log(

"Module Productions Aigle Royal chargé"

);







console.log(

generateProductionReport()

);







console.log(

advancedProductionStats()

);





},2000);



});
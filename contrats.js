/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE 11
 CONTRATS & REVENUS
 JAVASCRIPT PARTIE 1/5
 INITIALISATION + FIREBASE
====================================================*/



//==============================================
// IMPORT FIREBASE
//==============================================


import {


collection,

addDoc,

getDocs,

doc,

deleteDoc,

updateDoc,

onSnapshot,

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


let contracts=[];



let artists=[];



let currentContract=null;



let editingContract=null;








//==============================================
// COLLECTION FIREBASE
//==============================================


const contractsCollection =

collection(

window.firebaseDB,

"contrats"

);






const artistsCollection =

collection(

window.firebaseDB,

"artistes"

);






const storage =

window.firebaseStorage;









//==============================================
// ELEMENTS HTML
//==============================================


const contractsGrid =

document.getElementById(

"contractsGrid"

);







const contractForm =

document.getElementById(

"contractForm"

);







const contractModal =

document.getElementById(

"contractModal"

);







const detailsModal =

document.getElementById(

"contractDetailsModal"

);









//==============================================
// OUVERTURE NOUVEAU CONTRAT
//==============================================


document

.querySelector(

".new-contract-btn"

)

.addEventListener(

"click",

()=>{


openContractModal();



});







function openContractModal(){



contractModal.classList.add(

"active"

);



}









//==============================================
// FERMETURE MODALE
//==============================================


document

.getElementById(

"closeContractModal"

)

.addEventListener(

"click",

closeContractModal);






document

.getElementById(

"cancelContract"

)

.addEventListener(

"click",

closeContractModal);








function closeContractModal(){



contractModal.classList.remove(

"active"

);



contractForm.reset();



editingContract=null;



}









//==============================================
// FERMETURE DETAIL
//==============================================


document

.getElementById(

"closeContractDetails"

)

.addEventListener(

"click",

()=>{


detailsModal.classList.remove(

"active"

);



});









//==============================================
// UPLOAD DOCUMENT CONTRAT
//==============================================


async function uploadContractDocument(file){



if(!file)

return "";







const documentRef =

ref(

storage,

"contrats/documents/"

+

Date.now()

+

"_"

+

file.name

);







await uploadBytes(

documentRef,

file

);






return await getDownloadURL(

documentRef

);



}









//==============================================
// INITIALISATION MODULE
//==============================================


document.addEventListener(

"DOMContentLoaded",

()=>{



loadContracts();



loadArtists();



});
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE 11
 CONTRATS & REVENUS
 JAVASCRIPT PARTIE 2/5
 CREATION CONTRAT + FIREBASE
====================================================*/



//==============================================
// SOUMISSION FORMULAIRE CONTRAT
//==============================================


contractForm.addEventListener(

"submit",

async(e)=>{


e.preventDefault();



await saveContract();



});








//==============================================
// ENREGISTREMENT CONTRAT
//==============================================


async function saveContract(){



try{





let documentURL="";






const file =

document.getElementById(

"contractDocument"

)

.files[0];







if(file){



documentURL =

await uploadContractDocument(

file

);



}









const contractData={



artistId:

document.getElementById(

"contractArtist"

).value,





type:

document.getElementById(

"contractType"

).value,





startDate:

document.getElementById(

"contractStart"

).value,





endDate:

document.getElementById(

"contractEnd"

).value,







amount:

Number(

document.getElementById(

"contractAmount"

).value

),







paymentType:

document.getElementById(

"paymentType"

).value,







paymentStatus:

document.getElementById(

"paymentStatus"

).value,







commission:

Number(

document.getElementById(

"labelCommission"

).value

),







expenses:{



production:

Number(

document.getElementById(

"productionCost"

).value

),






marketing:

Number(

document.getElementById(

"marketingCost"

).value

),






other:

Number(

document.getElementById(

"otherCost"

).value

)



},








document:

documentURL,








description:

document.getElementById(

"contractDescription"

).value,







createdAt:

serverTimestamp()



};










// MODIFICATION


if(editingContract){



await updateDoc(


doc(

window.firebaseDB,

"contrats",

editingContract

),


contractData


);






showNotification(

"Contrat modifié avec succès"

);



}







// NOUVEAU CONTRAT


else{



await addDoc(

contractsCollection,

contractData

);







showNotification(

"Contrat enregistré avec succès"

);



}








closeContractModal();






}







catch(error){



console.error(error);



showNotification(

"Erreur sauvegarde contrat",

"error"

);



}



}









//==============================================
// CALCUL FINANCIER
//==============================================


function calculateContractProfit(contract){



const income =

Number(

contract.amount || 0

);






const expenses =



Number(

contract.expenses?.production || 0

)

+

Number(

contract.expenses?.marketing || 0

)

+

Number(

contract.expenses?.other || 0

);







return income - expenses;



}








//==============================================
// NOTIFICATION
//==============================================


function showNotification(

message,

type="success"

){



const notification =

document.createElement(

"div"

);





notification.className=

"notification "+type;







notification.innerHTML=`



<i class="fa fa-bell"></i>


${message}



`;






document.body.appendChild(

notification

);






setTimeout(()=>{



notification.remove();



},4000);



}
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE 11
 CONTRATS & REVENUS
 JAVASCRIPT PARTIE 3/5
 AFFICHAGE + FILTRES + STATISTIQUES
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






populateArtistSelect();



}

catch(error){



console.error(error);



}



}









//==============================================
// REMPLIR SELECT ARTISTES
//==============================================


function populateArtistSelect(){



const select =

document.getElementById(

"contractArtist"

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
// CHARGER LES CONTRATS
//==============================================


function loadContracts(){



onSnapshot(

contractsCollection,

(snapshot)=>{



contracts=[];






snapshot.forEach((item)=>{



contracts.push({



id:item.id,



...item.data()



});



});








renderContracts(contracts);



updateFinancialStats();



});



}









//==============================================
// AFFICHAGE CARTES CONTRATS
//==============================================


function renderContracts(data){



contractsGrid.innerHTML="";







if(data.length===0){



contractsGrid.innerHTML=`



<div class="empty-contracts">



<i class="fa fa-folder-open"></i>



<h3>

Aucun contrat disponible

</h3>



<p>

Ajoutez votre premier contrat

</p>



</div>



`;



return;


}









data.forEach((contract)=>{





const artist =

artists.find(

a=>a.id===contract.artistId

);






const card =

document.createElement(

"div"

);





card.className=

"contract-card";






card.innerHTML=`



<div class="contract-header">



<div>


<h3 class="contract-title">


${contract.type}


</h3>




<p class="contract-artist">


<i class="fa fa-user"></i>


${artist?.name || "Artiste inconnu"}


</p>


</div>




<span class="contract-status">


${contract.paymentStatus}


</span>



</div>








<div class="contract-body">



<div class="contract-info">


<i class="fa fa-calendar"></i>


<div>


<strong>

Période

</strong>


<p>


${contract.startDate}

-

${contract.endDate}


</p>


</div>


</div>






<div class="contract-info">


<i class="fa fa-money-bill"></i>


<div>


<strong>

Montant

</strong>


<p>


${contract.amount} $

</p>


</div>


</div>








<div class="contract-info">


<i class="fa fa-chart-line"></i>


<div>


<strong>

Bénéfice

</strong>


<p>


${calculateContractProfit(contract)} $

</p>


</div>


</div>






</div>








<div class="contract-actions">



<button

class="view-contract"

data-id="${contract.id}">


<i class="fa fa-eye"></i>


</button>






<button

class="edit-contract"

data-id="${contract.id}">


<i class="fa fa-edit"></i>


</button>







<button

class="delete-contract"

data-id="${contract.id}">


<i class="fa fa-trash"></i>


</button>





</div>



`;






contractsGrid.appendChild(card);



});



}









//==============================================
// STATISTIQUES FINANCIERES
//==============================================


function updateFinancialStats(){



const income =

contracts.reduce(

(total,c)=>

total +

Number(c.amount || 0),

0

);







const expenses =

contracts.reduce(

(total,c)=>



total +

Number(c.expenses?.production || 0)

+

Number(c.expenses?.marketing || 0)

+

Number(c.expenses?.other || 0),


0


);







const profit =

income - expenses;








document.getElementById(

"totalIncome"

).textContent =

income+" $";






document.getElementById(

"totalExpenses"

).textContent =

expenses+" $";






document.getElementById(

"totalProfit"

).textContent =

profit+" $";







document.getElementById(

"activeContracts"

).textContent =



contracts.filter(

c=>

c.paymentStatus==="Payé"

).length;







document.getElementById(

"pendingPayments"

).textContent =



contracts.filter(

c=>

c.paymentStatus==="En attente"

).length;



}








//==============================================
// RECHERCHE
//==============================================


document

.getElementById(

"searchContract"

)

.addEventListener(

"input",

filterContracts

);








//==============================================
// FILTRES
//==============================================


document

.getElementById(

"filterContractStatus"

)

.addEventListener(

"change",

filterContracts

);





document

.getElementById(

"filterContractType"

)

.addEventListener(

"change",

filterContracts

);









function filterContracts(){



const search =

document.getElementById(

"searchContract"

)

.value

.toLowerCase();







const status =

document.getElementById(

"filterContractStatus"

)

.value;






const type =

document.getElementById(

"filterContractType"

)

.value;








const result =

contracts.filter((contract)=>{



const artist =

artists.find(

a=>a.id===contract.artistId

);






const matchSearch =

artist?.name

.toLowerCase()

.includes(search)

||


contract.type

.toLowerCase()

.includes(search);







const matchStatus =



status==="all"

||

contract.paymentStatus===status;







const matchType =



type==="all"

||

contract.type===type;







return

matchSearch

&&

matchStatus

&&

matchType;



});






renderContracts(result);



}
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE 11
 CONTRATS & REVENUS
 JAVASCRIPT PARTIE 4/5
 DETAIL + MODIFICATION + SUPPRESSION
====================================================*/



//==============================================
// ACTIONS SUR LES CONTRATS
//==============================================


document.addEventListener(

"click",

(e)=>{



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

"view-contract"

)

){



showContractDetails(id);



}








// MODIFIER


if(

button.classList.contains(

"edit-contract"

)

){



editContract(id);



}







// SUPPRIMER


if(

button.classList.contains(

"delete-contract"

)

){



deleteContract(id);



}



});









//==============================================
// AFFICHER DETAIL CONTRAT
//==============================================


function showContractDetails(id){



const contract =

contracts.find(

c=>c.id===id

);





if(!contract)

return;







currentContract = contract;






const artist =

artists.find(

a=>a.id===contract.artistId

);









document.getElementById(

"detailArtist"

).textContent =

artist?.name || "Inconnu";







document.getElementById(

"detailType"

).textContent =

contract.type;








document.getElementById(

"detailStart"

).textContent =

contract.startDate;








document.getElementById(

"detailEnd"

).textContent =

contract.endDate;







document.getElementById(

"detailAmount"

).textContent =

contract.amount+" $";







document.getElementById(

"detailStatus"

).textContent =

contract.paymentStatus;







document.getElementById(

"detailDescription"

).textContent =

contract.description ||

"Aucune description";








detailsModal.classList.add(

"active"

);



}









//==============================================
// MODIFICATION CONTRAT
//==============================================


function editContract(id){



const contract =

contracts.find(

c=>c.id===id

);





if(!contract)

return;






editingContract=id;








document.getElementById(

"contractArtist"

).value =

contract.artistId;






document.getElementById(

"contractType"

).value =

contract.type;







document.getElementById(

"contractStart"

).value =

contract.startDate;







document.getElementById(

"contractEnd"

).value =

contract.endDate;








document.getElementById(

"contractAmount"

).value =

contract.amount;








document.getElementById(

"paymentType"

).value =

contract.paymentType;







document.getElementById(

"paymentStatus"

).value =

contract.paymentStatus;







document.getElementById(

"labelCommission"

).value =

contract.commission;








document.getElementById(

"productionCost"

).value =

contract.expenses?.production || 0;







document.getElementById(

"marketingCost"

).value =

contract.expenses?.marketing || 0;








document.getElementById(

"otherCost"

).value =

contract.expenses?.other || 0;







document.getElementById(

"contractDescription"

).value =

contract.description || "";








openContractModal();



}









//==============================================
// SUPPRESSION CONTRAT
//==============================================


async function deleteContract(id){



const confirmDelete =

confirm(

"Voulez-vous supprimer ce contrat ?"

);







if(!confirmDelete)

return;








try{



await deleteDoc(


doc(

window.firebaseDB,

"contrats",

id

)

);







showNotification(

"Contrat supprimé"

);



}

catch(error){



console.error(error);



showNotification(

"Erreur suppression contrat",

"error"

);



}



}









//==============================================
// HISTORIQUE PAIEMENT
//==============================================


function createPaymentHistory(contract){



return {



contractId:

contract.id,





amount:

contract.amount,





status:

contract.paymentStatus,





date:

new Date()

.toLocaleDateString()



};



}
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE 11
 CONTRATS & REVENUS
 JAVASCRIPT PARTIE 5/5
 FINALISATION
====================================================*/



//==============================================
// RAPPORT FINANCIER GLOBAL
//==============================================


function generateFinancialReport(){



const report = {



date:

new Date()

.toLocaleDateString(),





contracts:

contracts.length,







revenues:

contracts.reduce(

(total,c)=>

total + Number(c.amount || 0),

0

),







expenses:

contracts.reduce(

(total,c)=>



total +

Number(c.expenses?.production || 0)

+

Number(c.expenses?.marketing || 0)

+

Number(c.expenses?.other || 0),


0

),








profit:

0



};








report.profit =

report.revenues -

report.expenses;







return report;



}









//==============================================
// EXPORT CONTRATS JSON
//==============================================


function exportContracts(){



const data =

JSON.stringify(

contracts,

null,

2

);








const file =

new Blob(

[data],

{

type:

"application/json"

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

"contrats-aigle-royal.json";







link.click();



}









//==============================================
// HISTORIQUE DES ACTIONS
//==============================================


function saveContractHistory(

action,

contract

){



let history =

JSON.parse(

localStorage.getItem(

"contract_history"

)

)

|| [];








history.unshift({



action:

action,





contract:

contract.type,





amount:

contract.amount,





date:

new Date()

.toLocaleString()



});







localStorage.setItem(

"contract_history",

JSON.stringify(history)

);



}









//==============================================
// SYNCHRONISATION DASHBOARD GENERAL
//==============================================


function syncContractDashboard(){



const report =

generateFinancialReport();







localStorage.setItem(

"financial_dashboard",

JSON.stringify(

report

)

);



}









//==============================================
// STATISTIQUES AVANCEES
//==============================================


function advancedFinancialStats(){



return {



totalContracts:

contracts.length,







activeContracts:

contracts.filter(

c=>

c.paymentStatus==="Payé"

).length,







pending:

contracts.filter(

c=>

c.paymentStatus==="En attente"

).length,







totalRevenue:

contracts.reduce(

(sum,c)=>

sum +

Number(c.amount || 0),

0

),







averageContract:

contracts.length

?

(

contracts.reduce(

(sum,c)=>

sum+

Number(c.amount || 0),

0

)

/

contracts.length

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



syncContractDashboard();





console.log(

"Module Contrats & Revenus chargé"

);






console.log(

advancedFinancialStats()

);





},2000);



});
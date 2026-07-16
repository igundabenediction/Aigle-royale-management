/*====================================================
 AIGLE ROYAL MANAGEMENT SYSTEM
 MODULE PRESENCES
 JAVASCRIPT
 PARTIE 1/3
====================================================*/



// ============================================
// ELEMENTS
// ============================================


const rows = document.querySelectorAll(
"#presenceList tr"
);



const presentCount =
document.getElementById(
"presentCount"
);



const absentCount =
document.getElementById(
"absentCount"
);



const lateCount =
document.getElementById(
"lateCount"
);



const totalCount =
document.getElementById(
"totalCount"
);








// ============================================
// CALCUL DES PRESENCES
// ============================================


function updateStatistics(){


let present = 0;

let absent = 0;

let late = 0;





rows.forEach(row=>{



const status =
row.getAttribute(
"data-status"
);




if(status==="present"){


present++;


}



if(status==="absent"){


absent++;


}



if(status==="late"){


late++;


}



});






if(presentCount)

presentCount.innerText = present;



if(absentCount)

absentCount.innerText = absent;



if(lateCount)

lateCount.innerText = late;



if(totalCount)

totalCount.innerText = rows.length;



}





// Initialisation

updateStatistics();









// ============================================
// BOUTONS STATUT
// ============================================


document.addEventListener(
"click",
function(e){



const row =

e.target.closest(
"tr"
);




if(!row) return;





if(e.target.classList.contains(
"present-btn"
)){



row.dataset.status =
"present";



row.style.background =
"rgba(10,143,60,.25)";



}





if(e.target.classList.contains(
"late-btn"
)){



row.dataset.status =
"late";



row.style.background =
"rgba(245,196,0,.25)";



}





if(e.target.classList.contains(
"absent-btn"
)){



row.dataset.status =
"absent";



row.style.background =
"rgba(208,0,0,.25)";



}





updateStatistics();



}

);
/*====================================================
        RECHERCHE + RAPPORT AUTOMATIQUE
        PARTIE 2/3
====================================================*/



// ============================================
// RECHERCHE MEMBRE
// ============================================


const searchPresence =

document.getElementById(
"searchPresence"
);




if(searchPresence){



searchPresence.addEventListener(
"keyup",
function(){



const value =

this.value.toLowerCase();




const members =

document.querySelectorAll(
"#presenceList tr"
);





members.forEach(member=>{


const text =

member.innerText.toLowerCase();




if(text.includes(value)){


member.style.display="";


}

else{


member.style.display="none";


}



});



}

);


}










// ============================================
// FILTRE DEPARTEMENT
// ============================================


const departmentSelect =

document.getElementById(
"presenceDepartment"
);




if(departmentSelect){



departmentSelect.addEventListener(
"change",
function(){



const department =

this.value;




const members =

document.querySelectorAll(
"#presenceList tr"
);






members.forEach(member=>{



const memberDepartment =

member.children[2].innerText;




if(

department==="all"

||

memberDepartment===department

){



member.style.display="";



}

else{



member.style.display="none";



}



});




}

);


}









// ============================================
// DATE AUTOMATIQUE RAPPORT
// ============================================



const dateInput =

document.getElementById(
"presenceDate"
);



const reportDate =

document.getElementById(
"reportDate"
);




if(dateInput){



const today =

new Date();



const formatted =

today.toISOString()
.split("T")[0];



dateInput.value = formatted;



if(reportDate){


reportDate.innerText =

"Date : " + formatted;



}



}









// ============================================
// RESUME RAPPORT
// ============================================



function updateReport(){



let present = 0;

let absent = 0;

let late = 0;





document.querySelectorAll(
"#presenceList tr"
)

.forEach(row=>{



if(row.dataset.status==="present"){


present++;


}



if(row.dataset.status==="absent"){


absent++;


}



if(row.dataset.status==="late"){


late++;


}



});







const reportPresent =

document.getElementById(
"reportPresent"
);



const reportAbsent =

document.getElementById(
"reportAbsent"
);



const reportLate =

document.getElementById(
"reportLate"
);



const reportTotal =

document.getElementById(
"reportTotal"
);






if(reportPresent)

reportPresent.innerText =
present;



if(reportAbsent)

reportAbsent.innerText =
absent;



if(reportLate)

reportLate.innerText =
late;



if(reportTotal)

reportTotal.innerText =
rows.length;



}







document.addEventListener(

"click",

()=>{


updateReport();


}

);
/*====================================================
        EXPORT + SAUVEGARDE SYSTEME
        PARTIE 3/3
====================================================*/



// ============================================
// TELECHARGER RAPPORT PDF
// ============================================


const pdfButton =

document.querySelector(
".pdf-report"
);




if(pdfButton){



pdfButton.addEventListener(
"click",
()=>{



if(typeof window.jspdf !== "undefined"){



const { jsPDF } = window.jspdf;



const pdf = new jsPDF();




pdf.setFontSize(18);



pdf.text(

"AIGLE ROYAL MUSIC GOSPEL",

20,

20

);





pdf.setFontSize(14);



pdf.text(

"Rapport Journalier des Présences",

20,

35

);






const date =

document.getElementById(
"presenceDate"
).value;





pdf.setFontSize(12);



pdf.text(

"Date : " + date,

20,

50

);





let y = 65;





document.querySelectorAll(

"#presenceList tr"

)

.forEach(row=>{



const nom =

row.children[1].innerText;



const departement =

row.children[2].innerText;



const statut =

row.dataset.status || "Non défini";





pdf.text(

`${nom} | ${departement} | ${statut}`,

20,

y

);



y += 10;



});






pdf.save(

"rapport-presences-aigle-royal.pdf"

);



}

else{


alert(

"Bibliothèque PDF indisponible"

);


}



}

);

}









// ============================================
// IMPRESSION
// ============================================


const printButton =

document.querySelector(
".print-btn"
);




if(printButton){



printButton.addEventListener(
"click",
()=>{


window.print();



}

);


}









// ============================================
// VALIDATION RAPPORT
// ============================================



const saveReport =

document.querySelector(
".save-report"
);




if(saveReport){



saveReport.addEventListener(
"click",
()=>{



const report = {



date:

document.getElementById(
"presenceDate"
).value,



responsable:

document.getElementById(
"responsible"
).value,



fonction:

document.getElementById(
"responsibleRole"
).value,



commentaire:

document.getElementById(
"dailyComment"
).value



};





console.log(

"Rapport enregistré :",

report

);





alert(

"Rapport journalier validé avec succès"

);



}

);

}









// ============================================
// STRUCTURE FIREBASE FIRESTORE
// ============================================


const presenceData = {



date:"",



membreId:"",



nom:"",



departement:"",



statut:"",



observation:"",



responsable:""



};





console.log(

"Structure Firebase Présences prête",

presenceData

);







// ============================================
// SYSTEME CHARGE
// ============================================


console.log(

"AIGLE ROYAL - Module Présences chargé"

);

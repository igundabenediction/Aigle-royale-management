/*====================================================
 AIGLE ROYAL MANAGEMENT SYSTEM
 MODULE RAPPORTS
 JAVASCRIPT
 PARTIE 1/3
====================================================*/



// ============================================
// ELEMENTS
// ============================================


const newReportBtn =

document.querySelector(
".new-report-btn"
);



const reportModal =

document.getElementById(
"reportModal"
);



const closeModal =

document.getElementById(
"closeReportModal"
);



const cancelModal =

document.getElementById(
"cancelReport"
);






// ============================================
// OUVRIR MODAL
// ============================================


if(newReportBtn){



newReportBtn.addEventListener(

"click",

()=>{


reportModal.classList.add(
"active"
);


}

);


}






// ============================================
// FERMER MODAL
// ============================================


function closeReport(){


reportModal.classList.remove(
"active"
);


}




if(closeModal){


closeModal.addEventListener(

"click",

closeReport

);


}





if(cancelModal){


cancelModal.addEventListener(

"click",

closeReport

);


}









// ============================================
// CREATION RAPPORT
// ============================================


const reportForm =

document.getElementById(
"reportForm"
);





const reportsList =

document.getElementById(
"reportsList"
);






if(reportForm){



reportForm.addEventListener(

"submit",

function(e){


e.preventDefault();





const report = {



date:

document.getElementById(
"newReportDate"
).value,



titre:

document.getElementById(
"reportTitle"
).value,



type:

document.getElementById(
"newReportType"
).value,



departement:

document.getElementById(
"newReportDepartment"
).value,



auteur:

document.getElementById(
"reportAuthor"
).value,



description:

document.getElementById(
"reportDescription"
).value



};









const row = document.createElement(
"tr"
);






row.innerHTML = `


<td>

${report.date}

</td>



<td>

${report.titre}

</td>




<td>

${report.type}

</td>




<td>

${report.departement}

</td>




<td>

${report.auteur}

</td>




<td>


<button class="view-btn">

<i class="fa-solid fa-eye"></i>

</button>



<button class="pdf-btn">

<i class="fa-solid fa-file-pdf"></i>

</button>




<button class="delete-btn">

<i class="fa-solid fa-trash"></i>

</button>



</td>


`;








reportsList.appendChild(row);






reportForm.reset();




closeReport();






alert(

"Rapport créé avec succès"

);





}

);


}









// ============================================
// SUPPRESSION RAPPORT
// ============================================



document.addEventListener(

"click",

function(e){



if(

e.target.closest(
".delete-btn"
)

){



const row =

e.target.closest(
"tr"
);




row.remove();



alert(

"Rapport supprimé"

);



}




}

);
/*====================================================
        RECHERCHE + FILTRES + STATISTIQUES
        PARTIE 2/3
====================================================*/



// ============================================
// ELEMENTS FILTRES
// ============================================


const searchReport =

document.getElementById(
"searchReport"
);



const typeFilter =

document.getElementById(
"reportType"
);



const departmentFilter =

document.getElementById(
"reportDepartment"
);



const dateFilter =

document.getElementById(
"reportDateFilter"
);







// ============================================
// FILTRAGE TABLEAU
// ============================================


function filterReports(){



const searchValue =

searchReport ?

searchReport.value.toLowerCase()

:

"";




const typeValue =

typeFilter ?

typeFilter.value

:

"all";





const departmentValue =

departmentFilter ?

departmentFilter.value

:

"all";





const dateValue =

dateFilter ?

dateFilter.value

:

"";






const rows =

document.querySelectorAll(
"#reportsList tr"
);






rows.forEach(row=>{



const text =

row.innerText.toLowerCase();




const type =

row.children[2].innerText;




const department =

row.children[3].innerText;




const date =

row.children[0].innerText;







let visible = true;







if(

searchValue &&

!text.includes(searchValue)

){


visible=false;


}








if(

typeValue !== "all"

&&

type !== typeValue

){


visible=false;


}







if(

departmentValue !== "all"

&&

department !== departmentValue

){


visible=false;


}







if(

dateValue

&&

date !== dateValue

){


visible=false;


}






row.style.display =

visible ? "" : "none";




});



}









// ============================================
// EVENEMENTS FILTRES
// ============================================



if(searchReport){


searchReport.addEventListener(

"keyup",

filterReports

);


}





if(typeFilter){


typeFilter.addEventListener(

"change",

filterReports

);


}





if(departmentFilter){


departmentFilter.addEventListener(

"change",

filterReports

);


}





if(dateFilter){


dateFilter.addEventListener(

"change",

filterReports

);


}









// ============================================
// STATISTIQUES
// ============================================


function updateReportStats(){



const rows =

document.querySelectorAll(

"#reportsList tr"

);




let total = rows.length;



let today = 0;



let departments = new Set();






const currentDate =

new Date()

.toISOString()

.split("T")[0];






rows.forEach(row=>{



const date =

row.children[0].innerText;



const department =

row.children[3].innerText;






departments.add(
department
);






if(date===currentDate){


today++;


}



});








const totalReports =

document.getElementById(
"totalReports"
);



const dailyReports =

document.getElementById(
"dailyReports"
);



const departmentReports =

document.getElementById(
"departmentReports"
);








if(totalReports)

totalReports.innerText = total;





if(dailyReports)

dailyReports.innerText = today;





if(departmentReports)

departmentReports.innerText =
departments.size;



}





updateReportStats();







console.log(

"Gestion filtres rapports activée"

);
/*====================================================
        EXPORT PDF + FIREBASE
        PARTIE 3/3
====================================================*/



// ============================================
// EXPORT PDF D'UN RAPPORT
// ============================================


document.addEventListener(

"click",

function(e){





if(

e.target.closest(
".pdf-btn"
)

){



const row =

e.target.closest(
"tr"
);






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

"Rapport administratif",

20,

35

);






pdf.setFontSize(12);



pdf.text(

"Date : " +

row.children[0].innerText,

20,

50

);





pdf.text(

"Titre : " +

row.children[1].innerText,

20,

65

);





pdf.text(

"Type : " +

row.children[2].innerText,

20,

80

);





pdf.text(

"Département : " +

row.children[3].innerText,

20,

95

);





pdf.text(

"Auteur : " +

row.children[4].innerText,

20,

110

);







pdf.save(

"rapport-aigle-royal.pdf"

);



}

else{


alert(

"Bibliothèque PDF non disponible"

);



}



}



}

);









// ============================================
// EXPORT TOUS LES RAPPORTS
// ============================================



const exportAll =

document.querySelector(
".export-all"
);





if(exportAll){



exportAll.addEventListener(

"click",

()=>{



if(typeof window.jspdf !== "undefined"){



const { jsPDF } = window.jspdf;



const pdf = new jsPDF();




pdf.setFontSize(18);



pdf.text(

"Archives Rapports - Aigle Royal Music Gospel",

20,

20

);





let y = 40;





document.querySelectorAll(

"#reportsList tr"

)

.forEach(row=>{



pdf.setFontSize(11);



pdf.text(

`${row.children[0].innerText}

-

${row.children[1].innerText}

-

${row.children[2].innerText}`,

20,

y

);



y += 10;



});





pdf.save(

"archives-rapports-aigle-royal.pdf"

);



}



}

);


}









// ============================================
// APERCU RAPPORT
// ============================================



document.addEventListener(

"click",

function(e){



if(

e.target.closest(
".view-btn"
)

){



const row =

e.target.closest(
"tr"
);




alert(



"Rapport : "

+

row.children[1].innerText

+

"\n\nType : "

+

row.children[2].innerText

+

"\nDépartement : "

+

row.children[3].innerText



);



}



}

);









// ============================================
// STRUCTURE FIREBASE FIRESTORE
// ============================================


const reportData = {



titre:"",



type:"",



departement:"",



date:"",



auteur:"",



description:"",



fichier:"",



createdAt:""



};






console.log(

"Structure Firebase Rapports prête",

reportData

);







// ============================================
// SYSTEME CHARGE
// ============================================


console.log(

"AIGLE ROYAL - Module Rapports chargé"

);
/*====================================================
 AIGLE ROYAL MANAGEMENT SYSTEM
 MODULE DEPARTEMENTS
 JAVASCRIPT
 PARTIE 1/3
====================================================*/



// ============================================
// ELEMENTS
// ============================================


const newDepartmentBtn =

document.querySelector(
".new-department-btn"
);





const departmentModal =

document.getElementById(
"departmentModal"
);





const closeDepartmentModal =

document.getElementById(
"closeDepartmentModal"
);





const cancelDepartment =

document.getElementById(
"cancelDepartment"
);






const departmentForm =

document.getElementById(
"departmentForm"
);





const departmentList =

document.getElementById(
"departmentList"
);









// ============================================
// OUVRIR MODAL
// ============================================


if(newDepartmentBtn){



newDepartmentBtn.addEventListener(

"click",

()=>{


departmentModal.classList.add(
"active"
);


}

);


}









// ============================================
// FERMER MODAL
// ============================================


function closeDepartment(){


departmentModal.classList.remove(
"active"
);


}






if(closeDepartmentModal){


closeDepartmentModal.addEventListener(

"click",

closeDepartment

);


}






if(cancelDepartment){


cancelDepartment.addEventListener(

"click",

closeDepartment

);


}









// ============================================
// CREATION DEPARTEMENT
// ============================================


if(departmentForm){



departmentForm.addEventListener(

"submit",

function(e){



e.preventDefault();







const department = {



name:

document.getElementById(
"departmentName"
).value,



manager:

document.getElementById(
"departmentManager"
).value,



role:

document.getElementById(
"managerRole"
).value,



phone:

document.getElementById(
"managerPhone"
).value,



email:

document.getElementById(
"managerEmail"
).value,



date:

document.getElementById(
"departmentDate"
).value,



mission:

document.getElementById(
"departmentMission"
).value,



objectives:

document.getElementById(
"departmentObjectives"
).value



};









const box = document.createElement(
"div"
);






box.className =

"department-box";







box.innerHTML = `


<div class="department-icon">

<i class="fa-solid fa-building"></i>

</div>



<h3>

${department.name}

</h3>




<p class="manager">


Responsable :

<strong>

${department.manager}

</strong>


</p>





<p>


Mission :

${department.mission}

</p>





<div class="department-footer">



<span>

Membres : 0

</span>





<button class="view-department">

Voir

</button>



</div>


`;








departmentList.appendChild(box);






departmentForm.reset();





closeDepartment();






alert(

"Nouveau département créé avec succès"

);





updateDepartmentStats();



}

);


}
/*====================================================
        RECHERCHE + STATISTIQUES
        PARTIE 2/3
====================================================*/



// ============================================
// ELEMENTS
// ============================================


const searchDepartment =

document.getElementById(
"searchDepartment"
);





const departmentFilter =

document.getElementById(
"departmentFilter"
);









// ============================================
// RECHERCHE DEPARTEMENT
// ============================================


function filterDepartments(){



const searchValue =

searchDepartment ?

searchDepartment.value.toLowerCase()

:

"";






const filterValue =

departmentFilter ?

departmentFilter.value

:

"all";








const departments =

document.querySelectorAll(

".department-box"

);






departments.forEach(department=>{





const text =

department.innerText.toLowerCase();






const title =

department.querySelector("h3")

.innerText;






let visible = true;







if(

searchValue

&&

!text.includes(searchValue)

){


visible=false;


}







if(

filterValue !== "all"

&&

title !== filterValue

){


visible=false;


}







department.style.display =

visible ? "" : "none";



});



}









// ============================================
// EVENEMENTS RECHERCHE
// ============================================



if(searchDepartment){



searchDepartment.addEventListener(

"keyup",

filterDepartments

);


}






if(departmentFilter){



departmentFilter.addEventListener(

"change",

filterDepartments

);


}









// ============================================
// STATISTIQUES
// ============================================


function updateDepartmentStats(){





const departments =

document.querySelectorAll(

".department-box"

);





let total =

departments.length;





let managers = 0;





let members = 0;





let active = 0;







departments.forEach(dep=>{





const manager =

dep.querySelector(".manager");






if(manager){


managers++;


}





active++;





});








const totalDepartments =

document.getElementById(

"totalDepartments"

);





const totalManagers =

document.getElementById(

"totalManagers"

);





const totalMembers =

document.getElementById(

"totalDepartmentMembers"

);





const activeDepartment =

document.getElementById(

"activeDepartment"

);







if(totalDepartments)

totalDepartments.innerText = total;






if(totalManagers)

totalManagers.innerText = managers;






if(totalMembers)

totalMembers.innerText = members;






if(activeDepartment)

activeDepartment.innerText = active;



}








// Initialisation


updateDepartmentStats();







console.log(

"Gestion départements activée"

);
/*====================================================
        DETAIL + EXPORT + FIREBASE
        PARTIE 3/3
====================================================*/



// ============================================
// AFFICHER DETAIL DEPARTEMENT
// ============================================


document.addEventListener(

"click",

function(e){



if(

e.target.closest(
".view-department"
)

){



const box =

e.target.closest(
".department-box"
);






const name =

box.querySelector(
"h3"
).innerText;






const manager =

box.querySelector(
".manager"
).innerText;






const mission =

box.querySelectorAll(
"p"
)[1].innerText;







alert(



"Département : "

+

name

+

"\n\n"

+

manager

+

"\n\n"

+

mission



);



}



}

);









// ============================================
// EXPORT PDF DEPARTEMENTS
// ============================================



const exportDepartment =

document.createElement(
"button"
);




exportDepartment.className =

"export-department";



exportDepartment.innerHTML =

`

<i class="fa-solid fa-file-pdf"></i>

Exporter PDF

`;





const header =

document.querySelector(
".section-header"
);





if(header){



header.appendChild(
exportDepartment
);


}









exportDepartment.addEventListener(

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

"Structure des départements",

20,

35

);






let y = 50;






document.querySelectorAll(

".department-box"

)

.forEach(dep=>{



const name =

dep.querySelector(
"h3"
).innerText;






pdf.setFontSize(12);



pdf.text(

"- " + name,

20,

y

);



y += 10;



});







pdf.save(

"departements-aigle-royal.pdf"

);



}

else{


alert(

"Bibliothèque PDF non disponible"

);


}



}

);









// ============================================
// STRUCTURE FIREBASE FIRESTORE
// ============================================


const departmentData = {



nom:"",



responsable:"",



fonction:"",



telephone:"",



email:"",



dateCreation:"",



mission:"",



objectifs:"",



membres:[],



createdAt:""



};






console.log(

"Structure Firebase Départements prête",

departmentData

);








// ============================================
// SYSTEME CHARGE
// ============================================


console.log(

"AIGLE ROYAL - Module Départements chargé"

);
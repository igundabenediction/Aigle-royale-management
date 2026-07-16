/*====================================================
 AIGLE ROYAL MANAGEMENT SYSTEM
 MODULE MEMBRES
 JAVASCRIPT
 PARTIE 1/3
====================================================*/



// ============================================
// ELEMENTS
// ============================================


const modal =
document.getElementById("memberModal");


const openButton =
document.querySelector(".add-btn");


const closeButton =
document.getElementById("closeModal");


const cancelButton =
document.getElementById("cancelBtn");


const memberForm =
document.getElementById("memberForm");


const membersList =
document.getElementById("membersList");







// ============================================
// OUVRIR MODAL
// ============================================


if(openButton){


openButton.addEventListener(
"click",
()=>{


modal.classList.add("active");


}

);


}







// ============================================
// FERMER MODAL
// ============================================


function closeModal(){


modal.classList.remove("active");


}




if(closeButton){


closeButton.addEventListener(
"click",
closeModal
);


}



if(cancelButton){


cancelButton.addEventListener(
"click",
closeModal
);


}





// Fermeture en cliquant dehors


window.addEventListener(
"click",
(e)=>{


if(e.target === modal){


closeModal();


}


}

);









// ============================================
// AJOUT D'UN MEMBRE
// ============================================



if(memberForm){



memberForm.addEventListener(
"submit",
function(e){


e.preventDefault();




const name =
document.getElementById("fullName").value;



const phone =
document.getElementById("phone").value;



const department =
document.getElementById("department").value;



const role =
document.getElementById("function").value;



const status =
document.getElementById("status").value;






const row = document.createElement("tr");



row.innerHTML = `


<td>

<img 

src="../assets/images/default-user.png"

class="member-photo"

>

</td>



<td>

${name}

</td>



<td>

${department}

</td>



<td>

${role}

</td>



<td>

${phone}

</td>



<td>


<span class="${status === "Actif" ? "active-status" : "inactive-status"}">


${status}


</span>


</td>



<td>


<button class="edit">

<i class="fa-solid fa-pen"></i>

</button>


<button class="delete">

<i class="fa-solid fa-trash"></i>

</button>


</td>



`;




membersList.appendChild(row);



memberForm.reset();



closeModal();



alert(

"Le membre a été ajouté avec succès"

);



}



);
}
/*====================================================
        RECHERCHE ET ACTIONS MEMBRES
        PARTIE 2/3
====================================================*/



// ============================================
// RECHERCHE MEMBRE
// ============================================


const searchInput =

document.getElementById(
"searchMember"
);




if(searchInput){



searchInput.addEventListener(
"keyup",
function(){



const searchValue =

this.value.toLowerCase();



const rows =

document.querySelectorAll(
"#membersList tr"
);



rows.forEach(row=>{


const text =

row.innerText.toLowerCase();



if(text.includes(searchValue)){


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
// FILTRE DEPARTEMENT
// ============================================


const departmentFilter =

document.getElementById(
"departmentFilter"
);




if(departmentFilter){



departmentFilter.addEventListener(
"change",
function(){



const value =

this.value;



const rows =

document.querySelectorAll(
"#membersList tr"
);



rows.forEach(row=>{



const department =

row.children[2].innerText;



if(

value==="all"

|| 

department===value

){


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
// SUPPRESSION MEMBRE
// ============================================


document.addEventListener(
"click",
function(e){



if(
e.target.closest(".delete")
){



const row =

e.target.closest("tr");



const confirmation =

confirm(

"Voulez-vous supprimer ce membre ?"

);




if(confirmation){


row.remove();



alert(

"Membre supprimé"

);


}



}



}

);








// ============================================
// MODIFICATION MEMBRE
// ============================================



document.addEventListener(
"click",
function(e){



if(

e.target.closest(".edit")

){



const row =

e.target.closest("tr");



const name =

row.children[1].innerText;



const phone =

row.children[4].innerText;



const newName =

prompt(

"Modifier le nom :",

name

);





if(newName){


row.children[1].innerText =

newName;



}



const newPhone =

prompt(

"Modifier téléphone :",

phone

);





if(newPhone){


row.children[4].innerText =

newPhone;


}



alert(

"Modification effectuée"

);



}



}

);
/*====================================================
        EXPORT ET PREPARATION SYSTEME
        PARTIE 3/3
====================================================*/



// ============================================
// EXPORT PDF
// ============================================


const exportButton =

document.querySelector(
".table-header button"
);




if(exportButton){



exportButton.addEventListener(
"click",
()=>{



if(typeof window.jspdf !== "undefined"){



const { jsPDF } = window.jspdf;



const pdf = new jsPDF();




pdf.setFontSize(18);



pdf.text(

"Aigle Royal Music Gospel",

20,

20

);





pdf.setFontSize(14);



pdf.text(

"Liste des membres",

20,

35

);





let y = 50;




const rows =

document.querySelectorAll(
"#membersList tr"
);




rows.forEach(row=>{


const data = [

row.children[1].innerText,

row.children[2].innerText,

row.children[3].innerText,

row.children[4].innerText,

row.children[5].innerText

];




pdf.text(

data.join(" | "),

20,

y

);



y += 10;



});






pdf.save(

"liste-membres-aigle-royal.pdf"

);



}

else{


alert(

"Bibliothèque PDF non chargée"

);



}




}

);



}








// ============================================
// IMPRESSION LISTE
// ============================================


function printMembers(){



window.print();


}







// ============================================
// STRUCTURE FIREBASE PRETE
// ============================================



const memberData = {



nom:"",

telephone:"",

email:"",

departement:"",

fonction:"",

dateEntree:"",

statut:"",


photo:""



};





console.log(

"Structure membre Firebase prête",

memberData

);








// ============================================
// CONTROLE SYSTEME
// ============================================



document.addEventListener(

"DOMContentLoaded",

()=>{


console.log(

"Module Gestion Membres chargé"

);



}

);
/*====================================================
 AIGLE ROYAL MANAGEMENT SYSTEM
 MODULE UTILISATEURS
 JAVASCRIPT
 PARTIE 1/3
====================================================*/



// ============================================
// ELEMENTS
// ============================================


const newUserBtn =

document.querySelector(
".new-user-btn"
);




const userModal =

document.getElementById(
"userModal"
);





const closeUserModal =

document.getElementById(
"closeUserModal"
);





const cancelUser =

document.getElementById(
"cancelUser"
);





const userForm =

document.getElementById(
"userForm"
);





const usersList =

document.getElementById(
"usersList"
);









// ============================================
// OUVRIR MODAL
// ============================================


if(newUserBtn){



newUserBtn.addEventListener(

"click",

()=>{


userModal.classList.add(
"active"
);


}

);


}









// ============================================
// FERMER MODAL
// ============================================


function closeUser(){


userModal.classList.remove(
"active"
);


}





if(closeUserModal){


closeUserModal.addEventListener(

"click",

closeUser

);


}






if(cancelUser){


cancelUser.addEventListener(

"click",

closeUser

);


}









// ============================================
// CREATION UTILISATEUR
// ============================================


if(userForm){



userForm.addEventListener(

"submit",

function(e){



e.preventDefault();







const permissions=[];






document.querySelectorAll(

".permissions-box input:checked"

)

.forEach(item=>{


permissions.push(

item.value

);


});









const user={



nom:

document.getElementById(
"userName"
).value,



email:

document.getElementById(
"userEmail"
).value,



telephone:

document.getElementById(
"userPhone"
).value,



role:

document.getElementById(
"userRole"
).value,



departement:

document.getElementById(
"userDepartment"
).value,



permissions:permissions,



statut:"Actif",



dateCreation:

new Date().toLocaleDateString()



};









const row =

document.createElement(
"tr"
);






row.innerHTML=`


<td>

${user.nom}

</td>



<td>

${user.email}

</td>



<td>

${user.role}

</td>




<td>

${user.departement}

</td>





<td>


<span class="status active">

Actif

</span>


</td>






<td>



<button class="edit-user">


<i class="fa-solid fa-pen"></i>


</button>





<button class="delete-user">


<i class="fa-solid fa-trash"></i>


</button>



</td>


`;









usersList.appendChild(row);







userForm.reset();






closeUser();






updateUserStats();







alert(

"Utilisateur créé avec succès"

);





}

);


}
/*====================================================
        RECHERCHE + STATISTIQUES
        PARTIE 2/3
====================================================*/



// ============================================
// ELEMENTS RECHERCHE
// ============================================


const searchUser =

document.getElementById(
"searchUser"
);





const roleFilter =

document.getElementById(
"roleFilter"
);









// ============================================
// RECHERCHE UTILISATEUR
// ============================================


function filterUsers(){



const searchValue =

searchUser ?

searchUser.value.toLowerCase()

:

"";







const roleValue =

roleFilter ?

roleFilter.value

:

"all";








const rows =

document.querySelectorAll(

"#usersList tr"

);







rows.forEach(row=>{



const text =

row.innerText.toLowerCase();





const role =

row.children[2]

.innerText;





let show=true;






if(

searchValue

&&

!text.includes(searchValue)

){


show=false;


}






if(

roleValue !== "all"

&&

role !== roleValue

){


show=false;


}







row.style.display=

show ? "" : "none";



});



}









if(searchUser){


searchUser.addEventListener(

"keyup",

filterUsers

);


}






if(roleFilter){


roleFilter.addEventListener(

"change",

filterUsers

);


}









// ============================================
// SUPPRESSION UTILISATEUR
// ============================================


document.addEventListener(

"click",

function(e){





if(

e.target.closest(

".delete-user"

)

){



const row =

e.target.closest(
"tr"
);







const confirmation =

confirm(

"Voulez-vous supprimer cet utilisateur ?"

);







if(confirmation){



row.remove();



updateUserStats();




alert(

"Utilisateur supprimé"

);



}



}



}

);









// ============================================
// STATISTIQUES
// ============================================


function updateUserStats(){





const users =

document.querySelectorAll(

"#usersList tr"

);







let total =

users.length;






let active = 0;






let admins = 0;






let roles = [];









users.forEach(user=>{





const statut =

user.querySelector(

".status"

);





if(statut){


active++;


}






const role =

user.children[2]

.innerText;






if(

role.includes(

"Direction"

)

){


admins++;


}







if(

!roles.includes(role)

){


roles.push(role);


}






});









const totalUsers =

document.getElementById(

"totalUsers"

);





const activeUsers =

document.getElementById(

"activeUsers"

);





const adminUsers =

document.getElementById(

"adminUsers"

);





const roleCount =

document.getElementById(

"roleCount"

);








if(totalUsers)

totalUsers.innerText=

total;







if(activeUsers)

activeUsers.innerText=

active;







if(adminUsers)

adminUsers.innerText=

admins;







if(roleCount)

roleCount.innerText=

roles.length;



}







// Initialisation


updateUserStats();
/*====================================================
        FIREBASE + PERMISSIONS
        PARTIE 3/3
====================================================*/



// ============================================
// MODIFICATION UTILISATEUR
// ============================================


document.addEventListener(

"click",

function(e){





if(

e.target.closest(

".edit-user"

)

){





const row =

e.target.closest(
"tr"
);






const nom =

row.children[0].innerText;





const email =

row.children[1].innerText;





const role =

row.children[2].innerText;






alert(

"Modification utilisateur :\n\n"

+

"Nom : "

+

nom

+

"\nEmail : "

+

email

+

"\nRôle : "

+

role



);




}



}

);









// ============================================
// DONNEES UTILISATEUR FIRESTORE
// ============================================


function createUserData(){





return {



nom:

document.getElementById(

"userName"

).value,




email:

document.getElementById(

"userEmail"

).value,





telephone:

document.getElementById(

"userPhone"

).value,





role:

document.getElementById(

"userRole"

).value,





departement:

document.getElementById(

"userDepartment"

).value,






permissions:

Array.from(

document.querySelectorAll(

".permissions-box input:checked"

)

)

.map(permission=>permission.value),






statut:

"Actif",






dateCreation:

new Date()



};



}









// ============================================
// CONTROLE PERMISSIONS
// ============================================


function checkPermission(permission){





const currentUser =

JSON.parse(

localStorage.getItem(

"currentUser"

)

);







if(!currentUser){


return false;


}








return currentUser.permissions.includes(

permission

);



}









// ============================================
// PROTECTION DES PAGES
// ============================================


function protectPage(permission){





if(

!checkPermission(permission)

){





alert(

"Accès non autorisé"

);






window.location.href=

"../dashboard.html";





}



}









// ============================================
// FIREBASE PREPARATION
// ============================================


async function saveUserFirebase(data){





try{





const db =

window.firebaseDB;







console.log(

"Utilisateur prêt Firebase :",

data

);






/*

Insertion Firestore prévue :



addDoc(

collection(db,"users"),

data

);



*/





}

catch(error){



console.error(

error

);



}



}








// ============================================
// SESSION UTILISATEUR
// ============================================


function saveCurrentUser(user){



localStorage.setItem(

"currentUser",

JSON.stringify(user)

);



}








console.log(

"AIGLE ROYAL - Gestion utilisateurs activée"

);
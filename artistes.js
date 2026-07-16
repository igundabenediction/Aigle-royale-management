/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE ARTISTES
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


let artists = [];



let currentArtist = null;



let editingArtist = null;







//==============================================
// REFERENCES FIREBASE
//==============================================


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


const artistsGrid =

document.getElementById(

"artistsGrid"

);





const artistForm =

document.getElementById(

"artistForm"

);







const artistModal =

document.getElementById(

"artistModal"

);







const profileModal =

document.getElementById(

"artistProfileModal"

);








//==============================================
// OUVERTURE MODALE AJOUT
//==============================================


document

.querySelector(

".new-artist-btn"

)

.addEventListener(

"click",

()=>{


    openArtistModal();


});








function openArtistModal(){



    artistModal.classList.add(

    "active"

    );



}







//==============================================
// FERMETURE MODALE AJOUT
//==============================================


document

.getElementById(

"closeArtistModal"

)

.addEventListener(

"click",

closeArtistModal);





document

.getElementById(

"cancelArtist"

)

.addEventListener(

"click",

closeArtistModal);






function closeArtistModal(){



    artistModal.classList.remove(

    "active"

    );



    artistForm.reset();



    editingArtist=null;



}








//==============================================
// FERMETURE PROFIL
//==============================================


document

.getElementById(

"closeArtistProfile"

)

.addEventListener(

"click",

()=>{


profileModal.classList.remove(

"active"

);



});









//==============================================
// UPLOAD PHOTO ARTISTE
//==============================================


async function uploadArtistPhoto(file){



    if(!file)

    return "";





    const imageRef =

    ref(

    storage,

    "artistes/photos/"

    +

    Date.now()

    +

    "_"

    +

    file.name

    );






    await uploadBytes(

    imageRef,

    file

    );






    return await getDownloadURL(

    imageRef

    );



}








//==============================================
// INITIALISATION
//==============================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    loadArtists();



});
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE ARTISTES
 JAVASCRIPT PARTIE 2/5
 CREATION + FIREBASE
====================================================*/



//==============================================
// SOUMISSION FORMULAIRE ARTISTE
//==============================================


artistForm.addEventListener(

"submit",

async(e)=>{


e.preventDefault();




await saveArtist();



});








//==============================================
// ENREGISTREMENT ARTISTE
//==============================================


async function saveArtist(){



try{



let photoURL="";





const file =

document.getElementById(

"artistPhoto"

)

.files[0];







if(file){



photoURL =

await uploadArtistPhoto(

file

);



}








const artistData={



name:

document.getElementById(

"artistName"

).value,





stageName:

document.getElementById(

"stageName"

).value,





country:

document.getElementById(

"artistCountry"

).value,





city:

document.getElementById(

"artistCity"

).value,





genre:

document.getElementById(

"artistGenre"

).value,





careerStart:

document.getElementById(

"careerStart"

).value,





bio:

document.getElementById(

"artistBio"

).value,





photo:

photoURL,







status:

document.getElementById(

"artistStatus"

).value,





contractDate:

document.getElementById(

"contractDate"

).value,





contractDuration:

document.getElementById(

"contractDuration"

).value,






income:

Number(

document.getElementById(

"artistIncome"

).value

),






social:{



youtube:

document.getElementById(

"artistYoutube"

).value,




facebook:

document.getElementById(

"artistFacebook"

).value,




instagram:

document.getElementById(

"artistInstagram"

).value,




spotify:

document.getElementById(

"artistSpotify"

).value



},







notes:

document.getElementById(

"artistNotes"

).value,





albums:[],



singles:[],



createdAt:

serverTimestamp()



};








// MODIFICATION


if(editingArtist){



await updateDoc(


doc(

window.firebaseDB,

"artistes",

editingArtist

),


artistData


);




notifyArtist(

"Artiste modifié avec succès"

);



}





// NOUVEL ARTISTE


else{



await addDoc(

artistsCollection,

artistData

);



notifyArtist(

"Artiste ajouté avec succès"

);



}








closeArtistModal();



loadArtists();





}






catch(error){



console.error(

error

);



notifyArtist(

"Erreur sauvegarde artiste",

"error"

);



}



}









//==============================================
// NOTIFICATION
//==============================================


function notifyArtist(

message,

type="success"

){



const notification =

document.createElement(

"div"

);





notification.className =

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
 MODULE ARTISTES
 JAVASCRIPT PARTIE 3/5
 AFFICHAGE + FILTRES + STATISTIQUES
====================================================*/



//==============================================
// CHARGEMENT DES ARTISTES FIRESTORE
//==============================================


async function loadArtists(){



try{



onSnapshot(

artistsCollection,

(snapshot)=>{



artists=[];





snapshot.forEach((item)=>{



artists.push({


id:item.id,


...item.data()



});



});






renderArtists(artists);



updateArtistStats();



});



}



catch(error){



console.error(error);



}




}







//==============================================
// AFFICHAGE CARTES ARTISTES
//==============================================


function renderArtists(data){



artistsGrid.innerHTML="";






if(data.length===0){



artistsGrid.innerHTML=`



<div class="empty-artists">


<i class="fa fa-user-slash"></i>


<h3>

Aucun artiste enregistré

</h3>


<p>

Commencez par ajouter un artiste

</p>


</div>



`;



return;


}









data.forEach((artist)=>{





const card = document.createElement(

"div"

);






card.className="artist-card";







card.innerHTML=`



<div class="artist-cover">



<img src="${

artist.photo ||

"../assets/images/default-artist.jpg"

}">





<div class="artist-overlay">


<button class="view-artist"

data-id="${artist.id}">


<i class="fa fa-eye"></i>


</button>


</div>




</div>







<div class="artist-info">



<h3>


${artist.name}


</h3>






<p class="artist-stage">


<i class="fa fa-microphone"></i>


${artist.stageName}


</p>






<div class="artist-tags">


<span class="artist-genre">


${artist.genre}


</span>





<span class="artist-status">


${artist.status}


</span>


</div>







<div class="artist-actions">


<button

class="view-profile"

data-id="${artist.id}">


<i class="fa fa-user"></i>


</button>






<button

class="edit-artist"

data-id="${artist.id}">


<i class="fa fa-edit"></i>


</button>






<button

class="delete-artist"

data-id="${artist.id}">


<i class="fa fa-trash"></i>


</button>



</div>





</div>



`;






artistsGrid.appendChild(card);




});



}








//==============================================
// STATISTIQUES ARTISTES
//==============================================


function updateArtistStats(){



document.getElementById(

"totalArtists"

).textContent =

artists.length;





document.getElementById(

"activeArtists"

).textContent =

artists.filter(

artist=>

artist.status==="Actif"

).length;






document.getElementById(

"totalAlbumsArtist"

).textContent =

artists.reduce(

(total,artist)=>

total +

(artist.albums ?

artist.albums.length:0),

0

);






document.getElementById(

"totalProductionsArtist"

).textContent =

artists.reduce(

(total,artist)=>

total +

(artist.singles ?

artist.singles.length:0),

0

);







document.getElementById(

"artistRevenue"

).textContent =

artists.reduce(

(total,artist)=>

total +

Number(artist.income || 0),

0

)

+

" $";



}








//==============================================
// RECHERCHE
//==============================================


document

.getElementById(

"searchArtist"

)

.addEventListener(

"input",

filterArtists

);







//==============================================
// FILTRES
//==============================================


document

.getElementById(

"filterArtistStatus"

)

.addEventListener(

"change",

filterArtists

);





document

.getElementById(

"filterGenre"

)

.addEventListener(

"change",

filterArtists

);









function filterArtists(){



const search =

document.getElementById(

"searchArtist"

)

.value

.toLowerCase();





const status =

document.getElementById(

"filterArtistStatus"

)

.value;





const genre =

document.getElementById(

"filterGenre"

)

.value;






const result =

artists.filter((artist)=>{






const matchSearch =



artist.name

.toLowerCase()

.includes(search)

||

artist.stageName

.toLowerCase()

.includes(search);








const matchStatus =



status==="all"

||

artist.status===status;








const matchGenre =



genre==="all"

||

artist.genre===genre;







return

matchSearch

&&

matchStatus

&&

matchGenre;



});







renderArtists(result);



}
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE ARTISTES
 JAVASCRIPT PARTIE 4/5
 PROFIL + MODIFICATION + SUPPRESSION
====================================================*/



//==============================================
// ACTIONS SUR LES CARTES ARTISTES
//==============================================


document.addEventListener(

"click",

async(e)=>{



const id =

e.target.closest("button")

?.dataset.id;





if(!id)

return;






// VOIR PROFIL


if(

e.target.closest(".view-profile")

||

e.target.closest(".view-artist")

){



showArtistProfile(id);



}







// MODIFIER


if(

e.target.closest(".edit-artist")

){



editArtist(id);



}








// SUPPRIMER


if(

e.target.closest(".delete-artist")

){



deleteArtist(id);



}



});









//==============================================
// AFFICHER PROFIL ARTISTE
//==============================================


function showArtistProfile(id){



const artist =

artists.find(

a=>a.id===id

);





if(!artist)

return;






currentArtist = artist;






document.getElementById(

"profileArtistImage"

).src =

artist.photo ||

"../assets/images/default-artist.jpg";






document.getElementById(

"profileArtistName"

).textContent =

artist.name;






document.getElementById(

"profileStageName"

).textContent =

artist.stageName;






document.getElementById(

"profileStatus"

).textContent =

artist.status;






document.getElementById(

"profileBio"

).textContent =

artist.bio || "Aucune biographie";






document.getElementById(

"profileCountry"

).textContent =

artist.country;






document.getElementById(

"profileGenre"

).textContent =

artist.genre;






document.getElementById(

"profileStart"

).textContent =

artist.careerStart;






document.getElementById(

"profileIncome"

).textContent =

artist.income+" $";









// Réseaux sociaux


document.getElementById(

"youtubeArtist"

).href =

artist.social?.youtube || "#";





document.getElementById(

"facebookArtist"

).href =

artist.social?.facebook || "#";





document.getElementById(

"instagramArtist"

).href =

artist.social?.instagram || "#";





document.getElementById(

"spotifyArtist"

).href =

artist.social?.spotify || "#";









loadDiscography(artist);







profileModal.classList.add(

"active"

);



}









//==============================================
// DISCOGRAPHIE
//==============================================


function loadDiscography(artist){



const table =

document.getElementById(

"artistDiscography"

);





table.innerHTML="";







let albums =

artist.albums || [];







albums.forEach((album)=>{



table.innerHTML +=`



<tr>


<td>

${album.title}

</td>



<td>

Album

</td>



<td>

${album.year}

</td>



<td>

${album.status}

</td>


</tr>



`;



});








if(albums.length===0){



table.innerHTML=`



<tr>


<td colspan="4">


Aucune production disponible


</td>


</tr>



`;



}




}









//==============================================
// MODIFICATION ARTISTE
//==============================================


function editArtist(id){



const artist =

artists.find(

a=>a.id===id

);





if(!artist)

return;





editingArtist=id;





document.getElementById(

"artistName"

).value=

artist.name;





document.getElementById(

"stageName"

).value=

artist.stageName;





document.getElementById(

"artistCountry"

).value=

artist.country || "";





document.getElementById(

"artistCity"

).value=

artist.city || "";





document.getElementById(

"artistGenre"

).value=

artist.genre;





document.getElementById(

"careerStart"

).value=

artist.careerStart;





document.getElementById(

"artistBio"

).value=

artist.bio;






document.getElementById(

"artistStatus"

).value=

artist.status;






document.getElementById(

"artistIncome"

).value=

artist.income;






document.getElementById(

"artistYoutube"

).value=

artist.social?.youtube || "";





document.getElementById(

"artistFacebook"

).value=

artist.social?.facebook || "";





document.getElementById(

"artistInstagram"

).value=

artist.social?.instagram || "";





document.getElementById(

"artistSpotify"

).value=

artist.social?.spotify || "";








openArtistModal();



}









//==============================================
// SUPPRESSION ARTISTE
//==============================================


async function deleteArtist(id){



const confirmDelete =

confirm(

"Voulez-vous supprimer cet artiste ?"

);





if(!confirmDelete)

return;






try{



await deleteDoc(


doc(

window.firebaseDB,

"artistes",

id

)



);






notifyArtist(

"Artiste supprimé"

);





}

catch(error){



console.error(error);



notifyArtist(

"Erreur suppression",

"error"

);



}



}
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE ARTISTES
 JAVASCRIPT PARTIE 5/5
 FINALISATION
====================================================*/



//==============================================
// HISTORIQUE DES ACTIONS
//==============================================


function saveArtistHistory(action, artist){



let history =

JSON.parse(

localStorage.getItem(

"artist_history"

)

)

|| [];






history.unshift({



action:



action,





artist:



artist.name,





date:



new Date()

.toLocaleString()



});







localStorage.setItem(

"artist_history",

JSON.stringify(history)

);



}








//==============================================
// STATISTIQUES AVANCEES
//==============================================


function getAdvancedArtistStats(){



const stats={



totalArtists:

artists.length,





active:

artists.filter(

a=>a.status==="Actif"

).length,






pause:

artists.filter(

a=>a.status==="Pause"

).length,







old:

artists.filter(

a=>a.status==="Ancien"

).length,







totalIncome:

artists.reduce(

(sum,a)=>

sum + Number(a.income || 0),

0

),





genres:{}



};







artists.forEach((artist)=>{



if(!stats.genres[artist.genre]){


stats.genres[artist.genre]=0;


}



stats.genres[artist.genre]++;



});







return stats;



}









//==============================================
// SYNCHRONISATION DASHBOARD GENERAL
//==============================================


function syncMainDashboard(){



const stats =

getAdvancedArtistStats();







localStorage.setItem(

"dashboard_artists",

JSON.stringify(stats)

);



}









//==============================================
// EXPORT DONNEES ARTISTES
//==============================================


function exportArtists(){



const data =

JSON.stringify(

artists,

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

"artistes-aigle-royal.json";






link.click();



}









//==============================================
// NOTIFICATION AMELIOREE
//==============================================


function showArtistNotification(

message,

type="success"

){



const box =

document.createElement(

"div"

);





box.className =

`notification ${type}`;







box.innerHTML=`



<i class="fa fa-circle-check"></i>


${message}



`;






document.body.appendChild(box);






setTimeout(()=>{



box.remove();



},3500);



}








//==============================================
// INITIALISATION FINALE
//==============================================


window.addEventListener(

"load",

()=>{



setTimeout(()=>{



syncMainDashboard();




console.log(

"Module Artistes Aigle Royal chargé"

);




console.log(

getAdvancedArtistStats()

);



},1500);



});
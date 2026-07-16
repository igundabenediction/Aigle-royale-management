/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 SYSTÈME DE GESTION
 MODULE ALBUMS & CATALOGUES
 JAVASCRIPT PARTIE 1/5
====================================================*/


//==============================================
// VARIABLES GENERALES
//==============================================


let albums = [];

let editingAlbum = null;

let currentAlbum = null;





//==============================================
// ELEMENTS HTML
//==============================================


const albumModal =

document.getElementById(
"albumModal"
);



const newAlbumBtn =

document.querySelector(
".new-album-btn"
);



const closeAlbumModal =

document.getElementById(
"closeAlbumModal"
);



const cancelAlbum =

document.getElementById(
"cancelAlbum"
);



const albumForm =

document.getElementById(
"albumForm"
);



const albumsGrid =

document.getElementById(
"albumsGrid"
);





//==============================================
// MODALE DETAILS
//==============================================


const albumDetailsModal =

document.getElementById(
"albumDetailsModal"
);



const closeAlbumDetails =

document.getElementById(
"closeAlbumDetails"
);






//==============================================
// CHAMPS FORMULAIRE
//==============================================


const albumName =

document.getElementById(
"albumName"
);



const albumArtist =

document.getElementById(
"albumArtist"
);



const albumType =

document.getElementById(
"albumType"
);



const albumGenre =

document.getElementById(
"albumGenre"
);



const albumYear =

document.getElementById(
"albumYear"
);



const albumLabel =

document.getElementById(
"albumLabel"
);



const albumProducer =

document.getElementById(
"albumProducer"
);



const albumBudget =

document.getElementById(
"albumBudget"
);



const albumDescription =

document.getElementById(
"albumDescription"
);



const albumCover =

document.getElementById(
"albumCover"
);






//==============================================
// DISTRIBUTION
//==============================================


const youtubeLink =

document.getElementById(
"youtubeLink"
);



const spotifyLink =

document.getElementById(
"spotifyLink"
);



const appleLink =

document.getElementById(
"appleLink"
);



const deezerLink =

document.getElementById(
"deezerLink"
);





//==============================================
// STATISTIQUES
//==============================================


const albumStreams =

document.getElementById(
"albumStreams"
);



const albumRevenue =

document.getElementById(
"albumRevenue"
);






//==============================================
// OUVRIR MODALE CREATION
//==============================================


function openAlbumModal(){


    albumModal.classList.add(
        "active"
    );


}






//==============================================
// FERMER MODALE CREATION
//==============================================


function closeAlbumModalFunction(){


    albumModal.classList.remove(
        "active"
    );


    albumForm.reset();


    editingAlbum=null;


}







//==============================================
// OUVRIR DETAILS
//==============================================


function openDetailsModal(){


    albumDetailsModal.classList.add(
        "active"
    );


}






//==============================================
// FERMER DETAILS
//==============================================


function closeDetailsModal(){


    albumDetailsModal.classList.remove(
        "active"
    );


    currentAlbum=null;


}






//==============================================
// EVENEMENTS MODALES
//==============================================


newAlbumBtn.addEventListener(

"click",

openAlbumModal

);




closeAlbumModal.addEventListener(

"click",

closeAlbumModalFunction

);



cancelAlbum.addEventListener(

"click",

closeAlbumModalFunction

);




closeAlbumDetails.addEventListener(

"click",

closeDetailsModal

);






// Fermeture extérieure


window.addEventListener(

"click",

(e)=>{


    if(e.target===albumModal){

        closeAlbumModalFunction();

    }


    if(e.target===albumDetailsModal){

        closeDetailsModal();

    }


}

);






//==============================================
// INITIALISATION
//==============================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    console.log(

    "Module Albums initialisé"

    );


});
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE ALBUMS & CATALOGUES
 JAVASCRIPT PARTIE 2/5
====================================================*/


//==============================================
// VARIABLES MORCEAUX
//==============================================


let tracks = [];





//==============================================
// ELEMENTS MORCEAUX
//==============================================


const tracksContainer =

document.getElementById(
"tracksContainer"
);



const addTrackBtn =

document.getElementById(
"addTrack"
);






//==============================================
// AJOUTER UNE PISTE
//==============================================


addTrackBtn.addEventListener(

"click",

()=>{


    const row = document.createElement(
        "div"
    );


    row.className="track-row";


    row.innerHTML=`

        <input

        type="text"

        placeholder="Titre chanson"

        class="trackTitle">


        <input

        type="text"

        placeholder="Auteur"

        class="trackAuthor">


        <input

        type="text"

        placeholder="Durée"

        class="trackDuration">


        <button

        type="button"

        class="remove-track">


        <i class="fa fa-trash"></i>


        </button>


    `;



    tracksContainer.appendChild(
        row
    );



});






//==============================================
// SUPPRESSION PISTE
//==============================================


tracksContainer.addEventListener(

"click",

(e)=>{


    const button =

    e.target.closest(
        ".remove-track"
    );



    if(button){


        button.parentElement.remove();


    }


});






//==============================================
// RECUPERER LES MORCEAUX
//==============================================


function getTracks(){


    let result=[];



    document
    .querySelectorAll(".track-row")
    .forEach(row=>{


        result.push({

            title:

            row.querySelector(
            ".trackTitle"
            ).value,


            author:

            row.querySelector(
            ".trackAuthor"
            ).value,


            duration:

            row.querySelector(
            ".trackDuration"
            ).value


        });


    });



    return result;


}






//==============================================
// CREATION ALBUM
//==============================================


albumForm.addEventListener(

"submit",

(e)=>{


    e.preventDefault();




    const album={



        id:

        Date.now(),




        name:

        albumName.value,



        artist:

        albumArtist.value,



        type:

        albumType.value,



        genre:

        albumGenre.value,



        year:

        albumYear.value,



        label:

        albumLabel.value,



        producer:

        albumProducer.value,



        budget:

        albumBudget.value,



        description:

        albumDescription.value,



        cover:"",




        tracks:

        getTracks(),



        youtube:

        youtubeLink.value,



        spotify:

        spotifyLink.value,



        apple:

        appleLink.value,



        deezer:

        deezerLink.value,



        streams:

        Number(albumStreams.value),



        revenue:

        Number(albumRevenue.value),



        status:

        "Préparation",



        created:

        new Date()


    };






    albums.push(album);




    saveAlbumsLocal();



    renderAlbums();



    updateAlbumStats();




    closeAlbumModalFunction();




    notifyAlbum(

    "Album ajouté avec succès"

    );



});







//==============================================
// SAUVEGARDE LOCALE
//==============================================


function saveAlbumsLocal(){


    localStorage.setItem(

        "albums",

        JSON.stringify(albums)

    );


}






//==============================================
// CHARGEMENT LOCAL
//==============================================


function loadAlbumsLocal(){


    albums =

    JSON.parse(

        localStorage.getItem(
            "albums"
        )

    ) || [];



}






//==============================================
// AFFICHAGE CATALOGUE
//==============================================


function renderAlbums(){



    albumsGrid.innerHTML="";




    albums.forEach((album,index)=>{



        const card = document.createElement(
            "div"
        );



        card.className="album-card";



        card.innerHTML=`

        <div class="album-cover">


        <img

        src="${album.cover ||
        "../assets/images/default-cover.jpg"}">


        <div class="album-overlay">


        <button class="play-album"
        data-index="${index}">


        <i class="fa fa-play"></i>


        </button>


        </div>


        </div>





        <div class="album-info">


        <h3>

        ${album.name}

        </h3>




        <p class="album-artist">

        <i class="fa fa-user"></i>

        ${album.artist}

        </p>



        <div class="album-details">


        <span class="album-type">

        ${album.type}

        </span>



        <span>

        ${album.year}

        </span>


        </div>




        <div class="album-status">

        ${album.status}

        </div>



        <div class="album-actions">


        <button class="view-album"
        data-index="${index}">

        <i class="fa fa-eye"></i>

        </button>



        <button class="edit-album"
        data-index="${index}">

        <i class="fa fa-edit"></i>

        </button>



        <button class="delete-album"
        data-index="${index}">

        <i class="fa fa-trash"></i>

        </button>


        </div>


        </div>

        `;



        albumsGrid.appendChild(card);



    });



}






//==============================================
// STATISTIQUES
//==============================================


function updateAlbumStats(){



document.getElementById(
"totalAlbums"
).textContent =

albums.length;




document.getElementById(
"publishedAlbums"
).textContent =

albums.filter(

a=>a.status==="Publié"

).length;




document.getElementById(
"pendingAlbums"
).textContent =

albums.filter(

a=>a.status==="Préparation"

).length;





document.getElementById(
"totalTracks"
).textContent =

albums.reduce(

(total,a)=>

total+a.tracks.length,

0

);





document.getElementById(
"totalStreams"
).textContent =

albums.reduce(

(total,a)=>

total+a.streams,

0

);





document.getElementById(
"totalRevenue"
).textContent =

albums.reduce(

(total,a)=>

total+a.revenue,

0

)+" $";



}





//==============================================
// INITIALISATION
//==============================================


loadAlbumsLocal();


renderAlbums();


updateAlbumStats();
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE ALBUMS & CATALOGUES
 JAVASCRIPT PARTIE 3/5
====================================================*/



//==============================================
// ACTIONS DES CARTES ALBUMS
//==============================================


albumsGrid.addEventListener(

"click",

(e)=>{


    const button =

    e.target.closest(
        "button"
    );



    if(!button) return;



    const index =

    button.dataset.index;




    // VOIR DETAILS

    if(

    button.classList.contains(
        "view-album"
    )

    ){

        showAlbumDetails(index);

    }





    // MODIFIER

    if(

    button.classList.contains(
        "edit-album"
    )

    ){

        editAlbum(index);

    }






    // SUPPRIMER

    if(

    button.classList.contains(
        "delete-album"
    )

    ){

        deleteAlbum(index);

    }




});






//==============================================
// AFFICHER DETAILS ALBUM
//==============================================


function showAlbumDetails(index){



    const album = albums[index];



    currentAlbum = album;



    document.getElementById(
    "detailAlbumCover"
    ).src =

    album.cover ||

    "../assets/images/default-cover.jpg";




    document.getElementById(
    "detailAlbumTitle"
    ).textContent =

    album.name;




    document.getElementById(
    "detailArtist"
    ).textContent =

    album.artist;




    document.getElementById(
    "detailYear"
    ).textContent =

    album.year;




    document.getElementById(
    "detailTracks"
    ).textContent =

    album.tracks.length +

    " chansons";




    document.getElementById(
    "detailStreams"
    ).textContent =

    album.streams +

    " écoutes";




    document.getElementById(
    "detailRevenue"
    ).textContent =

    album.revenue +

    " $";





    renderTracks(album.tracks);




    openDetailsModal();



}






//==============================================
// AFFICHER LES MORCEAUX
//==============================================


function renderTracks(tracks){



    const list =

    document.getElementById(
        "tracksList"
    );



    list.innerHTML="";




    tracks.forEach(

    (track,index)=>{



        list.innerHTML += `


        <tr>


        <td>

        ${index+1}

        </td>



        <td>

        ${track.title}

        </td>




        <td>

        ${track.duration || "-"}

        </td>




        <td>

        ${track.author || "-"}

        </td>




        <td>


        <button

        class="track-play">


        <i class="fa fa-play"></i>


        </button>


        </td>


        </tr>


        `;



    }

    );



}








//==============================================
// MODIFICATION ALBUM
//==============================================


function editAlbum(index){



    const album = albums[index];



    editingAlbum=index;




    albumName.value =

    album.name;




    albumArtist.value =

    album.artist;




    albumType.value =

    album.type;




    albumGenre.value =

    album.genre;




    albumYear.value =

    album.year;




    albumLabel.value =

    album.label;




    albumProducer.value =

    album.producer;




    albumBudget.value =

    album.budget;




    albumDescription.value =

    album.description;




    youtubeLink.value =

    album.youtube;




    spotifyLink.value =

    album.spotify;




    appleLink.value =

    album.apple;




    deezerLink.value =

    album.deezer;




    albumStreams.value =

    album.streams;




    albumRevenue.value =

    album.revenue;





    openAlbumModal();



}







//==============================================
// SUPPRESSION ALBUM
//==============================================


function deleteAlbum(index){



    const confirmDelete =

    confirm(

    "Voulez-vous supprimer cet album ?"

    );




    if(!confirmDelete)

    return;




    albums.splice(

    index,

    1

    );





    saveAlbumsLocal();



    renderAlbums();



    updateAlbumStats();




    notifyAlbum(

    "Album supprimé"

    );



}







//==============================================
// RECHERCHE
//==============================================


const searchAlbum =

document.getElementById(
"searchAlbum"
);





searchAlbum.addEventListener(

"input",

filterAlbums

);







//==============================================
// FILTRES
//==============================================


const filterAlbumType =

document.getElementById(
"filterAlbumType"
);



const filterAlbumStatus =

document.getElementById(
"filterAlbumStatus"
);



const filterArtist =

document.getElementById(
"filterArtist"
);






filterAlbumType.addEventListener(

"change",

filterAlbums

);



filterAlbumStatus.addEventListener(

"change",

filterAlbums

);



filterArtist.addEventListener(

"change",

filterAlbums

);







//==============================================
// FONCTION FILTRE
//==============================================


function filterAlbums(){



    const search =

    searchAlbum.value
    .toLowerCase();




    const type =

    filterAlbumType.value;




    const status =

    filterAlbumStatus.value;




    const artist =

    filterArtist.value;





    const result =

    albums.filter(album=>{



        const matchSearch =


        album.name
        .toLowerCase()
        .includes(search)

        ||

        album.artist
        .toLowerCase()
        .includes(search);





        const matchType =

        type==="all"

        ||

        album.type===type;





        const matchStatus =

        status==="all"

        ||

        album.status===status;





        const matchArtist =

        artist==="all"

        ||

        album.artist===artist;





        return

        matchSearch

        &&

        matchType

        &&

        matchStatus

        &&

        matchArtist;



    });





    renderFilteredAlbums(result);



}







//==============================================
// AFFICHAGE FILTRE
//==============================================


function renderFilteredAlbums(data){



    albumsGrid.innerHTML="";




    data.forEach(album=>{



        const index =

        albums.indexOf(album);



        const card = document.createElement(
            "div"
        );



        card.className="album-card";



        card.innerHTML=`


        <div class="album-cover">


        <img src="${
        album.cover ||
        "../assets/images/default-cover.jpg"
        }">


        </div>



        <div class="album-info">


        <h3>

        ${album.name}

        </h3>



        <p class="album-artist">

        ${album.artist}

        </p>


        <div class="album-actions">


        <button class="view-album"
        data-index="${index}">

        <i class="fa fa-eye"></i>

        </button>


        <button class="edit-album"
        data-index="${index}">

        <i class="fa fa-edit"></i>

        </button>


        <button class="delete-album"
        data-index="${index}">

        <i class="fa fa-trash"></i>

        </button>


        </div>


        </div>

        `;



        albumsGrid.appendChild(card);



    });



}
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE ALBUMS & CATALOGUES
 JAVASCRIPT PARTIE 4/5
 FIREBASE
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
// REFERENCES FIREBASE
//==============================================


const albumsCollection =

collection(

window.firebaseDB,

"albums"

);



const storage =

window.firebaseStorage;







//==============================================
// UPLOAD IMAGE ALBUM
//==============================================


async function uploadAlbumCover(file){



    if(!file)

    return "";




    const storageRef =

    ref(

    storage,

    "albums/covers/"

    +

    Date.now()

    +

    "_"

    +

    file.name

    );





    await uploadBytes(

    storageRef,

    file

    );





    return await getDownloadURL(

    storageRef

    );



}







//==============================================
// ENREGISTRER FIREBASE
//==============================================


async function saveAlbumFirebase(data){



    try{



        await addDoc(

        albumsCollection,

        {


            ...data,


            createdAt:

            serverTimestamp()


        }


        );



        console.log(

        "Album enregistré Firebase"

        );



    }



    catch(error){



        console.error(

        error

        );



    }



}








//==============================================
// CHARGEMENT TEMPS REEL
//==============================================


function loadFirebaseAlbums(){



    onSnapshot(

    albumsCollection,

    snapshot=>{



        albums=[];



        snapshot.forEach(item=>{


            albums.push({


                id:item.id,


                ...item.data()



            });



        });





        renderAlbums();



        updateAlbumStats();



    }



    );



}







//==============================================
// SUPPRESSION FIREBASE
//==============================================


async function deleteAlbumFirebase(id){



    await deleteDoc(


    doc(

    window.firebaseDB,

    "albums",

    id


    )


    );


}







//==============================================
// MODIFICATION FIREBASE
//==============================================


async function updateAlbumFirebase(

id,

data

){



    await updateDoc(


    doc(

    window.firebaseDB,

    "albums",

    id


    ),


    data


    );



}







//==============================================
// ENREGISTREMENT COMPLET
//==============================================


async function saveCompleteAlbum(){



let coverURL="";





if(albumCover.files[0]){



    coverURL =

    await uploadAlbumCover(

    albumCover.files[0]

    );


}







const data={



name:

albumName.value,



artist:

albumArtist.value,



type:

albumType.value,



genre:

albumGenre.value,



year:

albumYear.value,



label:

albumLabel.value,



producer:

albumProducer.value,



budget:

albumBudget.value,



description:

albumDescription.value,



cover:

coverURL,



tracks:

getTracks(),



youtube:

youtubeLink.value,



spotify:

spotifyLink.value,



apple:

appleLink.value,



deezer:

deezerLink.value,



streams:

Number(

albumStreams.value

),



revenue:

Number(

albumRevenue.value

),



status:

"Préparation"



};






await saveAlbumFirebase(

data

);






closeAlbumModalFunction();





notifyAlbum(

"Album sauvegardé en ligne"

);



}







//==============================================
// REMPLACEMENT DU SUBMIT
//==============================================


albumForm.removeEventListener(

"submit",

()=>{}

);



albumForm.addEventListener(

"submit",

(e)=>{


e.preventDefault();



saveCompleteAlbum();



});








//==============================================
// INITIALISATION FIREBASE
//==============================================


document.addEventListener(

"DOMContentLoaded",

()=>{


loadFirebaseAlbums();


});
/*====================================================
 AIGLE ROYAL MUSIC GOSPEL
 MODULE ALBUMS & CATALOGUES
 JAVASCRIPT PARTIE 5/5
 FINALISATION
====================================================*/



//==============================================
// LECTEUR AUDIO ALBUM
//==============================================


function playAlbumAudio(url,title){



    if(!url){


        notifyAlbum(

        "Aucun fichier audio disponible",

        "error"

        );


        return;


    }





    const player = document.createElement(
        "div"
    );



    player.className="audio-player";



    player.innerHTML=`


    <div class="audio-box">


    <h3>

    🎵 ${title}

    </h3>



    <audio controls autoplay>


    <source src="${url}">


    Votre navigateur ne supporte pas l'audio.


    </audio>



    <button id="closeAudioPlayer">

    Fermer

    </button>



    </div>


    `;




    document.body.appendChild(player);




    document

    .getElementById(

    "closeAudioPlayer"

    )

    .onclick=()=>{


        player.remove();


    };



}







//==============================================
// LECTURE D'UNE CHANSON
//==============================================


document.addEventListener(

"click",

(e)=>{



    const playButton =

    e.target.closest(

    ".track-play"

    );



    if(!playButton)

    return;





    if(currentAlbum){


        const index =

        playButton.dataset.index;



        const track =

        currentAlbum.tracks[index];




        playAlbumAudio(

        track.audio,

        track.title

        );


    }




});









//==============================================
// NOTIFICATIONS
//==============================================


function notifyAlbum(

message,

type="success"

){



    const box =

    document.createElement(
        "div"
    );



    box.className =

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







//==============================================
// HISTORIQUE
//==============================================


function addAlbumHistory(

action,

album

){



let history =

JSON.parse(

localStorage.getItem(

"album_history"

)

)

|| [];





history.unshift({


action,


album:

album.name,


date:

new Date()

.toLocaleString()



});






localStorage.setItem(

"album_history",

JSON.stringify(history)

);



}







//==============================================
// STATISTIQUES DASHBOARD
//==============================================


function refreshAlbumDashboard(){



const data={



total:

albums.length,




published:

albums.filter(

a=>a.status==="Publié"

).length,




tracks:

albums.reduce(

(total,a)=>

total+a.tracks.length,

0

),




streams:

albums.reduce(

(total,a)=>

total+a.streams,

0

),




revenue:

albums.reduce(

(total,a)=>

total+a.revenue,

0

)



};





console.log(

"Dashboard Albums",

data

);



}







//==============================================
// INITIALISATION FINALE
//==============================================


document.addEventListener(

"DOMContentLoaded",

()=>{



loadFirebaseAlbums();



refreshAlbumDashboard();



notifyAlbum(

"Module Albums chargé avec succès"

);



});
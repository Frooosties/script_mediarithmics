var roomApiUrl = "https://infinite-castles.azurewebsites.net/castles/1/rooms/";
var chestApiUrl = "https://infinite-castles.azurewebsites.net/castles/1/chests/";
//Fonction permettant de prendre en entrée un id de coffre et vérifier si plein
function isChestFull(chestId, callback) {
    fetch(chestApiUrl + chestId)
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var chestFull;
        if (data.status === 'This chest is empty :/ Try another one!') {
            chestFull = false;
        }
        else {
            chestFull = true;
        }
        callback(chestFull);
    })
        .catch(function (error) {
        console.error("Erreur lors de la récupération des données :", error);
        callback(true);
    });
}
//Fonction permettant de prendre en entrée un id de pièce et lister les coffres pleins de la pièce
function listFullChests(roomId, callback) {
    var fullChestsList = [];
    var completedRequests = 0;
    fetch(roomApiUrl + roomId)
        .then(function (response) { return response.json(); })
        .then(function (data) {
        data.chests.forEach(function (chest) {
            return isChestFull(chest.slice(18), function (chestFull) {
                completedRequests++;
                if (chestFull === true) {
                    //console.log('Coffre plein : ' + chest.slice(18))
                    fullChestsList.push([chest.slice(18), data.id]);
                }
                if (completedRequests === data.chests.length) {
                    callback(fullChestsList);
                }
            });
        });
    })
        .catch(function (error) {
        console.error("Erreur lors de la récupération des données :", error);
        callback([]);
    });
}
function listEmptyChests(roomId, callback) {
    var emptyChestsList = [];
    var completedRequests = 0;
    fetch(roomApiUrl + roomId)
        .then(function (response) { return response.json(); })
        .then(function (data) {
        data.chests.forEach(function (chest) {
            return isChestFull(chest.slice(18), function (chestFull) {
                completedRequests++;
                if (chestFull !== true) {
                    //console.log('Coffre plein : ' + chest.slice(18))
                    emptyChestsList.push([chest.slice(18), data.id]);
                }
                if (completedRequests === data.chests.length) {
                    callback(emptyChestsList);
                }
            });
        });
    })
        .catch(function (error) {
        console.error("Erreur lors de la récupération des données :", error);
        callback([]);
    });
}
//Fonction devant permettre de prendre en entrée une room et en lister les rooms liées
function listLinkedRooms(roomId, callback) {
    var linkedRoomsList = [];
    var completedRequests = 0;
    fetch(roomApiUrl + roomId)
        .then(function (response) { return response.json(); })
        .then(function (data) {
        data.rooms.forEach(function (room) {
            var roomSlice = room.slice(17);
            linkedRoomsList.push(roomSlice);
            completedRequests++;
            if (completedRequests === data.rooms.length) {
                callback(linkedRoomsList);
            }
        });
    })
        .catch(function (error) {
        console.error("Erreur lors de la récupération des données :", error);
        callback([]);
    });
}
// Appel fonctions
isChestFull('a7d41947-648a-4e48-9e5e-33d669030681', function (result) {
    console.log('Coffre plein ? ' + result);
});
listEmptyChests('entry', function (result) {
    console.log('Liste des coffres vides : ');
    console.log(result);
});
listFullChests('entry', function (result) {
    console.log('Liste des coffres pleins : ' + result);
});
listLinkedRooms('entry', function (result) {
    console.log('Liste des salles liées :');
    console.log(result);
});

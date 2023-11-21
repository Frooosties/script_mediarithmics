interface Room {
    id: string;
    rooms: string[];
    chests: string[];
}
interface Chest {
    id: string;
    status: string;
}

const roomApiUrl = "https://infinite-castles.azurewebsites.net/castles/1/rooms/";
const chestApiUrl = "https://infinite-castles.azurewebsites.net/castles/1/chests/";

//Fonction permettant de prendre en entrée un id de coffre et vérifier si plein
function isChestFull(chestId: string, callback: (bool: boolean) => void): void {
    fetch(chestApiUrl + chestId)
        .then(response => response.json())
        .then((data: Chest) => {
            let chestFull: boolean;
            if(data.status === 'This chest is empty :/ Try another one!'){
                chestFull = false;
                }
            else{
                chestFull = true;
            }
            callback(chestFull)
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
            callback(true);
        });
}

//Fonction permettant de prendre en entrée un id de pièce et lister les coffres pleins de la pièce
function listFullChests(roomId: string, callback: (list: string[][]) => void): void {
    const fullChestsList: string[][] = []
    let completedRequests = 0;

    fetch(roomApiUrl + roomId)
        .then(response => response.json())
        .then((data: Room) => {
            data.chests.forEach(chest =>
                isChestFull(chest.slice(18), (chestFull: boolean) =>{
                    completedRequests++;

                    if (chestFull === true){
                        //console.log('Coffre plein : ' + chest.slice(18))
                        fullChestsList.push([chest.slice(18),data.id])
                    }      

                    if (completedRequests === data.chests.length) {
                        callback(fullChestsList);
                    }             
                }))
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
            callback([]);
        });
}

function listEmptyChests(roomId: string, callback: (list: string[][]) => void): void {
    const emptyChestsList: string[][] = []
    let completedRequests = 0;

    fetch(roomApiUrl + roomId)
        .then(response => response.json())
        .then((data: Room) => {
            data.chests.forEach(chest =>
                isChestFull(chest.slice(18), (chestFull: boolean) =>{
                    completedRequests++;

                    if (chestFull !== true){
                        //console.log('Coffre plein : ' + chest.slice(18))
                        emptyChestsList.push([chest.slice(18),data.id])
                    }

                    if (completedRequests === data.chests.length) {
                        callback(emptyChestsList);
                    }
                }))
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
            callback([]);
        });
}

//Fonction devant permettre de prendre en entrée une room et en lister les rooms liées
function listLinkedRooms(roomId: string, callback: (list: string[]) => void): void {
    const linkedRoomsList: string[] = [];
    let completedRequests = 0;

    fetch(roomApiUrl + roomId)
        .then(response => response.json())
        .then((data: Room) => {         
            data.rooms.forEach(room => {
                const roomSlice = room.slice(17);
                linkedRoomsList.push(roomSlice)
                
                completedRequests++;

                if (completedRequests === data.rooms.length) {
                    callback(linkedRoomsList);
                }
        })
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
            callback([]);
        })
}

// Appel fonctions
isChestFull('a7d41947-648a-4e48-9e5e-33d669030681', (result)=>{
    console.log('Coffre plein ? ' + result)
})

listEmptyChests('entry', (result)=>{
    console.log('Liste des coffres vides : ')
    console.log(result)
})

listFullChests('entry', (result) =>{
    console.log('Liste des coffres pleins : ' + result)
})

listLinkedRooms('entry', (result) => {
    console.log('Liste des salles liées :')
    console.log(result)
})
let db;

const request = indexedDB.open('pizza_hunt', 1);

// this will emit when the database version changes
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    // create new object store, where db data is stored
    db.createObjectStore('new_pizza', { autoIncrement: true })
}

// call if the connection is established
request.onsuccess = function(event) {
    db = event.target.result;

    // check if the app is online
    if (navigator.onLine) {
        uploadPizza();
    }
}

// call if the connection failed
request.onerror = function(event) {
    console.log(event.target.errorCode)
}

function saveRecord(record) {
    // in indexeddb, we dont always have a direct connection like sql and mongodb, which is what transactions are for
    // transactions are temporary connections to the database so the indexeddb database maintains an accurate reading of data so it isn't in flux all the time
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access object store for new_pizza
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    pizzaObjectStore.add(record);
}

function uploadPizza() {
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    const pizzaObjectStore = transaction.objectStore('new_pizza');

    const getAll = pizzaObjectStore.getAll();

    getAll.onsuccess = function() {
        // if data was found in indexeddb's store, send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open one final transaction so we can clear the data in the object store
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                const pizzaObjectStore = transaction.objectStore('new_pizza');

                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
}

window.addEventListener('online', uploadPizza);
document.addEventListener("DOMContentLoaded", () => {
    getPooches()
    document.getElementById('good-dog-filter').addEventListener("click", () => {
        filterDogs()
    })
});

function getPooches() {
    fetch("http://localhost:3000/pups")
    .then(resp => resp.json())
    .then(json => {
        for(const dog of json) {
            const newSpan = document.createElement("span")
            newSpan.innerText = dog.name
            newSpan.addEventListener("click", () => {
                showDogInfo(dog.image, dog.name, dog.isGoodDog, dog.id)
            })
            document.getElementById("dog-bar").appendChild(newSpan)
        }
    })
};

function showDogInfo(image, dogName, goodness, databaseId) {
    const dogInfo = document.getElementById('dog-info')
    dogInfo.innerHTML = ""

    const dogImg = document.createElement('img')
    dogImg.src = image
    const dog = document.createElement('h2')
    dog.innerText = dogName
    const goodnessBtn = document.createElement('button')
    goodnessBtn.id = databaseId
    goodnessBtn.addEventListener("click", () => {
        toggleGoodness(goodness, databaseId)
    })

    if(goodness === true) {
        goodnessBtn.innerText = "Good Dog!"
    } else {
        goodnessBtn.innerText = "Bad Dog!"
    }
    
    dogInfo.appendChild(dogImg)
    dogInfo.appendChild(dog)
    dogInfo.appendChild(goodnessBtn)
};

const goodnessDbToggle = {
    true: false,
    false: true
};

function toggleGoodness(goodness, databaseId) {
    fetch(`http://localhost:3000/pups/${databaseId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            "isGoodDog": goodnessDbToggle[goodness]
        })
    })
    .then(resp => resp.json())
    .then(json => {
        goodnessBtn = document.getElementById(databaseId)
        if(json.isGoodDog === true) {
            goodnessBtn.innerText = "Good Dog!"
        } else {
            goodnessBtn.innerText = "Bad Dog!"
        }
    })
};

const filterToggle = {
    "Filter good dogs: ON": "Filter good dogs: OFF",
    "Filter good dogs: OFF": "Filter good dogs: ON"
};

function filterDogs() {
    document.getElementById("dog-bar").innerHTML = ""
    fetch("http://localhost:3000/pups")
    .then(resp => resp.json())
    .then(json => {
        const filterBtn = document.getElementById('good-dog-filter')
        filterBtn.innerText = filterToggle[filterBtn.innerText]

        for(const dog of json) {
            if (dog.isGoodDog === true && filterBtn.innerText === "Filter good dogs: ON") {
                const newSpan = document.createElement("span")
                newSpan.innerText = dog.name
                newSpan.addEventListener("click", () => {
                    showDogInfo(dog.image, dog.name, dog.isGoodDog, dog.id)
                })
            document.getElementById("dog-bar").appendChild(newSpan)
            }
        }

        if(filterBtn.innerText === "Filter good dogs: OFF") {
            document.getElementById("dog-bar").innerHTML = ""
            getPooches()
        }
    })
};

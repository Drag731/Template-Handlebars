var search = document.querySelector('input');
var td = document.getElementsByTagName('td');
var clear = document.getElementsByClassName('clear')[0];
var delFriend = document.getElementsByClassName('del-friend');
var addFriend = document.getElementsByClassName('add-friend')[0];
var rawTemplate = document.getElementById("friendsTamplate").innerHTML;
var localFriend;

var ourRequest = new XMLHttpRequest();
ourRequest.open('GET', 'http://www.json-generator.com/api/json/get/cgmZpkYnYi?indent=2');
ourRequest.onload = function() {
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
        var data = JSON.parse(ourRequest.responseText);

        for (var i = 0; i < data.length; i += 1) {
            if (data[i].isActive === true) {
            createHTML(data[i].friends);
            }
        }

    } else {
        console.log("We connected to the server, but it returned an error.");
    }
};

ourRequest.onerror = function() {
    console.log("Connection error");
};

ourRequest.send();

search.addEventListener('input', searchFriend);
clear.addEventListener('click', clearField); 

function searchFriend() {
    for (var i = 0; i < td.length; i += 1) {
        if (~td[i].innerText.toLowerCase().indexOf(search.value.toLowerCase()) && search.value != '') {
            td[i].style.cssText="color: red; background-color: yellow; font-weight: bold;";
        } else if (!(~td[i].innerText.toLowerCase().indexOf(search.value.toLowerCase())) || search.value == '') {
            td[i].style.cssText="color: black;";
        }
    }
}

function clearField() {
    search.value = '';
    searchFriend();
}

function createHTML(petsData) {
    if (JSON.parse(localStorage.getItem('friends'))) {
        var newPetsData = JSON.parse(localStorage.getItem('friends'));
        petsData = newPetsData.friends;
    }

    var obj = {friends: petsData}
    localFriend= JSON.stringify(obj);
    localStorage.setItem('friends', localFriend);

    for (var i = 0; i < petsData.length; i += 1) {
        var fullName = obj.friends[i].name.split(' ');
        obj.friends[i].firstName = fullName[0];
        obj.friends[i].lastName = fullName[1];
        delete obj.friends[i].name;
    }
    
    var compiledTemplate = Handlebars.compile(rawTemplate);
    var ourGeneratedHTML = compiledTemplate(obj);

    var petsContainer = document.getElementById("my-friends");
    petsContainer.innerHTML = ourGeneratedHTML;

    for (var i = 0; i < delFriend.length; i += 1) {
        delFriend[i].addEventListener('click', delFriendToList);
    }
}

addFriend.addEventListener('click', addFriendToList);

function addFriendToList() {
    var storageFriends = JSON.parse(localStorage.getItem('friends'));
    var arrayStorageFriends = storageFriends.friends;
    var question = prompt('Please, enter full name through space', '');

    for (var i = 0; i < arrayStorageFriends.length; i += 1) {
        if (~arrayStorageFriends[i].name.toLowerCase().indexOf(question.toLowerCase())) {
            alert('You have already added this friend');
            return;
        }
    }

    if (arrayStorageFriends.length == 0) {
        var newFriend = {
            id: 0,
            name: question
        } 
    } else {
        var newFriend = {
            id: arrayStorageFriends[(arrayStorageFriends.length)-1].id + 1,
            name: question
        }
    }
    
    arrayStorageFriends.push(newFriend);
    
    localFriend = JSON.stringify(storageFriends);
    localStorage.setItem('friends', localFriend);

    createHTML(arrayStorageFriends);
}

function delFriendToList(e) {
    var storageFriends = JSON.parse(localStorage.getItem('friends'));
    var arrayStorageFriends = storageFriends.friends;
    var question = confirm('Are you sure, that you will delete this friend?');

    if (question) {

        for (var i = 0; i < arrayStorageFriends.length; i += 1) {

            if (arrayStorageFriends[i].id == parseInt(e.target.getAttribute('data-id'))) {
                arrayStorageFriends.splice(i, 1);
            }

        }

        localFriend = JSON.stringify(storageFriends);
        localStorage.setItem('friends', localFriend);
    }
    createHTML(arrayStorageFriends);
}


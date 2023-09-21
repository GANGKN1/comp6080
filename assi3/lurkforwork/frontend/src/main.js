import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

console.log('Let\'s go!');

// by default, token and userId is null and profile button cannot use
let token = null;
let userId = null;

const apiCall = (path, method, body) => {
    return new Promise((resolve, reject) => {
    const options = {
        method: method,
        headers: {
        'Content-type': 'application/json',
        },
    };
    if (method === 'GET') {
        // Come back to this
    } else {
        options.body = JSON.stringify(body);
    }
    if (localStorage.getItem('token')) {
        options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }

    fetch('http://localhost:5005/' + path, options)
        .then((data) => data.json())
        .then((data) => {
        if (data.error) {
            error_pop(data.error);
        } else {
            resolve(data);
        }
        });
    });
  
};
  
const setToken = (token, userId) => {
    localStorage.setItem('token', token);
    console.log('token storaged at local');
    show('section-logged-in');
    hide('section-logged-out');
    document.getElementById("profile-text").style.display = "inline-block";
    document.getElementById("nav-post-button").style.display = "inline-block";
    document.getElementById("logout").style.display = "inline-block";
    document.getElementById("profile-avatar").classList.remove("hide");
    document.getElementById("user-area").classList.add("hide");
    document.getElementById("profile-editing-area").classList.add("hide");
    document.getElementById("add-new-job-area").classList.add("hide");
    showFeed(userId, token);
}
// show the error information
const error_pop = (msg) => {
    const error = document.getElementById("error");
    error.classList.remove("hide");
    const content = document.getElementById("error-text");
    content.innerText = msg;
};

document.getElementById("error-close-button").addEventListener("click", () => {
    error.classList.add("hide");
});
document.getElementById('regi-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const pwd = document.getElementById('pwd').value;
    const repwd = document.getElementById('re-pwd').value;
    if (email === '' || name === '' || pwd === '' || repwd === '') {
        error_pop('Please fill in all blank!');
    }
    else if (pwd !== repwd) {
        error_pop('Two passwords don\'t match!');
    }
    else {
        const payload = {
            email: email,
            password: pwd,
            name: name
        }
        apiCall('auth/register', 'POST', payload)
        .then((data) => {
            token = data.token;
            userId = data.userId;
            setToken(token, userId);
        });
    }
});
  
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const pwd = document.getElementById('login-pwd').value;
    if (email === '' || pwd === '') {
        error_pop('Your email or password is empty!');
    }
    else {        
        //send data to backend
        const payload = {
            email: email,
            password: pwd
        }
        apiCall('auth/login', 'POST', payload)
        .then((data) => {
            token = data.token;
            userId = data.userId;
            setToken(token, userId);
        });
    }
});
  
const show = (element) => {
    document.getElementById(element).classList.remove('hide');
}
  
const hide = (element) => {
    document.getElementById(element).classList.add('hide');
}
  
document.getElementById('goToRegi').addEventListener('click', () => {
    show('register');
    hide('login');
});
  
document.getElementById('goToLogin').addEventListener('click', () => {
    show('login');
    hide('register');
});
  
document.getElementById('logout').addEventListener('click', () => {
    document.getElementById("profile-text").style.display = "none";
    document.getElementById("nav-post-button").style.display = "none";
    document.getElementById("logout").style.display = "none";
    document.getElementById("profile-avatar").classList.add("hide");
    hide('section-logged-in');
    show('section-logged-out');
    localStorage.removeItem('token');
});

function difftimeConverter(date) {
    const now = new Date();
    var diff = Math.abs(now - date)/ 1000;

    // calculate hours
    const hours = Math.floor(diff / 3600) % 24;
    diff -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diff / 60) % 60;
    return [hours, minutes];
}

function datetimeConverter(date) {
    const mon = date.getMonth();
    const d = date.getDate();
    const h = date.getHours();
    const min = date.getMinutes();
    const y = date.getFullYear();
    return `${y}/${mon}/${d} at ${h}:${min}`;
}

function getInformation (token, userId) {
    return fetch(`http://localhost:5005/user?userId=${userId}`, {
        method: 'GET',
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}` 
        },
    })
    .then(data => {
        if(data.status === 200) {
            return data.json();

        }
        else {
            data.json().then(data => {
                console.log(data["error"]);
            })
        }
    })
}

function userProfileint(userId, token) {

    const temp = getInformation(token, userId);
    const btnpro = document.getElementById("profile-index").children;
    temp.then(temp => {
        if (temp['image'] != null) {
            btnpro[0].src = temp['image'];
        }
        else {
            btnpro[0].src = "../assets/user.jpg";
        }
        btnpro[1].textContent = temp['name'];
    })

    document.getElementById("profile-index").addEventListener('click', () => {
        document.getElementById("feed-container-area").classList.add("hide");
        showProfileofCurrentUser(userId, token, userId);
    })
}


//opens user's profile with all relevant information
function showProfileofCurrentUser(userId, token, selfUserId) {
    window.scrollTo(0,0);
    document.getElementById("user-area").classList.remove("hide");
    const userProfile = document.getElementById("user-profile-area");
    const jobsPosted = document.getElementById("jobs-post-by-user");
    const userWatchedby = document.getElementById("being-watched-by");
    const tempData = userProfile.children;
    if(selfUserId != userId) {
        tempData[1].classList.add("hide");
    }
    else {
        tempData[1].classList.remove("hide");
    }
    const temp = getInformation(token, userId);
    temp.then(temp => {
        if (temp['image'] != null) {
            tempData[2].src = temp['image'];
        }
        else {
            tempData[2].src = "../assets/user.jpg";
        }
        tempData[6].textContent = `${temp['watcheeUserIds'].length} is watching you`
        tempData[5].textContent = temp['email'];
        tempData[4].textContent = temp['id'];
        tempData[3].textContent = temp['name'];
        const btnforWatching = document.getElementById("watch").cloneNode(true);
        const btnforUnwatching = document.getElementById("unwatch").cloneNode(true);
        tempData[7].parentElement.replaceChild(btnforWatching, tempData[7]);
        btnforWatching.addEventListener('click', (e) => {
            e.preventDefault();
            fucWatch(temp['email'], token, true);
            showProfileofCurrentUser(userId, token, selfUserId);
        })

        tempData[8].parentElement.replaceChild(btnforUnwatching, tempData[8]);
        btnforUnwatching.addEventListener('click', (e) => {
            e.preventDefault();
            fucWatch(temp['email'], token, false);
            showProfileofCurrentUser(userId, token, selfUserId);
        })

        // if (userId === selfUserId) {
        //     btnforWatching.classList.add("hide");
        //     btnforUnwatching.classList.add("hide");
        // }
        // else {
        //     if(temp['watcheeUserIds'].includes(selfUserId)) {
        //         btnforWatching.classList.add("hide");
        //         btnforUnwatching.classList.remove("hide");
        //     }
        //     else {
        //         btnforWatching.classList.remove("hide");
        //         btnforUnwatching.classList.add("hide");
        //     }
        // }
        if (userId != selfUserId) {
            if(temp['watcheeUserIds'].includes(selfUserId)) {
                btnforWatching.classList.add("hide");
                btnforUnwatching.classList.remove("hide");
            }
            else {
                btnforWatching.classList.remove("hide");
                btnforUnwatching.classList.add("hide");
            }
        }
        else {
            btnforWatching.classList.add("hide");
            btnforUnwatching.classList.add("hide");
        }

        const jobs = temp['jobs'];

        // remove all old childrens
        while (userWatchedby.lastElementChild) {
            if (userWatchedby.lastElementChild.id === "watch-structure") {
                break;
            }
            userWatchedby.removeChild(userWatchedby.lastElementChild);
        }
                // remove all old childrens
        while (jobsPosted.lastElementChild) {
            if (jobsPosted.lastElementChild.id === "job-structure2") {
                break;
            }
            jobsPosted.removeChild(jobsPosted.lastElementChild);
        }

        jobsPosted.children[0].textContent = `Jobs that were posted by user ${temp['name']}`;
        for(let tempIndex = 0; tempIndex < jobs.length; tempIndex++) {
            const job = jobs[tempIndex];
            const childJob = document.getElementById("job-structure2").cloneNode(true);
            childJob.removeAttribute("id");
            childJob.classList.remove("hide");
            const tempData = childJob.children;
            tempData[1].textContent = temp['name'];

            const date = new Date(job['createdAt']);
            const startDate = new Date(job['start']);
            const [time,mins] = difftimeConverter(date);
            //time posted
            if (time < 24) {
                tempData[1].textContent = `Posted ${time} hours and ${mins} minutes ago`;
            }
            else {
                tempData[2].textContent = `Posted on ${datetimeConverter(date)}`;
            }
            
            tempData[6].src = job['image'];
            tempData[5].textContent = `Starts on ${datetimeConverter(startDate)}`;
            tempData[4].textContent = job['description'];
            tempData[3].textContent = job['title'];
            // add functionality to the edit btn
            tempData[0].children[0].addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById("addjob-post-button").classList.add("hide");
                document.getElementById("add-new-job-area").classList.remove("hide");

                const save = document.getElementById("changejob-post-button");
                save.classList.remove("hide");
                save.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById("add-new-job-area").classList.add("hide");
                    jobChangerFunc(job['id'], token, selfUserId);
                    if (!document.getElementById("user-area").classList.contains('hide'))  {
                        document.getElementById("add-new-job-area").classList.add("hide");
                    }
                    else {
                        document.getElementById("add-new-job-area").classList.add("hide");
                        document.getElementById("feed-container-area").classList.remove("hide");
                    }
                })
            })

            // add functionality to the delete btn
            tempData[0].children[1].addEventListener('click', () => {
                jobDeleterFunc(job['id'], selfUserId, token);
            })

            jobsPosted.appendChild(childJob);
        }

        // Put the watcher that are watching this user into the watchers area
        const watcherList = temp['watcheeUserIds'];
        for (let tempIndex = 0; tempIndex < watcherList.length; tempIndex++) {
            const watchChild = document.getElementById("watch-structure").cloneNode(true);
            watchChild.removeAttribute("id");
            watchChild.classList.remove("hide");
            const profileLink = watchChild.children;
            const temp = getInformation(token, watcherList[tempIndex]);
            profileLink[0].setAttribute('id', watcherList[tempIndex]);
            temp.then(temp => {
                profileLink[0].textContent = temp['name'];
            })

            userWatchedby.appendChild(watchChild);

            profileLink[0].addEventListener('click', (e) => {
                showProfileofCurrentUser(profileLink[0].id, token, selfUserId);
            })
        }
    })

    // add functionality to the back btn
    var btnForBackFuc = tempData[0].cloneNode(true);
    tempData[0].parentElement.replaceChild(btnForBackFuc, tempData[0]);
    btnForBackFuc.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("feed-container-area").classList.remove('hide');
        document.getElementById("user-area").classList.add("hide");
    })

    // add functionality to the edit profile btn
    var newProfileButton = tempData[1].cloneNode(true);
    tempData[1].parentElement.replaceChild(newProfileButton, tempData[1]);
    newProfileButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("user-area").classList.add("hide");
        editProfilePageShower(selfUserId, token);
    })
}

// The function using for watch a specific user
function fucWatch(email, token, flagButton) {
    var data = {"flagButton": flagButton, "email": email};
    return fetch('http://localhost:5005/user/watch', {
        method: 'PUT',
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}` 
        },
        body: JSON.stringify(data)
    })
    .then(data => {
        if(data.status === 200) {
            return true;
        }
        else {
            data.json().then(data => {
                console.log(data["error"]);
                error_pop(data["error"]);
                return false;
            })
        }
    })
}

function editProfilePageShower(selfUserId, token) {
    document.getElementById("profile-editing-area").classList.remove("hide");

    document.getElementById("edit-cancel").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("profile-editing-area").classList.add("hide");
        document.getElementById("user-area").classList.remove("hide");
        showProfileofCurrentUser(selfUserId, token, selfUserId);
    })
    
    document.getElementById("confirm-btn-for-editing").addEventListener('click', (e) => {
        e.preventDefault();
        const confirmPass = document.getElementById("re-new-pwd").value;
        const newPass = document.getElementById("new-pwd").value;
        if (newPass === confirmPass) {
            document.getElementById("profile-editing-area").classList.add("hide");
            document.getElementById("user-area").classList.remove("hide");
            profileEditorFunc(selfUserId, token);
        }
        else {
            error_pop("Two passwords need to be same!");
        }
    })
}

function profileEditorFunc(userId, token) {

    const name = document.getElementById("new-name").value;
    const email = document.getElementById("edit-email").value;
    const image = document.getElementById("new-user-avatar").files[0];
    const password = document.getElementById("new-pwd").value;
    
    // the case the current user have an avatat
    if (image) {
        fileToDataUrl(image).then(image => {
            var data = {"email": email, "image": image, "name": name, "password": password, };
            fetch('http://localhost:5005/user', {
                method: 'PUT',
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${token}` 
                },
                body: JSON.stringify(data)
            })
            .then(data => {
                if(data.status === 200) {
                    error_pop("changes successfully saved!");
                }
                else {
                    data.json().then(data => {
                        console.log(data["error"]);
                        error_pop(data["error"]);
                    })
                }
            })
        })
    }
    // the case the current user dont have an avatat
    else {
        var data = {"email": email, "password": password, "name": name};
            fetch('http://localhost:5005/user', {
                method: 'PUT',
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${token}` 
                },
                body: JSON.stringify(data)
            })
            .then(data => {
                if(data.status === 200) {
                    error_pop("changes successfully saved!");
                }
                else {
                    data.json().then(data => {
                        console.log(data["error"]);
                        error_pop(data["error"]);
                    })
                }
            })
    }
}

function jobChangerFunc(jobId, token, selfUserId) {
    const title = document.getElementById("title-new-job").value;
    const description = document.getElementById("description-add-job").value;
    const image = document.getElementById("image-add-job").files[0];
    const start = new Date(document.getElementById("start-date-add-job").value);
    if (image) {
        fileToDataUrl(image).then(image => {
            var data = {"id": jobId, "title": title,  "image": image, "start": start, "description": description};
            fetch('http://localhost:5005/job', {
                method: 'PUT',
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${token}` 
                },
                body: JSON.stringify(data)
            })
            .then(data => {
                if(data.status === 200) {
                    error_pop("job changed successfully!");
                }
                else {
                    data.json().then(data => {
                        console.log(data["error"]);
                        error_pop(data["error"]);
                    })
                }
            })
        })
    }
    else {
        var data = {"id": jobId, "title": title, "start": start, "description": description};
            fetch('http://localhost:5005/job', {
                method: 'PUT',
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${token}` 
                },
                body: JSON.stringify(data)
            })
            .then(data => {
                if(data.status === 200) {
                    error_pop("job changed successfully!");
                }
                else {
                    data.json().then(data => {
                        console.log(data["error"]);
                        error_pop(data["error"]);
                    })
                }
            })
    }
}

function jobDeleterFunc(jobId, selfUserId, token) {
    var data = {"id": jobId};
            fetch('http://localhost:5005/job', {
                method: 'DELETE',
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${token}` 
                },
                body: JSON.stringify(data)
            })
            .then(data => {
                if(data.status === 200) {
                    showProfileofCurrentUser(selfUserId, token, selfUserId);
                    error_pop("job deleted success!");
                }
                else {
                    data.json().then(data => {
                        console.log(data["error"]);
                        error_pop(data["error"]);
                    })
                }
            })
}
// make the website update up tp time for every 4 secs
var tempServer = setInterval((console.log("tempServer is running!")), 5000);
function showFeed(userId, token) {
    let count = 0;
    userProfileint(userId, token);
    postNewJobinit(userId, token);
    document.getElementById("feed-container-area").classList.remove("hide");

    const feedArea = document.getElementById("feed-holder-area")
    while (feedArea.lastElementChild) {
        if (feedArea.lastElementChild.id === "job-structure") {
            break;
        }
        feedArea.removeChild(feedArea.lastElementChild);
    }
    
    scrollOverinfinity.init(userId, token, count);

}

function tempPollServer(userId, token, count) {
    let ttt = [];
    for (let tempIndex = 0; tempIndex < (count + 5); tempIndex += 5) {
        ttt.push(fetch(`http://localhost:5005/job/feed?start=${tempIndex}`, {
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}` 
            },
            method: 'GET',
        }));
    }
    Promise.all(ttt)
    .then(data => {
        for (let tempIndex = 0; tempIndex < data.length; tempIndex++) {
            if(data[tempIndex].status === 200) {
                data[tempIndex].json().then(data => {
                feedPageUpdater(data, userId, token, tempIndex * 5);
                })
            }
        }
    })
}

function feedGetter(userId, token, count) {
    return fetch(`http://localhost:5005/job/feed?start=${count}`, {
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}` 
        },
        method: 'GET',
    })
    .then(data => {
        if(data.status === 200) {
            return data.json();
        }
        else {
            data.json().then(data => {
                console.log(data["error"]);
                error_pop(data["error"]);
            })
        }
    })
}

function jobsForFeedShower(token, userId, count) {
    const temp = feedGetter(userId, token, count);
    if (temp != null) {      
        temp.then(data => {
            for(let tempIndex = 0 ; tempIndex < data.length; tempIndex++) {
                const childJob = document.getElementById("job-structure").cloneNode(true);
                const userJobsList = data[tempIndex];
                const tempData = childJob.children;
                childJob.removeAttribute("id");
                childJob.setAttribute("id", `job${tempIndex + count}`);
                childJob.classList.remove("hide");
                
                const temp = getInformation(token, userJobsList['creatorId']);
                temp.then(temp => {
                    // the post person
                    tempData[0].textContent = temp['name'];
                })
                tempData[0].setAttribute('id', userJobsList['creatorId']);
        
                const date = new Date(userJobsList['createdAt']);
                const startDate = new Date(userJobsList['start']);
                const [time,mins] = difftimeConverter(date);
                if (time > 24) {
                    tempData[1].textContent = `Posted on ${datetimeConverter(date)}`;
                }
                else {
                    tempData[1].textContent = `Posted ${time} hours and ${mins} minutes ago`;
                }
                tempData[6].textContent = `${userJobsList['likes'].length} likes`;
                tempData[7].textContent = `${userJobsList['comments'].length} comments`;
                tempData[4].textContent = `This job start from ${datetimeConverter(startDate)}`;
                tempData[5].src = userJobsList['image'];
                tempData[2].textContent = userJobsList['title'];
                tempData[3].textContent = userJobsList['description'];
                tempData[7].setAttribute('for', `comment${tempIndex + count}`);
                tempData[10].setAttribute('id', `comment${tempIndex + count}`);
                tempData[11].setAttribute('id', `like-container${tempIndex + count}`);
                const feedLikeItem = tempData[11].children[0];
                feedLikeItem.setAttribute('id', `likes${tempIndex + count}`);
                document.getElementById("feed-holder-area").appendChild(childJob);
                const isLikedByUsers = feedLikeShowerfunc(feedLikeItem, userJobsList['likes'], token, userId);
        
                const likeButton = tempData[6];
                likeButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    tempData[11].classList.remove("hide");
                });
                
                newCommAdder(tempData[9], userJobsList['id'], userId, token);
                allCommsShower(tempData[10], userJobsList, token, userId);
                let comFlag = false;
                const btnForShowComms = tempData[7];
                btnForShowComms.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (comFlag === true) {
                        tempData[10].classList.add("hide");
                        comFlag = false;
                    }
                    else {
                        tempData[10].classList.remove("hide");
                        comFlag = true;
                    }
                });

                const tempButtons = tempData[8].children;
                const jobLikeIndicator = tempButtons[0];

                if (isLikedByUsers === false) {
                    jobLikeIndicator.classList.remove("liked");
                    jobLikeIndicator.textContent = "Like";
                }
                else {
                    jobLikeIndicator.textContent = "Liked";
                    jobLikeIndicator.classList.add("liked");
                }

                // this part used for like a post
                jobLikeIndicator.addEventListener('click', (e) => {
                    let flagButton = false;
                    if (jobLikeIndicator.classList.contains("liked")) {
                        flagButton = false;
                        jobLikeIndicator.classList.remove("liked");
                        jobLikeIndicator.textContent = "Like";
                    }
                    else {
                        flagButton = true;
                        jobLikeIndicator.classList.add("liked");
                        jobLikeIndicator.textContent = "Liked";
                    }
                    e.preventDefault();
                    console.log(userJobsList['id']);
                    likeAdderFunc(userJobsList['id'], token, flagButton);
                    tempPollServer(userId, token, count);
                })
            
                // show the user's profile
                tempData[0].addEventListener('click', (e) => {
                    e.preventDefault();
                    showProfileofCurrentUser(tempData[0].id, token, userId);
                })
            }
        })
    }
};

// This func is used for add like to posts
function likeAdderFunc(id, token, flagButton) {
    var data = {"id": id, "turnon": flagButton};
    fetch('http://localhost:5005/job/like', {
        method: 'PUT',
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}` 
        },
        body: JSON.stringify(data)
    })
    .then(data => {
        if(data.status === 200) {
            console.log("add like success");
        }
        else {
            data.json().then(data => {
                console.log(data["error"]);
                error_pop(data["error"]);
            })
        }
    })
}


function feedLikeShowerfunc(feedLikeItem, likeList, token, selfUserId) {
    let likeFlag = false;

    // remove all old childrens
    while (feedLikeItem.lastElementChild) {
        if (feedLikeItem.lastElementChild.id === "like-structure") {
            break;
        }
        feedLikeItem.removeChild(feedLikeItem.lastElementChild);
    }

    for (let tempIndex=0; tempIndex < likeList.length; tempIndex++) {
        const newLikeChild = document.getElementById("like-structure").cloneNode(true);
        newLikeChild.removeAttribute("id");
        newLikeChild.classList.remove("hide");
        const tempData = newLikeChild.children;
        const likeChildInfo = tempData[0].children;
        const tempPro = getInformation(token, likeList[tempIndex]['userId']);
        tempPro.then(temp => {
            if (temp['image'] != null) {
                likeChildInfo[0].src = temp['image'];
            }
            // check if the like has an avatar
            likeChildInfo[1].textContent = temp['name'];
        })
        
        likeChildInfo[1].addEventListener('click', (e) => {
            e.preventDefault();
            showProfileofCurrentUser(likeList[tempIndex]['userId'], token, selfUserId);
        })

        document.getElementById(feedLikeItem.id).appendChild(newLikeChild);

        
        if(likeList[tempIndex]['userId'] === selfUserId) {
            likeFlag = true;
        }
        else {

        }
    }

    // add functionality to close button
    const butForClogingLike = feedLikeItem.children[0];
    butForClogingLike.addEventListener('click', (e) => {
        e.preventDefault();
        feedLikeItem.parentElement.classList.add("hide");
    })
    return likeFlag;
}


function newCommAdder(divForshowComms, jobId, selfUserId, token) {
    const tempComms = divForshowComms.children;

    const currUser = getInformation(token, selfUserId);
    currUser.then(ttt => {
        // check if the curr user has an avatar
        if (ttt['image']) {
            tempComms[0].src = ttt['image'];
        }
        else {
            tempComms[0].src = "assets/user.jpg";
        }
    })

    tempComms[2].addEventListener('click', (e) => {
        e.preventDefault();
        const tempComm = tempComms[1].value;
        var data = {"id": jobId, "comment": tempComm};
                fetch('http://localhost:5005/job/comment', {
                    headers: {
                        "Content-Type" : "application/json",
                        "Authorization" : `Bearer ${token}` 
                    },
                    method: 'POST',
                    body: JSON.stringify(data)
                })
                .then(resData => {
                    if(resData.status === 200) {
                        showFeed(selfUserId, token);
                        error_pop("comment post success!");
                    }
                    else {
                        resData.json().then(resData => {
                            error_pop(resData["error"]);
                            console.log(resData["error"]);
                        })
                    }
                })
    })
}

function allCommsShower(allComments, userJobsList, token, selfUserId) {
    // remove all old comments
    while (allComments.lastElementChild) {
        if (allComments.lastElementChild.id === "comment-structure") {
            break;
        }
        allComments.removeChild(allComments.lastElementChild);
    }
    const commsData = userJobsList['comments'];
    for(let tempIndex=0; tempIndex < commsData.length; tempIndex++) {
        const commsChild = document.getElementById("comment-structure").cloneNode(true);
        commsChild.removeAttribute("id");
        commsChild.classList.remove("hide");
        const tempData = commsChild.children;
        const commsInfomation = tempData[1].children;
        const tempPro = getInformation(token, commsData[tempIndex]['userId']);
        tempPro.then(temp => {
            // check if the curr user has an avatar
            if(temp['image'] != null) {
                tempData[0].src = temp['image'];
            }
            commsInfomation[0].textContent = temp['name'];
        })
        commsInfomation[0].addEventListener('click', (e) =>{
            e.preventDefault();
            showProfileofCurrentUser(commsData[tempIndex]['userId'], token, selfUserId);
        })
        commsInfomation[1].textContent = commsData[tempIndex]['comment'];
        allComments.appendChild(commsChild);
    }
}

// A func used to update feed page
function feedPageUpdater(data, selfUserId, token, count) {

    for(let tempIndex=0; tempIndex < data.length; tempIndex++) {
        const job = document.getElementById(`job${tempIndex + count}`);
        const userJobsList = data[tempIndex];
        const tempData = job.children;

        tempData[7].textContent = `${userJobsList['comments'].length} comments`;
        tempData[6].textContent = `${userJobsList['likes'].length} likes`;
        console.log("feed page renewed");
        const feedLikeItem = tempData[11].children[0];
        console.log(userJobsList['likes']);
        feedLikeShowerfunc(feedLikeItem, userJobsList['likes'], token, selfUserId);
        allCommsShower(tempData[10], userJobsList, token, selfUserId); 
    }
}

function postNewJobinit(selfUserId, token) {
    document.getElementById("nav-post-button").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("feed-container-area").classList.add("hide");
        document.getElementById("add-new-job-area").classList.remove("hide");
        document.getElementById("addjob-post-button").classList.remove("hide");
        document.getElementById("changejob-post-button").classList.add("hide");
    })

    // check which condition
    document.getElementById("addjob-cancel").addEventListener('click', (e) => {
        e.preventDefault;
        if (!document.getElementById("user-area").classList.contains('hide'))  {
            document.getElementById("add-new-job-area").classList.add("hide");
        }
        else {
            document.getElementById("add-new-job-area").classList.add("hide");
            document.getElementById("feed-container-area").classList.remove("hide");
        }
    })
    
    document.getElementById("addjob-post-button").addEventListener('click', (e) => {
        e.preventDefault();
        const title = document.getElementById("title-new-job").value;
        const description = document.getElementById("description-add-job").value;
        const image = document.getElementById("image-add-job").files[0];
        const start = new Date(document.getElementById("start-date-add-job").value);

        // the case the job does has a img
        if (image) {
            fileToDataUrl(image).then(image => {
                var data = {"title": title, "image": image, "start": start, "description": description};
                fetch('http://localhost:5005/job', {
                    headers: {
                        "Content-Type" : "application/json",
                        "Authorization" : `Bearer ${token}` 
                    },
                    method: 'POST',
                    body: JSON.stringify(data)
                })
                .then(data => {
                    if(data.status === 200) {
                        if (!document.getElementById("user-area").classList.contains('hide'))  {
                            document.getElementById("add-new-job-area").classList.add("hide");
                        }
                        else {
                            document.getElementById("add-new-job-area").classList.add("hide");
                            document.getElementById("feed-container-area").classList.remove("hide");
                        }
                        error_pop("job post success!");
                    }
                    else {
                        data.json().then(data => {
                            error_pop(data["error"]);
                            console.log(data["error"]);
                        })
                    }
                })
            })
        }
        // the case the job does not has a img
        else {
            error_pop("Please enter all relevant fields");
        }
    })
}

var scrollOverinfinity = {
    init: function (userId, token, count) {
        window.addEventListener("scroll", function () {
            if ((window.scrollY + window.innerHeight) >= document.body.scrollHeight) {
                count += 5;
                scrollOverinfinity.load(userId, token, count);
                clearInterval(tempServer);
                tempServer = setInterval(function(){tempPollServer(userId, token, count)}, 5000);
            }
        })
        scrollOverinfinity.load(userId, token, count);
        clearInterval(tempServer);
        tempServer = setInterval(function(){tempPollServer(userId, token, count)}, 5000);
    },
    load: function (userId, token, count) {
        jobsForFeedShower(token, userId, count);
    }

};

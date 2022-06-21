"use strict"


function select(selector, all = false){
    let method = ! all ? 'querySelector' : 'querySelectorAll';
    return document[method](selector);
}

searchUsername('octocat');

window.addEventListener('load', function () {
    document.querySelector('.theme-switcher').addEventListener('click', toggleTheme);

    const searchBtn = select('.search-button');
    const usernameField = select('#username');
    const errorMessage = select('.error-message');
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();

        errorMessage.classList.add('hidden');


        const username = usernameField.value;

        if(username.trim().length === 0){
            return;
        }

        searchUsername(username);

    });
});

async function searchUsername(username){
    const endpoint = 'https://api.github.com/users/' + username;

    const response = await fetch(endpoint);

    if(response.status === 404){
        toggleErrorMessage();
        return;
    }

    const data = await response.json();

    updateUi(data);

}

function formateDate(date) {

    const created_at = new Date(date);

    const year = created_at.getFullYear();

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const month = months[created_at.getMonth()];

    const day = created_at.getDate();

    return `${day} ${month} ${year}`;
}

function updateStats(data) {
    // Update stats
    // Repo number
    const repoEl = select('.repo-number');
    repoEl.innerText = data.public_repos ?? 0;
    // Followers
    const followersEl = select('.followers-number');
    followersEl.innerText = data.followers ?? 0;
    // Following
    const followingEl = select('.following-number');
    followingEl.innerText = data.following ?? 0;
}

function updateSocials(data) {

    const locationEl = select('.location');
    locationEl.innerText = data.location ?? 'Not available';

    const websiteEl = select('.website');
    websiteEl.href = !data.blog?.trim() ? 'Not available' : data.blog;
    websiteEl.innerText = 'Website';

    const twitterEl = select('.twitter');
    let twitterhandler = data.twitter_username ?? 'Not available'
    twitterEl.href = twitterhandler !== 'Not available' ? "https://twitter.com/" + twitterhandler : '#'
    twitterEl.innerText = twitterhandler;

    const companyEl = select('.company');
    companyEl.innerText = data.company ?? 'Not available';

}

function updateUi(data){
    console.log({data});

    //Update the image
    const imgEl = [...select('.card .profile-image', true)];
    imgEl.forEach((image) => image.src = data.avatar_url);

    // Update the name.
    const userNameEl = select('.user-name h1');
    userNameEl.innerHTML = data.name ?? 'Not available';

    // Update handler.
    const handlerEl = select('.handler');
    handlerEl.href = data.html_url;
    handlerEl.innerText = `@${data.login}`;

    // Update joined section
    const joinedEl = select('.joined');
    joinedEl.innerText = `Joined ${formateDate(data.created_at)}`;

    // Update the bio
    const bioEl = select('.bio');
    bioEl.innerText = data.bio ?? 'It seem like there is no bio...';

    updateStats(data);

    updateSocials(data);
}

function toggleErrorMessage(){
    const errorMessage = select('.error-message');
    errorMessage.classList.toggle('hidden');
}




function toggleTheme() {
    const body = document.querySelector('body');
    const themeSwitcherTxt = document.querySelector('.theme-switcher span');
    const themeSwitcherImg = document.querySelector('.theme-switcher img');
    const themes = {
        light: {
            code: 'dark',
            name: 'Light',
            icon: 'public/assets/icon-sun.svg',
        },
        dark: {
            code: 'light',
            name: 'Dark',
            icon: 'public/assets/icon-moon.svg',
        }
    }
    let theme = themes[body.dataset.theme];
    body.dataset.theme = theme.code.toLowerCase();
    themeSwitcherTxt.innerHTML = theme.name;
    themeSwitcherImg.src = theme.icon;
}
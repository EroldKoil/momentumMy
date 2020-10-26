// DOM Elements
const time = document.querySelector('.time'),
    dateDom = document.querySelector('.date'),
    greeting = document.querySelector('.greeting'),
    name = document.querySelector('.name'),
    focusQuestion = document.getElementById('focusQuestion'),
    focus = document.querySelector('.focus'),
    prevBtn = document.getElementById('scrollLeft'),
    nextBtn = document.getElementById('scrollRight'),
    languageBtn = document.querySelector('.languageChanger'),

    weatherIcon = document.querySelector('.weather-icon'),
    weatherDescription = document.querySelector('.weather-description'),
    temperature = document.querySelector('.temperature'),
    city = document.querySelector('.city'),
    humidity = document.querySelector('.humidity'),
    wind = document.querySelector('.wind'),
    errors = document.querySelector('.errors'),
    quote = document.querySelector('#quote'),
    nextQuote = document.querySelector('.nextQuote'),
    psevdoQuote = document.querySelector('#psevdoQuote');


const monthsList = {
    ru: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

const daysList = {
    ru: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
};

const wordsList = {
    ru: {
        prev: 'Назад',
        next: 'Вперед',
        night: 'ночь',
        morning: 'утро',
        afternoon: 'день',
        evening: 'вечер',
        good: 'Добрый',
        goood: 'Доброе',
        great: 'Славная',
        focusQ: 'Какие планы на сегодня?',
        enter: 'Указать',
        focus: 'Цель',
        name: 'Имя',
        speed: 'м/с',
        speedF: 'ми/ч',
        cantFindCity: 'Указанный город не найден <br> Выбран город по умолчанию',
        errorNet: 'Нет доступа к сервису погоды <br> Кликните по значку погоды для перезагрузки'
    },
    en: {
        prev: 'Prev',
        next: 'Next',
        night: 'night',
        morning: 'morning',
        afternoon: 'afternoon',
        evening: 'evening',
        good: 'Good',
        goood: 'Good',
        great: 'Good',
        focusQ: 'What Is Your Focus For Today?',
        enter: 'Enter',
        focus: 'Focus',
        name: 'Name',
        speed: 'm/s',
        speedF: 'mi/h',
        cantFindCity: 'The specified city was not found <br> The default city was selected',
        errorNet: 'No access to the weather service <br> Cklik to weather icon for reload'
    }
};


let backgroundsList = createBackgroundsList(); // Backgrounds List for a day
let bgCount = 0; // Number shows how much the background is ahead of time
let lang; // Selected language
let errorType = false; // Type of error
let canSeeNextQuote = true; // False when animation of changing quotes runing
let quoteColor = 'rgb(255,255,200)'; // actual background color for quote 

// Temperature in C or F. true = C
let cF = localStorage.getItem('cF') === null ? true : localStorage.getItem('cF') == 'false' ? false : true;

// add city at first
city.innerText = localStorage.getItem('city') === null ? 'Минск' : localStorage.getItem('city');

// Create List of Backgrounds
function createBackgroundsList() {
    let array = [];
    let getRandomImgs = (dayPart, hourStart) => {
        let arrayImages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        for (let i = hourStart; i < hourStart + 6; i++) {
            let randN = Math.floor(Math.random() * arrayImages.length);
            let img = document.createElement('img');
            img.src = `assets/images/${dayPart}/${arrayImages[randN]<10?'0':''}${arrayImages[randN]}.jpg`;
            
            img.onload = function() {
               
            }; 
            array.push(`assets/images/${dayPart}/${arrayImages[randN]<10?'0':''}${arrayImages[randN]}.jpg`);
            arrayImages.splice(randN - 1, 1);
        }
    };
    getRandomImgs('night', 0);
    getRandomImgs('morning', 6);
    getRandomImgs('day', 12);
    getRandomImgs('evening', 18);
    return array;
}

// Show Time
function showTime() {
    let today = new Date(),
        weekDay = daysList[lang][today.getDay()],
        month = monthsList[lang][today.getMonth()],
        date = addZero(today.getDate()),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds();

    if (min == 0 && sec == 0) { setBgGreet(); }

    // Output Time
    time.children[0].innerText = addZero(hour);
    time.children[2].innerText = addZero(min);
    time.children[4].innerText = addZero(sec);
    dateDom.innerText = `${weekDay}, ${date} ${month} `;
    setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

// Set Background and Greeting
function setBgGreet() {
    let hour = new Date().getHours();
    if (bgCount + hour < 1) { bgCount = 24 - hour; }
    if (bgCount + hour > 24) { bgCount = -hour + 1; }
    document.body.style.backgroundImage = `url(${backgroundsList[hour + bgCount - 1]}) `;
    if (hour < 6) { greeting.textContent = wordsList[lang].great + ' ' + wordsList[lang].night + ', '; } // Night
    else if (hour < 12) { greeting.textContent = wordsList[lang].goood + ' ' + wordsList[lang].morning + ', '; } // Morning
    else if (hour < 18) { greeting.textContent = wordsList[lang].good + ' ' + wordsList[lang].afternoon + ', '; } // Afternoon 
    else { greeting.textContent = wordsList[lang].good + ' ' + wordsList[lang].evening + ', '; } // Evening
}

// Get Name
function getName() {
    if (localStorage.getItem('name') === null) {
        name.textContent = `[${wordsList[lang].enter} ${wordsList[lang].name}]`;
    } else {
        name.textContent = localStorage.getItem('name');
    }
}

// Set Name
function setName(e) {
    if (e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            if (e.target.innerText != '') {
                localStorage.setItem('name', e.target.innerText);
            } else {
                name.innerText = localStorage.getItem('name');
            }
            name.blur();
        }
    } else {
        if (e.target.innerText != '') {
            localStorage.setItem('name', e.target.innerText);
        } else {
            name.innerText = localStorage.getItem('name');
        }
    }
    name.style.opacity = '1';
}

// Get Focus
function getFocus() {
    if (localStorage.getItem('focus') === null) {
        focus.textContent = `[${wordsList[lang].enter} ${wordsList[lang].focus}]`;
    } else {
        focus.textContent = localStorage.getItem('focus');
    }
}

// Get Language
function getLanguage() {
    if (localStorage.getItem('language') === null) { lang = 'ru'; } else { lang = localStorage.getItem('language'); }
    languageBtn.innerText = lang;
    focusQuestion.innerText = wordsList[lang].focusQ;
}

// Change Language
function changeLanguage() {
    lang = lang == 'ru' ? 'en' : 'ru';
    localStorage.setItem('language', lang);
    focusQuestion.innerText = wordsList[lang].focusQ;
    languageBtn.innerText = lang;
    setBgGreet();
    getWeather();
}

// Set Focus
function setFocus(e) {
    if (e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            if (e.target.innerText != '') {
                localStorage.setItem('focus', e.target.innerText);
            } else {
                focus.innerText = localStorage.getItem('focus');
            }
            focus.blur();
        } else {
            if (focus.innerText.length > 90) {
                e.preventDefault();
            }
        }
    } else {
        if (e.target.innerText != '') {
            localStorage.setItem('focus', e.target.innerText);
        } else {
            focus.innerText = localStorage.getItem('focus');
        }
    }
}


// Get Weather Info
async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=${lang}&appid=1917bd59682636083ae7ad154d5b1542&units=${cF ? 'metric' : 'imperial'}`;
    let res;
    try {
        res = await fetch(url);
    } catch (err) {
        errors.innerHtml = wordsList[lang].errorNet;
        errors.style.left = '0px';
        errorType = 'errorNet';
        document.querySelector('.windAndHumidity').style.display = 'none';
        setTimeout(() => { errors.style.left = '-100%'; }, 5000);
    }

    if (res != undefined) {
        if (res.status == 400 || res.status == 404) {
            if (!errorType) {
                city.innerText = localStorage.getItem('city');
                errorType = 'cantFindCity';
                errors.innerHTML = wordsList[lang].cantFindCity;
                errors.style.left = '0px';
                document.querySelector('.windAndHumidity').style.display = 'none';
                setTimeout(() => { errors.style.left = '-100%'; }, 5000);
                getWeather();
            } else if(city.innerText != 'Гомель'){
                city.innerHTML = 'Гомель';
                getWeather();
            }
        } else {
            document.querySelector('.windAndHumidity').style.display = 'block';
            errorType = false;
            const data = await res.json();
            weatherIcon.className = 'weather-icon owf';
            weatherIcon.classList.add(`owf-${data.weather[0].id}`);
            temperature.textContent = `${data.main.temp.toFixed(0)}°${cF ? 'C' : 'F'}`;
            wind.lastChild.textContent = ` : ${data.wind.speed}  ${cF ? wordsList[lang].speed : wordsList[lang].speedF}`;
            humidity.lastChild.textContent = ` : ${data.main.humidity}  %`;
            weatherDescription.textContent = data.weather[0].description;
            if (data.weather[0].description.length > 10) {
                weatherDescription.classList.add('runingString');
            } else {
                weatherDescription.classList.remove('runingString');
            }
            localStorage.setItem('city', city.innerText);
        }
    }
}


// Get Quote
async function getQuote() {
    const urll = 'https://favqs.com/api/qotd';
    let res;

    try {
        res = await fetch(urll);
    } catch (err) {
        quote.querySelector('.quote__author').innerText = 'Нет доступа к сервису';
        errorType = 'errorNet';
    }

    if (res != undefined && canSeeNextQuote) {
        if (res.status == 400 || res.status == 404) {
            //errors.innerHTML = wordsList[lang].cantFindQuote;
        } else {
            const data = await res.json();

            if (quote.querySelector('.quote__text').innerText != '') {

                psevdoQuote.style.backgroundColor = quoteColor;
                quoteColor = `rgb(${Math.floor(Math.random() * 80) + 175} ${Math.floor(Math.random() * 80) + 175} ${Math.floor(Math.random() * 80) + 175})`;
                quote.style.backgroundColor = quoteColor;

                canSeeNextQuote = false;
                psevdoQuote.classList.add('quoteChange');
                psevdoQuote.classList.remove('psevdoQuote');
                psevdoQuote.querySelector('.quote__text').innerText = quote.querySelector('.quote__text').innerText;
                psevdoQuote.querySelector('.quote__author').innerText = quote.querySelector('.quote__author').innerText;

                quote.className = 'quoteHover';
                setTimeout(() => {
                    psevdoQuote.classList.remove('quoteChange');
                    psevdoQuote.classList.add('psevdoQuote');
                    quote.className = 'quote';
                    canSeeNextQuote = true;
                }, 700);
            }
            quote.querySelector('.quote__text').innerText = data.quote.body;
            quote.querySelector('.quote__author').innerText = ' - ' + data.quote.author;


        }
    }
}

// Set city
function setCity(e) {
    if (e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            e.preventDefault();
            getWeather();
            city.blur();
        }
    } else {
        getWeather();
    }
}

name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
name.addEventListener('click', () => { name.innerText = ' '; });

focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
focus.addEventListener('click', () => { focus.innerText = ''; });

city.addEventListener('keypress', setCity);
city.addEventListener('click', (e) => { city.innerText = '' });

nextQuote.addEventListener('click', getQuote);
weatherIcon.addEventListener('click', getWeather);

prevBtn.addEventListener('click', () => {
    bgCount--;
    setBgGreet()
});

nextBtn.addEventListener('click', () => {
    bgCount++;
    setBgGreet()
});

errors.addEventListener('click', () => { errors.style.left = '-100%' });
languageBtn.addEventListener('click', changeLanguage);
temperature.addEventListener('click', () => {
    cF = !cF;
    localStorage.setItem('cF', cF);
    getWeather();
});

document.addEventListener('DOMContentLoaded', getWeather);


// Run

getLanguage();
showTime();
setBgGreet(0);
getName();
getFocus();
getQuote();
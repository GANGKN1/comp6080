const streetname = document.getElementById('streetname');
const suburb = document.getElementById('suburb');
const birthday = document.getElementById('birthday');
const postcode = document.getElementById('postcode');
const remove = document.getElementById('remove');
const selectedtype = document.getElementById('selectedtype');
const features = document.getElementById("checkboxes").querySelectorAll("input[type=checkbox]");
const heating = document.getElementById('heating');
const airconditioning = document.getElementById('airconditioning');
const pool = document.getElementById('pool');
const sandpit = document.getElementById('sandpit');
const selectall = document.getElementById('selectall');
const form = document.getElementById('info-form');
const textarea = document.getElementById('output');
var now = new Date();

function input_is_valid(input) {
    if (input.value.length >= 3 && input.value.length <= 50) {
        return true;
    }
    return false;
}

function birthday_is_valid(date) {
    let tmp = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
    if (!tmp.test(date)) {
        return false;
    }
    /*check if date is NaN*/
    let day = date.substr(0, 2);
    let month = date.substr(3, 2);
    let year = date.substr(6, 4);
    let new_date = new Date(Date.parse(year + '-' + month + '-' + day));

    if (isNaN(new_date)) {
        return false;
    }
    return true;
}

function postcode_is_valid(code) {
    let tmp = /^[0-9]{4}$/;
    if (!tmp.test(code)) {
        return false;
    }
    return true;
}

const render_page = () => {
    if (!input_is_valid(streetname)) {
        textarea.value = 'Please input a valid street name';
    } else if (!input_is_valid(suburb)) {
        textarea.value = 'Please input a valid suburb';
    } else if (!postcode_is_valid(postcode.value)) {
        textarea.value = 'Please input a valid postcode';
    } else if (!birthday_is_valid(birthday.value)) {
        textarea.value = 'Please enter a valid date of birth';
    } else {
        let dob = birthday.value;
        dob = new Date(dob);
        let age = now.getFullYear() - dob.getFullYear();
        if (now.getMonth() < dob.getMonth()) {
            age--;
        } else if (now.getMonth() == dob.getMonth() && now.getDate() < dob.getDate()) {
            age--;
        }
        let featurechecked = [];
        if (heating.checked) {
            featurechecked.push(heating.value);
        }
        if (airconditioning.checked) {
            featurechecked.push(airconditioning.value);
        }
        if (pool.checked) {
            featurechecked.push(pool.value);
        }
        if (sandpit.checked) {
            featurechecked.push(sandpit.value);
        }
        if (featurechecked.length == 0) {
            featurechecked = 'no features';
        } else {
            featurechecked = featurechecked.join(', ');
            featurechecked = featurechecked.replace(/,([^,]*)$/, ' and$1');
        }

        let aan = selectedtype.value === 'house' ? 'a' : 'an';
        textarea.value = `You are ${age} years old, and your address is ${streetname.value} St, ${suburb.value}, ${postcode.value}, Australia. Your building is ${aan} ${selectedtype.value}, and it has ${featurechecked}.`;
    }
}



streetname.addEventListener('blur', render_page);
suburb.addEventListener('blur', render_page);
selectedtype.addEventListener('change', render_page);
postcode.addEventListener('blur', render_page);
birthday.addEventListener('blur', render_page);
features.forEach(feature => feature.addEventListener('change', render_page));

remove.onclick = () => {
    form.reset();
    textarea.value = '';
}
selectall.onclick = () => {
    if (selectall.innerHTML = 'deselect all') {
        if (heating.checked) {
            heating.checked = false;
        }
        if (airconditioning.checked) {
            airconditioning.checked = false;
        }
        if (pool.checked) {
            pool.checked = false;
        }
        if (sandpit.checked) {
            sandpit.checked = false;
        }
        selectall.innerHTML = 'select all';
    } else {
        if (!heating.checked) {
            heating.checked = true;
        }
        if (!airconditioning.checked) {
            airconditioning.checked = true;
        }
        if (!pool.checked) {
            pool.checked = true;
        }
        if (!sandpit.checked) {
            sandpit.checked = true;
        }
        selectall.innerHTML = 'deselect all';
    }
}
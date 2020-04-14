function btnCancel_Clicked() {
    window.location = url_Web;
}

function validationForm(validationMessage) {
    Swal.fire({
        type: 'info',
        title: 'Warning',
        html: validationMessage
    });
}

function JsonToArray(obj) {
    var array = JSON.parse(obj);
    // iterate backwards ensuring that length is an UInt32
    for (var i = obj.length >>> 0; i--;) {
        array[i] = JSON.parse(obj[i]);
    }
    return array;
}

function successPrompt() {
    Swal.fire({
        type: 'success',
        title: 'Success',
        text: 'Save Successfully'
    });
}

function generateAutoNumber(name) {
    var prefixName = '';
    var firstChar = name.charAt(0);
    var lastChar = name.substr(-2).toUpperCase();
    prefixName = firstChar + lastChar;
    var currentYear = new Date(dateServer).getFullYear();
    return prefixName + '-' + currentYear + '-XXXX';
}

function generateCreateDate() {
    var currentYear = new Date(dateServer).getFullYear();
    var currentMonth = new Date(dateServer).getMonth() + 1;
    var currentDate = new Date(dateServer).getDate();
    if (currentMonth.toString().length === 1) {
        currentMonth = '0' + currentMonth;
    }
    if (currentDate.toString().length === 1) {
        currentDate = '0' + currentDate;
    }
    return currentDate + '/' + currentMonth + '/' + currentYear;
}

function toMMDDYYYY(date) {
    var date_arr = date.split(" ");
    var datePart = date_arr[0].split("/");
    if (datePart[1].toString().length === 1) {
        datePart[1] = '0' + datePart[1];
    }
    if (datePart[0].toString().length === 1) {
        datePart[0] = '0' + datePart[0];
    }
    var MMDDYYYY = [datePart[1], datePart[0], datePart[2]].join('/');
    return MMDDYYYY;
}

function toMMDDYYYYDate(date) {
    var date_arr = date.split(" ");
    var datePart = date_arr[0].split("/");
    var dt = new Date(parseInt(datePart[2], 10),
        parseInt(datePart[0], 10) - 1,
        parseInt(datePart[1], 10));
    return dt;
}

function formateDate(dateParam) {
    var currentYear = new Date(dateParam).getFullYear();
    var currentMonth = new Date(dateParam).getMonth() + 1;
    var currentDate = new Date(dateParam).getDate();
    if (currentMonth.toString().length === 1) {
        currentMonth = '0' + currentMonth;
    }
    if (currentDate.toString().length === 1) {
        currentDate = '0' + currentDate;
    }
    return currentDate + '/' + currentMonth + '/' + currentYear;
}

function returnDateFromDDMMYYYY(strDate) {
    var parts = strDate.split("/");
    var dt = new Date(parseInt(parts[2], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10));
    return dt;
}

function returnDateFromYYYYMMDDT(strDate) {
    var parts = strDate.split("T");
    var partsDate = parts[0].split("-");
    var dt = new Date(parseInt(partsDate[0], 10),
        parseInt(partsDate[1], 10) - 1,
        parseInt(partsDate[2], 10));
    return dt;
}

function addCommas(str) {
    return str.replace(/^0+/, '').replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function removeCommas(str) {
    return str.replace(/,/g, '');
}

function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}


function autocomplete(inp, arr, page) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                    if (page === "budgettopup") {
                        LoadDMEReqDatatopUp();
                    }
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode === 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt !== x[i] && elmnt !== inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0].toLocaleLowerCase());
        vars[hash[0].toLocaleLowerCase()] = hash[1];
    }
    return vars;
}
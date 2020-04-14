//when status == 1 set the loader on
function startSpinner(text, status) {
    var elementExist = document.getElementsByClassName("coverScreen");
    if (status == 1 && elementExist.length == 0) {
        $('body').append('<div class="coverScreen"><div class="spinnerWrapper"><div class="mul8"><div class="mul8circ1"></div><div class="mul8circ2"></div></div><div class="spinnerText"><span class="textContainer">' + text + '</span></div></div></div>');
    }
    else {
        if (status == 1 && elementExist.length > 0) { elementExist[0].style.display = 'block'; }
        else { elementExist[0].style.display = 'none'; }
    }
}
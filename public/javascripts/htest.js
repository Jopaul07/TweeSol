$(document).ready(function () {
    if ($(window).width() < 960) {
        $('#sidebar').addClass('active');
        var nw = $('#navid').width();
        var sw = $('#sidebar').width();
        var tw = nw - sw - 48;
        if ($(window).width() > 767) {
            var sw = 80;
            var tw = nw - sw - 48;
            $('#content').width(tw);
        }
        else {
            var nw = $('#navid').width();
            var sw = $('#sidebar').width();
            var tw = nw - sw - 48;
            $('#content').width(tw);
        }

    }
    else {
        $('#sidebar').removeClass('active');
        var nw = $('#navid').width();
        var sw = $('#sidebar').width();

        var tw = nw - sw - 48;

        $('#content').width(tw);
    }
    
   
    



    $(window).resize(function () {
        setTimeout(recheck, 300);
        if ($(window).width() < 960) {
            $('#sidebar').addClass('active');
        }
        else {
            $('#sidebar').removeClass('active');
        }
    });
});
function recheck() {
    var sw = $('#sidebar').width();
    var nw = $('#navid').width();
    var tw = nw - sw - 48;
    $('#content').width(tw);
}
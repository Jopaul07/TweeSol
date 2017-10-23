$(document).ready(function () {
    console.log("winsize:" + $(window).width());
    if ($(window).width() < 960) {
        $('#sidebar').addClass('active');
        var nw = $('#navid').width();
        var sw = $('#sidebar').width();
        console.log("win-side-bar:" + sw);
        var tw = nw - sw - 48;
        if ($(window).width() > 767) {
            var sw = 80;
            var tw = nw - sw - 48;
            $('#content').width(tw);
            console.log(" 960>sw>767:" + sw);
        }
        else {
            var nw = $('#navid').width();
            var sw = $('#sidebar').width();
            var tw = nw - sw - 48;
            console.log(" 960>767>sw:" + sw);
            $('#content').width(tw);
        }

    }
    else {
        $('#sidebar').removeClass('active');
        var nw = $('#navid').width();
        var sw = $('#sidebar').width();

        console.log("desktop-size:" + sw);
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
    console.log("rc-sidebar-width:" + sw);
    $('#content').width(tw);
}
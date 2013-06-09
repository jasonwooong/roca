function rocaInit() {
    if(document.COLORIZE_NAVBAR) {
        colorizeNavbar();
    } else {
        $(".navbar .navbar-inner").css('background', 'rgba(20,20,20,0.75)');
        $(".navbar .navbar-inner").css('border-top', '1px solid rgba(75,75,75,0.6)');
    }

    if(document.ENABLE_PARALLAX) {
        enableParallax();
    }

    justifyGalleries();
    $(".content").fitVids();
}

/*
    Parallax header effect:
    http://abduzeedo.com/super-easy-parallax-effect-jquery

    Photo should also fade to half opacity when scollTop matches
    div height of header element.
*/
function enableParallax() {
    if (!$("#header img").length || !$("#header")) {
        console.warn("Parallax header settings incorrect.  Please verify DOM structure.");
        return;
    }

    // Don't use parallax effect on mobile devices
    if ( !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) { 
        $(document).scroll(function () {
            var s = $(document).scrollTop();
            var h = $("#header").height();

            $("#header img").css("-webkit-transform", "translateY(" + (s/2) + "px)");
            $("#header img").css({opacity: 1 - (s/h) / 2 });
        })
    } else {
        console.warn('Parallax header not supported on mobile devices.');
    }
}

/*
    Use miromannino's JS justify gallery library to properly align photos.

    TinyMCE Usage:

    To turn a collection of images to a justified gallery simply insert them
    into a 1 x 1 table (one row, one column) and set its class to "gallery".

    Visit the following for more information:
    http://miromannino.it/projects/justified-gallery/
*/
function justifyGalleries() {
    if ($(this).justifiedGallery) {
        if (!$("table.gallery").length) {
            return;
        }
        // Replace table with a wrapper and then justify galleries
        $("table.gallery").each(function(i) {
            var gallery = $('td:first', this);
            gallery.wrap('<div class="container"></div>');
            gallery.contents().unwrap();

            var container = $('.container', this);
            container.insertBefore($(this));
            container.justifiedGallery({'captions': false});
            $(this).remove();
        });
    }
}


/*
  
    Randomly select a color to be used as navbar background on each pageload.

*/
function colorizeNavbar() {
    if (!$(".navbar .navbar-inner").length) {
        console.warn('Selector ".navbar .navbar-inner" does not exist.  Cannot randomize background color.');
        return;
    }

    var DARKEN = 0.5;  // Reduce the luminance of random navbar color
    var ALPHA = 0.75;

    var r, g, b;
    r = Math.round((Math.random()*255));
    g = Math.round((Math.random()*255));
    b = Math.round((Math.random()*255));

    var rgb = new Array(3); // base rgb color spec
    var rgb_light = new Array(3);  // lightened version of base color
    
    // Adjust luminance for both color specs
    for(i = 0; i < rgb.length; i++) {
        rgb[i] = Math.round((Math.random()*255) * (1 - DARKEN));
        rgb_light[i] = rgb[i] + 15;
    }

    $(".navbar .navbar-inner").css('background', 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + ALPHA + ')');
    $(".navbar .navbar-inner").css('border-top', '1px solid rgba(' + rgb_light[0] + ',' + rgb_light[1] + ',' + rgb_light[2] + ',' + 0.8 + ')');
    $(".navbar .navbar-inner").css('border-bottom', '1px solid rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + ALPHA / 2 + ')');
}
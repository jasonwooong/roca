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
    All HTML items classed as "img-justify" will be justified.

    Example:

        <div id="img-justify" >
          <a href="myimage1.jpg" title="Title 1">
            <img alt="Title 1" src="myimage1_m.jpg"/>
          </a>
          <a href="myimage2.jpg" title="Title 2">
            <img alt="Title 2" src="myimage2_m.jpg"/>
          </a>
          <!-- other images... -->
        </div>

    Visit the following for more information:

    http://miromannino.it/projects/justified-gallery/
*/
function justifyGalleries() {
    if ($(this).justifiedGallery) {
        if (!$(".img-justify").length) {
            console.warn('Unable to find galleries to justify.  Have you specified class="img-justify" on the gallery?');
            return;
        }
        $(".img-justify").each(function(i) {
            $(this).justifiedGallery({'captions': false});
        });
    }
}


/*
  
    Randomly select a color to be used as navbar background on each pageload.

*/
function randomizeNavbar() {
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
}

$(document).ready(function () {
    justifyGalleries();
    randomizeNavbar();    
    enableParallax();
})
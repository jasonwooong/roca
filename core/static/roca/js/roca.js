function rocaInit() {
    if(document.COLOR_SPLASH) {
        colorize();
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
            // Build photo url from filename and lazily wrap images with respective <a> tag.
            if(!$('a', this).length) {
                $("img", this).each(function() {
                    var $this = $(this);
                    var src, filename, photo;
                    src = $this.attr('src');

                    var flickr = /^https?:\/\/.*staticflickr\.com/;
                    if(!flickr.test(src)) throw "Cannot justify gallery using " + src + ". Photo is not from valid Flickr source.";

                    filename = src.substr(src.lastIndexOf("/") + 1);
                    // Splice on first underbar to remove secret key, extension from photo id
                    photo = filename.substr(0, filename.indexOf("_"));
                    if(!$this.attr('alt'))
                        $this.attr('alt', $this.attr('title'));
                    $this.wrap('<a title="' + $this.attr('alt') + 
                        '" href="' + "http://flic.kr/p/" + base58.encode(parseInt(photo)) + 
                        "/lightbox" + '"></a>');
                })
            }

            var options = {
                'captions': false,
                'rowHeight': 150,
                'margins': 1,
            };
            var gallery = $('td:first', this);
            gallery.wrap('<div class="container"></div>');
            gallery.contents().unwrap();

            var container = $('.container', this);
            container.insertBefore($(this));

            if($(this).hasClass('captions'))
                options['captions'] = true;
            if($(this).hasClass('labels')) {
                options['captions'] = true;
                options['labels'] = true;
            }
            container.justifiedGallery(options);
            $(this).remove();
        });
    }
}


/*
  
    Randomly select a color to be used as navbar background on each pageload.
    Each blog post title will also be colorized at random.

*/
function colorize() {
    if (!$(".navbar .navbar-inner").length) {
        console.warn('Selector ".navbar .navbar-inner" does not exist.  Cannot randomize background color.');
        return;
    }

    var ALPHA = 0.75;
    var options = {
        darken: 0.30,
    };
    var randomRGB = this.randomRGB(options);

    $(".navbar .navbar-inner").css('background', 'rgba(' + randomRGB['rgb'][0] + ',' + randomRGB['rgb'][1] + ',' + randomRGB['rgb'][2] + ',' + ALPHA + ')');
    $(".navbar .navbar-inner").css('border-top', '1px solid rgba(' + randomRGB['rgb_light'][0] + ',' + randomRGB['rgb_light'][1] + ',' + randomRGB['rgb_light'][2] + ',' + 0.8 + ')');
    $(".navbar .navbar-inner").css('border-bottom', '1px solid rgba(' + randomRGB['rgb'][0] + ',' + randomRGB['rgb'][1] + ',' + randomRGB['rgb'][2] + ',' + ALPHA / 2 + ')');
    $("footer").css('border-bottom-color', 'rgb(' + randomRGB['rgb'][0] + ',' + randomRGB['rgb'][1] + ',' + randomRGB['rgb'][2] + ')');

    var that = this
    $('.blog-post').not(".first").each(function() {
        var options = {
            brightness: 0.60,
        };
        var randomRGB = that.randomRGB(options);
        $('h2.title a', this).css('color', 'rgb(' + randomRGB['rgb'][0] + ',' + randomRGB['rgb'][1] + ',' + randomRGB['rgb'][2] + ')');
        $('.title', this).css('border-left-color', 'rgb(' + randomRGB['rgb_light'][0] + ',' + randomRGB['rgb_light'][1] + ',' + randomRGB['rgb_light'][2] + ')');
        $('h6.author', this).css('border-left-color', 'rgb(' + randomRGB['rgb_light'][0] + ',' + randomRGB['rgb_light'][1] + ',' + randomRGB['rgb_light'][2] + ')');
    });
}

/*
    Accepts the following colors to seed randomized colors:

    All values are percentage based from 0.0 to 1.0.

    options {
        brightness: 0.5,
        low: 0.0,
        high: 0.0,
        darken: 0.0,
        lighten: 0.0
    }
    

*/
function randomRGB(options) {
    options['brightness'] = typeof options['brightness'] !== 'undefined' ? options['brightness'] : 0.5;
    options['low'] = typeof options['low'] !== 'undefined' ? options['low'] : 0;
    options['high'] = typeof options['high'] !== 'undefined' ? options['high'] : 1;
    options['darken'] = typeof options['darken'] !== 'undefined' ? options['darken'] : 0;
    options['lighten'] = typeof options['lighten'] !== 'undefined' ? options['lighten'] : 0;

    var MAX = 255;

    var low = MAX * options['low'];


    var rgb = new Array(3); // base rgb color spec
    var rgb_light = new Array(3);  // lightened version of base color
    
    // Adjust luminance for both color specs
    for(i = 0; i < rgb.length; i++) {
        rgb[i] = low + (Math.random()*(MAX * options['high'] - low));
    };

    var b = MAX * options['brightness'];
    var a = b / (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114); // Apply weighted brightness multipliers

    for(i = 0; i < rgb.length; i++) {
        rgb[i] *= a;
        rgb[i] = Math.round(rgb[i] * (1 - options['darken']) / (1 - options['lighten']));
        rgb_light[i] = rgb[i] + 25;
    };

    var random = {
        'rgb': rgb,
        'rgb_light': rgb_light
    };

    // Print perceived brightness value
    //console.log('brightness: ' + (0.299*random['rgb'][0] + 0.587*random['rgb'][1] + 0.114*random['rgb'][2]))

    return random;
}

/*
 Base 58 implementation by inflammable:
 https://gist.github.com/inflammable/2929362
*/
var base58 = (function(alpha) {
    var alphabet = alpha || '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
        base = alphabet.length;
    return {
        encode: function(enc) {
            if(typeof enc!=='number' || enc !== parseInt(enc))
                throw '"encode" only accepts integers.';
            var encoded = '';
            while(enc) {
                var remainder = enc % base;
                enc = Math.floor(enc / base);
                encoded = alphabet[remainder].toString() + encoded;        
            }
            return encoded;
        },
        decode: function(dec) {
            if(typeof dec!=='string')
                throw '"decode" only accepts strings.';            
            var decoded = 0;
            while(dec) {
                var alphabetPosition = alphabet.indexOf(dec[0]);
                if (alphabetPosition < 0)
                    throw '"decode" can\'t find "' + dec[0] + '" in the alphabet: "' + alphabet + '"';
                var powerOf = dec.length - 1;
                decoded += alphabetPosition * (Math.pow(base, powerOf));
                dec = dec.substring(1);
            }
            return decoded;
        }
    };
})();
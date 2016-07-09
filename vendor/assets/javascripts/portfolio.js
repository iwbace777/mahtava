/*
 * Portfolio.js v1.0
 * jQuery Plugin for Portfolio Gallery
 * http://portfoliojs.com
 *
 * Copyright (c) 2012 Abhinay Omkar (http://abhiomkar.in) @abhiomkar
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Dependencies
 *  - jQuery: http://jquery.com
 *  - jQuery easing: http://gsgd.co.uk/sandbox/jquery/easing
 *  - jQuery touch swipe: http://labs.skinkers.com/touchSwipe
 *  - jQuery imagesLoaded: http://desandro.github.com/imagesloaded
 *  - jQuery scrollTo: http://flesler.blogspot.in/2007/10/jqueryscrollto.html
 *  - JS Spin: http://fgnass.github.com/spin.js

 * */

;(function($) {

    $.fn.portfolio = function(settings) {
        
    // default values 
    var defaults = {
        autoplay: false,
        firstLoadCount: 4,
        enableKeyboardNavigation: true,
        loop: true,
        easingMethod: 'easeOutQuint',
        height: '500px',
        width: '100%',
        lightbox: false,
        showArrows: true,
        logger: true
    };

    // overriding default values
    $.extend(this, defaults, settings);

    // Local variables
    var portfolio = this, gallery = this,
    currentViewingImage,
    totalLoaded = 0,
    offset_left = 6,
    imageLoadedCalled = false;

    // portfolio public methods
    $.extend(this, {
        version: "0.1v",
        init: function() {

            portfolio.scrollToOptions={axis: 'x', easing: portfolio.easingMethod, offset: -4}

            // Responsive for Mobile
            if ($(window).width() <= 700) {
                // if mobile, reduce the gallery height to fit on screen
                // 200px fixed height is good enough?
                
                // override gallery height
                portfolio.height = '200px';
            }

            // CSS Base
            $(this).css({
                width: portfolio.width,
                'max-height': portfolio.height,
                'overflow-x': 'scroll',
                'overflow-y': 'hidden',
                'white-space': 'nowrap'
            });

            $(this).find('img').css({
                display: 'inline-block',
                'max-width': 'none',
                height: portfolio.height,
                width: 'auto'
            });


            $(this).find("img").css('display', 'none');
            // end

            // set all images element attribute loaded to false and hide, bcoz the
            // game is not yet started :)
            $(this).find("img").attr('loaded', 'false');
            // end

            // mark first & last images
            $(this).find("img").first().attr('first', 'true').css({'margin-left': '5px'});
            $(this).find("img").last().attr('last', 'true').css({'margin-right': '6px'});
            // end

            // spinner
            // show spinner while the images are being loaded...
            portfolio.spinner.show('100%');

            // load first 4 images
            portfolio.loadNextImages(portfolio.firstLoadCount);
            
            // First Image
            $(this).find("img").first().addClass('active');

            if (portfolio.lightbox) {
                $(gallery).find('img').not('.active').animate({opacity: '0.2'});
                $(gallery).find('img.active').animate({opacity: '1'});
                $(gallery).css({ 'overflow-x': 'hidden' });
            }

            // Show Arrows
            if (portfolio.showArrows) {
                portfolio.navigation.show();
            }

            // add a 5px space at the end
            $('.gallery-blank-space').css({
                position: 'absolute',
                width: '5px',
                height: portfolio.height,
            });

            // Events

            /* Swipe Left */
            $(this).swipe( {
                swipeLeft: function() {
                                portfolio.next();
                            },
                swipeRight: function() {
                                portfolio.prev();
                            }
            });

            $(this).find('img').on('movestart', function(e) {
                console_.log('movestart');
                if ((e.distX > e.distY && e.distX < -e.distY) ||
                    (e.distX < e.distY && e.distX > -e.distY)) {
                    e.preventDefault();
                        // TODO: touchstart? the gallery should follow the
                        // finger on touchstart
                } 
            });

            /* Click */
            $(this).find("img").click(function(event) {

                if ($(gallery).find('img.active')[0] === $(this)[0]) {
                    // If clicked on the current viewing image
                    // then scroll to next image
                    portfolio.next();

                }
                else {
                    // clicked on the next image or particular image, scroll to that image
                    portfolio.slideTo($(this));
                }
            }); // click()

            // Gallery Scroll
            $(this).scroll(function() {
                    if ($(gallery).find('img').last().attr('loaded') === 'true') {
                        $('.gallery-blank-space').css({left: $(gallery).find('img').last().data('offset-left') + $(gallery).find('img').last().width() + 'px'});
                    }

                    // if (gallery[0].offsetWidth + gallery.scrollLeft() >= gallery[0].scrollWidth) // scroll end condition
                    
                    // scroll amount is greater than 60%
                    if ((gallery[0].offsetWidth + gallery.scrollLeft())*100 / gallery[0].scrollWidth > 60) {

                        if (totalLoaded < $(gallery).find('img').length) {
                            console_.log('scroll(): loading some more images');
                            portfolio.loadNextImages(6);
                            // $(gallery).find('img[loaded=true]').last().addClass('ctive');

                        }
                    }
            });

            // Window Resize
            $(window).resize(function() {
                if ($(window).width() <= 700 && $(gallery).find('img').first().height()!==200) {
                    $(gallery).css({height: '200px'});
                    $(gallery).find('img').css({height: '200px'});
                    $(gallery).find('.gallery-arrow-left, .gallery-arrow-right').css({height: '200px'});
                }
                else if ($(window).width() > 700 && $(gallery).find('img').first().height()===200) {
                    $(gallery).css({height: portfolio.height});
                    $(gallery).find('img').css({height: portfolio.height});
                    $(gallery).find('.gallery-arrow-left, .gallery-arrow-right').css({height: portfolio.height});
                }
            });

        }, // init

        next: function() {

            var cur_img = $(gallery).find('img.active'),
                next_img = $(gallery).find('img.active').next();

            if($(cur_img).attr('last') === 'true') {

                // if on last image and if loop is on 
                if(portfolio.loop) {
                    // go to first image 
                    console_.log('last', 'loop: on');

                    $(gallery).scrollTo(0, 500, portfolio.scrollToOptions);

                    $(gallery).find('img').removeClass('active').first().addClass('active');

                    if (portfolio.lightbox) {
                        $(gallery).find('img').not('.active').animate({opacity: '0.2'});
                        $(gallery).find('img.active').animate({opacity: '1'});
                    }
                }
                else {
                    console_.log('last', 'loop: off');
                }
            }

            // if next image is already loaded
            else if ($(next_img).attr('loaded') === 'true') {
                // go to next image
                $(gallery).scrollTo(next_img, 600, portfolio.scrollToOptions);

                $(gallery).find('img').removeClass('active');
                $(next_img).addClass('active');

                if (portfolio.lightbox) {
                    $(gallery).find('img').not('.active').animate({opacity: '0.2'});
                    $(gallery).find('img.active').animate({opacity: '1'});
                }

            }
            // if next image is not yet loaded
            else if ($(next_img).attr('loaded') === 'false') {
                // show the spinner and prepare to load next images
                console_.log('next images are being loaded...');
            }

            /*
            if (gallery.offsetWidth + gallery.scrollLeft >= gallery.scrollWidth) {
                console_.log('scrollEnd');
                var spinner_target = $(currentViewingImage).after('<span class="spinner-container"></span>');
                $(gallery).scrollTo($(currentViewingImage).data("offset-left") + 100, 500, {axis: 'x'});
                portfolio.spinner(spinner_target);
            }
            */
            console_.log('next: current viewing image', $(gallery).find('img.active'));
        },

        prev: function() {
            var cur_img = $(gallery).find('img.active'),
                prev_img = $(gallery).find('img.active').prev();

            if($(cur_img).attr('first') === 'true') {
                // If on first Image stay there, do not scroll
            }
            else if (prev_img){
                // go to prev image
                $(gallery).scrollTo(prev_img, 500, portfolio.scrollToOptions);

                $(gallery).find('img').removeClass('active');
                $(prev_img).addClass('active');

                if (portfolio.lightbox) {
                    $(gallery).find('img').not('.active').animate({opacity: '0.2'});
                    $(gallery).find('img.active').animate({opacity: '1'});
                }
            }

            console_.log('prev: current viewing image', $(gallery).find('img.active'));
        },

        slideTo: function(img) {

            $(gallery).scrollTo(img, 500, portfolio.scrollToOptions);

            $(gallery).find('img').removeClass('active');
            $(img).addClass('active');

            if (portfolio.lightbox) {
                $(gallery).find('img').not('.active').animate({opacity: '0.2'});
                $(gallery).find('img.active').animate({opacity: '1'});
            }

        },

        spinner: {
            remove: function() {
                $(gallery).find('.spinner-container').remove();
            },

            show: function(width) {
                // Spinner
                portfolio.spinner.remove();

                var lastImg = $(gallery).find('img[loaded=true]').last();
                $(gallery).append('<span class="spinner-container"></span>');
                $(gallery).find('.spinner-container').css({
                    display: 'inline-block',
                    height: portfolio.height,
                    width: width,
                    'vertical-align': 'top'
                });

                var opts = {
                    lines: 17, // The number of lines to draw
                    length: 4, // The length of each line
                    width: 2, // The line thickness
                    radius: 5, // The radius of the inner circle
                    corners: 1, // Corner roundness (0..1)
                    rotate: 0, // The rotation offset
                    color: '#000', // #rgb or #rrggbb
                    speed: 1.5, // Rounds per second
                    trail: 72, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: parseInt(portfolio.height)/2, // Top position relative to parent in px
                    left: 'auto' // Left position relative to parent in px
                };

                var spinner = new Spinner(opts).spin($(gallery).find('.spinner-container')[0]);
            }
        },

        loadNextImages: function(count) {
                // console_.log('loading...', totalLoaded, count, $(gallery).find(".photo img").slice(totalLoaded, totalLoaded + count));

            if (!imageLoadedCalled) {
                var nextImages;
                
                // load first few pictures - gallery init
                nextImages   = $(gallery).find("img[loaded=false]").slice(0, count);
                $(nextImages).each(function(index) {
                    // current img element
                    var cur_img = this;

                    cur_img.src = $(cur_img).data('src');
                    $(cur_img).attr('loaded', 'loading');
                }); // each()

                // .imagesLoaded callback on images having src attribute but not loaded yet
                // on otherwords, filter only loading images
                $(nextImages).imagesLoaded(function($img_loaded){

                    console_.log('images loaded:');
                    console_.log($img_loaded);
                    $img_loaded.each(function(index) {
                        var img = this;

                        // Inorder to fadeIn effect to work, make the new
                        // img element invisible by 'display: none'
                        $(img).css({display: 'none'});
                        portfolio.spinner.remove();
                        $(img).fadeIn('slow');

                        img_width = $(img).width();

                        totalLoaded += 1;

                        $(img).data('width', img_width);
                        $(img).attr('loaded', 'true');

                    }); // each()

                    portfolio.spinner.show('100px');
                    imageLoadedCalled = false;

                    // loaded all images
                    if (totalLoaded === $(gallery).find('img').length) {
                        portfolio.spinner.remove();
                    }
                    else if (gallery[0].offsetWidth === gallery[0].scrollWidth) {
                        // if the first loaded images doesn't fill the
                        // offsetWidth of gallery then load some more images
                        portfolio.loadNextImages(6);
                    }

                }); // imagesLoaded()

                imageLoadedCalled = true;
            } // if(!imageLoadedCalled)

        }, // loadNextImages
        navigation: {
            show: function() {
                if (portfolio.navigation.created) {
                    // arrows already exists, do not create again
                    $('.gallery-arrow-left, .gallery-arrow-right').show();
                }
                else {
                    // create arrows
                    $(gallery).before('<span class="gallery-arrow-left"></span>').after('<span class="gallery-arrow-right"></span>');
                    $(gallery).prev('.gallery-arrow-left').css({
                        position: 'absolute',
                        left: $(gallery).position().left,
                        height: portfolio.height,
                        width: '50px',
                        'z-index': '9999',
                        // inline image for arrow-left
                        background: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAYAAAASYli2AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAA5pJREFUeNp8ls1qG2cUht/z/WksY6tY2KZg8MIL9zKy6LKlJbQUCm3sQK+gNMQxjn8S0+QKsrRpAqFNCWnpBbiFLnUbpts4IdZozndON/MNn0YjCw6akUbPvOc9PyMyxmDeS1WbdyICEcEYA2MMnHM7xpgda+2Hfr9/dnl5+QoAYK2dCufc1DkRAQCICNZahBBQFMVev9/X5eVlHQ6Hura2Jtvb2z+qKsh73yjoUicizffGGFhrD6y1J957eO/hnIP3HgCwsbGxa733TRp55DdQ1QTbr2HkvUcIoQnvPaqq+th57yEijUcJICJTSgEcEtFRsiUpDCE0NhHRYAqYKxIRMDNUFTHGh0R0mMOSKuccnHMwxmBxcfFf1+v1EGOcURdjBAASkWMAB8nDBMhVWmsB4I8Qwj1XFAWqqppRR0QQkUMABwCSh00npKhT/QvAnYuLi7euKIopdXWKFGN8BGCfiNpVbrfVGyLaGY1GbwHA9Xq9BpTUicgJgP3U9DfA/iSiO6PR6Cpl6IqiQIwx9RtNJpNTVd1rT1B7UgC8VtXdHAYAJpXdOQcAjxMsr3oOqz9/A2CXiK7a42rqShkAT1X1QVtZPsf1+e+q+h2Aq675NyEEIyKnInIvKWiPYVb916p6V1XfZw0/DSzL8gdmvp8vgvY818e/isj3IvIuzXeapvzlmPnreYqy45e1snHdBYgxomv1GWNMzFdUG1afa4K0YwZYFMVvXb6lvqyPvxWRcxFZZGbkMQNcWlo6W1hYeDLP5KRcVb+JMf4SY1y6CehUVUII+5PJBJPJ5H475dR/tXe3mVmI6C4Rveuscg2QEMJeCOE03965FclDEfkqxvi8qqrlfKk0wPxB5L1/6L3/uf1ISNVMO5KZv2Dms6qqlucCk1Lv/QPv/UmuMEXeMjHG28z8YjgcDmaA7YI4546cc4/bwKQyKY0xfs7M5ysrKw3UpAtaUK2fbkdtaLbiUvpfMvOLwWDwEQCYGGNzUYKmH1trj621x10FytNn5s+Y+Xx9fX1gt7a2cH193fanCRG5EBFV1VuqSvkGav27+AQA2c3NTYzHYySlXeOlqn/XGdy6aQBijCuuqiowM+Z42SgxxhyLCAN4BIA65h3GmPeuLMsGmBR2gWv4KREZACddSwTAM7u6uoqyLGeMbvmY3+QfVS0BfJploET0EzM/c+PxeOq5nAMTpEPJEyL6D8COqn4gorMY4ysA+H8AlUj0uGFo1ssAAAAASUVORK5CYII=) center left no-repeat",
                        'background-position': '8px',
                        opacity: '0.2'
                    });
                    $(gallery).next('.gallery-arrow-right').css({
                        position: 'absolute',
                        right: $(gallery).position().left,
                        top: $(gallery).position().top,
                        height: portfolio.height,
                        width: '50px',
                        'z-index': '9999',
                        // inline image for arrow-right
                        background: "url(data:image/png;base64,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) center left no-repeat",
                        'background-position': '8px',
                        opacity: '0.2'
                    });

                    $(gallery).prev('.gallery-arrow-left').click(function(e) {
                        portfolio.prev();
                    });

                    $(gallery).next('.gallery-arrow-right').click(function(e) {
                        portfolio.next();
                    });

                    $('.gallery-arrow-left, .gallery-arrow-right').hover(function(){
                        // Mouse In
                        $(this).css({ 'opacity': '0.5' });
                    },
                    function() {
                        // Mouse Out
                        $(this).css({ 'opacity': '0.2' });
                    }); // hover()

                    $(gallery).mousemove(function(){
                        portfolio.navigation.show();
                    });

                    $('.gallery-arrow-left, .gallery-arrow-right').delay(3000).fadeOut();
                    portfolio.navigation.created = true;

                } // if.. else..
            }, // show() 

            hide: function() {
                $('.gallery-arrow-left, .gallery-arrow-right').fadeOut();
            }, // hide()
            created: false
        } // navigation
    }); // extend()

    // keyboard navigation
    if (this.enableKeyboardNavigation) {
            $(document).keydown(function(e) {
                    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
                    switch(key) {
                            case 73: // 'i' key
                                        // go to first slide
                                    portfolio.slideTo($(gallery).find('img').first());
                                    break;
                            case 65: // 'a' key
                                        // go to last slide
                                    portfolio.slideTo($(gallery).find('img').last());
                                    break;

                            case 75: // 'k' key
                            case 37: // left arrow
                                    portfolio.navigation.hide();
                                    portfolio.prev();
                                    e.preventDefault();
                                    break;
                            // case 74: // 'j' key
                            case 39: // right arrow
                                    portfolio.navigation.hide();
                                    portfolio.next();
                                    e.preventDefault();
                                    break;
                    }
            });
    } // keyboard shortcuts

    // logger
    var console_ = {
        log: function() {
            if (this.active) {
                // var l = [];
                for (var i=0, len=arguments.length; i < len; i++) {
                    // l.push(arguments[i]);
                    console.log(arguments[i]);
                }
                // console.log(l.join(' '));
            }
        },
        active: portfolio.logger
    } // console_

    return this;
} // $.fn.portfolio

// TODO
// handle keyboard shortcuts in a smart way when multiple galleries are used

})(jQuery);

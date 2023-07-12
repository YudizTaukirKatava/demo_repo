$('#live-auctions .img-tilt').tilt({
    maxTilt: 5,
    glare: true,
    maxGlare: 0.5,
});

$('#live-auctions').owlCarousel({
    loop: false,
    margin: 24,
    dots: false,
    autoplay: false,
    nav: true,
    navText: [
        "<img src='/assets/img/ArrowRight.svg'>",
        "<img src='/assets/img/ArrowLeft.svg'>",
    ],
    responsive: {
        0: {
            items: 2,
            margin: 12,
            nav: true,
            dots: true,
        },
        575: {
            items: 2,
        },
        992: {
            items: 3,
        },
        1300: {
            items: 4,
        },
    },
});

$('.banner-slider').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    dots: true,
    arrows: false,
    speed: 3000,
    pauseOnHover: false,
    responsive: [
        {
            breakpoint: 575,
            settings: {
                adaptiveHeight: true,
                speed: 500,
            },
        },
    ],
});

setInterval(() => {
    if (window.innerWidth > 991) {
        if (!$('.primary-slide').hasClass('slick-active')) {
            $('.primary-slide .col-content-otr').css('opacity', '0');
            $('.primary-slide .bg-gradient').css('border-radius', '24px');
            $('.primary-slide .bg-gradient').css('width', '200%');
        } else {
            $('.primary-slide .col-content-otr').css('opacity', '1');
            $('.primary-slide .bg-gradient').css('width', '130%');
            $('.primary-slide .bg-gradient').css(
                'border-radius',
                '24px 0px 0px 24px'
            );
        }
    }
}, 800);

$('.close-icn').on('click', function (e) {
    e.preventDefault();
    $(this).parents().find('.modal').hide();
});

var dropdownId = '';
$('.select-dropdown__button').on('click', function () {
    dropdownId = $(this).parent().attr('id');
    $('#' + dropdownId + ' .select-dropdown__list').toggleClass('active');
});
$('.select-dropdown__list-item').on('click', function () {
    var itemValue = $(this).data('value');
    $('#' + dropdownId + ' .select-dropdown__button span')
        .text($(this).text())
        .parent()
        .attr('data-value', itemValue);
    $('#' + dropdownId + ' .select-dropdown__list').removeClass('active');
});

// OTP modal logic

$('.otpbox-container input').keyup(function (e) {
    if ($(this).val() > 0) {
        if (
            e.key == 1 ||
            e.key == 2 ||
            e.key == 3 ||
            e.key == 4 ||
            e.key == 5 ||
            e.key == 6 ||
            e.key == 7 ||
            e.key == 8 ||
            e.key == 9 ||
            e.key == 0
        ) {
            $(this).next().focus();
        }
    } else {
        if (e.key == 'Backspace') {
            $(this).prev().focus();
        }
    }
});

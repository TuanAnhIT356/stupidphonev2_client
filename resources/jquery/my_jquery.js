$(document).ready(function() {
    //Resize event
    function onResize() {
        if ($(this).width() < 975) {
            $("#header").hide();
            $(".navbar-right").hide();
        } else {
            $("#header").show();
            $(".navbar-right").show();
        }

        if ($(this).width() < 750) {
            $(".navbar-right").show();
            $("#header").show();
            $(".navbar-header").append($("#search-bar"));
        } else
            $("#form-div").append($("#search-bar"));

        if ($(this).width() < 992) {
            $("#footer").addClass("text-center");
            $("#footer ul").css("list-style-type", "none");
        } else {
            $("#footer").removeClass("text-center");
            $("#footer ul").css("list-style-type", "disc");
        }
    }
    onResize();
    $(window).resize(onResize);

    //Add class active for reg tab
    $("#reg-btn").on("click", function() {
        $("#reg-tab").addClass("active");
        $("#reg").addClass("in active");
        $("#login-tab").removeClass("active");
        $("#login").removeClass("active");
    });

    //Add class active for login tab
    $("#login-btn").on("click", function() {
        $("#login-tab").addClass("active");
        $("#login").addClass("in active");
        $("#reg-tab").removeClass("active");
        $("#reg").removeClass("active");
    });

    $("#buy-btn").on("click", function() {
        $("#login-tab").addClass("active");
        $("#login").addClass("in active");
        $("#reg-tab").removeClass("active");
        $("#reg").removeClass("active");
    });

    $("#pay-btn").on("click", function() {
        $("#login-tab").addClass("active");
        $("#login").addClass("in active");
        $("#reg-tab").removeClass("active");
        $("#reg").removeClass("active");
    });

    //Smooth scrolling
    $("footer a[href='#myPage']").on('click', function(event) {
        event.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 900, function() {
            window.location.hash = hash;
        });
    });

    //Slide animation
    $(window).scroll(function() {
        $(".slideanim").each(function() {
            var pos = $(this).offset().top;
            var winTop = $(window).scrollTop();
            if (pos < winTop + 600) {
                $(this).addClass("slide");
            }
        });
    });

    //Load img in form
    $("#img_sm_input").on("change", function() {
        var fileName = $("#img_sm_input").val();
        $("#img_sm").attr("src", "/Content/img/" + fileName);
    });
    $("#img_lg_input").on("change", function() {
        var fileName = $("#img_lg_input").val();
        $("#img_lg").attr("src", "/Content/img/" + fileName);
    });

    //Confirm payment
    $('[data-confirm]').click(function(e) {
        if (!confirm(jQuery(this).attr("data-confirm"))) {
            e.preventDefault();
        }
    });

    //Login submit
    $("#submit-login").on("click", function() {
        $("#confirm-pwd").attr("value", $("#pwd").val());
    });
});
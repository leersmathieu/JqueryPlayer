/*Fonction de base du lecteur*/

$(document).ready(function () {

    //clic sur la barre de progression
    $('#time').click(function (e) {
        var ev = e || window.event;
        var pos = findPos(this);
        var diffx = ev.clientX - pos.x;
        $("#time").progressbar({
            value: diffx * 100 / $(this).width()
        });
        var duration = $('video')[0].duration;
        $('video')[0].currentTime = diffx * duration / $(this).width();
    });
    
    //barre de volume
    $("#volume").slider({
        slide: function (event, ui) {
            var volume = ui.value / 100;
            setVolume(volume);
        },
        value: 50
    });

    //joue la vidéo
    $("#play").click(function () {
        $('video')[0].play();
        setInterval("setTime()", 10);

    });

    //met en pause la vidéo
    $("#pause").click(function () {
        $('video')[0].pause();
    });

    //stop la vidéo
    $("#stop").click(function () {
        $('video')[0].pause();
        $('video')[0].currentTime = 0;
    });

    //mute/unmute en cliquant sur l'icone volume
    $("#btn_volume").click(function () {
        var volume = $("#volume").slider("option", "value");
        if (volume > 0)
            setVolume(0);
        else
            setVolume(0.5);
    });

    //vue large
    $('#largescreen').click(function () {
        //si pas encore large
        if ($('#video').attr('rel') != 'largescreen'){ 
            //on aggrandi la video
            $('#video').css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
            }).attr('rel', 'largescreen');

            //on met la barre de controles en bas de la page
            $('#video').css({
                position:'initial'
            })

            $('#player').css({
                width:'100%',
            });

        } else {
            //on remet la vidéo en mode normal
            $('#video').removeAttr('style').removeAttr('rel');

            $('#player').css({
                width: '800px',
            });
        }
    })

    //plein écran
    $("#fullscreen").click(function () {

        var video = $('#video').get(0);
        if (video.requestFullScreen) {
            //fonction officielle du w3c
            video.requestFullScreen();
        } else if (video.webkitRequestFullScreen) {
            //fonction pour Google Chrome (on lui passe un argument pour autoriser le plein écran lors d'une pression sur le clavier)
            video.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (video.mozRequestFullScreen) {
            //fonction pour Firefox
            video.mozRequestFullScreen();
        } else { //fallback pour anciens navigateurs
            //si pas déjà en pleine écran
            if ($('#video').attr('rel') != 'fullscreen') {
                //on met la vidéo en pleine écran
                $('#video').css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                }).attr('rel', 'fullscreen');
                //on met la barre de controles en bas de la page
                $('#controls').css({
                    position: 'absolute',
                    bottom: 0,
                    marginLeft: 'auto',
                    marginRight: 'auto'
                });
                //la barre apparait si on passe dessus
                setTimeout("$('#controls').animate({opacity : 0.0}, 500);", 1000);
                $('#controls').hover(function () {
                    $(this).animate({
                        opacity: 1.0
                    }, 200);
                }, function () {
                    $(this).animate({
                        opacity: 0.0
                    }, 500);
                });
            } else {
                //on remet la vidéo en mode normal
                $('#video').removeAttr('style').removeAttr('rel');
                //on remet la barre de control en dessous de la vidéo
                $('#controls').animate({
                    opacity: 1.0
                }, 1).off('hover').removeAttr('style').removeAttr('style');
            }
        }

    });
    
    
}); 

/*Barre de progression*/

$("#time").progressbar();

    //syncronisation vidéo/barre de progression
function setTime() {
    $("#time").progressbar({
        value: $('video')[0].currentTime * 100 / $('video')[0].duration
    });
}
    // Déterminer position HTML
function findPos(el) {
    var x = y = 0;
    if (el.offsetParent) {
        x = el.offsetLeft;
        y = el.offsetTop;
        while (el = el.offsetParent) {
            x += el.offsetLeft;
            y += el.offsetTop;
        }
    }
    return {
        'x': x,
        'y': y
    };
}
/* volume */

function setVolume(value) {
    if (value == 0)
        $("#btn_volume").css('opacity', 0.3);
    else
        $("#btn_volume").css('opacity', 1.0);
        $("#volume").slider("option", "value", value * 100);
        $('video')[0].volume = value;
}

/* switch video */

let tabVid = ["video/selfie2.mp4","video/scy.mp4","video/nekfeu-plume.mp4"]
let vidSelector = 0

console.log(vidSelector)

let previousVideo = () => {
    vidSelector--
    if (vidSelector < 0) {
        vidSelector = tabVid.length -1

    }
    $('#srcVideo').attr("src", tabVid[vidSelector])
}

let nextVideo = () => {
    if (tabVid.length > vidSelector){
        vidSelector++
        if ( vidSelector >= tabVid.length){
            vidSelector = 0

        }
        $('#srcVideo').attr("src",tabVid[vidSelector])
    }
}

$('#next').on('click', () => {
    nextVideo()
    $('video')[0].load();
    $('video')[0].play();
})

$('#previous').on('click', () => {
    previousVideo()
    $('video')[0].load();
    $('video')[0].play();
})


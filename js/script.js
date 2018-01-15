(function () {
    /* Plus button -----------------------------------------------*/
    var overlay = document.getElementById('overlay');

    document.getElementById('plus-btn').addEventListener('click', animationToggle);
    /* if btn has animation then remove it otherwise add it. */
    function animationToggle() {
        [...document.querySelectorAll('.plus-option')].map(function (btn, i) {
            btn.classList.contains('animation') ? removeAnimation(btn) : addAnimation(btn, i);
            return btn;
        });
    }
    /* add animation and timeout every btn for 30ms. Add overlay */
    function addAnimation(btn, i) {
        setTimeout(function () {
            btn.classList.add('animation');
        }, 30 * i);
        /* for every btn it's 30ms times that index */
        overlay.classList.add('overlay');
    }
    /* remove animation and overlay */
    function removeAnimation(btn) {
        btn.classList.remove('animation');
        overlay.classList.remove('overlay');
    }

    /* clicking on white transparent overlay */
    overlay.addEventListener('click', function () {
        animationToggle();
    });

    /* end of Plus button --------------------------------------------*/

    /*  */
    var clientObject = {
        user: 'Daniel',
        id: '',
        dashboard: []
    };



})();
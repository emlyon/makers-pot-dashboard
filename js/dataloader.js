addEventListener( 'load', e => {
    const splitPath = location.pathname.split( '/' );
    const cred = creds[ splitPath[ splitPath.length - 1 ].split( '.' )[ 0 ] ];
    const link = `https://io.adafruit.com/api/v2/${ cred.username }/feeds?X-AIO-Key=${ cred.key }`;
    // console.log( link );

    ( function getData() {
        let water = 0, waterTarget = 0,
            leds = 0, ledsTarget = 0,
            pump = 0, pumpTarget = 0;

        let waterCanvas = document.querySelector( '.water canvas' ),
            waterCtx = waterCanvas.getContext( '2d' ),
            pumpCanvas = document.querySelector( '.pump canvas' ),
            pumpCtx = pumpCanvas.getContext( '2d' ),
            ledsCanvas = document.querySelector( '.leds canvas' ),
            ledsCtx = ledsCanvas.getContext( '2d' );

        let survol = document.querySelector( '.water' );
        let w = waterCanvas.width = waterCanvas.height =
            pumpCanvas.width = pumpCanvas.height =
            ledsCanvas.width = ledsCanvas.height =
            survol.offsetWidth;

        function ease( value, target, easingVal ) {
            let d = target - value;
            if( Math.abs( d ) > 1 ) value += d * easingVal;
            else value = target;
            return value;
        }

        function displayCanvas( ctx, value, max ){
            ctx.fillStyle = 'grey';
            ctx.fillRect( 0, 0, w, w );

            ctx.fillStyle = '#E2001A';
            ctx.fillRect( 0, w - value/max*w, w, w );
        }

        ( function updateCanvas(){
            requestAnimationFrame( updateCanvas );

            water = ease( water, waterTarget, 0.02 );
            pump = ease( pump, pumpTarget, 0.02 );
            leds = ease( leds, ledsTarget, 0.02 );

            displayCanvas( waterCtx, water, 2 * 100 );
            displayCanvas( pumpCtx, pump, 1 * 100 );
            displayCanvas( ledsCtx, leds, 1 * 100 );
        } )();


        fetch( link ).then( r => r.json() )
            .then( data => {
                console.log( data );

                data.forEach( d => {
                    let val = + d.last_value;

                    switch( d.key ){
                        case 'waterlevel':
                            waterTarget = val * 100;
                            document.querySelector( '.water span' ).innerText = messages.water[ val ][ ~~( Math.random() * messages.water[ val ].length ) ].toUpperCase();
                            break;

                        case 'pump':
                            pumpTarget = val * 100;
                            document.querySelector( '.pump span' ).innerText = messages.pump[ val ][ ~~( Math.random() * messages.pump[ val ].length ) ].toUpperCase();
                            break;

                        case 'leds':
                            ledsTarget = val * 100;
                            document.querySelector( '.leds span' ).innerText = messages.leds[ val ][ ~~( Math.random() * messages.leds[ val ].length ) ].toUpperCase();
                            break;
                    }
                } );

                [].forEach.call( document.querySelectorAll( '.info-text' ), d => d.style.opacity = 1 );
            } )
            .catch( e => console.log( `error: ${ e }` ) );

        setTimeout( getData, 5 * 60000 );
    } )();
} );

/* ========================================
   SCENE 2 - MẪU
   ======================================== */

window.scenes = window.scenes || {};

window.scenes.scene2 = {
    id: 'scene2',
    name: 'Hành Lang',
    background: 'images/background2.png',
    enterMessage: 'nơi này âm u quá...',
    
    lights: [],
    
    items: {},
    
    hotspots: [],
    
    transitions: [
        {
            id: 'back-to-scene1',
            image: 'images/muitenxanh.png',
            bottom: '1%',
            left: '40%',
            width: '9%',
            height: '30%',
            rotate: '250deg',
            targetScene: 'scene1'
        }
    ]
};

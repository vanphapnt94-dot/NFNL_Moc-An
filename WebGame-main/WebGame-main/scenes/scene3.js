/* ========================================
   SCENE 3 - OPENAI
   ======================================== */

window.scenes = window.scenes || {};

window.scenes.sceneOpenAI = {
    id: 'sceneOpenAI',
    name: 'OpenAI',
    background: 'images/anh1.png',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    enterMessage: null,

    lights: [],
    decorations: [
        {
            id: 'openai-paper',
            name: 'OpenAI',
            image: 'images/OpenAI.png',
            top: '10%',
            left: '27%',
            width: '46%',
            height: '82%',
            zIndex: 25
        }
    ],
    items: {},
    hotspots: [],

    transitions: [
        {
            id: 'back-to-scene1-from-openai',
            image: 'images/muitenxanh.png',
            bottom: '13%',
            right: '5%',
            width: '9%',
            height: '30%',
            targetScene: 'scene1'
        }
    ]
};

/* ========================================
   SCENE 1 - PHÒNG THỜ
   ======================================== */

window.scenes = window.scenes || {};

window.scenes.scene1 = {
    id: 'scene1',
    name: 'Phòng Thờ',
    background: 'images/anh1.png',
    enterMessage: null,
    
    lights: [
        {
            id: 'den-trai',
            top: '29%',
            left: '33.60%'
        },
        {
            id: 'den-phai',
            top: '26%',
            left: '56.55%'
        }
    ],

    decorations: [
        {
            id: 'decor-ai',
            name: 'AI',
            image: 'images/AI.png',
            top: '36%',
            left: '73%',
            width: '12%',
            height: '22%',
            zIndex: 9
        }
    ],

    interactionZones: [
        {
            id: 'hitbox-ai',
            name: 'AI Hitbox',
            top: '41.5%',
            left: '75.5%',
            width: '7%',
            height: '11%',
            zIndex: 20,
            openImage: 'images/OpenAI.png',
            chatMode: true,
            characterId: 'ai_assistant'
        },
        {
            id: 'hitbox-next-scene',
            name: 'Chuyen sang scene 2',
            top: '30%',
            left: '10%',
            width: '9%',
            height: '35%',
            zIndex: 20,
            targetScene: 'scene2'
        }
    ],
    
    items: {
        'dua': {
            name: 'Nhang',
            image: 'images/nhang3.png',
            top: '77%',
            left: '45%',
            width: '50%',
            height: '12%',
            pickupMessage: 'Đã nhặt được nhang. Mùi hương thoảng nhẹ làm lòng ta bồn chồn.',
            useMessage: 'Bạn cầm nhang lên. Mùi hương thanh tao lan tỏa, có vẻ cần dùng nó ở đâu đó...',
            singleUse: false
        }
    },
    
    hotspots: [
        {
            id: 'hotspot-lu-huong',
            top: '75%',
            left: '15.70%',
            width: '14.4%',
            height: '16.67%',
            message: 'Lư hương đã nguội lạnh, chỉ còn tàn tro.'
        },
        {
            id: 'hotspot-ban-tho',
            top: '41.67%',
            left: '37.11%',
            width: '24.41%',
            height: '20%',
            message: 'Trên bàn thờ có một bức tượng quái dị đang nhìn chằm chằm vào tôi.'
        },
        {
            id: 'hotspot-tuong',
            top: '41.67%',
            left: '61.52%',
            width: '7.81%',
            height: '33.33%',
            message: 'Pho tượng hộ pháp cầm kiếm, ánh mắt dữ tợn.'
        }
    ],
    
    transitions: []
};

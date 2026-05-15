/* ========================================
   HUYẾT TÂN NƯƠNG - GAME ENGINE (FULL FIXED)
   ======================================== */

const hopThoai = document.getElementById("hop-thoai");
const noiDung = document.getElementById("noi-dung-thoai");
const overlay = document.getElementById("overlay");
const nhanVat = document.getElementById("nhan-vat");
const gameContainer = document.getElementById("game-container");
const gameWrapper = document.getElementById("game-wrapper");
const gameAspectRatio = document.getElementById("game-aspect-ratio");
const warningScreen = document.getElementById("warning-screen");

// ========================================
// MÀN HÌNH CẢNH BÁO
// ========================================
function dongCanhBao() {
    if (warningScreen.classList.contains('hidden')) return;

    gameContainer.classList.remove('enter-scene');
    void gameContainer.offsetWidth;
    gameContainer.classList.add('enter-scene');

    warningScreen.classList.add('closing');
    setTimeout(() => {
        warningScreen.classList.add('hidden');
        warningScreen.classList.remove('closing');
    }, 420);

    setTimeout(() => {
        gameContainer.classList.remove('enter-scene');
    }, 700);
}

// ========================================
// HỆ THỐNG TÚI ĐỒ (INVENTORY)
// ========================================
const inventory = {
    slots: [null, null, null, null, null],

    themItem: function(itemId, itemName, itemImage) {
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i] === null) {
                this.slots[i] = { id: itemId, name: itemName, image: itemImage };
                this.capNhatUI(i);
                return i + 1;
            }
        }
        return -1;
    },

    capNhatUI: function(slotIndex) {
        const slotElement = document.getElementById(`slot-${slotIndex + 1}`);
        const item = this.slots[slotIndex];
        if (item) {
            slotElement.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
            slotElement.classList.add('has-item');
            slotElement.title = item.name;
        } else {
            slotElement.innerHTML = '';
            slotElement.classList.remove('has-item');
            slotElement.title = `Ô túi đồ ${slotIndex + 1}`;
        }
    },

    xoaItem: function(slotIndex) {
        this.slots[slotIndex] = null;
        this.capNhatUI(slotIndex);
    },

    coItem: function(itemId) {
        return this.slots.some(slot => slot && slot.id === itemId);
    }
};

// ========================================
// HỘP THOẠI
// ========================================
function khamPha(loiDan) {
    overlay.style.display = "block";
    hopThoai.style.display = "block";
    nhanVat.style.display = "block";
    setTimeout(() => { nhanVat.classList.add("show"); }, 10);
    noiDung.innerText = loiDan;
}

function dongHopThoai() {
    nhanVat.classList.remove("show");
    setTimeout(() => { nhanVat.style.display = "none"; }, 300);
    overlay.style.display = "none";
    hopThoai.style.display = "none";
}

function themDongChat(chatLog, role, text) {
    const row = document.createElement('div');
    row.className = `chat-line ${role}`;
    row.textContent = text;
    chatLog.appendChild(row);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// ========================================
// MỞ ẢNH / CHAT AI
// ========================================
function moAnhTrongGame(imagePath, imageAlt, chatMode) {
    const cu = document.getElementById('in-game-image-layer');
    if (cu) cu.remove();

    const layer = document.createElement('div');
    layer.id = 'in-game-image-layer';
    layer.className = 'in-game-image-layer';

    if (!chatMode) {
        layer.innerHTML = `
            <div class="in-game-image-backdrop"></div>
            <div class="in-game-chat-shell single-image">
                <button class="in-game-chat-close" type="button">x</button>
                <div class="in-game-chat-image-wrap">
                    <img src="${imagePath}" alt="${imageAlt || 'Image'}">
                </div>
            </div>
        `;
    } else {
        layer.innerHTML = `
            <div class="in-game-image-backdrop"></div>
            <div class="in-game-chat-shell">
                <button class="in-game-chat-close" type="button">x</button>
                <div class="in-game-chat-image-wrap">
                    <img src="${imagePath}" alt="${imageAlt || 'AI'}">
                </div>
                <div class="in-game-chat-panel">
                    <div class="in-game-chat-header">Chat</div>
                    <div class="in-game-chat-log">
                        <div class="chat-line ai">Xin chào...?</div>
                    </div>
                    <form class="in-game-chat-form" id="in-game-chat-form">
                        <input id="in-game-chat-input" type="text" maxlength="150" placeholder="Nhập câu hỏi..." autocomplete="off">
                        <button type="submit">Gửi</button>
                    </form>
                </div>
            </div>
        `;
    }

    const closeBtn = layer.querySelector('.in-game-chat-close');
    const backdrop = layer.querySelector('.in-game-image-backdrop');
    const dongLayer = () => layer.remove();

    closeBtn.onclick = dongLayer;
    backdrop.onclick = dongLayer;

    if (chatMode) {
        const chatForm = layer.querySelector('#in-game-chat-form');
        const chatInput = layer.querySelector('#in-game-chat-input');
        const chatLog = layer.querySelector('.in-game-chat-log');

        chatForm.onsubmit = (e) => {
            e.preventDefault();
            const userText = chatInput.value.trim();
            if (!userText) return;

            themDongChat(chatLog, 'user', userText);
            chatInput.value = '';
            chatInput.disabled = true;

            window.handleGameChatMessage(userText, (aiText) => {
                chatInput.disabled = false;
                chatInput.focus();
                if (!aiText) return;
                themDongChat(chatLog, 'ai', aiText);
            });
        };
    }

    gameContainer.appendChild(layer);
}

// ========================================
// VẬT PHẨM
// ========================================
function nhatItem(itemId) {
    const itemData = currentScene.items[itemId];
    if (!itemData) return;
    const slot = inventory.themItem(itemId, itemData.name, itemData.image);
    if (slot > 0) {
        const itemEl = document.getElementById(`item-${itemId}`);
        if (itemEl) itemEl.classList.add('collected');
        khamPha(itemData.pickupMessage);
    } else {
        khamPha('Túi đồ đã đầy!');
    }
}

function suDungItem(soO) {
    const item = inventory.slots[soO - 1];
    if (!item) {
        khamPha(`Ô túi đồ số ${soO} đang trống.`);
        return;
    }
    const itemData = currentScene.items[item.id];
    if (itemData) {
        khamPha(itemData.useMessage);
        if (itemData.singleUse) inventory.xoaItem(soO - 1);
    }
}

// ========================================
// CHUYỂN CẢNH
// ========================================
let currentScene = null;

function loadScene(sceneId) {
    const sceneData = window.scenes[sceneId];
    if (!sceneData) return;

    currentScene = sceneData;
    gameContainer.style.backgroundImage = `url('${sceneData.background}')`;

    if (gameAspectRatio) {
        const img = new Image();
        img.src = sceneData.background;
        img.onload = () => {
            const w = img.naturalWidth || 1011;
            const h = img.naturalHeight || 649;
            if (gameWrapper) {
                gameWrapper.style.setProperty('--scene-w', w);
                gameWrapper.style.setProperty('--scene-h', h);
            }
            gameAspectRatio.style.setProperty('--scene-w', w);
            gameAspectRatio.style.setProperty('--scene-h', h);
        };
    }

    clearSceneElements();
    createSceneElements(sceneData);
}

function clearSceneElements() {
    ['.hotspot', '.item', '.scene-transition', '.den-long', '.decoration', '.interaction-zone', '.in-game-image-layer']
        .forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));
}

function createSceneElements(data) {
    if (data.decorations) {
        data.decorations.forEach(d => {
            const div = document.createElement('div');
            if (d.id) div.id = d.id;
            div.className = 'decoration';
            div.style.cssText = `top:${d.top}; left:${d.left}; width:${d.width}; height:${d.height}; z-index:${d.zIndex || 9}`;
            div.innerHTML = `<img src="${d.image}">`;
            gameContainer.appendChild(div);
        });
    }

    if (data.interactionZones) {
        data.interactionZones.forEach(z => {
            const zone = document.createElement('div');
            if (z.id) zone.id = z.id;
            zone.className = 'interaction-zone';
            zone.style.cssText = `top:${z.top}; left:${z.left}; width:${z.width}; height:${z.height}; z-index:${z.zIndex || 20}`;

            if (z.targetScene) {
                zone.onclick = () => chuyenCanh(z.targetScene);
            } else if (z.openImage) {
                zone.onclick = () => {
                    if (z.chatMode && z.characterId) {
                        window.currentChatCharacter = z.characterId;
                    }
                    moAnhTrongGame(z.openImage, z.name || 'Image', !!z.chatMode);
                };
            }
            gameContainer.appendChild(zone);
        });
    }

    if (data.items) {
        Object.keys(data.items).forEach(id => {
            const it = data.items[id];
            const div = document.createElement('div');
            div.className = 'item';
            div.id = `item-${id}`;
            div.style.cssText = `top:${it.top}; left:${it.left}; width:${it.width}; height:${it.height}`;
            div.innerHTML = `<img src="${it.image}">`;
            div.onclick = () => nhatItem(id);
            gameContainer.appendChild(div);
        });
    }

    if (data.hotspots) {
        data.hotspots.forEach(hs => {
            const div = document.createElement('div');
            div.className = 'hotspot';
            div.style.cssText = `top:${hs.top}; left:${hs.left}; width:${hs.width}; height:${hs.height}`;
            div.onclick = () => khamPha(hs.message);
            gameContainer.appendChild(div);
        });
    }

    if (data.transitions) {
        data.transitions.forEach(tr => {
            const div = document.createElement('div');
            div.className = 'scene-transition';
            div.style.cssText = `bottom:${tr.bottom}; left:${tr.left}; width:${tr.width}; height:${tr.height}; transform:rotate(${tr.rotate || '0deg'}); transform-origin:center`;
            div.innerHTML = `<img src="${tr.image}">`;
            div.onclick = () => chuyenCanh(tr.targetScene);
            gameContainer.appendChild(div);
        });
    }
}

function chuyenCanh(id) {
    gameContainer.style.opacity = "0";
    setTimeout(() => {
        loadScene(id);
        gameContainer.style.opacity = "1";
        if (currentScene.enterMessage) khamPha(currentScene.enterMessage);
    }, 500);
}

window.addEventListener('DOMContentLoaded', () => loadScene('scene1'));

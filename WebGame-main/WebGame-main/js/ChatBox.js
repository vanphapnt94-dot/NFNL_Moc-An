/* ========================================
   GEMINI AI CHAT - FINAL VERSION
   ======================================== */

const WORKER_URL = "https://weathered-band-197b.vanphapnt9-4.workers.dev";

const chatSessions = {};

function khoiTaoChatSession(nhanVatId) {
    if (!chatSessions[nhanVatId]) {
        chatSessions[nhanVatId] = { 
            contents: [
                {
                    role: "user",
                    parts: [{ text: "Bạn luôn trả lời bằng tiếng Việt." }]
                },
                {
                    role: "model",
                    parts: [{ text: "Được, tôi sẽ luôn trả lời bằng tiếng Việt." }]
                }
            ]
        };
    }
    return chatSessions[nhanVatId];
}

async function guiTinNhanDenAI(nhanVatId, userMessage, callback) {
    try {
        const session = khoiTaoChatSession(nhanVatId);

        session.contents.push({
            role: "user",
            parts: [{ text: userMessage }]
        });

        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: session.contents,
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 300,
                    topP: 0.95,
                    topK: 40
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || "API Error");
        }

        if (!data.candidates || !data.candidates[0]) {
            throw new Error("Không nhận được phản hồi");
        }

        const text = data.candidates[0].content.parts[0].text;

        session.contents.push({
            role: "model",
            parts: [{ text: text }]
        });

        // Giữ 10 cặp hội thoại + 1 cặp system message
        if (session.contents.length > 22) {
            session.contents = [
                session.contents[0],
                session.contents[1],
                ...session.contents.slice(-20)
            ];
        }

        if (callback) callback(text);

    } catch (error) {
        console.error("❌ Lỗi:", error);

        let errorMsg = "*[Không thể kết nối]*";
        const errStr = error.message.toLowerCase();

        // XỬ LÝ LỖI KHU VỰC
        if (errStr.includes("location") || errStr.includes("not supported") || errStr.includes("region")) {
            errorMsg = "*[⚠️ Khu vực của bạn không được hỗ trợ bởi Gemini API. Vui lòng sử dụng VPN để truy cập!]*";
        } 
        // XỬ LÝ LỖI API KEY
        else if (errStr.includes("api key") || errStr.includes("invalid") || errStr.includes("api_key_invalid")) {
            errorMsg = "*[Lỗi: API Key không hợp lệ hoặc đã hết hạn]*";
        } 
        // XỬ LÝ LỖI HẾT QUOTA
        else if (errStr.includes("quota") || errStr.includes("429") || errStr.includes("exhausted") || errStr.includes("resource_exhausted")) {
            errorMsg = "*[Đã hết quota miễn phí. Vui lòng thử lại sau hoặc nâng cấp plan!]*";
        } 
        // XỬ LÝ LỖI MẠNG
        else if (errStr.includes("failed to fetch") || errStr.includes("network") || errStr.includes("timeout")) {
            errorMsg = "*[Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại!]*";
        } 
        // XỬ LÝ LỖI SERVER QUÁ TẢI
        else if (errStr.includes("503") || errStr.includes("overload") || errStr.includes("unavailable")) {
            errorMsg = "*[Server đang quá tải. Vui lòng thử lại sau vài giây!]*";
        }
        // LỖI KHÁC
        else {
            errorMsg = `*[Lỗi: ${error.message.substring(0, 80)}]*`;
        }

        if (callback) callback(errorMsg);
    }
}

window.handleGameChatMessage = function(userText, callback) {
    const currentCharacterId = window.currentChatCharacter || "default_chat";

    const chatLog = document.getElementById('in-game-chat-log');
    let dotCount = 0;
    let loadingInterval;

    if (chatLog) {
        const tempDiv = document.createElement('div');
        tempDiv.className = 'chat-line ai typing';
        tempDiv.textContent = 'Đang suy nghĩ';
        tempDiv.id = 'temp-typing-indicator';
        chatLog.appendChild(tempDiv);
        chatLog.scrollTop = chatLog.scrollHeight;

        loadingInterval = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            tempDiv.textContent = 'Đang suy nghĩ' + '.'.repeat(dotCount);
        }, 400);
    }

    guiTinNhanDenAI(currentCharacterId, userText, (aiText) => {
        if (loadingInterval) clearInterval(loadingInterval);
        const tempDiv = document.getElementById('temp-typing-indicator');
        if (tempDiv) tempDiv.remove();
        
        // Chỉ gọi callback cho game-engine.js xử lý hiển thị
        if (typeof callback === "function") callback(aiText);
    });
};

window.resetChatSession = function(nhanVatId) {
    const id = nhanVatId || window.currentChatCharacter || "default_chat";
    if (chatSessions[id]) {
        chatSessions[id].contents = [];
    }
};

console.log("✅ ChatBox.js loaded!");

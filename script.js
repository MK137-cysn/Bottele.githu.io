const PIN_CODE = "0319995568";
const TELEGRAM_BOT_TOKEN = '8340408055:AAF3P6mP_otUjtAnf535VD5aZaEQmOLXHKc';
const TELEGRAM_CHAT_ID = '-1003849367168'; // បានកែលេខ ID ថ្មីនៅទីនេះ

const wrapper = document.getElementById('mainWrapper');
const adminToggleBtn = document.getElementById('btnAdminMode');
let isAdmin = false;

// ១. ប្រព័ន្ធ Admin
adminToggleBtn.addEventListener('click', () => {
    if (!isAdmin) {
        if (prompt("សូមបញ្ចូលលេខកូដសម្ងាត់ (0319...)៖") === PIN_CODE) {
            isAdmin = true;
            document.body.classList.replace('admin-off', 'admin-on');
            adminToggleBtn.innerHTML = "🔒 LOCK ADMIN";
            updateEditable(true);
        } else { alert("លេខកូដមិនត្រឹមត្រូវ!"); }
    } else {
        isAdmin = false;
        document.body.classList.replace('admin-on', 'admin-off');
        adminToggleBtn.innerHTML = "🔓 UNLOCK ADMIN";
        updateEditable(false);
    }
});

function updateEditable(state) {
    document.querySelectorAll('.editable').forEach(el => el.contentEditable = state);
}

// ២. បង្កើតក្រដាសថ្មី
document.getElementById('btnAddPage').addEventListener('click', () => {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'a4-page';
    
    let headerHTML = `
        <div style="display:flex; justify-content:center; align-items:start; position:relative;">
            <div class="editable font-mool" style="text-align:center; font-size:17px; line-height:1.6;">
                ព្រះរាជាណាចក្រកម្ពុជា<br>ជាតិ សាសនា ព្រះមហាក្សត្រ<br>***
            </div>
            <div class="editable" style="position:absolute; right:0; top:0; text-align:right; font-size:12px;">
                សម័យប្រឡង៖ ២០២៦<br>ថ្នាក់ទី ១២
            </div>
        </div>
        <div style="text-align:center; margin-top:30px;">
            <div class="editable font-mool" style="font-size:18px;">វិទ្យាល័យ៖ ...........................................</div>
            <div class="editable font-mool" style="font-size:24px; margin-top:15px; border-bottom:2px solid #1a1a1a; display:inline-block; padding-bottom:5px;">វិញ្ញាសា៖ .....................</div>
        </div>
    `;

    pageDiv.innerHTML = `
        <button class="btn-del-page" onclick="if(confirm('លុប?')) this.parentElement.remove()">លុប</button>
        <div class="inner-border">
            <div class="ornament top-left"></div><div class="ornament top-right"></div>
            <div class="ornament bottom-left"></div><div class="ornament bottom-right"></div>
            
            <div class="editable" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%) rotate(-45deg); font-size:55px; color:rgba(197, 160, 89, 0.12); font-family:'Khmer OS Mool Light'; white-space:nowrap; z-index:0; text-align:center;">
                កម្មសិទ្ធិបញ្ញារបស់អ្នក
            </div>

            <div style="position:relative; z-index:1; flex-grow:1;">
                ${headerHTML}
                <div class="question-list" style="margin-top:35px;"></div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:flex-end; position:relative; z-index:1;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" style="width:20px; height:20px;">
                    <span class="editable" style="font-weight:bold; color:#0088cc; font-size:14px;">Channel: @YourName</span>
                </div>
                <div class="editable" style="font-style:italic; font-size:12px; color:#777;">រៀបរៀងដោយ៖ ....................</div>
            </div>
        </div>
    `;
    wrapper.appendChild(pageDiv);
    updateEditable(isAdmin);
    saveData();
});

// ៣. បន្ថែមសំណួរ
document.getElementById('btnAddQuestion').addEventListener('click', () => {
    const qBody = prompt("បញ្ចូលសំណួរ៖");
    if (!qBody) return;
    const qPoint = prompt("បញ្ចូលពិន្ទុ៖", "10");
    
    const areas = document.querySelectorAll('.question-list');
    const lastArea = areas[areas.length - 1];
    if(!lastArea) return alert("សូមបង្កើតក្រដាសសិន!");

    const num = lastArea.children.length + 1;
    const qDiv = document.createElement('div');
    qDiv.style.cssText = "display:flex; justify-content:space-between; margin-bottom:12px; text-align:justify;";
    qDiv.innerHTML = `
        <div style="flex:1; padding-right:10px;"><span class="editable"><b>${num}.</b> ${qBody}</span></div>
        <div style="white-space:nowrap;"><span class="editable" style="font-weight:bold;">(${qPoint} ពិន្ទុ)</span></div>
    `;
    lastArea.appendChild(qDiv);
    updateEditable(isAdmin);
    saveData();
});

// ៤. ផ្ញើទៅ Telegram (មាន Error Handling)
document.getElementById('btnSendTelegram').addEventListener('click', async () => {
    const pages = document.querySelectorAll('.a4-page');
    if (pages.length === 0) return alert("គ្មានក្រដាសសម្រាប់ផ្ញើ!");
    
    const wasAdmin = isAdmin;
    if (wasAdmin) { document.body.classList.replace('admin-on', 'admin-off'); updateEditable(false); }

    alert("កំពុងចាប់ផ្ដើមបញ្ជូន... សូមរង់ចាំ!");

    for (let i = 0; i < pages.length; i++) {
        try {
            const canvas = await html2canvas(pages[i], { scale: 2 });
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const formData = new FormData();
            formData.append('chat_id', TELEGRAM_CHAT_ID);
            formData.append('photo', blob, `page-${i + 1}.png`);
            formData.append('caption', `📄 វិញ្ញាសា (ទំព័រទី ${i+1})\n🚀 រៀបរៀងដោយប្រព័ន្ធ Premium Exam`);

            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, { 
                method: 'POST', 
                body: formData 
            });

            const result = await response.json();
            if (!result.ok) {
                alert(`Error: ${result.description}`);
            }
        } catch (error) {
            alert("បញ្ហាបច្ចេកទេស: " + error.message);
        }
    }
    
    alert("✅ រួចរាល់!");
    if (wasAdmin) { document.body.classList.replace('admin-off', 'admin-on'); updateEditable(true); }
});

// ៥. Download PNG
document.getElementById('btnDownloadImg').addEventListener('click', () => {
    const pages = document.querySelectorAll('.a4-page');
    pages.forEach((page, i) => {
        html2canvas(page, { scale: 2 }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Exam-Page-${i+1}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    });
});

// ៦. Zoom & Auto Save
document.getElementById('zoomSlider').oninput = (e) => wrapper.style.transform = `scale(${e.target.value})`;
function saveData() { localStorage.setItem('exam_v6_final_fix', wrapper.innerHTML); }
document.getElementById('btnSave').onclick = () => { saveData(); alert("Saved!"); };

window.onload = () => {
    const saved = localStorage.getItem('exam_v6_final_fix');
    if (saved) { wrapper.innerHTML = saved; updateEditable(isAdmin); }
    else { document.getElementById('btnAddPage').click(); }
};
wrapper.addEventListener('input', saveData);
      

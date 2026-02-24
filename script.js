const PIN_CODE = "0319995568";
const TELEGRAM_BOT_TOKEN = '8340408055:AAF3P6mP_otUjtAnf535VD5aZaEQmOLXHKc';
const TELEGRAM_CHAT_ID = '-1003849367168';

const wrapper = document.getElementById('mainWrapper');
const adminToggleBtn = document.getElementById('btnAdminMode');
let isAdmin = false;

// ១. Admin Mode
adminToggleBtn.addEventListener('click', () => {
    if (!isAdmin) {
        if (prompt("បញ្ចូលកូដសម្ងាត់៖") === PIN_CODE) {
            isAdmin = true;
            document.body.classList.replace('admin-off', 'admin-on');
            adminToggleBtn.innerHTML = "🔒 LOCK ADMIN";
            updateEditable(true);
        }
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

// ២. បង្កើតក្រដាសថ្មី (Layout ការពារការជាន់គ្នា និងមាន Footer ជាប់បាត)
document.getElementById('btnAddPage').addEventListener('click', () => {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'a4-page';
    
    let headerHTML = `
        <div class="exam-header">
            <div class="header-row">
                <div style="flex: 1; text-align: left;">
                    <div class="editable font-mool">ឈ្មោះសាលា៖ .....................</div>
                    <div class="editable font-mool" style="font-size: 13px; margin-top: 5px;">ប្រឡងប្រចាំ៖ .....................</div>
                </div>
                <div style="flex: 1.5; text-align: center;">
                    <div class="editable font-mool" style="font-size: 16px;">ព្រះរាជាណាចក្រកម្ពុជា<br>ជាតិ សាសនា ព្រះមហាក្សត្រ<br>***</div>
                </div>
                <div style="flex: 1; text-align: right;">
                    <div class="editable font-mool">ថ្នាក់ទី៖ .............</div>
                    <div class="editable" style="font-size: 12px; margin-top: 5px;">សម័យប្រឡង៖ ២០២៦</div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 5px;"><div class="editable" style="font-weight: bold; text-decoration: underline;">វិញ្ញាសាត្រៀមប្រឡង</div></div>
            <div style="text-align: center; margin-top: 10px;"><div class="editable font-mool" style="font-size: 24px; border-bottom: 2px solid #000; display: inline-block; padding: 0 15px 5px 15px;">វិញ្ញាសា៖ .....................</div></div>
        </div>
    `;

    pageDiv.innerHTML = `
        <button class="btn-del-page" onclick="this.parentElement.remove()">លុបសន្លឹកនេះ</button>
        <div class="inner-border">
            <div class="ornament top-left"></div><div class="ornament top-right"></div>
            <div class="ornament bottom-left"></div><div class="ornament bottom-right"></div>
            
            <div class="editable" style="position: absolute; top: 55%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 50px; color: rgba(197, 160, 89, 0.08); font-family: 'Khmer OS Mool Light'; z-index: 0; white-space: nowrap; pointer-events: none;">កម្មសិទ្ធិបញ្ញារបស់អ្នក</div>
            
            <div style="position: relative; z-index: 10; flex-grow: 1; display: flex; flex-direction: column;">
                ${headerHTML}
                <div class="question-list" style="margin-top: 30px;"></div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #eee; padding-top: 10px; margin-top: 20px; position: relative; z-index: 20;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" style="width: 20px; height: 20px;">
                    <span class="editable" style="font-weight: bold; color: #0088cc; font-size: 14px;">Channel: @YourName</span>
                </div>
                <div class="editable" style="font-style: italic; font-size: 13px; color: #555;">
                    រៀបរៀងដោយ៖ ....................
                </div>
            </div>
        </div>
    `;
    wrapper.appendChild(pageDiv);
    updateEditable(isAdmin);
    saveData();
});

// ៣. បន្ថែមសំណួរ
document.getElementById('btnAddQuestion').addEventListener('click', () => {
    let q = prompt("បញ្ចូលសំណួរ៖");
    if (!q) return;
    let p = prompt("បញ្ចូលពិន្ទុ៖", "10");
    let areas = document.querySelectorAll('.question-list');
    let last = areas[areas.length - 1];
    if(!last) return alert("ថែមក្រដាសសិន!");

    let qDiv = document.createElement('div');
    qDiv.className = 'q-row';
    qDiv.innerHTML = `
        <div style="display: flex; flex: 1;">
            <button class="btn-del-q" onclick="if(confirm('លុបសំណួរ?')) { this.closest('.q-row').remove(); saveData(); }">✕</button>
            <div style="flex: 1;"><span class="editable"><b>សំណួរ៖</b> ${q}</span></div>
        </div>
        <div style="min-width: 70px; text-align: right;"><span class="editable"><b>(${p} ពិន្ទុ)</b></span></div>
    `;
    last.appendChild(qDiv);
    updateEditable(isAdmin);
    saveData();
});

// ៤. ផ្ញើទៅ Telegram
document.getElementById('btnSendTelegram').addEventListener('click', async () => {
    const pages = document.querySelectorAll('.a4-page');
    if (pages.length === 0) return alert("គ្មានក្រដាស!");
    const wasAdmin = isAdmin;
    if (wasAdmin) { document.body.classList.replace('admin-on', 'admin-off'); updateEditable(false); }
    alert("កំពុងផ្ញើរូបភាព...");
    for (let page of pages) {
        const canvas = await html2canvas(page, { scale: 2 });
        const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
        const fd = new FormData();
        fd.append('chat_id', TELEGRAM_CHAT_ID);
        fd.append('photo', blob, 'exam.png');
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, { method: 'POST', body: fd });
    }
    alert("ផ្ញើជោគជ័យ!");
    if (wasAdmin) { document.body.classList.replace('admin-off', 'admin-on'); updateEditable(true); }
});

// ៥. សម្អាតទិន្នន័យ
document.getElementById('btnClearData').onclick = () => {
    if(confirm("លុបទិន្នន័យចាស់ដែលខូច?")) { localStorage.clear(); location.reload(); }
};

document.getElementById('zoomSlider').oninput = (e) => wrapper.style.transform = `scale(${e.target.value})`;
function saveData() { localStorage.setItem('exam_v11_final', wrapper.innerHTML); }
document.getElementById('btnSave').onclick = () => { saveData(); alert("រក្សាទុកបានជោគជ័យ!"); };

window.onload = () => { 
    let s = localStorage.getItem('exam_v11_final'); 
    if(s) { wrapper.innerHTML = s; updateEditable(isAdmin); } 
    else { document.getElementById('btnAddPage').click(); }
};

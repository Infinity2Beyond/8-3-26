let userName = "Cậu";

// Kiểm tra xem có truyền tên qua URL không (VD: ?name=Lan)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('name')) {
    userName = urlParams.get('name');
    document.getElementById('username-input').value = userName;
}

// =========================================
// 1. KHAI BÁO CẤU HÌNH & DANH SÁCH LỜI CHÚC
// =========================================
const wishes = [
    "Chúc cậu ngày 8/3 luôn xinh đẹp, rạng rỡ và ngập tràn niềm vui nhé!",
    "Happy Women's Day! Chúc cậu một ngày nhận được thật nhiều hoa và quà!",
    "Chúc cậu mãi luôn tự tin, yêu đời và thành công trong mọi dự định!",
    "Gửi đến cậu ngàn đóa hoa tươi thắm nhất. Ngày 8/3 thật hạnh phúc nha!",
    "Chúc bông hoa xinh đẹp nhất luôn tỏa sáng theo cách của riêng mình!",
    "Nụ cười của cậu rất đẹp, hãy luôn giữ nụ cười ấy trên môi nhé!"
];

const ground = document.getElementById('ground');
const numFlowers = 100; // Tổng số hoa
const isMobile = window.innerWidth < 768;
const sizeMultiplier = isMobile ? 1.8 : 1; 

const flowerHTML = `
    <div class="flower-glow"></div> 
    <div class="flower-top">
        <div class="flower-petal flower-petal__1"></div>
        <div class="flower-petal flower-petal__2"></div>
        <div class="flower-petal flower-petal__3"></div>
        <div class="flower-petal flower-petal__4"></div>
        <div class="flower-petal flower-petal__5"></div>
        <div class="flower-petal flower-petal__6"></div>
        <div class="flower-petal flower-petal__7"></div>
        <div class="flower-petal flower-petal__8"></div>
        <div class="flower-circle"></div>
        <div class="flower-light flower-light__1"></div>
        <div class="flower-light flower-light__2"></div>
        <div class="flower-light flower-light__3"></div>
    </div>
    <div class="flower-bottom">
        <div class="flower-stem"></div>
        <div class="flower-leaf flower-leaf__1"></div>
        <div class="flower-leaf flower-leaf__2"></div>
        <div class="flower-leaf flower-leaf__3"></div>
        <div class="flower-leaf flower-leaf__4"></div>
        <div class="flower-leaf flower-leaf__5"></div>
        <div class="flower-leaf flower-leaf__6"></div>
        <div class="flower-grass flower-grass__1"></div>
        <div class="flower-grass flower-grass__2"></div>
    </div>`;

// =========================================
// 2. CHIA LƯỚI TỌA ĐỘ ĐỂ HOA MỌC ĐỀU
// =========================================
const rows = isMobile ? 12 : 9; 
const cols = isMobile ? 9 : 12; 
const cellWidth = 98 / cols; 
const heightRange = isMobile ? 32 : 32; 
const startTop = isMobile ? 65 : 53;
const cellHeight = heightRange / rows; 

let gridPositions = [];
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        let baseY = startTop + (r * cellHeight) + (cellHeight / 2);
        let baseX = 2 + (c * cellWidth) + (cellWidth / 2);
        let jitterY = (Math.random() - 0.5) * (cellHeight * 0.9); 
        let jitterX = (Math.random() - 0.5) * (cellWidth * 0.9);
        gridPositions.push({ y: baseY + jitterY, x: baseX + jitterX });
    }
}
gridPositions.sort(() => Math.random() - 0.5);

// =========================================
// 3. TRỒNG HOA VÀ GẮN TƯƠNG TÁC (TỐI ƯU DOM)
// =========================================
const actualNumFlowers = Math.min(numFlowers, gridPositions.length);
const fragment = document.createDocumentFragment(); // Tối ưu hóa hiệu suất vẽ

for (let i = 0; i < actualNumFlowers; i++) {
    const flower = document.createElement('div');
    flower.className = 'flower-container';
    const randomHue = Math.floor(Math.random() * 120) + 180;    
    let topPos, leftPos, size, zIndex;

    if (i === 0) {
        topPos = isMobile ? 72 : 70; 
        leftPos = 50; 
        size = 4.5 * sizeMultiplier;
        flower.classList.add('flower-main'); 
    } else {
        topPos = gridPositions[i].y;
        leftPos = gridPositions[i].x;
        size = (1.5 + ((topPos - startTop) / heightRange) * 5) * sizeMultiplier; 
    }
    
    zIndex = Math.floor(topPos);
    flower.style.setProperty('--hue', randomHue);
    flower.style.top = `${topPos}%`;
    flower.style.left = `${leftPos}%`;
    flower.style.width = `${size}%`;
    flower.style.zIndex = zIndex;
    flower.innerHTML = flowerHTML;

    const showWish = (e) => {
        const popup = document.getElementById('wish-popup');
        const wishText = document.getElementById('wish-text');
        
        let rawWish = wishes[Math.floor(Math.random() * wishes.length)];
        let personalizedWish = rawWish.replace(/cậu/gi, userName);
        
        popup.classList.remove('hidden');
        
        // Hiệu ứng gõ chữ mượt mà hơn với con trỏ nhấp nháy
        wishText.innerHTML = '<span class="text-content"></span><span class="typing-cursor">|</span>';
        const textContent = wishText.querySelector('.text-content');
        const cursor = wishText.querySelector('.typing-cursor');
        
        let j = 0;
        function typingWish() {
            if (j < personalizedWish.length) {
                textContent.innerHTML += personalizedWish.charAt(j);
                j++;
                setTimeout(typingWish, 40);
            } else {
                cursor.style.display = 'none'; // Ẩn con trỏ khi gõ xong
            }
        }
        typingWish();
    };

    flower.addEventListener('click', showWish);
    flower.addEventListener('touchstart', showWish, { passive: true });
    fragment.appendChild(flower);
}
ground.appendChild(fragment); // Render 1 lần duy nhất

// =========================================
// 4. KỊCH BẢN ĐIỆN ẢNH (BẤM NÚT)
// =========================================
const bgMusic = document.getElementById('bg-music');
const flowers = document.querySelectorAll('.flower-container');
const startBtn = document.getElementById('start-btn');
const nameInput = document.getElementById('username-input');
const wishTitle = document.getElementById('wish-title');
const introScreen = document.getElementById('intro-screen');

function handleStart() {
    let name = nameInput.value.trim();
    if (name) userName = name; 
    if (wishTitle) wishTitle.innerText = `💌 Gửi tặng ${userName}`;
    document.title = `Gửi tặng ${userName} 🌸`;

    // Ép trình duyệt tải âm thanh ngay lập tức (Audio Preload Trick)
    bgMusic.play().then(() => {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }).catch(e => console.log("Audio unlock failed:", e));

    introScreen.style.opacity = '0';
    setTimeout(() => { introScreen.style.display = 'none'; }, 500);    
    
    // Thu phóng mặt đất
    ground.classList.add('start-zoom');
    
    // Giai đoạn 1: Chỉ mọc DUY NHẤT 1 bông hoa chính
    document.querySelector('.flower-main').classList.add('animate');

    // Đợi bông hoa nở xong (1.5s) rồi gõ thơ
    setTimeout(typeSkyPoem, 1500); 
}

startBtn.addEventListener('click', handleStart);
nameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleStart(); });

// =========================================
// 5. GÕ THƠ, HIỆN TRĂNG VÀ ĐIỂM ĐỈNH CAO
// =========================================
function typeSkyPoem() {
    const element = document.getElementById('sky-poem');
    const moon = document.getElementById('moon');
    if (!element || !moon) return;
    
    const text = element.getAttribute('data-text');
    
    // Thêm con trỏ nhấp nháy cho thơ
    element.innerHTML = '<span class="text-content"></span><span class="typing-cursor" style="color:#ff3366">|</span>'; 
    const textContent = element.querySelector('.text-content');
    const cursor = element.querySelector('.typing-cursor');
    
    let i = 0;
    const speed = 90;

    function typing() {
        if (i < text.length) {
            let char = text.charAt(i);
            textContent.innerHTML += (char === '|') ? "<br>" : char;
            i++;
            setTimeout(typing, speed);
        } else {
            cursor.style.display = 'none'; // Tắt con trỏ
            // Chờ 6 giây cho người dùng ngắm thơ (giảm từ 10s để đỡ sốt ruột)
            setTimeout(() => {
                element.classList.add('poem-fade-out'); 
                
                setTimeout(() => {
                    moon.classList.add('moon-activate'); 
                    moon.addEventListener('click', triggerClimax, { once: true });
                }, 1000);
            }, 6000); 
        }
    }
    typing();
}

function triggerClimax() {
    const mainFlower = document.querySelector('.flower-main');
    const mainPetals = document.querySelectorAll('.flower-main .flower-petal');
    const moon = document.getElementById('moon');

    // Dừng xoay bông hoa chính ngay lập tức
    if(mainFlower) mainFlower.style.animationPlayState = 'paused';
    moon.classList.add('hide-hint'); // Ẩn chữ gợi ý bấm trăng

    // 1. Từng cánh hoa rụng lả tả (Nâng cấp quỹ đạo rơi)
    mainPetals.forEach((petal, index) => {
        setTimeout(() => {
            const currentTransform = window.getComputedStyle(petal).transform;
            
            petal.style.animation = "none";
            petal.style.opacity = "0.9"; 
            petal.style.transform = currentTransform; 
            
            // Ép trình duyệt cập nhật thay đổi
            void petal.offsetWidth;
            
            // Random hóa quỹ đạo để tạo cảm giác gió thổi
            const swayX = (Math.random() - 0.5) * 120; // Lắc lư trái phải
            const rotX = Math.random() * 360; // Xoay 3D trục X
            const rotY = Math.random() * 360; // Xoay 3D trục Y
            const rotZ = (Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 90);
            
            petal.style.transition = "all 2.2s cubic-bezier(0.32, 0, 0.67, 0)"; // Gia tốc rơi tự nhiên
            // Vừa rụng xuống, vừa lả lướt sang ngang, vừa xoay lộn vòng
            petal.style.transform = `translate(${swayX}px, 250px) ${currentTransform} rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(0)`;
            petal.style.opacity = "0";
            
        }, index * 250); 
    });

    const totalDropTime = mainPetals.length * 250;

    // 2. Chạy nhạc sau khi cánh cuối cùng bắt đầu rụng
    setTimeout(() => {
        bgMusic.currentTime = 0;
        bgMusic.play();
        const calligraphyText = document.getElementById('calligraphy-text');
        if (calligraphyText) {
            calligraphyText.classList.add('animate-calligraphy');
        }

        // 3. Đợi đúng 2 giây sau khi nhạc chạy -> Bừng sáng và hồi sinh
        setTimeout(() => {
            document.body.classList.add('daytime'); 
            moon.style.opacity = "0";
            moon.style.transform = "translate(-50%, -50%) scale(0)";

            // 69 bông hoa còn lại đồng loạt mọc lên
            flowers.forEach((f, idx) => {
                if(!f.classList.contains('flower-main')) {
                    setTimeout(() => f.classList.add('animate'), idx * 25);
                }
            });
            
        }, 2000); 
    }, totalDropTime + 200); 
}

// =========================================
// 6. HIỆU ỨNG OUTRO (Trái tim sao)
// =========================================
function createStars() {
    for (let i = 0; i < (isMobile ? 50 : 100); i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 60 + 'vh';
        star.style.width = (Math.random() * 2 + 1) + 'px';
        star.style.height = star.style.width;
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(star);
    }
}
createStars();

const shootingStar = document.createElement('div');
shootingStar.className = 'shooting-star';
document.body.appendChild(shootingStar);

const skyHeart = document.createElement('div');
skyHeart.className = 'sky-heart';
skyHeart.innerHTML = `<svg style="background:transparent" viewBox="0 0 100 100"><path class="heart-path" d="M50 85 C50 85 10 55 10 30 C10 10 35 10 50 30 C65 10 90 10 90 30 C90 55 50 85 50 85 Z" /></svg>`;
document.body.appendChild(skyHeart);

bgMusic.addEventListener('timeupdate', () => {
    const timeLeft = bgMusic.duration - bgMusic.currentTime;
    if (timeLeft <= 5 && !skyHeart.classList.contains('animate-heart')) {
        skyHeart.classList.add('animate-heart');
        // shootingStar.classList.add('animate-shooting-star');
    }
});

document.getElementById('close-wish').onclick = () => document.getElementById('wish-popup').classList.add('hidden');
let userName = "cậu";
let isGameStarted = false;
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
let lastWishIndex = -1;

const ground = document.getElementById('ground');
const numFlowers = 70; // Tổng số hoa
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
// 2. RẢI HOA BẰNG TOÁN HỌC (FIBONACCI PHYLLOTAXIS)
// =========================================
let gridPositions = [];

// Tâm của xoắn ốc (Trùng với vị trí bông hoa chính)
const centerX = 50; 
const centerY = isMobile ? 80 : 70; 

// Hệ số dãn nở (Ép dẹt trục Y để tạo cảm giác phối cảnh 3D mặt đất)
const spreadX = isMobile ? 7 : 4.5; 
const spreadY = isMobile ? 2 : 2; 

// Góc vàng (Golden Angle) tính bằng radian
const goldenAngle = 137.5 * (Math.PI / 180);

let n = 2; // Bỏ qua vài n đầu tiên để chừa chỗ trống cho bông hoa chính ở giữa
let added = 0;

while (added < numFlowers) {
    let radius = Math.sqrt(n);
    let angle = n * goldenAngle;

    // Chuyển sang tọa độ Descartes và áp dụng hệ số phối cảnh
    let posX = centerX + (radius * Math.cos(angle) * spreadX);
    let posY = centerY + (radius * Math.sin(angle) * spreadY);

    // Thêm một chút nhiễu (jitter) nhỏ để khu vườn trông tự nhiên
    let jitterX = (Math.random() - 0.5) * 1.5;
    let jitterY = (Math.random() - 0.5) * 1;

    // Chỉ giữ lại những tọa độ nằm trong khu vực mặt đất an toàn
    if (posX > 2 && posX < 98 && posY > 53 && posY < 95) {
        gridPositions.push({ 
            x: posX + jitterX, 
            y: posY + jitterY
            // Mảng tự động sắp xếp theo n (từ tâm ra ngoài) để lát nữa làm hiệu ứng gợn sóng
        });
        added++;
    }
    n++;
    if (n > 1000) break; // An toàn chống treo trình duyệt
}

// =========================================
// 3. TRỒNG HOA VÀ GẮN TƯƠNG TÁC (TỐI ƯU DOM)
// =========================================
const fragment = document.createDocumentFragment();

// Hàm xử lý click hiển thị lời chúc
const showWish = (e) => {
    if (!isGameStarted) return

    const popup = document.getElementById('wish-popup');
    const wishText = document.getElementById('wish-text');
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * wishes.length);
    } while (randomIndex === lastWishIndex && wishes.length > 1);
    
    lastWishIndex = randomIndex;
    let rawWish = wishes[randomIndex];
    let personalizedWish = rawWish.replace(/cậu/gi, userName);
    
    popup.classList.remove('hidden');
    wishText.innerHTML = personalizedWish;
};

// 3.1 Trồng Bông Hoa Chính (Nằm ở trung tâm)
const mainFlower = document.createElement('div');
const mainSize = 5.5 * sizeMultiplier; // Tính toán chiều rộng hoa chính
mainFlower.className = 'flower-container flower-main';
mainFlower.style.setProperty('--hue', Math.floor(Math.random() * 120) + 180);
mainFlower.style.top = `${centerY}%`;
// TRỪ ĐI NỬA CHIỀU RỘNG ĐỂ TÂM HOA NẰM ĐÚNG TỌA ĐỘ
mainFlower.style.left = `${centerX - (mainSize / 2)}%`; 
mainFlower.style.width = `${mainSize}%`;
mainFlower.style.zIndex = Math.floor(centerY);
mainFlower.innerHTML = flowerHTML;
mainFlower.addEventListener('click', showWish);
mainFlower.addEventListener('touchstart', showWish, { passive: true });
fragment.appendChild(mainFlower);

// 3.2 Trồng Các Bông Hoa Phụ (Theo tọa độ toán học)
const subSize = 4.5 * sizeMultiplier; // Tính toán chiều rộng hoa phụ
for (let i = 0; i < gridPositions.length; i++) {
    const flower = document.createElement('div');
    flower.className = 'flower-container';
    flower.style.setProperty('--hue', Math.floor(Math.random() * 120) + 180);
    flower.style.top = `${gridPositions[i].y}%`;
    // TRỪ ĐI NỬA CHIỀU RỘNG ĐỂ TÂM HOA NẰM ĐÚNG TỌA ĐỘ
    flower.style.left = `${gridPositions[i].x - (subSize / 2)}%`; 
    flower.style.width = `${subSize}%`;
    flower.style.zIndex = Math.floor(gridPositions[i].y);
    flower.innerHTML = flowerHTML;

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
    isGameStarted = true;
    let name = nameInput.value.trim();
    if (name) userName = name; 
    if (wishTitle) wishTitle.innerText = `💌 Gửi tặng ${userName}`;
    document.title = `Gửi tặng ${userName} 🌸`;

    introScreen.style.opacity = '0';
    setTimeout(() => { introScreen.style.display = 'none'; }, 500);    
    
    ground.classList.add('start-zoom');
    document.querySelector('.flower-main').classList.add('animate');
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
            cursor.style.display = 'none'; 
            setTimeout(() => {
                element.classList.add('poem-fade-out'); 
                setTimeout(() => {
                    moon.classList.add('moon-activate'); 
                    moon.addEventListener('click', triggerClimax, { once: true });
                    isGameStarted = false;    
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
    bgMusic.play();
    if(mainFlower) mainFlower.style.animationPlayState = 'paused';
    document.body.classList.add('camera-zoom-in');
    
    // Từng cánh hoa rụng lả tả
    mainPetals.forEach((petal, index) => {
        setTimeout(() => {
            // Lấy trạng thái hiện tại để làm mốc
            const currentTransform = window.getComputedStyle(petal).transform;
            petal.style.animation = "none";
            petal.style.opacity = "1"; // Đảm bảo nó hiện rõ trước khi bay
            
            // Force reflow để trình duyệt nhận diện trạng thái mới
            void petal.offsetWidth;

            // Tính toán Vector gió thổi mạnh (Bay lên cao và tạt sang phải)
            // WindX: Bay sang phải từ 150px đến 550px
            const windX = Math.random() * 400 + 150; 
            // WindY: Bay lên cao từ 300px đến 800px (Giá trị âm là bay lên)
            const windY = -(Math.random() * 500 + 300); 

            // Tạo góc xoay 3D hỗn loạn hơn (tăng lên 720 độ)
            const rotX = Math.random() * 720 - 360; 
            const rotY = Math.random() * 720 - 360; 
            const rotZ = Math.random() * 720 - 360;

            // Đổi hiệu ứng chuyển động: Dài hơn (4s) và dùng ease-out để mô phỏng bị gió cuốn đi
            petal.style.transition = "all 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"; 
            
            // Áp dụng biến đổi: Bay theo vector gió, xoay lộn vòng, và nhỏ dần lại (scale 0.1)
            petal.style.transform = `translate(${windX}px, ${windY}px) ${currentTransform} rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(0.1)`;
            
            // Mờ dần khi bay ra xa
            petal.style.opacity = "0";
        }, index * 500); // Giảm delay giữa các cánh (từ 250 xuống 150) để bay dồn dập hơn
    });
        
    setTimeout(() => {
            document.body.classList.remove('camera-zoom-in'); 
            document.body.classList.add('camera-zoom-out');   
            document.body.classList.add('daytime'); 
            moon.style.opacity = "0";
            moon.style.transform = "translate(-50%, -50%) scale(0)";
            // Hiệu ứng hoa nở lan tỏa (Ripple Effect)
            flowers.forEach((f, idx) => {
                if(!f.classList.contains('flower-main')) {
                    // Càng xa tâm (idx càng lớn), hoa nở càng trễ, tạo làn sóng
                    setTimeout(() => f.classList.add('animate'), idx * 50);
                }
            });
            const dayWish = document.createElement('div');
            dayWish.className = 'daylight-wish';
            // Dùng biến userName để lời chúc mang tính cá nhân hóa
            dayWish.innerHTML = `Chúc ${userName} luôn rực rỡ<br>như những đóa hoa này nha!`;
            document.body.appendChild(dayWish);
            
            // Chờ mặt trời lên hẳn (khoảng 1.5s) rồi từ từ hiện chữ cho tăng phần kịch tính
            setTimeout(() => {
                dayWish.classList.add('show');
                createBlowingPetals()
                isGameStarted = true;
            }, 2500);
    }, 4500); 
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
    if (timeLeft <= 15 && !skyHeart.classList.contains('animate-heart')) {
        skyHeart.classList.add('animate-heart');
    }
});

document.getElementById('close-wish').onclick = () => document.getElementById('wish-popup').classList.add('hidden');

// =========================================
// 7. TẠO MÂY BAN NGÀY
// =========================================
function createClouds() {
    const numClouds = isMobile ? 4 : 7;
    for (let i = 0; i < numClouds; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.top = (Math.random() * 35 + 5) + '%'; 
        cloud.style.left = (Math.random() * 80) + '%';
        const scale = 0.4 + Math.random() * 0.6;
        cloud.style.setProperty('--scale', scale);
        cloud.style.animationDuration = (Math.random() * 10 + 15) + 's';
        document.body.appendChild(cloud);
    }
}
createClouds();

// =========================================
// 8. HỆ THỐNG HẠT: CÁNH HOA BAY TRONG GIÓ
// =========================================
function createBlowingPetals() {
    const numPetals = isMobile ? 100 : 200; // Mật độ cánh hoa bay cùng lúc
    const container = document.body;

    for (let i = 0; i < numPetals; i++) {
        // Tạo độ trễ ngẫu nhiên ban đầu để hoa không bay lên cùng 1 lúc
        setTimeout(() => {
            spawnSinglePetal(container);
            // Lặp lại việc sinh cánh hoa mới để gió thổi liên tục
            setInterval(() => spawnSinglePetal(container), Math.random() * 4000 + 4000);
        }, Math.random() * 5000);
    }
}

function spawnSinglePetal(container) {
    // Chỉ hoạt động khi trời đã sáng
    if (!document.body.classList.contains('daytime')) return;

    const petal = document.createElement('div');
    petal.className = 'blowing-petal';
    
    // Khởi tạo màu ngẫu nhiên (tone xanh/tím giống vườn hoa)
    const randomHue = Math.floor(Math.random() * 120) + 180;
    petal.style.setProperty('--hue', randomHue);

    // Điểm xuất phát: Nằm rải rác ở phần nửa dưới màn hình (khu vực bãi cỏ)
    const startX = Math.random() * 100; // 0vw -> 100vw
    const startY = 65 + Math.random() * 35; // 65vh -> 100vh
    petal.style.left = `${startX}vw`;
    petal.style.top = `${startY}vh`;

    // Tính toán Vector gió: Thổi chéo lên trên và tạt ngang
    // 70% xác suất thổi từ trái sang phải, 30% thổi ngược lại cho tự nhiên
    const directionX = (Math.random() > 0.3 ? 1 : -1); 
    const endX = directionX * (Math.random() * 60 + 40) + 'vw'; // Độ dạt ngang
    const endY = -(Math.random() * 60 + 50) + 'vh'; // Độ bốc lên cao
    petal.style.setProperty('--endX', endX);
    petal.style.setProperty('--endY', endY);

    // Tính toán động học Euler (SO(3)) để cánh hoa lộn vòng cuộn xoáy trong gió
    petal.style.setProperty('--rotX', Math.random() * 1080 + 'deg');
    petal.style.setProperty('--rotY', Math.random() * 1080 + 'deg');
    petal.style.setProperty('--rotZ', (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 720) + 'deg');

    // Vận tốc gió (thời gian bay)
    const duration = Math.random() * 5 + 5; // 5s đến 10s
    petal.style.animation = `flyingPetal ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;

    container.appendChild(petal);

    // Giải phóng bộ nhớ (dọn dẹp DOM) ngay khi cánh hoa bay khuất màn hình
    setTimeout(() => {
        petal.remove();
    }, duration * 1000);
}
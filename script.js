let userName = "cậu"; // Giá trị mặc định

// =========================================
// 1. KHAI BÁO CẤU HÌNH & DANH SÁCH LỜI CHÚC
// =========================================
const wishes = [
    "Chúc cậu ngày 8/3 luôn xinh đẹp, rạng rỡ và ngập tràn niềm vui nhé!",
    "Happy Women's Day! Chúc cậu một ngày nhận được thật nhiều hoa và quà!",
    "Chúc cậu mãi luôn tự tin, yêu đời và thành công trong mọi dự định!",
    "Gửi đến cậu ngàn đóa hoa tươi thắm nhất. Ngày 8/3 thật hạnh phúc nha!",
    "Chúc bông hoa xinh đẹp nhất luôn tỏa sáng theo cách của riêng mình!",
    "Chúc cậu 8/3 vui vẻ, ăn nhiều không béo, tiền tiêu rủng rỉnh!",
    "Nụ cười của cậu rất đẹp, hãy luôn giữ nụ cười ấy trên môi nhé!"
];

const ground = document.getElementById('ground');
const numFlowers = 70; // 70 bông hoa
const isMobile = window.innerWidth < 768;
const sizeMultiplier = isMobile ? 1.8 : 1; 

// --- CẤU TRÚC: BÔNG HOA CHÍNH ĐẦY ĐỦ CHI TIẾT ---
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
const rows = isMobile ? 10 : 7; 
const cols = isMobile ? 7 : 10; 
const cellWidth = 98 / cols; 
const heightRange = isMobile ? 52 : 42; 
const startTop = isMobile ? 43 : 53;
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
// 3. TRỒNG HOA VÀ GẮN TƯƠNG TÁC
// =========================================
const actualNumFlowers = Math.min(numFlowers, gridPositions.length);

for (let i = 0; i < actualNumFlowers; i++) {
    const flower = document.createElement('div');
    flower.className = 'flower-container';
    const randomHue = Math.floor(Math.random() * 120) + 180;    
    let topPos, leftPos, size, zIndex;

    if (i === 0) {
        topPos = isMobile ? 65 : 70; 
        leftPos = 50; 
        size = 4.5 * sizeMultiplier;
        flower.classList.add('flower-main'); 
        flower.innerHTML = flowerHTML; 
    } else {
        topPos = gridPositions[i].y;
        leftPos = gridPositions[i].x;
        size = (1.5 + ((topPos - startTop) / heightRange) * 5) * sizeMultiplier; 
        flower.innerHTML = flowerHTML;
    }
    
    zIndex = Math.floor(topPos);
    flower.style.setProperty('--hue', randomHue);
    flower.style.top = `${topPos}%`;
    flower.style.left = `${leftPos}%`;
    flower.style.width = `${size}%`;
    flower.style.zIndex = zIndex;

    const showWish = (e) => {
        const popup = document.getElementById('wish-popup');
        const wishText = document.getElementById('wish-text');
        
        let rawWish = wishes[Math.floor(Math.random() * wishes.length)];
        let personalizedWish = rawWish.replace(/cậu/gi, userName);
        
        wishText.innerText = personalizedWish;
        popup.classList.remove('hidden');
    };

    flower.addEventListener('click', showWish);
    flower.addEventListener('touchstart', showWish, { passive: true });
    ground.appendChild(flower);
}

// =========================================
// 4. LOGIC KHỞI ĐỘNG (BẤM NÚT HOẶC NHẤN ENTER)
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
    if (wishTitle) {
        wishTitle.innerText = `💌 Gửi tặng ${userName}`;
    }
    document.title = `Gửi tặng ${userName} 🌸`;

    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.style.display = 'none';
    }, 500);    
    bgMusic.play();
    ground.classList.add('start-zoom');
    
    document.querySelector('.flower-main').classList.add('animate');

    setTimeout(() => {
        flowers.forEach((f, idx) => {
            if(!f.classList.contains('flower-main')) {
                setTimeout(() => f.classList.add('animate'), idx * 25);
            }
        });
    }, 1500);
    setTimeout(typeSkyPoem, 1000);
}

// Bắt sự kiện click chuột
startBtn.addEventListener('click', handleStart);

// Bắt sự kiện nhấn phím Enter
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleStart();
});

// =========================================
// 5. HIỆU ỨNG SAO BĂNG & TRÁI TIM OUTRO (25S CUỐI)
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
        shootingStar.classList.add('animate-shooting-star');
    }
});

document.getElementById('close-wish').onclick = () => document.getElementById('wish-popup').classList.add('hidden');

// Hàm gõ chữ bài thơ trên trời (Dựa trên logic thiệp Tết)
function typeSkyPoem() {
    console.log("Bắt đầu gõ thơ..."); // Kiểm tra log
    const element = document.getElementById('sky-poem');
    const moon = document.getElementById('moon');
    
    if (!element) {
        console.error("Không tìm thấy thẻ #sky-poem!");
        return;
    }
    
    const text = element.getAttribute('data-text');
    element.innerHTML = ""; 
    let i = 0;
    const speed = 100;

    function typing() {
        if (i < text.length) {
            let char = text.charAt(i);
            if (char === '|') {
                element.innerHTML += "<br>";
            } else {
                element.innerHTML += char;
            }
            i++;
            setTimeout(typing, speed);
        } else {
            console.log("Gõ thơ xong, chờ 10s biến thành trăng...");
            // SAU 10 GIÂY BIẾN THÀNH TRĂNG
            setTimeout(() => {
                element.classList.add('poem-fade-out');
                if (moon) {
                    setTimeout(() => {
                        moon.classList.add('moon-activate');
                    }, 1000);
                }
            }, 10000);
        }
    }
    typing();
}
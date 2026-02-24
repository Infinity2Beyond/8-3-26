let userName = "Cậu"; // Giá trị mặc định

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
const numFlowers = 70; 
const isMobile = window.innerWidth < 768;
const sizeMultiplier = isMobile ? 1.8 : 1; 

// Cấu trúc HTML của một bông hoa (Đã tỉa bớt đốm sáng để giảm lag)
const flowerHTML = `
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
for (let i = 0; i < numFlowers; i++) {
    const flower = document.createElement('div');
    flower.className = 'flower-container';
    const randomHue = Math.floor(Math.random() * 120) + 180;    
    let topPos, leftPos, size, zIndex;

    if (i === 0) {
        topPos = isMobile ? 65 : 70; 
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
    
    // Lấy lời chúc ngẫu nhiên
    let rawWish = wishes[Math.floor(Math.random() * wishes.length)];
    
    // THAY THẾ CHỮ "CẬU" BẰNG TÊN NGƯỜI DÙNG
    let personalizedWish = rawWish.replace(/cậu/gi, userName);
    
    wishText.innerText = personalizedWish;
    popup.classList.remove('hidden');
    };

    flower.addEventListener('click', showWish);
    flower.addEventListener('touchstart', showWish, { passive: true });
    ground.appendChild(flower);
}

// =========================================
// 4. LOGIC KHỞI ĐỘNG (BẤM NÚT -> CHẠY)
// =========================================
const bgMusic = document.getElementById('bg-music');
const flowers = document.querySelectorAll('.flower-container');
const startBtn = document.getElementById('start-btn');
const nameInput = document.getElementById('username-input');
const wishTitle = document.getElementById('wish-title');


startBtn.addEventListener('click', () => {
    let name = nameInput.value.trim();
    if (name) userName = name; 
    if (wishTitle) {
        wishTitle.innerText = `💌 Gửi tặng ${userName}`;
    }
    // Đổi tiêu đề trang web cho chuyên nghiệp
    document.title = `Gửi tặng ${userName} 🌸`;

    // Ẩn màn hình Intro và chạy nhạc/hoa
    document.getElementById('intro-screen').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('intro-screen').style.display = 'none';
    }, 500);    
    bgMusic.play();
    ground.classList.add('start-zoom');
    
    // Bông hoa chính nở trước
    document.querySelector('.flower-main').classList.add('animate');

    // Sau 1.5s các bông còn lại mọc rào rào
    setTimeout(() => {
        flowers.forEach((f, idx) => {
            if(!f.classList.contains('flower-main')) {
                setTimeout(() => f.classList.add('animate'), idx * 50);
            }
        });
    }, 1500);
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

// Outro
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

// Đóng popup
document.getElementById('close-wish').onclick = () => document.getElementById('wish-popup').classList.add('hidden');
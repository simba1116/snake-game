const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');

// 设置画布大小
canvas.width = 400;
canvas.height = 400;

// 游戏配置
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let score = 0;

// 蛇的初始位置和速度
let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }  // 初始长度为3
];
let dx = 0;
let dy = 0;

// 食物位置
let food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};

// 游戏状态控制
let gameRunning = false;
let gameInterval = null;

// 获取按钮元素
const startBtn = document.getElementById('startBtn');
const endBtn = document.getElementById('endBtn');

// 游戏主循环
function gameLoop() {
    updateGame();
    drawGame();
}

// 更新游戏状态
function updateGame() {
    if (!gameRunning) return;
    
    // 移动蛇
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // 检查碰撞
    if (isCollision(head)) {
        endGame();
        return;
    }
    
    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

// 绘制游戏画面
function drawGame() {
    // 清空画布
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格背景
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    if (gameRunning) {
        // 绘制蛇
        snake.forEach((segment, index) => {
            // 蛇身渐变色
            const hue = (120 + index * 2) % 360;
            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
            
            // 圆角矩形
            const x = segment.x * gridSize;
            const y = segment.y * gridSize;
            const size = gridSize - 2;
            const radius = 5;
            
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + size - radius, y);
            ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
            ctx.lineTo(x + size, y + size - radius);
            ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
            ctx.lineTo(x + radius, y + size);
            ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.fill();
        });

        // 绘制食物
        const foodX = food.x * gridSize;
        const foodY = food.y * gridSize;
        const foodSize = gridSize - 2;
        
        // 创建食物的渐变色
        const gradient = ctx.createRadialGradient(
            foodX + foodSize/2, foodY + foodSize/2, 2,
            foodX + foodSize/2, foodY + foodSize/2, foodSize/2
        );
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(1, '#ee5253');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(foodX + foodSize/2, foodY + foodSize/2, foodSize/2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 修改结束游戏画面
function endGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    startBtn.textContent = '开始游戏';
    
    // 绘制半透明遮罩
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制游戏结束文本
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 40px Poppins';
    ctx.fillText('游戏结束', canvas.width/2, canvas.height/2 - 20);
    
    ctx.font = '24px Poppins';
    ctx.fillText(`最终得分: ${score}`, canvas.width/2, canvas.height/2 + 20);
}

// 生成新的食物位置
function generateFood() {
    // 确保食物不会出现在蛇身上
    do {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// 检查碰撞
function isCollision(head) {
    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // 检查自身碰撞
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// 重置游戏
function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    dx = 1;  // 初始向右移动
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    drawGame();
}

// 开始游戏
function startGame() {
    if (gameRunning) {
        // 如果游戏正在运行，重置游戏
        resetGame();
    } else {
        // 开始新游戏
        gameRunning = true;
        resetGame();
        gameInterval = setInterval(gameLoop, 150);
        startBtn.textContent = '重新开始';
    }
}

// 结束游戏
function endGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    startBtn.textContent = '开始游戏';
    
    // 绘制游戏结束画面
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束', canvas.width/2, canvas.height/2);
    ctx.fillText('得分: ' + score, canvas.width/2, canvas.height/2 + 40);
}

// 键盘控制
document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;
    
    switch (event.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

// 初始化游戏画面
drawGame();

// 添加按钮事件监听
startBtn.addEventListener('click', startGame);
endBtn.addEventListener('click', endGame);
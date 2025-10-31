// 游戏数据
const gameData = {
    player: {
        level: 1,
        exp: 0,
        primogems: 1600,
        mora: 50000
    },
    characters: [
        {
            id: 'traveler',
            name: '旅行者',
            element: '风',
            level: 1,
            hp: 100,
            maxHp: 100,
            attack: 25,
            avatar: '👤',
            rarity: 5,
            owned: true
        },
        {
            id: 'amber',
            name: '安柏',
            element: '火',
            level: 1,
            hp: 80,
            maxHp: 80,
            attack: 30,
            avatar: '🏹',
            rarity: 4,
            owned: false
        },
        {
            id: 'kaeya',
            name: '凯亚',
            element: '冰',
            level: 1,
            hp: 90,
            maxHp: 90,
            attack: 28,
            avatar: '❄️',
            rarity: 4,
            owned: false
        },
        {
            id: 'lisa',
            name: '丽莎',
            element: '雷',
            level: 1,
            hp: 85,
            maxHp: 85,
            attack: 32,
            avatar: '⚡',
            rarity: 4,
            owned: false
        },
        {
            id: 'diluc',
            name: '迪卢克',
            element: '火',
            level: 1,
            hp: 120,
            maxHp: 120,
            attack: 45,
            avatar: '🔥',
            rarity: 5,
            owned: false
        },
        {
            id: 'venti',
            name: '温迪',
            element: '风',
            level: 1,
            hp: 95,
            maxHp: 95,
            attack: 38,
            avatar: '🌪️',
            rarity: 5,
            owned: false
        }
    ],
    inventory: {
        weapons: [
            { id: 'dull_blade', name: '无锋剑', count: 1, icon: '⚔️', rarity: 1 },
            { id: 'silver_sword', name: '白铁剑', count: 0, icon: '🗡️', rarity: 2 }
        ],
        materials: [
            { id: 'mora', name: '摩拉', count: 50000, icon: '💰', rarity: 1 },
            { id: 'exp_book', name: '经验书', count: 10, icon: '📚', rarity: 2 },
            { id: 'crystal', name: '原石', count: 1600, icon: '⭐', rarity: 3 }
        ]
    },
    currentCharacter: 'traveler',
    currentBattle: null
};

// 敌人数据
const enemies = {
    hilichurl: {
        name: '丘丘人',
        hp: 60,
        maxHp: 60,
        attack: 15,
        sprite: '👹',
        exp: 25,
        mora: 50
    },
    slime: {
        name: '史莱姆',
        hp: 40,
        maxHp: 40,
        attack: 12,
        sprite: '🟢',
        exp: 20,
        mora: 30
    },
    treasure: {
        name: '宝藏守卫',
        hp: 100,
        maxHp: 100,
        attack: 25,
        sprite: '💎',
        exp: 60,
        mora: 200,
        primogems: 20
    }
};

// 祈愿物品池
const gachaPool = {
    characters: [
        { id: 'amber', rarity: 4, rate: 20 },
        { id: 'kaeya', rarity: 4, rate: 20 },
        { id: 'lisa', rarity: 4, rate: 20 },
        { id: 'diluc', rarity: 5, rate: 3 },
        { id: 'venti', rarity: 5, rate: 3 }
    ],
    weapons: [
        { id: 'silver_sword', name: '白铁剑', rarity: 2, rate: 30, icon: '🗡️' },
        { id: 'magic_sword', name: '魔剑', rarity: 3, rate: 15, icon: '✨' },
        { id: 'legendary_sword', name: '传说之剑', rarity: 4, rate: 5, icon: '🌟' }
    ]
};

// 当前选中的角色
let selectedCharacter = null;

// 初始化游戏
function initGame() {
    // 加载游戏数据
    loadGameData();
    
    // 显示加载界面
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        showScreen('main-menu');
        updateUI();
    }, 3000);
}

// 保存游戏数据
function saveGameData() {
    localStorage.setItem('genshinWebGame', JSON.stringify(gameData));
}

// 加载游戏数据
function loadGameData() {
    const saved = localStorage.getItem('genshinWebGame');
    if (saved) {
        const savedData = JSON.parse(saved);
        Object.assign(gameData, savedData);
    }
}

// 显示界面
function showScreen(screenId) {
    // 隐藏所有界面
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // 显示目标界面
    document.getElementById(screenId).classList.remove('hidden');
    
    // 更新对应界面的内容
    switch(screenId) {
        case 'character-screen':
            updateCharacterScreen();
            break;
        case 'inventory-screen':
            updateInventoryScreen();
            break;
    }
}

// 更新UI
function updateUI() {
    document.getElementById('player-level').textContent = gameData.player.level;
    document.getElementById('primogems').textContent = gameData.primogems || gameData.player.primogems;
    document.getElementById('mora').textContent = gameData.mora || gameData.player.mora;
}

// 更新角色界面
function updateCharacterScreen() {
    const container = document.getElementById('character-cards');
    container.innerHTML = '';
    
    gameData.characters.filter(char => char.owned).forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.onclick = () => selectCharacter(character.id);
        
        card.innerHTML = `
            <div class="character-avatar">${character.avatar}</div>
            <div class="character-name">${character.name}</div>
            <div class="character-element">${character.element}元素</div>
            <div class="character-level">等级 ${character.level}</div>
        `;
        
        container.appendChild(card);
    });
    
    // 如果有选中的角色，显示详情
    if (selectedCharacter) {
        const character = gameData.characters.find(c => c.id === selectedCharacter);
        if (character && character.owned) {
            showCharacterDetails(character);
        }
    }
}

// 选择角色
function selectCharacter(characterId) {
    selectedCharacter = characterId;
    
    // 更新选中状态
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.character-card').classList.add('selected');
    
    // 显示角色详情
    const character = gameData.characters.find(c => c.id === characterId);
    showCharacterDetails(character);
    
    // 设置为当前角色
    gameData.currentCharacter = characterId;
    saveGameData();
}

// 显示角色详情
function showCharacterDetails(character) {
    const container = document.getElementById('selected-character');
    container.innerHTML = `
        <div class="character-avatar" style="width: 120px; height: 120px; font-size: 3rem;">${character.avatar}</div>
        <h3>${character.name}</h3>
        <p><strong>元素：</strong>${character.element}</p>
        <p><strong>等级：</strong>${character.level}</p>
        <p><strong>生命值：</strong>${character.hp}/${character.maxHp}</p>
        <p><strong>攻击力：</strong>${character.attack}</p>
        <p><strong>稀有度：</strong>${'⭐'.repeat(character.rarity)}</p>
        <button class="menu-btn" onclick="setCurrentCharacter('${character.id}')" style="margin-top: 1rem; padding: 0.5rem 1rem; font-size: 1rem;">
            设为当前角色
        </button>
    `;
}

// 设置当前角色
function setCurrentCharacter(characterId) {
    gameData.currentCharacter = characterId;
    saveGameData();
    showNotification(`${gameData.characters.find(c => c.id === characterId).name} 已设为当前角色`);
}

// 开始战斗
function startBattle(enemyType) {
    const enemy = JSON.parse(JSON.stringify(enemies[enemyType])); // 深拷贝
    gameData.currentBattle = {
        enemy: enemy,
        playerTurn: true
    };
    
    showScreen('battle-screen');
    updateBattleScreen();
    addBattleMessage(`遭遇了 ${enemy.name}！`);
}

// 更新战斗界面
function updateBattleScreen() {
    const battle = gameData.currentBattle;
    const currentChar = gameData.characters.find(c => c.id === gameData.currentCharacter);
    
    // 更新敌人信息
    document.getElementById('enemy-sprite').textContent = battle.enemy.sprite;
    document.getElementById('enemy-name').textContent = battle.enemy.name;
    document.getElementById('enemy-health').style.width = `${(battle.enemy.hp / battle.enemy.maxHp) * 100}%`;
    document.getElementById('enemy-hp-text').textContent = `${battle.enemy.hp}/${battle.enemy.maxHp}`;
    
    // 更新玩家信息
    document.querySelector('#current-character .character-avatar').textContent = currentChar.avatar;
    document.querySelector('#current-character .character-name').textContent = currentChar.name;
    document.getElementById('player-health').style.width = `${(currentChar.hp / currentChar.maxHp) * 100}%`;
    document.getElementById('player-hp-text').textContent = `${currentChar.hp}/${currentChar.maxHp}`;
    
    // 更新按钮状态
    const playerTurn = battle.playerTurn;
    document.getElementById('attack-btn').disabled = !playerTurn;
    document.getElementById('skill-btn').disabled = !playerTurn;
    document.getElementById('flee-btn').disabled = !playerTurn;
}

// 玩家攻击
function playerAttack() {
    const battle = gameData.currentBattle;
    const currentChar = gameData.characters.find(c => c.id === gameData.currentCharacter);
    
    if (!battle.playerTurn) return;
    
    const damage = Math.floor(currentChar.attack * (0.8 + Math.random() * 0.4));
    const isCrit = Math.random() < 0.2; // 20%暴击率
    const finalDamage = isCrit ? Math.floor(damage * 1.5) : damage;
    
    battle.enemy.hp = Math.max(0, battle.enemy.hp - finalDamage);
    
    showDamageNumber(finalDamage, isCrit);
    addBattleMessage(`${currentChar.name} 对 ${battle.enemy.name} 造成了 ${finalDamage} 点伤害${isCrit ? ' (暴击!)' : ''}`);
    
    if (battle.enemy.hp <= 0) {
        // 敌人被击败
        setTimeout(() => {
            winBattle();
        }, 1000);
    } else {
        // 敌人回合
        battle.playerTurn = false;
        setTimeout(() => {
            enemyAttack();
        }, 1500);
    }
    
    updateBattleScreen();
}

// 玩家技能
function playerSkill() {
    const battle = gameData.currentBattle;
    const currentChar = gameData.characters.find(c => c.id === gameData.currentCharacter);
    
    if (!battle.playerTurn) return;
    
    const damage = Math.floor(currentChar.attack * 1.5 * (0.9 + Math.random() * 0.2));
    battle.enemy.hp = Math.max(0, battle.enemy.hp - damage);
    
    showDamageNumber(damage, false);
    addBattleMessage(`${currentChar.name} 使用了元素技能，对 ${battle.enemy.name} 造成了 ${damage} 点元素伤害！`);
    
    if (battle.enemy.hp <= 0) {
        setTimeout(() => {
            winBattle();
        }, 1000);
    } else {
        battle.playerTurn = false;
        setTimeout(() => {
            enemyAttack();
        }, 1500);
    }
    
    updateBattleScreen();
}

// 敌人攻击
function enemyAttack() {
    const battle = gameData.currentBattle;
    const currentChar = gameData.characters.find(c => c.id === gameData.currentCharacter);
    
    const damage = Math.floor(battle.enemy.attack * (0.7 + Math.random() * 0.6));
    currentChar.hp = Math.max(0, currentChar.hp - damage);
    
    addBattleMessage(`${battle.enemy.name} 对 ${currentChar.name} 造成了 ${damage} 点伤害`);
    
    if (currentChar.hp <= 0) {
        // 玩家失败
        setTimeout(() => {
            loseBattle();
        }, 1000);
    } else {
        // 玩家回合
        battle.playerTurn = true;
    }
    
    updateBattleScreen();
}

// 战斗胜利
function winBattle() {
    const battle = gameData.currentBattle;
    const rewards = [];
    
    // 获得经验
    if (battle.enemy.exp) {
        rewards.push(`经验 +${battle.enemy.exp}`);
    }
    
    // 获得摩拉
    if (battle.enemy.mora) {
        gameData.player.mora = (gameData.player.mora || 50000) + battle.enemy.mora;
        rewards.push(`摩拉 +${battle.enemy.mora}`);
    }
    
    // 获得原石
    if (battle.enemy.primogems) {
        gameData.player.primogems = (gameData.player.primogems || 1600) + battle.enemy.primogems;
        rewards.push(`原石 +${battle.enemy.primogems}`);
    }
    
    addBattleMessage(`胜利！获得奖励: ${rewards.join(', ')}`);
    
    setTimeout(() => {
        gameData.currentBattle = null;
        showScreen('adventure-screen');
        showNotification('战斗胜利！' + rewards.join(', '));
        saveGameData();
        updateUI();
    }, 2000);
}

// 战斗失败
function loseBattle() {
    addBattleMessage('战斗失败...');
    
    setTimeout(() => {
        // 恢复角色生命值
        const currentChar = gameData.characters.find(c => c.id === gameData.currentCharacter);
        currentChar.hp = currentChar.maxHp;
        
        gameData.currentBattle = null;
        showScreen('adventure-screen');
        showNotification('战斗失败，已恢复生命值', 'error');
        saveGameData();
    }, 2000);
}

// 逃跑
function fleeBattle() {
    addBattleMessage('成功逃脱了战斗');
    
    setTimeout(() => {
        gameData.currentBattle = null;
        showScreen('adventure-screen');
        showNotification('已逃离战斗');
    }, 1000);
}

// 添加战斗消息
function addBattleMessage(message) {
    const container = document.getElementById('battle-messages');
    const messageEl = document.createElement('div');
    messageEl.className = 'battle-message';
    messageEl.textContent = message;
    
    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
    
    // 限制消息数量
    while (container.children.length > 10) {
        container.removeChild(container.firstChild);
    }
}

// 显示伤害数字
function showDamageNumber(damage, isCrit) {
    const container = document.getElementById('damage-numbers');
    const damageEl = document.createElement('div');
    damageEl.className = `damage-number ${isCrit ? 'crit' : ''}`;
    damageEl.textContent = damage;
    
    // 随机位置
    const enemyArea = document.querySelector('.enemy-sprite');
    const rect = enemyArea.getBoundingClientRect();
    damageEl.style.left = `${rect.left + Math.random() * rect.width}px`;
    damageEl.style.top = `${rect.top + Math.random() * rect.height}px`;
    
    container.appendChild(damageEl);
    
    // 动画结束后移除
    setTimeout(() => {
        container.removeChild(damageEl);
    }, 1500);
}

// 抽卡
function performGacha(count) {
    const cost = count * 160;
    if ((gameData.player.primogems || gameData.primogems) < cost) {
        showNotification('原石不足！', 'error');
        return;
    }
    
    // 扣除原石
    gameData.player.primogems = (gameData.player.primogems || gameData.primogems) - cost;
    
    const results = [];
    
    for (let i = 0; i < count; i++) {
        const result = performSingleGacha();
        results.push(result);
    }
    
    showGachaResults(results);
    saveGameData();
    updateUI();
}

// 单次抽卡
function performSingleGacha() {
    const random = Math.random() * 100;
    let currentRate = 0;
    
    // 先尝试角色
    for (const item of gachaPool.characters) {
        currentRate += item.rate;
        if (random < currentRate) {
            const character = gameData.characters.find(c => c.id === item.id);
            if (!character.owned) {
                character.owned = true;
                return {
                    type: 'character',
                    item: character,
                    rarity: character.rarity,
                    new: true
                };
            } else {
                // 已拥有，转换为碎片
                return {
                    type: 'fragment',
                    name: `${character.name}的碎片`,
                    rarity: character.rarity,
                    icon: character.avatar
                };
            }
        }
    }
    
    // 然后尝试武器
    for (const weapon of gachaPool.weapons) {
        currentRate += weapon.rate;
        if (random < currentRate) {
            // 添加武器到背包
            const inventoryWeapon = gameData.inventory.weapons.find(w => w.id === weapon.id);
            if (inventoryWeapon) {
                inventoryWeapon.count++;
            } else {
                gameData.inventory.weapons.push({
                    id: weapon.id,
                    name: weapon.name,
                    count: 1,
                    icon: weapon.icon,
                    rarity: weapon.rarity
                });
            }
            
            return {
                type: 'weapon',
                item: weapon,
                rarity: weapon.rarity
            };
        }
    }
    
    // 保底奖励
    return {
        type: 'material',
        name: '经验书',
        rarity: 2,
        icon: '📚'
    };
}

// 显示抽卡结果
function showGachaResults(results) {
    const container = document.getElementById('gacha-items');
    container.innerHTML = '';
    
    results.forEach((result, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = `gacha-item rarity-${result.rarity}`;
        itemEl.style.animationDelay = `${index * 0.1}s`;
        
        let content = '';
        if (result.type === 'character') {
            content = `
                <div class="item-icon">${result.item.avatar}</div>
                <div class="item-name">${result.item.name}</div>
                <div class="item-rarity">${'⭐'.repeat(result.rarity)}</div>
                ${result.new ? '<div class="new-tag">NEW!</div>' : ''}
            `;
        } else if (result.type === 'weapon') {
            content = `
                <div class="item-icon">${result.item.icon}</div>
                <div class="item-name">${result.item.name}</div>
                <div class="item-rarity">${'⭐'.repeat(result.rarity)}</div>
            `;
        } else {
            content = `
                <div class="item-icon">${result.icon}</div>
                <div class="item-name">${result.name}</div>
                <div class="item-rarity">${'⭐'.repeat(result.rarity)}</div>
            `;
        }
        
        itemEl.innerHTML = content;
        container.appendChild(itemEl);
    });
    
    document.getElementById('gacha-results').classList.remove('hidden');
    
    // 检查是否获得新角色
    const newCharacters = results.filter(r => r.type === 'character' && r.new);
    if (newCharacters.length > 0) {
        const names = newCharacters.map(r => r.item.name).join(', ');
        showNotification(`恭喜获得新角色: ${names}！`);
    }
}

// 关闭抽卡结果
function closeGachaResults() {
    document.getElementById('gacha-results').classList.add('hidden');
}

// 更新背包界面
function updateInventoryScreen() {
    showInventoryTab('weapons');
}

// 显示背包标签页
function showInventoryTab(tab) {
    // 更新标签按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const container = document.getElementById('inventory-items');
    container.innerHTML = '';
    
    let items = [];
    if (tab === 'weapons') {
        items = gameData.inventory.weapons;
    } else if (tab === 'materials') {
        items = gameData.inventory.materials;
    }
    
    items.forEach(item => {
        if (item.count > 0) {
            const itemEl = document.createElement('div');
            itemEl.className = 'inventory-item';
            itemEl.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-count">×${item.count}</div>
            `;
            container.appendChild(itemEl);
        }
    });
    
    if (items.filter(item => item.count > 0).length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #dbeafe; grid-column: 1 / -1;">暂无物品</p>';
    }
}

// 显示通知
function showNotification(message, type = 'success') {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (container.contains(notification)) {
            container.removeChild(notification);
        }
    }, 3000);
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initGame);

// 定期保存游戏数据
setInterval(saveGameData, 30000); // 每30秒自动保存
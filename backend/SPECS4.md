# 签到系统数据库设计与实现思路

## 一、数据库表设计

### 1. 签到记录表 (checkin_records)
```sql
CREATE TABLE checkin_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    checkin_date DATE NOT NULL COMMENT '签到日期',
    checkin_time DATETIME NOT NULL COMMENT '签到时间',
    
    -- 奖励相关
    base_points INT DEFAULT 10 COMMENT '基础积分',
    continuous_days INT DEFAULT 1 COMMENT '连续签到天数',
    extra_points INT DEFAULT 0 COMMENT '额外奖励积分',
    total_points INT DEFAULT 0 COMMENT '本次获得总积分',
    reward_type VARCHAR(20) COMMENT '奖励类型：NORMAL, CONTINUOUS, SPECIAL, MILESTONE',
    
    -- 特殊标记
    is_special_day BOOLEAN DEFAULT FALSE COMMENT '是否特殊日期',
    special_day_type VARCHAR(20) COMMENT '特殊日期类型：HOLIDAY, ANNIVERSARY, EVENT',
    is_makeup BOOLEAN DEFAULT FALSE COMMENT '是否补签',
    makeup_card_used INT DEFAULT 0 COMMENT '使用的补签卡数量',
    
    -- 设备信息
    checkin_method VARCHAR(20) DEFAULT 'WEB' COMMENT '签到方式：WEB, MOBILE, SHAKE, WIDGET, API',
    device_info VARCHAR(500) COMMENT '设备信息JSON',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- 索引
    UNIQUE KEY uk_user_date (user_id, checkin_date),
    INDEX idx_checkin_date (checkin_date),
    INDEX idx_user_continuous (user_id, continuous_days),
    INDEX idx_reward_type (reward_type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='签到记录表';
```

### 2. 用户签到统计表 (user_checkin_stats)
```sql
CREATE TABLE user_checkin_stats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE COMMENT '用户ID',
    
    -- 总体统计
    total_checkin_days INT DEFAULT 0 COMMENT '总签到天数',
    total_points_earned INT DEFAULT 0 COMMENT '累计获得积分',
    current_streak INT DEFAULT 0 COMMENT '当前连续签到天数',
    longest_streak INT DEFAULT 0 COMMENT '最长连续签到天数',
    
    -- 月度统计
    current_month_days INT DEFAULT 0 COMMENT '本月签到天数',
    current_month_points INT DEFAULT 0 COMMENT '本月获得积分',
    
    -- 补签相关
    makeup_cards_available INT DEFAULT 0 COMMENT '可用补签卡数量',
    makeup_cards_used_total INT DEFAULT 0 COMMENT '累计使用补签卡数',
    
    -- 里程碑统计
    milestone_7_days INT DEFAULT 0 COMMENT '7天里程碑完成次数',
    milestone_30_days INT DEFAULT 0 COMMENT '30天里程碑完成次数',
    
    -- 时间记录
    last_checkin_date DATE COMMENT '最后签到日期',
    last_checkin_time DATETIME COMMENT '最后签到时间',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_streak (current_streak),
    INDEX idx_total_days (total_checkin_days),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) COMMENT='用户签到统计表';
```

### 3. 签到配置表 (checkin_config)
```sql
CREATE TABLE checkin_config (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    -- 基础配置
    base_points INT DEFAULT 10 COMMENT '基础签到积分',
    max_continuous_days INT DEFAULT 365 COMMENT '最大连续签到天数',
    
    -- 连续签到奖励规则
    continuous_rewards JSON COMMENT '连续签到奖励配置，JSON格式',
    /*
    示例JSON：
    [
      {"days": 3, "extra_points": 5, "type": "BRONZE"},
      {"days": 7, "extra_points": 20, "type": "SILVER", "badge": "7_DAY_STREAK"},
      {"days": 14, "extra_points": 40, "type": "GOLD"},
      {"days": 30, "extra_points": 100, "type": "PLATINUM", "badge": "30_DAY_STREAK"}
    ]
    */
    
    -- 补签配置
    makeup_card_daily_limit INT DEFAULT 3 COMMENT '每日补签卡使用上限',
    makeup_card_points_cost INT DEFAULT 50 COMMENT '补签卡积分兑换价格',
    vip_makeup_cards_monthly INT DEFAULT 5 COMMENT 'VIP每月免费补签卡数量',
    
    -- 特殊日期配置
    special_dates JSON COMMENT '特殊日期配置，JSON格式',
    /*
    示例JSON：
    [
      {"date": "2024-01-01", "name": "元旦", "extra_points": 50, "type": "HOLIDAY"},
      {"date": "2024-02-10", "name": "春节", "extra_points": 100, "type": "HOLIDAY"},
      {"date": "2024-06-01", "name": "儿童节", "extra_points": 30, "type": "EVENT"}
    ]
    */
    
    -- 系统配置
    checkin_start_time VARCHAR(5) DEFAULT '00:00' COMMENT '每日签到开始时间',
    checkin_end_time VARCHAR(5) DEFAULT '23:59' COMMENT '每日签到结束时间',
    allow_retroactive_days INT DEFAULT 3 COMMENT '允许补签的天数',
    
    -- 功能开关
    enabled BOOLEAN DEFAULT TRUE COMMENT '签到功能是否启用',
    require_verification BOOLEAN DEFAULT FALSE COMMENT '是否需要验证',
    enable_shake_checkin BOOLEAN DEFAULT TRUE COMMENT '是否开启摇一摇签到',
    enable_widget_checkin BOOLEAN DEFAULT TRUE COMMENT '是否开启桌面部件签到',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT COMMENT '最后更新人'
) COMMENT='签到配置表';
```

### 4. 签到里程碑奖励表 (checkin_milestones)
```sql
CREATE TABLE checkin_milestones (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    milestone_type VARCHAR(20) NOT NULL COMMENT '里程碑类型：DAY_7, DAY_30, DAY_100等',
    required_days INT NOT NULL COMMENT '需要连续天数',
    
    -- 奖励配置
    points_reward INT DEFAULT 0 COMMENT '积分奖励',
    experience_reward INT DEFAULT 0 COMMENT '经验值奖励',
    badge_name VARCHAR(50) COMMENT '徽章名称',
    badge_icon VARCHAR(100) COMMENT '徽章图标',
    vip_days INT DEFAULT 0 COMMENT 'VIP天数奖励',
    coupon_id BIGINT COMMENT '优惠券ID',
    
    -- 奖励描述
    title VARCHAR(100) COMMENT '里程碑标题',
    description VARCHAR(500) COMMENT '里程碑描述',
    
    -- 状态
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    display_order INT DEFAULT 0 COMMENT '显示顺序',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_required_days (required_days),
    INDEX idx_milestone_type (milestone_type)
) COMMENT='签到里程碑奖励表';
```

### 5. 补签卡使用记录表 (makeup_card_records)
```sql
CREATE TABLE makeup_card_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    target_date DATE NOT NULL COMMENT '补签目标日期',
    
    -- 卡片来源
    card_source VARCHAR(20) DEFAULT 'PURCHASE' COMMENT '卡片来源：PURCHASE, VIP_GIFT, TASK_REWARD, EXCHANGE',
    source_detail VARCHAR(200) COMMENT '来源详情',
    
    -- 消耗信息
    points_cost INT DEFAULT 0 COMMENT '消耗积分',
    cards_used INT DEFAULT 1 COMMENT '使用卡片数量',
    
    -- 补签结果
    checkin_record_id BIGINT COMMENT '关联的签到记录ID',
    is_successful BOOLEAN DEFAULT TRUE COMMENT '是否成功',
    failure_reason VARCHAR(200) COMMENT '失败原因',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_date (user_id, target_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (checkin_record_id) REFERENCES checkin_records(id) ON DELETE SET NULL
) COMMENT='补签卡使用记录表';
```

### 6. 签到日历视图表 (checkin_calendar_cache)
```sql
CREATE TABLE checkin_calendar_cache (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    year_month CHAR(7) NOT NULL COMMENT '年月，格式：YYYY-MM',
    
    -- 日历数据
    calendar_data JSON NOT NULL COMMENT '日历数据JSON',
    /*
    示例JSON：
    {
      "year": 2024,
      "month": 2,
      "total_days": 29,
      "checkin_days": [1, 2, 3, 5, 7, ...],
      "special_days": {
        "2024-02-10": {"name": "春节", "extra_points": 100},
        "2024-02-14": {"name": "情人节", "extra_points": 50}
      },
      "current_streak": 7,
      "month_stats": {
        "total_days": 10,
        "total_points": 150,
        "milestones_achieved": ["7_DAY_STREAK"]
      }
    }
    */
    
    -- 缓存信息
    cache_expires_at DATETIME NOT NULL COMMENT '缓存过期时间',
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    UNIQUE KEY uk_user_month (user_id, year_month),
    INDEX idx_cache_expires (cache_expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) COMMENT='签到日历缓存表';
```

## 二、系统实现思路

### 1. 整体架构设计
```
┌─────────────────────────────────────────────┐
│                 前端层                       │
│  • 签到按钮和状态展示                        │
│  • 签到日历组件                             │
│  • 摇一摇签到监听                           │
│  • 桌面小部件                               │
└──────────────────┬──────────────────────────┘
                   │ HTTP/WebSocket
┌──────────────────▼──────────────────────────┐
│                 API网关                      │
│  • 认证鉴权                                  │
│  • 限流控制                                  │
│  • 请求路由                                  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│             签到服务层                       │
│  • 签到核心逻辑 (CheckinService)             │
│  • 签到规则引擎 (CheckinRuleEngine)          │
│  • 奖励计算器 (RewardCalculator)             │
│  • 统计管理器 (StatsManager)                 │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│             数据访问层                       │
│  • 签到记录Repository                       │
│  • 用户统计Repository                       │
│  • 配置缓存Repository                       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│             数据存储层                       │
│  • MySQL (主数据)                           │
│  • Redis (缓存/计数器)                       │
│  • Elasticsearch (日志/分析)                 │
└─────────────────────────────────────────────┘
```

### 2. 核心业务流程

#### 每日签到流程
```
1. 用户点击签到按钮
2. 验证用户今日是否已签到
3. 检查签到时间是否在允许范围内
4. 计算连续签到天数
5. 根据规则计算奖励积分
6. 检查是否为特殊日期，添加额外奖励
7. 记录签到信息到数据库
8. 更新用户签到统计
9. 发放奖励（积分、经验、徽章等）
10. 发送签到成功通知
11. 更新前端状态和动画
```

#### 补签流程
```
1. 用户选择要补签的日期
2. 验证用户是否有可用的补签卡
3. 验证补签日期是否在允许范围内
4. 检查目标日期是否已签到
5. 扣除补签卡
6. 创建补签记录
7. 执行签到逻辑（但不计算连续签到）
8. 更新统计信息
```

### 3. 关键算法设计

#### 连续签到计算算法
```javascript
// 伪代码示例
function calculateContinuousDays(userId, checkinDate) {
    // 1. 获取用户最近一次签到日期
    lastCheckin = getLastCheckinDate(userId);
    
    if (!lastCheckin) {
        return 1; // 首次签到
    }
    
    // 2. 计算日期差
    daysDiff = checkinDate - lastCheckin;
    
    if (daysDiff === 1) {
        // 连续签到
        currentStreak = getCurrentStreak(userId) + 1;
    } else if (daysDiff === 0) {
        throw new Error("今日已签到");
    } else {
        // 中断，重新开始
        currentStreak = 1;
    }
    
    return currentStreak;
}
```

#### 奖励计算算法
```javascript
function calculateRewards(continuousDays, checkinDate) {
    // 基础奖励
    rewards = {
        basePoints: config.base_points,
        extraPoints: 0,
        badges: []
    };
    
    // 连续签到奖励
    continuousRewards = config.continuous_rewards;
    for (reward of continuousRewards) {
        if (continuousDays >= reward.days && 
            continuousDays % reward.days === 0) {
            rewards.extraPoints += reward.extra_points;
            if (reward.badge) {
                rewards.badges.push(reward.badge);
            }
        }
    }
    
    // 特殊日期奖励
    if (isSpecialDate(checkinDate)) {
        specialReward = getSpecialDateReward(checkinDate);
        rewards.extraPoints += specialReward.extra_points;
    }
    
    // 里程碑奖励
    milestones = getMilestoneRewards(continuousDays);
    rewards.extraPoints += milestones.points;
    rewards.badges.push(...milestones.badges);
    
    return rewards;
}
```

### 4. 缓存策略设计

#### Redis缓存键设计
```
# 用户今日签到状态
checkin:user:{userId}:today:status -> boolean

# 用户连续签到天数
checkin:user:{userId}:streak -> integer

# 用户本月签到日历
checkin:user:{userId}:calendar:{yyyy-MM} -> json

# 签到排行榜
checkin:leaderboard:daily -> sorted set
checkin:leaderboard:monthly -> sorted set
checkin:leaderboard:continuous -> sorted set

# 补签卡数量
checkin:user:{userId}:makeup_cards -> integer

# 特殊日期配置缓存
checkin:special_dates:{year} -> json
```

#### 缓存更新策略
- **实时更新**：签到成功后立即更新相关缓存
- **异步刷新**：排行榜、统计信息等定时刷新
- **主动失效**：配置修改时主动清除相关缓存
- **TTL设置**：根据数据特点设置不同过期时间

### 5. 前端实现要点

#### 签到状态管理
```javascript
// React Hook 示例
const useCheckin = () => {
    const [checkinStatus, setCheckinStatus] = useState({
        todayChecked: false,
        continuousDays: 0,
        availableMakeupCards: 0,
        currentMonthStats: {},
        calendarData: null
    });
    
    // 签到操作
    const checkin = async (method = 'WEB') => {
        const result = await api.checkin({ method });
        
        // 播放动画
        playCheckinAnimation(result.rewards);
        
        // 更新状态
        setCheckinStatus(prev => ({
            ...prev,
            todayChecked: true,
            continuousDays: result.continuousDays,
            availableMakeupCards: result.availableMakeupCards
        }));
        
        // 更新用户积分
        updateUserPoints(result.totalPoints);
        
        return result;
    };
    
    // 补签操作
    const makeupCheckin = async (targetDate) => {
        // 实现补签逻辑
    };
    
    // 加载签到数据
    const loadCheckinData = async () => {
        // 加载日历、统计等信息
    };
    
    return { checkinStatus, checkin, makeupCheckin, loadCheckinData };
};
```

#### 摇一摇签到实现
```javascript
// 移动端摇一摇签到
class ShakeCheckin {
    constructor() {
        this.shakeThreshold = 15; // 摇动阈值
        this.lastShakeTime = 0;
        this.shakeCount = 0;
        this.isCheckingIn = false;
    }
    
    startListening() {
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', this.handleShake.bind(this));
        }
    }
    
    handleShake(event) {
        const acceleration = event.acceleration;
        const totalAcceleration = Math.sqrt(
            acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
        );
        
        if (totalAcceleration > this.shakeThreshold) {
            const currentTime = Date.now();
            if (currentTime - this.lastShakeTime > 1000) {
                this.shakeCount++;
                this.lastShakeTime = currentTime;
                
                if (this.shakeCount >= 3 && !this.isCheckingIn) {
                    this.triggerCheckin();
                    this.shakeCount = 0;
                }
            }
        }
    }
    
    async triggerCheckin() {
        this.isCheckingIn = true;
        try {
            await api.checkin({ method: 'SHAKE' });
            this.showSuccessAnimation();
        } finally {
            this.isCheckingIn = false;
        }
    }
}
```

### 6. 安全与防作弊设计

#### 防刷策略
1. **频率限制**：同一用户每日只能签到一次
2. **IP限制**：同一IP每日签到次数限制
3. **设备指纹**：记录设备信息，防止多账号刷签
4. **时间验证**：服务器时间验证，防止修改本地时间
5. **行为分析**：异常签到行为检测和预警

#### 数据一致性保证
1. **事务处理**：签到操作使用数据库事务
2. **幂等性设计**：防止重复签到
3. **数据同步**：使用消息队列保证数据最终一致性
4. **定期对账**：定期检查数据一致性

### 7. 监控与统计

#### 关键监控指标
- 每日签到人数和成功率
- 平均连续签到天数
- 补签卡使用率
- 特殊日期参与率
- 摇一摇签到使用率

#### 用户行为分析
- 签到时段分布
- 签到方式偏好
- 连续签到用户画像
- 奖励效果分析

### 8. 扩展性设计

#### 插件化架构
```java
// 签到奖励插件接口
public interface CheckinRewardPlugin {
    String getName();
    boolean canApply(User user, CheckinContext context);
    RewardResult apply(User user, CheckinContext context);
}

// 示例插件
@Component
public class ExperienceRewardPlugin implements CheckinRewardPlugin {
    // 经验值奖励插件
}

@Component  
public class BadgeRewardPlugin implements CheckinRewardPlugin {
    // 徽章奖励插件
}

@Component
public class VipRewardPlugin implements CheckinRewardPlugin {
    // VIP奖励插件
}
```

#### 规则引擎设计
```java
// 规则定义
public class CheckinRule {
    private String name;
    private Condition condition;
    private Action action;
    
    public boolean evaluate(CheckinContext context) {
        return condition.evaluate(context);
    }
    
    public void execute(CheckinContext context) {
        action.execute(context);
    }
}

// 规则引擎
@Component
public class CheckinRuleEngine {
    private List<CheckinRule> rules;
    
    public CheckinResult process(CheckinContext context) {
        for (CheckinRule rule : rules) {
            if (rule.evaluate(context)) {
                rule.execute(context);
            }
        }
        return context.getResult();
    }
}
```

### 9. 特殊场景处理

#### 跨天签到
- 支持时区处理
- 支持服务器时间切换
- 考虑国际用户的时间差异

#### 系统维护期间
- 提供维护公告
- 允许维护后补签
- 补偿机制

#### 数据迁移
- 历史签到数据导入
- 统计信息重建
- 缓存预热

### 10. 性能优化方案

#### 数据库优化
1. 分区表：按年月分区签到记录表
2. 读写分离：查询走从库，写入走主库
3. 索引优化：针对常用查询建立合适索引

#### 应用层优化
1. 异步处理：非核心逻辑异步化
2. 批量操作：统计信息批量更新
3. 连接池优化：合理配置数据库连接池

### 11. 测试策略

#### 单元测试
- 签到逻辑测试
- 奖励计算测试
- 连续天数计算测试

#### 集成测试
- 完整签到流程测试
- 补签流程测试
- 多用户并发签到测试

#### 压力测试
- 高并发签到场景
- 大数据量统计查询
- 缓存击穿场景

这个设计提供了完整的签到系统架构，从数据库设计到系统实现思路都进行了详细规划，可以支持大规模用户的高并发签到场景。
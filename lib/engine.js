// 订单类型枚举
const OrderType = {
    LIMIT: 1,  // 限价单
    MARKET: 2  // 市价单
};

// 订单方向枚举
const OrderSide = {
    BUY: 1,    // 买单
    SELL: 2    // 卖单
};

// 订单类
class Order {
    constructor(orderId, symbol, price, quantity, orderType, side, timestamp) {
        this.orderId = orderId;
        this.symbol = symbol;
        this.price = price;
        this.quantity = quantity;
        this.orderType = orderType;
        this.side = side;
        this.timestamp = timestamp;
    }
}

// 成交记录类
class Trade {
    constructor(buyerId, sellerId, symbol, price, quantity) {
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.symbol = symbol;
        this.price = price;
        this.quantity = quantity;
    }
}

// 订单簿类
class OrderBook {
    constructor() {
        this.bids = [];  // 买单堆（最大堆）
        this.asks = [];  // 卖单堆（最小堆）
    }
    
    // 添加买单
    addBid(order) {
        // 使用负价格实现最大堆
        this.bids.push({ key: -order.price, timestamp: order.timestamp, order });
        this.bids.sort((a, b) => a.key - b.key || a.timestamp - b.timestamp);
    }
    
    // 添加卖单
    addAsk(order) {
        this.asks.push({ key: order.price, timestamp: order.timestamp, order });
        this.asks.sort((a, b) => a.key - b.key || a.timestamp - b.timestamp);
    }
    
    // 获取最高买价
    getHighestBid() {
        return this.bids.length > 0 ? this.bids[0].order : null;
    }
    
    // 获取最低卖价
    getLowestAsk() {
        return this.asks.length > 0 ? this.asks[0].order : null;
    }
    
    // 移除最高买价订单
    removeHighestBid() {
        if (this.bids.length > 0) {
            this.bids.shift();
        }
    }
    
    // 移除最低卖价订单
    removeLowestAsk() {
        if (this.asks.length > 0) {
            this.asks.shift();
        }
    }
}

// 撮合引擎类
class MatchingEngine {
    constructor() {
        this.orderBooks = new Map();  // 交易对 -> 订单簿
        this.trades = [];             // 成交记录
    }
    
    // 处理订单
    processOrder(order) {
        // 检查交易对的订单簿是否存在
        if (!this.orderBooks.has(order.symbol)) {
            this.orderBooks.set(order.symbol, new OrderBook());
        }
        
        const orderBook = this.orderBooks.get(order.symbol);
        let trades = [];
        
        // 市价单处理逻辑
        if (order.orderType === OrderType.MARKET) {
            trades = this._processMarketOrder(order, orderBook);
        }
        // 限价单处理逻辑
        else {  // LIMIT
            trades = this._processLimitOrder(order, orderBook);
        }
        
        // 保存成交记录
        this.trades.push(...trades);
        return trades;
    }
    
    // 处理市价单
    _processMarketOrder(order, orderBook) {
        const trades = [];
        let remainingQty = order.quantity;
        
        if (order.side === OrderSide.BUY) {
            // 买单吃卖单
            while (remainingQty > 0 && orderBook.getLowestAsk()) {
                const ask = orderBook.getLowestAsk();
                const tradeQty = Math.min(remainingQty, ask.quantity);
                
                trades.push(new Trade(
                    order.orderId,
                    ask.orderId,
                    order.symbol,
                    ask.price,  // 市价单按对手价成交
                    tradeQty
                ));
                
                // 更新订单数量
                remainingQty -= tradeQty;
                ask.quantity -= tradeQty;
                
                // 移除已成交订单
                if (ask.quantity === 0) {
                    orderBook.removeLowestAsk();
                }
            }
        } else {
            // 卖单吃买单
            while (remainingQty > 0 && orderBook.getHighestBid()) {
                const bid = orderBook.getHighestBid();
                const tradeQty = Math.min(remainingQty, bid.quantity);
                
                trades.push(new Trade(
                    bid.orderId,
                    order.orderId,
                    order.symbol,
                    bid.price,  // 市价单按对手价成交
                    tradeQty
                ));
                
                // 更新订单数量
                remainingQty -= tradeQty;
                bid.quantity -= tradeQty;
                
                // 移除已成交订单
                if (bid.quantity === 0) {
                    orderBook.removeHighestBid();
                }
            }
        }
        
        return trades;
    }
    
    // 处理限价单
    _processLimitOrder(order, orderBook) {
        const trades = [];
        let remainingQty = order.quantity;
        
        if (order.side === OrderSide.BUY) {
            // 买单：检查是否能吃卖单
            while (remainingQty > 0 && orderBook.getLowestAsk() && 
                  order.price >= orderBook.getLowestAsk().price) {
                const ask = orderBook.getLowestAsk();
                const tradeQty = Math.min(remainingQty, ask.quantity);
                
                trades.push(new Trade(
                    order.orderId,
                    ask.orderId,
                    order.symbol,
                    ask.price,  // 按卖价成交
                    tradeQty
                ));
                
                // 更新订单数量
                remainingQty -= tradeQty;
                ask.quantity -= tradeQty;
                
                // 移除已成交订单
                if (ask.quantity === 0) {
                    orderBook.removeLowestAsk();
                }
            }
            
            // 如果还有剩余量，加入买单簿
            if (remainingQty > 0) {
                order.quantity = remainingQty;
                orderBook.addBid(order);
            }
        } else {
            // 卖单：检查是否能吃买单
            while (remainingQty > 0 && orderBook.getHighestBid() && 
                  order.price <= orderBook.getHighestBid().price) {
                const bid = orderBook.getHighestBid();
                const tradeQty = Math.min(remainingQty, bid.quantity);
                
                trades.push(new Trade(
                    bid.orderId,
                    order.orderId,
                    order.symbol,
                    bid.price,  // 按买价成交
                    tradeQty
                ));
                
                // 更新订单数量
                remainingQty -= tradeQty;
                bid.quantity -= tradeQty;
                
                // 移除已成交订单
                if (bid.quantity === 0) {
                    orderBook.removeHighestBid();
                }
            }
            
            // 如果还有剩余量，加入卖单簿
            if (remainingQty > 0) {
                order.quantity = remainingQty;
                orderBook.addAsk(order);
            }
        }
        
        return trades;
    }
}

class SettlementEngine {
    constructor(matchingEngine) {
        this.matchingEngine = matchingEngine;  // 引用撮合引擎
        this.settledEvents = new Map();        // 已结算事件
    }
    
    // 结算单个事件
    settleEvent(eventResult) {
        if (eventResult.settled) {
            return false;  // 已结算，跳过
        }
        
        // 获取该事件的所有成交订单
        const trades = this.matchingEngine.trades
            .filter(trade => trade.symbol === eventResult.symbol);
        
        // 为每个订单计算结算结果
        for (const trade of trades) {
            // 查找买方订单
            const buyerOrder = this._findOrderById(trade.buyerId);
            if (buyerOrder) {
                this._settleBet(buyerOrder, eventResult);
            }
            
            // 查找卖方订单
            const sellerOrder = this._findOrderById(trade.sellerId);
            if (sellerOrder) {
                this._settleBet(sellerOrder, eventResult);
            }
        }
        
        // 标记事件已结算
        eventResult.settled = true;
        this.settledEvents.set(eventResult.eventId, eventResult);
        return true;
    }
    
    // 查找订单
    _findOrderById(orderId) {
        // 实际系统中可能需要从订单历史中查找
        // 简化示例，假设所有订单都在撮合引擎的订单簿中
        for (const orderBook of this.matchingEngine.orderBooks.values()) {
            for (const bid of orderBook.bids) {
                if (bid.order.orderId === orderId) {
                    return bid.order;
                }
            }
            for (const ask of orderBook.asks) {
                if (ask.order.orderId === orderId) {
                    return ask.order;
                }
            }
        }
        return null;
    }
    
    // 计算单个投注的结算结果
    _settleBet(order, eventResult) {
        // 已结算的订单不再处理
        if (order.settlementStatus) {
            return;
        }
        
        // 计算等价赔率（确保使用统一的欧洲赔率格式）
        const odds = this._convertToDecimalOdds(order);
        
        // 根据投注方向和事件结果确定输赢
        if ((order.direction === BetDirection.BACK && eventResult.outcome) ||
            (order.direction === BetDirection.LAY && !eventResult.outcome)) {
            // 投注成功
            order.settlementStatus = 'WIN';
            // 计算赔付金额 = 本金 × 赔率
            order.payout = order.quantity * odds;
            // 计算利润 = 赔付金额 - 本金
            order.profit = order.payout - order.quantity;
        } else {
            // 投注失败
            order.settlementStatus = 'LOSE';
            order.payout = 0;
            order.profit = -order.quantity;  // 损失全部本金
        }
        
        // 记录结算时间等其他信息（实际系统中可能需要）
    }
    
    // 将各种赔率类型转换为欧洲赔率
    _convertToDecimalOdds(order) {
        if (order.oddsType === OddsType.DECIMAL) {
            return order.oddsValue;
        }
        
        // 其他赔率类型转换逻辑（略，参考之前的转换公式）
        return order.oddsValue;  // 简化示例
    }
}

// 新增事件结果类
class EventResult {
    /**
     * 创建事件结果对象
     * @param {number} eventId 事件ID
     * @param {string} symbol 交易对符号
     * @param {boolean|string} outcome 事件结果（true/false 或 具体结果）
     */
    constructor(eventId, symbol, outcome) {
        this.eventId = eventId;         // 事件ID
        this.symbol = symbol;           // 交易对符号
        this.outcome = outcome;         // 事件结果（true/false 或 具体结果）
        this.settled = false;           // 是否已结算
    }
}

class PayoutEngine {
    constructor(accountManager, settlementEngine) {
        this.accountManager = accountManager;
        this.settlementEngine = settlementEngine;
        this.payoutResults = new Map();
    }
    
    // 执行赔付
    processPayouts(eventId) {
        // 获取事件结算结果
        const eventResult = this.settlementEngine.settledEvents.get(eventId);
        if (!eventResult || !eventResult.settled) {
            return [];
        }
        
        // 获取该事件的所有成交订单
        const trades = this.settlementEngine.matchingEngine.trades
            .filter(trade => trade.symbol === eventResult.symbol);
        
        const results = [];
        
        // 为每个订单执行赔付
        for (const trade of trades) {
            // 处理买方
            const buyerOrder = this.settlementEngine._findOrderById(trade.buyerId);
            if (buyerOrder && buyerOrder.settlementStatus === 'WIN' && !buyerOrder.payoutProcessed) {
                const result = this._processSinglePayout(buyerOrder);
                results.push(result);
            }
            
            // 处理卖方
            const sellerOrder = this.settlementEngine._findOrderById(trade.sellerId);
            if (sellerOrder && sellerOrder.settlementStatus === 'WIN' && !sellerOrder.payoutProcessed) {
                const result = this._processSinglePayout(sellerOrder);
                results.push(result);
            }
        }
        
        return results;
    }
    
    // 处理单个订单的赔付
    _processSinglePayout(order) {
        try {
            // 创建交易记录
            const txId = `TX_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const transaction = new Transaction(
                txId,
                "SYSTEM_PAYOUT",  // 系统赔付账户（实际系统中可能是风险池）
                order.userId,     // 用户账户
                order.payout,     // 赔付金额
                "PAYOUT",         // 交易类型
                order.orderId     // 关联订单ID
            );
            
            // 执行资金转移
            const success = this.accountManager.recordCredit(transaction);
            
            // 标记订单已处理
            order.payoutProcessed = true;
            
            const result = new PayoutResult(
                order.orderId,
                success,
                order.payout,
                success ? null : transaction.errorMessage
            );
            
            this.payoutResults.set(order.orderId, result);
            return result;
        } catch (error) {
            const result = new PayoutResult(
                order.orderId,
                false,
                order.payout,
                error.message
            );
            
            this.payoutResults.set(order.orderId, result);
            return result;
        }
    }
}

// 账户类
class Account {
    constructor(accountId, userId, balance = 0, frozen = 0) {
        this.accountId = accountId;    // 账户ID
        this.userId = userId;          // 用户ID
        this.balance = balance;        // 可用余额
        this.frozen = frozen;          // 冻结金额
        this.version = 0;              // 版本号（用于乐观锁）
    }
    
    // 冻结资金
    freeze(amount) {
        if (this.balance < amount) {
            throw new Error("余额不足，无法冻结");
        }
        this.balance -= amount;
        this.frozen += amount;
        this.version++;
    }
    
    // 解冻资金
    unfreeze(amount) {
        if (this.frozen < amount) {
            throw new Error("冻结金额不足，无法解冻");
        }
        this.frozen -= amount;
        this.balance += amount;
        this.version++;
    }
    
    // 增加余额
    credit(amount) {
        this.balance += amount;
        this.version++;
    }
    
    // 扣除余额
    debit(amount) {
        if (this.balance < amount) {
            throw new Error("余额不足，无法扣除");
        }
        this.balance -= amount;
        this.version++;
    }
}

// 资金流水记录
class Transaction {
    constructor(txId, fromAccountId, toAccountId, amount, type, referenceId) {
        this.txId = txId;                // 交易ID
        this.fromAccountId = fromAccountId;  // 转出账户
        this.toAccountId = toAccountId;    // 转入账户
        this.amount = amount;            // 金额
        this.type = type;                // 交易类型（投注、赔付、手续费等）
        this.referenceId = referenceId;  // 关联ID（如订单ID）
        this.timestamp = Date.now();     // 时间戳
        this.status = "PENDING";         // 状态（PENDING, SUCCESS, FAILURE）
    }
}

// 赔付执行结果
class PayoutResult {
    constructor(orderId, success, amount, errorMessage = null) {
        this.orderId = orderId;          // 订单ID
        this.success = success;          // 是否成功
        this.amount = amount;            // 赔付金额
        this.errorMessage = errorMessage;  // 错误信息
    }
}
module.exports = {
    OrderType,
    OrderSide,
    Order,  // 订单类
    Trade,  // 成交记录类
    OrderBook,  // 订单簿类
    MatchingEngine,  // 撮合引擎类
    SettlementEngine,  // 结算引擎类
    PayoutEngine,  // 赔付引擎类
    EventResult,  // 事件结果类
    PayoutResult,  // 赔付结果类
    Account,  // 账户类
    Transaction,  // 资金流水记录类
};
import type { BalanceBubbleRow, BalanceState, CustomNode } from './types';
/**
 * 把 BalanceState 渲染成气泡行数据（纯函数，不碰 DOM/React）：
 * - windows：两行 —— 「X额度已用 N%」+ 重置倒计时
 * - money：一行 —— 「余额（峰/谷）¥x.xx」（峰红/谷绿由 role:'tier' 表达）；
 *   服务商没给档位装饰时退化成「余额 ¥x.xx」，不替它编一个峰谷
 * - points：一行 —— 「余额 800 积分」（单位由数据带出，绝不套货币符号）
 * - **custom：返回空数组** —— 该形态的展示语言是节点树，走同文件下方的 customViews()；
 *   两端渲染入口都先判 shape === 'custom'，这里的空数组只在"误用行数据"时兜底成空气泡
 * - 无效：显式展示不可用原因（见 unavailableRows），绝不伪造数字
 */
export declare function balanceBubbleView(state: BalanceState): BalanceBubbleRow[];
/**
 * 展开态行数据（点余额气泡后显示）：只有 windows 有三窗口读数可展开，每个存在窗口一行。
 *
 * money / points 形态没有"窗口"这个概念（只有账户余额 / 积分），也没有额外的 handler.detail，
 * 于是回落到收起态视图 —— 展开前后内容一致，不会出现"点了一下却什么都没变"的空交互。
 */
export declare function balanceDetailView(state: BalanceState): BalanceBubbleRow[];
/**
 * 多页节点树：只有 `shape:'custom'` 有，其余形态一律 undefined（调用方据此回落行数据）。
 * 第 1 项是初始页；>1 页时气泡可点，点一下切下一页（末页回第一页）。
 */
export declare function customViews(state: BalanceState): CustomNode[] | undefined;
/**
 * custom 是否可点切页 —— 两端据此决定气泡可不可点（内置形态只有 windows 可点）。
 * 只有一页 = 点开也没别的东西，保持不可点（气泡继续不挡页面）。
 */
export declare function customClickable(state: BalanceState): boolean;

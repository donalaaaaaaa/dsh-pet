import type { BalanceState, CustomTag } from './types';
/** 合法 tag：只开放排布局需要的几个。`script/style/iframe/svg` 之类一律不认（非法 tag = 整树作废）。 */
export declare const CUSTOM_TAGS: readonly CustomTag[];
/**
 * 合法内联样式（camelCase，与 React style 对象同形）—— 覆盖 flex 布局、盒模型、文字、圆角背景。
 *
 * **刻意不含** `position` / `zIndex` / `transform` / `inset`：气泡是悬在宠物头顶的浮层，那几样
 * 能让内容跑出气泡、盖住宠物本体或宿主页面（与"气泡默认不挡页面"的既有约束冲突）。
 */
export declare const CUSTOM_STYLE_KEYS: ReadonlySet<string>;
/**
 * 容量上限：气泡宽度只有 10.989em（约 155px），且它悬在宠物头顶。
 * 超限的处理分两种：**文本截断**（truncate，内容还能看）与**整树作废**（结构超限，
 * 因为少画一块会得到一棵骗人的树——不如这一拍不显示）。
 */
export declare const CUSTOM_LIMITS: {
    /** 树深上限（根为 0）；超出 = 整树作废 */
    readonly maxDepth: 6;
    /** 全树节点数上限；超出 = 整树作废 */
    readonly maxNodes: 200;
    /** 单节点子节点数上限；超出 = 整树作废 */
    readonly maxChildren: 24;
    /** 单段文本上限（超出截断） */
    readonly maxText: 120;
    /** 单条样式值上限（超出丢弃该属性，不影响其余样式） */
    readonly maxStyleValue: 64;
    /** img 地址上限（含 scheme） */
    readonly maxSrc: 512;
    /** 多页视图的页数上限：点不过来，也容易撑破气泡容量（1 页 = 不可点） */
    readonly maxViews: 4;
};
/**
 * host 的余额原始响应（`BalanceResult`，经 `/state` 的 `sections.balance` 叶子送达）→ 客户端视图。
 *
 * 形状非法 / shape 不认识 → **null**（消费端跳过这一拍）——注意这里**不抛**：它跑在 1s 轮询里，
 * 抛异常会把整拍打断（其余叶子也跟着不渲染）。取数失败（HTTP/网络）不在这里发生：取数在 host，
 * 失败会以 `ok:false` 写进 S，由这里正常映射成"不可用"状态。
 */
export declare function toBalanceState(raw: unknown): BalanceState | null;

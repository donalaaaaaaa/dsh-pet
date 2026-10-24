# dsh-pet 桌面版 fork 🐾

> 本 fork 基于 dsh-pet 0.3.7（main）二次开发，改动：
>
> - **只在桌面显示**：浏览器/应用窗口内的 overlay 不再渲染；旧配置里的 `web`/`both` 一律按桌面处理（`none` 仍为隐藏）。
> - **只有一只**：桌面最多显示一只宠物（取宠物列表第一只）。
> - **全局单实例**：Electron helper 加单实例锁，多个宿主（DSH 桌面版 + `dsh web` / standalone / 多个 profile）或插件重载时也只会有一只；抢不到锁的 helper 以退出码 75 退出，宿主每 3s 重试，旧实例退出后自动接管。需要多开可设 `DSH_PET_ALLOW_MULTI_INSTANCE=1`。
> - 顺手修复：设置页保存时写盘失败不再被误报成 `400 invalid JSON body`，改为 `500` 并带真实原因。
>
> 本地安装：`dsh plugin --profile desktop add <本 tgz 的绝对路径>`（或先 `npm i -g` 再按原方式添加），装完重开桌面应用。

---

# dsh-pet 🐾

一只住在 DeepSeek Harness 里的桌面宠物，一百余个透明动画，可多开、能上桌面。

安装与完整文档：**<https://github.com/PC2005-cloud/dsh-pet>**

许可：代码 MIT；素材禁止商用；二创在公开渠道须署名（同上链接）。

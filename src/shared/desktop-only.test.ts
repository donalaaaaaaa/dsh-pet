/**
 * 桌面版 fork 的不变式：浏览器 overlay 永不渲染；除 none 外一律上桌面；桌面最多一只。
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isWebVisible, isDesktopVisible, MAX_DESKTOP_PETS } from './config';

test('isWebVisible 恒为 false（不再出现网页内那一只）', () => {
  for (const d of ['web', 'desktop', 'both', 'none'] as const) assert.equal(isWebVisible(d), false);
});

test('isDesktopVisible：web/desktop/both 都上桌面，none 不上', () => {
  assert.equal(isDesktopVisible('web'), true);
  assert.equal(isDesktopVisible('desktop'), true);
  assert.equal(isDesktopVisible('both'), true);
  assert.equal(isDesktopVisible('none'), false);
});

test('桌面最多一只', () => {
  assert.equal(MAX_DESKTOP_PETS, 1);
  const host = readFileSync(new URL('../host/index.ts', import.meta.url), 'utf8');
  assert.match(host, /\.slice\(0, MAX_DESKTOP_PETS\)/);
  const renderer = readFileSync(new URL('../../runtime/electron-helper/renderer.js', import.meta.url), 'utf8');
  assert.match(renderer, /\.slice\(0, S\.MAX_DESKTOP_PETS/);
});

test('helper 主进程带单实例锁', () => {
  const main = readFileSync(new URL('../../runtime/electron-helper/main.js', import.meta.url), 'utf8');
  assert.match(main, /requestSingleInstanceLock\(\)/);
  assert.match(main, /SINGLE_INSTANCE_EXIT_CODE = 75/);
});

test('默认配置 display 为 desktop', () => {
  const cfg = readFileSync(new URL('../../assets/config.jsonc', import.meta.url), 'utf8');
  assert.match(cfg, /"display": "desktop"/);
  assert.doesNotMatch(cfg, /"display": "both"/);
});

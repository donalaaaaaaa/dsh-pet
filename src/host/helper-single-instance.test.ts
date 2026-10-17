/**
 * 桌面版 fork：helper 以 75 退出（单实例锁被占）时不算崩溃，按固定间隔重试，旧实例退出后接管。
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { HelperProcess, HELPER_SINGLE_INSTANCE_EXIT_CODE, HELPER_LOCK_RETRY_MS } from './helper-process';

test('exit 75 → 不计崩溃，3s 后重试；锁释放后正常运行', async () => {
  assert.equal(HELPER_SINGLE_INSTANCE_EXIT_CODE, 75);
  const dir = mkdtempSync(join(tmpdir(), 'dsh-pet-lock-'));
  const flag = join(dir, 'released');
  const script = join(dir, 'fake-helper.cjs');
  // 第一次：锁被占 → 75；之后（flag 存在）：常驻
  writeFileSync(
    script,
    `const fs=require('fs');if(!fs.existsSync(${JSON.stringify(flag)})){process.exit(75)}setInterval(()=>{},1000);`,
  );
  const logs: string[] = [];
  const logger = {
    info: () => {},
    warn: (...a: unknown[]) => {
      logs.push(String(a[0]));
    },
    error: (...a: unknown[]) => {
      logs.push('E:' + String(a[0]));
    },
  };
  const hp = new HelperProcess({ command: process.execPath, args: [script], cwd: dir }, logger);
  const first = hp.start();
  await new Promise((r) => first?.once('exit', r));
  writeFileSync(flag, '1');
  await new Promise((r) => setTimeout(r, HELPER_LOCK_RETRY_MS + 800));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 读私有字段做断言
  const internal = hp as any;
  assert.ok(internal.child && internal.child.exitCode === null, '锁释放后应已重新拉起并常驻');
  assert.equal(internal.restartFailures, 0, '锁等待不得计入连续崩溃');
  assert.ok(logs.some((l) => l.includes('single-instance lock')));
  assert.ok(!logs.some((l) => l.startsWith('E:')));
  await hp.stopAndWait('test');
  assert.ok(existsSync(flag));
});

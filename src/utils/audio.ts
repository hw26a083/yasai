/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API を使用したゲーム用効果音生成ヘルパー
class AudioManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // プレイヤーが弾を撃つ音
  playShoot() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // ピッチを急速に下げる (シューッという音)
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // 敵がダメージを受けた時の音
  playEnemyHit() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.setValueAtTime(600, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn(e);
    }
  }

  // 敵が爆発したとき（撃破）
  playExplosion() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const bufferSize = ctx.sampleRate * 0.25; // 0.25秒
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // ホワイトノイズ生成
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      // ローパスフィルターで爆発感
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseNode.start();
      noiseNode.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn(e);
    }
  }

  // 野菜（ドロップアイテム）を拾った音
  playPickup(itemType: string) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      let startFreq = 400;
      let endFreq = 800;

      // 野菜の種類によって音程を変えて変化を出す
      if (itemType === "CARROT") { startFreq = 300; endFreq = 900; }
      else if (itemType === "TOMATO") { startFreq = 400; endFreq = 600; }
      else if (itemType === "PIMIENTO") { startFreq = 260; endFreq = 780; }
      else if (itemType === "EGGPLANT") { startFreq = 500; endFreq = 1000; }
      else if (itemType === "BROCCOLI") { startFreq = 350; endFreq = 700; }

      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn(e);
    }
  }

  // プレイヤーがダメージを受けた時
  playPlayerHit() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.warn(e);
    }
  }

  // ステージクリアファンファーレ
  playStageClear() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      // ピロリロリーン！
      const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + index * 0.1);
        
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + index * 0.1 + 0.02);
        gain.gain.setValueAtTime(0.08, now + index * 0.1 + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 0.3);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // ゲームオーバー
  playGameOver() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const notes = [392.00, 349.23, 311.13, 261.63]; // G, F, Eb, C (悲しい下降)
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + index * 0.15);
        
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + index * 0.15 + 0.02);
        gain.gain.setValueAtTime(0.08, now + index * 0.15 + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.15 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + index * 0.15);
        osc.stop(now + index * 0.15 + 0.55);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // ゲームクリア大ファンファーレ！
  playGameClear() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      // Cメロディー
      const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 523.25, 659.25]; 
      const dur = 0.12;
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + index * dur);
        
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + index * dur + 0.02);
        gain.gain.setValueAtTime(0.08, now + index * dur + dur * 0.8);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * dur + dur * 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + index * dur);
        osc.stop(now + index * dur + dur * 1.8);
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

export const audio = new AudioManager();

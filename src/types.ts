/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum GameState {
  TITLE = "TITLE",
  PLAYING = "PLAYING",
  STAGE_CLEAR = "STAGE_CLEAR",
  GAME_OVER = "GAME_OVER",
  GAME_CLEAR = "GAME_CLEAR",
  RANKING = "RANKING",
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  atk: number;         // 弾の攻撃力
  speed: number;       // 移動速度
  fireDelay: number;   // 発射間隔 (ミリ秒)
  bulletCount: number; // 同時発射数 (1, 2, 3...)
  defense: number;     // 防御率 / ダメージカット (%)
  score: number;
  carrotCount: number;
  tomatoCount: number;
  pimientoCount: number;
  eggplantCount: number;
  broccoliCount: number;
  cornCount: number;   // トウモロコシ (連射スピードUP)
}

export interface Player {
  x: number;
  y: number;
  radius: number;
  angle: number;       // プレイヤーの向いている角度
}

export enum VeggieType {
  CARROT = "CARROT",       // にんじん (速度アップ)
  TOMATO = "TOMATO",       // トマト (MaxHP & 回復)
  PIMIENTO = "PIMIENTO",   // ピーマン (攻撃力アップ)
  EGGPLANT = "EGGPLANT",   // ナス (発射ディレイ減少 / 連射)
  BROCOOLI = "BROCCOLI",   // ブロッコリー (防御力アップ)
  CORN = "CORN",           // トウモロコシ (超連射)
}

export interface DropItem {
  id: string;
  x: number;
  y: number;
  type: VeggieType;
  radius: number;
  vy: number;              // 落下速度や、ゆらゆら動くための速度
  magnetized: boolean;     // プレイヤーに引き寄せられている状態
}

export enum EnemyType {
  CARROT_DEMON = "CARROT_DEMON",
  TOMATO_DEMON = "TOMATO_DEMON",
  PIMIENTO_DEMON = "PIMIENTO_DEMON",
  EGGPLANT_DEMON = "EGGPLANT_DEMON",
  BROCCOLI_DEMON = "BROCCOLI_DEMON",
  BOSS = "BOSS",
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: EnemyType;
  hp: number;
  maxHp: number;
  radius: number;
  damage: number;
  scoreValue: number;
  lastShotTime: number;
  shootInterval: number;
  stateTimer: number;       // 特殊能力（ダッシュやシールド）のクールタイム等
  shieldActive?: boolean;   // ブロッコリー用
  bossPhase?: number;       // ボス用
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  isPlayerBullet: boolean;
  color: string;
  angle?: number;
}

export interface GameEffect {
  id: string;
  x: number;
  y: number;
  type: "explosion" | "spark" | "heal" | "buff-carrot" | "buff-tomato" | "buff-pimiento" | "buff-eggplant" | "buff-broccoli" | "buff-corn" | "boss-charge" | "text";
  color: string;
  radius: number;
  maxRadius: number;
  alpha: number;
  life: number;           // 寿命 (フレーム数など)
  maxLife: number;
  text?: string;
  vx?: number;
  vy?: number;
}

export interface RankingEntry {
  name: string;
  score: number;
  stageReached: number;
  date: string;
  carrot: number;
  tomato: number;
  pimiento: number;
  eggplant: number;
  broccoli: number;
  corn: number;
}

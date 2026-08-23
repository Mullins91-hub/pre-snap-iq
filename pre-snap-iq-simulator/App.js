import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FIELD_WIDTH = SCREEN_WIDTH - 32;
const FIELD_HEIGHT = 240;

// =============================================================================
// COMPLETE MASTER PLAYBOOK DATABASE
// =============================================================================
const initialScenarios = [
  // ---------------------------------------------------------------------------
  // 🇬🇧 CUSTOM UK TEAM PLAYMAKER READS (IMPORTED FROM PDF)
  // ---------------------------------------------------------------------------
  {
    id: 'uk_play_01',
    isTeamPlaybook: true,
    mode: 'OFFENSE',
    prompt: '🇬🇧 TEAM PLAYBOOK: Identify this 10 Personnel 2x2 spread concept.',
    correctAnswer: 'Bench 10 (2 x 2)',
    choices: ['Bench 10 (2 x 2)', 'Deep Out 11 (3 x 1)', 'Fan Bunch (3 x 1)', 'Heavy 22 Power'],
    keyRead: 'Coach Note (Bench Concept): 10 Personnel balanced spread. Out-routes targeting the sidelines to stretch flat defenders.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 44, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'W1', x: 10, y: 60, team: 'OFF', isKeyRead: true },
      { id: '9', role: 'W2', x: 24, y: 60, team: 'OFF', isKeyRead: true }, { id: '10', role: 'W3', x: 76, y: 60, team: 'OFF', isKeyRead: true },
      { id: '11', role: 'W4', x: 90, y: 60, team: 'OFF', isKeyRead: true }, { id: '12', role: 'FS',   x: 35, y: 20, team: 'DEF' },
      { id: '13', role: 'SS',   x: 65, y: 20, team: 'DEF' }, { id: '14', role: 'CB1',  x: 10, y: 35, team: 'DEF' },
      { id: '15', role: 'CB2',  x: 90, y: 35, team: 'DEF' }, { id: '16', role: 'NC1',  x: 24, y: 38, team: 'DEF' },
      { id: '17', role: 'NC2',  x: 76, y: 38, team: 'DEF' }, { id: '18', role: 'MIKE', x: 50, y: 46, team: 'DEF' },
      { id: '19', role: 'DE1',  x: 34, y: 55, team: 'DEF' }, { id: '20', role: 'DT1',  x: 48, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 64, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'uk_play_02',
    isTeamPlaybook: true,
    mode: 'OFFENSE',
    prompt: '🇬🇧 TEAM PLAYBOOK: Identify this 11 Personnel 3x1 unbalanced concept.',
    correctAnswer: 'Deep Out 11 (3 x 1)',
    choices: ['Bench 10 (2 x 2)', 'Deep Out 11 (3 x 1)', 'Fan Bunch (3 x 1)', 'Pro 12 Duo'],
    keyRead: 'Coach Note (Deep Out 11): 11 Personnel (1 RB, 1 TE inline left) with 3 WRs stacked right to force single-coverage left.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'TE', x: 32, y: 60, team: 'OFF', isKeyRead: true },
      { id: '9', role: 'W1', x: 72, y: 60, team: 'OFF', isKeyRead: true }, { id: '10', role: 'W2', x: 82, y: 60, team: 'OFF', isKeyRead: true },
      { id: '11', role: 'W3', x: 92, y: 60, team: 'OFF', isKeyRead: true }, { id: '12', role: 'FS',   x: 50, y: 20, team: 'DEF' },
      { id: '13', role: 'SS',   x: 75, y: 35, team: 'DEF' }, { id: '14', role: 'CB1',  x: 10, y: 35, team: 'DEF' },
      { id: '15', role: 'CB2',  x: 90, y: 35, team: 'DEF' }, { id: '16', role: 'MIKE', x: 50, y: 46, team: 'DEF' },
      { id: '17', role: 'WILL', x: 40, y: 46, team: 'DEF' }, { id: '18', role: 'DE1',  x: 30, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 68, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'uk_play_03',
    isTeamPlaybook: true,
    mode: 'OFFENSE',
    prompt: '🇬🇧 TEAM PLAYBOOK: Identify this 3x1 bunch alignment.',
    correctAnswer: 'Fan Bunch (3 x 1)',
    choices: ['Fan Bunch (3 x 1)', 'Bench 10 (2 x 2)', 'Deep Out 11 (3 x 1)', 'Pistol Offset'],
    keyRead: 'Coach Note (Fan Bunch): 3 receivers in tight triangle cluster to beat press-man and release wide fan routes.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'TE', x: 32, y: 60, team: 'OFF' },
      { id: '9', role: 'W1', x: 80, y: 60, team: 'OFF', isKeyRead: true }, { id: '10', role: 'W2', x: 84, y: 63, team: 'OFF', isKeyRead: true },
      { id: '11', role: 'W3', x: 88, y: 60, team: 'OFF', isKeyRead: true }, { id: '12', role: 'FS',   x: 50, y: 20, team: 'DEF' },
      { id: '13', role: 'SS',   x: 75, y: 35, team: 'DEF' }, { id: '14', role: 'CB1',  x: 10, y: 35, team: 'DEF' },
      { id: '15', role: 'CB2',  x: 82, y: 35, team: 'DEF' }, { id: '16', role: 'MIKE', x: 50, y: 46, team: 'DEF' },
      { id: '17', role: 'WILL', x: 40, y: 46, team: 'DEF' }, { id: '18', role: 'DE1',  x: 30, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 68, y: 55, team: 'DEF' },
    ]
  },

  // ---------------------------------------------------------------------------
  // DEFENSIVE READS (ALL FRONTS & COVERAGES)
  // ---------------------------------------------------------------------------
  {
    id: 'def_c0_action',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL DECISION: Defense is showing Cover 0 (All-out Blitz). What is the QB pre-snap check?',
    correctAnswer: 'Throw Hot / Quick Slant',
    choices: ['Throw Hot / Quick Slant', 'Check to Deep Post', 'Run Outside Zone', 'Max Protect 7-Step Drop'],
    keyRead: 'Tactical Read: Against Cover 0 blitz, there is no deep safety. Get the ball out instantly to your hot receiver.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 42, y: 46, team: 'DEF', isKeyRead: true }, { id: '12', role: 'SS',   x: 58, y: 46, team: 'DEF', isKeyRead: true },
      { id: '13', role: 'CB1',  x: 10, y: 52, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 52, team: 'DEF' },
      { id: '15', role: 'MIKE', x: 50, y: 50, team: 'DEF' }, { id: '16', role: 'WILL', x: 36, y: 50, team: 'DEF' },
      { id: '17', role: 'SAM',  x: 64, y: 50, team: 'DEF' }, { id: '18', role: 'DE1',  x: 32, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 68, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def_c2_action',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL DECISION: Defense is in Cover 2 Zone. Where is the primary vulnerability?',
    correctAnswer: 'Deep Middle Hole (Tampa Gap)',
    choices: ['Deep Middle Hole (Tampa Gap)', 'Underneath Flat', 'Off-Coverage Sideline', 'A-Gap Line Scrimmage'],
    keyRead: 'Tactical Read: Cover 2 leaves a soft void deep down the middle seam between the two splitting safeties.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 30, y: 15, team: 'DEF', isKeyRead: true }, { id: '12', role: 'SS',   x: 70, y: 15, team: 'DEF', isKeyRead: true },
      { id: '13', role: 'CB1',  x: 10, y: 48, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 48, team: 'DEF' },
      { id: '15', role: 'MIKE', x: 50, y: 42, team: 'DEF' }, { id: '16', role: 'WILL', x: 40, y: 42, team: 'DEF' },
      { id: '17', role: 'SAM',  x: 60, y: 42, team: 'DEF' }, { id: '18', role: 'DE1',  x: 36, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 64, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def_43',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: Identify this front (4 Linemen, 3 Linebackers, 4 DBs).',
    correctAnswer: '4-3 Base Front',
    choices: ['4-3 Base Front', '3-4 Base Front', '4-4 Heavy Front', '5-2 Eagle Front'],
    keyRead: '4-3 Front: Balanced base defense featuring 2 DEs, 2 DTs, and 3 Linebackers.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 35, y: 18, team: 'DEF' }, { id: '12', role: 'SS',   x: 65, y: 18, team: 'DEF' },
      { id: '13', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 35, team: 'DEF' },
      { id: '15', role: 'WILL', x: 38, y: 46, team: 'DEF', isKeyRead: true }, { id: '16', role: 'MIKE', x: 50, y: 46, team: 'DEF', isKeyRead: true },
      { id: '17', role: 'SAM',  x: 62, y: 46, team: 'DEF', isKeyRead: true }, { id: '18', role: 'DE1',  x: 34, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 44, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 56, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 66, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def_44',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: Identify this front (4 Linemen, 4 Linebackers, 3 DBs).',
    correctAnswer: '4-4 Heavy Front',
    choices: ['4-4 Heavy Front', '4-3 Base Front', '5-2 Eagle Front', '46 Bear Front'],
    keyRead: '4-4 Front: Places 8 defenders in the box with 4 LBs for aggressive heavy run gap control.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'FB', x: 50, y: 78, team: 'OFF' },
      { id: '3', role: 'RB', x: 50, y: 84, team: 'OFF' }, { id: '4', role: 'LT', x: 38, y: 60, team: 'OFF' },
      { id: '5', role: 'LG', x: 44, y: 60, team: 'OFF' }, { id: '6', role: 'C',  x: 50, y: 60, team: 'OFF' },
      { id: '7', role: 'RG', x: 56, y: 60, team: 'OFF' }, { id: '8', role: 'RT', x: 62, y: 60, team: 'OFF' },
      { id: '9', role: 'TE', x: 68, y: 60, team: 'OFF' }, { id: '10', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 50, y: 18, team: 'DEF' }, { id: '12', role: 'CB1',  x: 10, y: 35, team: 'DEF' },
      { id: '13', role: 'CB2',  x: 90, y: 35, team: 'DEF' }, { id: '14', role: 'OLB1', x: 30, y: 48, team: 'DEF', isKeyRead: true },
      { id: '15', role: 'ILB1', x: 44, y: 48, team: 'DEF', isKeyRead: true }, { id: '16', role: 'ILB2', x: 56, y: 48, team: 'DEF', isKeyRead: true },
      { id: '17', role: 'OLB2', x: 70, y: 48, team: 'DEF', isKeyRead: true }, { id: '18', role: 'DE1',  x: 34, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 44, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 56, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 66, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def_52',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: Identify this front (5 Linemen, 2 Linebackers).',
    correctAnswer: '5-2 Eagle Front',
    choices: ['5-2 Eagle Front', '46 Bear Front', '3-4 Base Front', '4-3 Base Front'],
    keyRead: '5-2 Eagle: Features 5 DLs covering interior and edge gaps directly to smother run plays.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 35, y: 18, team: 'DEF' }, { id: '12', role: 'SS',   x: 65, y: 18, team: 'DEF' },
      { id: '13', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 35, team: 'DEF' },
      { id: '15', role: 'MLB1', x: 44, y: 46, team: 'DEF' }, { id: '16', role: 'MLB2', x: 56, y: 46, team: 'DEF' },
      { id: '17', role: 'E1',   x: 30, y: 55, team: 'DEF', isKeyRead: true }, { id: '18', role: 'T1',   x: 40, y: 55, team: 'DEF', isKeyRead: true },
      { id: '19', role: 'N',    x: 50, y: 55, team: 'DEF', isKeyRead: true }, { id: '20', role: 'T2',   x: 60, y: 55, team: 'DEF', isKeyRead: true },
      { id: '21', role: 'E2',   x: 70, y: 55, team: 'DEF', isKeyRead: true },
    ]
  },
  {
    id: 'def_46bear',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: Identify this heavy interior pressure front.',
    correctAnswer: '46 Bear Front',
    choices: ['46 Bear Front', '5-2 Eagle Front', 'Cover 0 (Zero Pressure)', '4-4 Heavy Front'],
    keyRead: '46 Bear: Packs 5 linemen over interior offensive line with SS down for max interior pressure.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 50, y: 15, team: 'DEF' }, { id: '12', role: 'SS',   x: 66, y: 46, team: 'DEF', isKeyRead: true },
      { id: '13', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 35, team: 'DEF' },
      { id: '15', role: 'MIKE', x: 44, y: 46, team: 'DEF' }, { id: '16', role: 'WILL', x: 56, y: 46, team: 'DEF' },
      { id: '17', role: 'DE1',  x: 32, y: 55, team: 'DEF', isKeyRead: true }, { id: '18', role: 'DT1',  x: 44, y: 55, team: 'DEF', isKeyRead: true },
      { id: '19', role: 'NT',   x: 50, y: 55, team: 'DEF', isKeyRead: true }, { id: '20', role: 'DT2',  x: 56, y: 55, team: 'DEF', isKeyRead: true },
      { id: '21', role: 'DE2',  x: 68, y: 55, team: 'DEF', isKeyRead: true },
    ]
  },
  {
    id: 'def_cover6',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: Identify this split-field coverage shell.',
    correctAnswer: 'Cover 6 Hybrid',
    choices: ['Cover 6 Hybrid', 'Cover 4 Quarters', 'Cover 2 Zone', 'Cover 3 Sky'],
    keyRead: 'Cover 6: Split-field hybrid scheme (Quarter-Quarter-Half) combining Cover 4 and Cover 2.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 74, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 35, y: 18, team: 'DEF', isKeyRead: true }, { id: '12', role: 'SS',   x: 75, y: 18, team: 'DEF', isKeyRead: true },
      { id: '13', role: 'CB1',  x: 10, y: 18, team: 'DEF', isKeyRead: true }, { id: '14', role: 'CB2',  x: 90, y: 48, team: 'DEF', isKeyRead: true },
      { id: '15', role: 'MIKE', x: 50, y: 44, team: 'DEF' }, { id: '16', role: 'WILL', x: 40, y: 44, team: 'DEF' },
      { id: '17', role: 'SAM',  x: 62, y: 44, team: 'DEF' }, { id: '18', role: 'DE1',  x: 34, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 66, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def1',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: Single-high FS in center, corners locked tight in press man.',
    correctAnswer: 'Cover 1 Man',
    choices: ['Cover 1 Man', 'Cover 2 Zone', 'Cover 3 Sky', 'Corner Blitz'],
    keyRead: 'Cover 1: Single high Free Safety (FS) taking deep middle; 5 DBs locked in man-to-man technique.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 50, y: 15, team: 'DEF', isKeyRead: true }, { id: '12', role: 'SS',   x: 68, y: 38, team: 'DEF' },
      { id: '13', role: 'CB1',  x: 10, y: 30, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 30, team: 'DEF' },
      { id: '15', role: 'MIKE', x: 50, y: 46, team: 'DEF' }, { id: '16', role: 'WILL', x: 40, y: 46, team: 'DEF' },
      { id: '17', role: 'SAM',  x: 60, y: 46, team: 'DEF' }, { id: '18', role: 'DE1',  x: 36, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 64, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def2',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: Two high safeties split wide; corners squatting at 5 yards.',
    correctAnswer: 'Cover 2 Zone',
    choices: ['Cover 1 Man', 'Cover 2 Zone', 'Cover 3 Sky', 'Double A-Gap Blitz'],
    keyRead: 'Cover 2: Safeties divide deep field into halves; corners protect flat zones.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 30, y: 15, team: 'DEF', isKeyRead: true }, { id: '12', role: 'SS',   x: 70, y: 15, team: 'DEF', isKeyRead: true },
      { id: '13', role: 'CB1',  x: 10, y: 48, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 48, team: 'DEF' },
      { id: '15', role: 'MIKE', x: 50, y: 42, team: 'DEF' }, { id: '16', role: 'WILL', x: 40, y: 42, team: 'DEF' },
      { id: '17', role: 'SAM',  x: 60, y: 42, team: 'DEF' }, { id: '18', role: 'DE1',  x: 36, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 64, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def3',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: Single-high safety, CBs off at 7 yards, Strong Safety walked down.',
    correctAnswer: 'Cover 3 Sky',
    choices: ['Cover 2 Zone', 'Cover 3 Sky', 'Cover 4 Quarters', 'Corner Blitz'],
    keyRead: 'Cover 3 Sky: 3 deep defenders (FS + 2 CBs). Strong Safety rotates into the box pre-snap.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 50, y: 15, team: 'DEF', isKeyRead: true }, { id: '12', role: 'SS',   x: 72, y: 44, team: 'DEF', isKeyRead: true },
      { id: '13', role: 'CB1',  x: 10, y: 25, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 25, team: 'DEF' },
      { id: '15', role: 'MIKE', x: 50, y: 46, team: 'DEF' }, { id: '16', role: 'WILL', x: 40, y: 46, team: 'DEF' },
      { id: '17', role: 'SAM',  x: 60, y: 46, team: 'DEF' }, { id: '18', role: 'DE1',  x: 36, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 64, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def4',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: 4 deep defensive backs aligned evenly at 8-10 yards depth.',
    correctAnswer: 'Cover 4 Quarters',
    choices: ['Cover 2 Zone', 'Cover 3 Sky', 'Cover 4 Quarters', 'Cover 0 (Zero Pressure)'],
    keyRead: 'Cover 4 (Quarters): Safeties and corners each guard deep 4ths to eliminate vertical routes.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 35, y: 18, team: 'DEF', isKeyRead: true }, { id: '12', role: 'SS',   x: 65, y: 18, team: 'DEF', isKeyRead: true },
      { id: '13', role: 'CB1',  x: 12, y: 18, team: 'DEF' }, { id: '14', role: 'CB2',  x: 88, y: 18, team: 'DEF' },
      { id: '15', role: 'MIKE', x: 50, y: 44, team: 'DEF' }, { id: '16', role: 'WILL', x: 40, y: 44, team: 'DEF' },
      { id: '17', role: 'SAM',  x: 60, y: 44, team: 'DEF' }, { id: '18', role: 'DE1',  x: 36, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 64, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def5',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: No safety deep over top. All 11 defenders stacked within 5 yards.',
    correctAnswer: 'Cover 0 (Zero Pressure)',
    choices: ['Cover 0 (Zero Pressure)', 'Cover 2 Zone', 'Cover 3 Sky', 'Cover 4 Quarters'],
    keyRead: 'Cover 0: All-out pressure without deep safety protection. Throw to the "Hot" route instantly.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 42, y: 46, team: 'DEF', isKeyRead: true }, { id: '12', role: 'SS',   x: 58, y: 46, team: 'DEF', isKeyRead: true },
      { id: '13', role: 'CB1',  x: 10, y: 52, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 52, team: 'DEF' },
      { id: '15', role: 'MIKE', x: 50, y: 50, team: 'DEF' }, { id: '16', role: 'WILL', x: 36, y: 50, team: 'DEF' },
      { id: '17', role: 'SAM',  x: 64, y: 50, team: 'DEF' }, { id: '18', role: 'DE1',  x: 32, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 68, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def6',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: Both Inside Linebackers (MIKE & WILL) stacked right in A-Gaps.',
    correctAnswer: 'Double A-Gap Blitz',
    choices: ['Double A-Gap Blitz', 'Cover 2 Zone', 'Nickel Corner Blitz', '3-4 Base Front'],
    keyRead: 'Double A-Gap: Threatens interior blitz directly up center. Requires protection slide.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 50, y: 20, team: 'DEF' }, { id: '12', role: 'SS',   x: 70, y: 35, team: 'DEF' },
      { id: '13', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 35, team: 'DEF' },
      { id: '15', role: 'MIKE', x: 47, y: 52, team: 'DEF', isKeyRead: true }, { id: '16', role: 'WILL', x: 53, y: 52, team: 'DEF', isKeyRead: true },
      { id: '17', role: 'SAM',  x: 65, y: 46, team: 'DEF' }, { id: '18', role: 'DE1',  x: 36, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 42, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 58, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 64, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def7',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: Slot Nickelback creeping up to scrimmage line on edge.',
    correctAnswer: 'Nickel Corner Blitz',
    choices: ['Nickel Corner Blitz', 'Cover 2 Zone', 'Cover 4 Quarters', '3-4 Base Front'],
    keyRead: 'Nickel Blitz: Slot corner rushes off edge. Safety rotates over to cover slot receiver.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 74, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 40, y: 18, team: 'DEF' }, { id: '12', role: 'SS',   x: 74, y: 25, team: 'DEF' },
      { id: '13', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 35, team: 'DEF' },
      { id: '15', role: 'NC',   x: 68, y: 56, team: 'DEF', isKeyRead: true }, { id: '16', role: 'MIKE', x: 50, y: 46, team: 'DEF' },
      { id: '17', role: 'WILL', x: 42, y: 46, team: 'DEF' }, { id: '18', role: 'DE1',  x: 34, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 63, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def8',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: 3 Defensive Linemen on line with 4 Linebackers stacked behind.',
    correctAnswer: '3-4 Base Front',
    choices: ['3-4 Base Front', '4-3 Base Front', 'Nickel 4-2-5 Defense', 'Dime 4-1-6 Defense'],
    keyRead: '3-4 Front: 3 DLs take interior gaps while 2 Outside LBs control edge rush and drop.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 35, y: 18, team: 'DEF' }, { id: '12', role: 'SS',   x: 65, y: 18, team: 'DEF' },
      { id: '13', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 35, team: 'DEF' },
      { id: '15', role: 'OLB1', x: 32, y: 50, team: 'DEF', isKeyRead: true }, { id: '16', role: 'ILB1', x: 44, y: 46, team: 'DEF' },
      { id: '17', role: 'ILB2', x: 56, y: 46, team: 'DEF' }, { id: '18', role: 'OLB2', x: 68, y: 50, team: 'DEF', isKeyRead: true },
      { id: '19', role: 'DE1',  x: 38, y: 55, team: 'DEF' }, { id: '20', role: 'NT',   x: 50, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 62, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def9',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: 4 Linemen and 2 Linebackers with 5 Defensive Backs (Nickel).',
    correctAnswer: 'Nickel 4-2-5 Defense',
    choices: ['Nickel 4-2-5 Defense', '3-4 Base Front', '4-3 Base Front', 'Dime 4-1-6 Defense'],
    keyRead: 'Nickel 4-2-5: Sub-package replacing a Linebacker with a Nickelback to counter 3-WR sets.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 74, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 35, y: 18, team: 'DEF' }, { id: '12', role: 'SS',   x: 65, y: 18, team: 'DEF' },
      { id: '13', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 35, team: 'DEF' },
      { id: '15', role: 'NC',   x: 74, y: 42, team: 'DEF', isKeyRead: true }, { id: '16', role: 'MIKE', x: 46, y: 46, team: 'DEF' },
      { id: '17', role: 'WILL', x: 54, y: 46, team: 'DEF' }, { id: '18', role: 'DE1',  x: 34, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 44, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 56, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 66, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def10',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: 6 Defensive Backs on field (Dime alignment for obvious pass downs).',
    correctAnswer: 'Dime 4-1-6 Defense',
    choices: ['Dime 4-1-6 Defense', 'Nickel 4-2-5 Defense', '3-4 Base Front', 'Cover 0 (Zero Pressure)'],
    keyRead: 'Dime Package: 6 DBs deployed to eliminate passing lanes on 3rd & long scenarios.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'LT', x: 38, y: 60, team: 'OFF' },
      { id: '3', role: 'LG', x: 44, y: 60, team: 'OFF' }, { id: '4', role: 'C',  x: 50, y: 60, team: 'OFF' },
      { id: '5', role: 'RG', x: 56, y: 60, team: 'OFF' }, { id: '6', role: 'RT', x: 62, y: 60, team: 'OFF' },
      { id: '7', role: 'W1', x: 8,  y: 60, team: 'OFF' }, { id: '8', role: 'W2', x: 22, y: 60, team: 'OFF' },
      { id: '9', role: 'W3', x: 78, y: 60, team: 'OFF' }, { id: '10', role: 'W4', x: 92, y: 60, team: 'OFF' },
      { id: '11', role: 'RB', x: 50, y: 80, team: 'OFF' },
      { id: '12', role: 'FS',   x: 35, y: 15, team: 'DEF' }, { id: '13', role: 'SS',   x: 65, y: 15, team: 'DEF' },
      { id: '14', role: 'CB1',  x: 8,  y: 30, team: 'DEF' }, { id: '15', role: 'CB2',  x: 92, y: 30, team: 'DEF' },
      { id: '16', role: 'D1',   x: 22, y: 40, team: 'DEF', isKeyRead: true }, { id: '17', role: 'D2',   x: 78, y: 40, team: 'DEF', isKeyRead: true },
      { id: '18', role: 'MIKE', x: 50, y: 44, team: 'DEF' }, { id: '19', role: 'DE1',  x: 36, y: 55, team: 'DEF' },
      { id: '20', role: 'DT1',  x: 48, y: 55, team: 'DEF' }, { id: '21', role: 'DE2',  x: 64, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'def11',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: Defensive End dropping to coverage while Linebacker rushes edge.',
    correctAnswer: 'Zone Blitz / Fire Zone',
    choices: ['Zone Blitz / Fire Zone', 'Cover 0 (Zero Pressure)', 'Double A-Gap Blitz', 'Cover 2 Zone'],
    keyRead: 'Fire Zone Blitz: 5-man rush with 3-deep, 3-underneath zone coverage behind it.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 50, y: 18, team: 'DEF' }, { id: '12', role: 'SS',   x: 68, y: 35, team: 'DEF' },
      { id: '13', role: 'CB1',  x: 10, y: 25, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 25, team: 'DEF' },
      { id: '15', role: 'MIKE', x: 42, y: 52, team: 'DEF', isKeyRead: true }, { id: '16', role: 'WILL', x: 50, y: 46, team: 'DEF' },
      { id: '17', role: 'DE1',  x: 36, y: 48, team: 'DEF', isKeyRead: true }, { id: '18', role: 'DT1',  x: 45, y: 55, team: 'DEF' },
      { id: '19', role: 'DT2',  x: 55, y: 55, team: 'DEF' }, { id: '20', role: 'DE2',  x: 64, y: 55, team: 'DEF' },
      { id: '21', role: 'SAM',  x: 60, y: 46, team: 'DEF' },
    ]
  },
  {
    id: 'def12',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'DEFENSIVE READ: Defensive Linemen slanting across gaps pre-snap (Stunt / Twist).',
    correctAnswer: 'DL Stunt / Twist Package',
    choices: ['DL Stunt / Twist Package', 'Cover 3 Sky', 'Cover 4 Quarters', 'Double A-Gap Blitz'],
    keyRead: 'Stunt/Twist: DL crosses paths to create pressure against offensive line pass protection.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'FS',   x: 50, y: 20, team: 'DEF' }, { id: '12', role: 'SS',   x: 68, y: 38, team: 'DEF' },
      { id: '13', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '14', role: 'CB2',  x: 90, y: 35, team: 'DEF' },
      { id: '15', role: 'MIKE', x: 50, y: 46, team: 'DEF' }, { id: '16', role: 'WILL', x: 40, y: 46, team: 'DEF' },
      { id: '17', role: 'DT1',  x: 48, y: 55, team: 'DEF', isKeyRead: true }, { id: '18', role: 'DE1',  x: 42, y: 56, team: 'DEF', isKeyRead: true },
      { id: '19', role: 'DT2',  x: 56, y: 55, team: 'DEF' }, { id: '20', role: 'DE2',  x: 64, y: 55, team: 'DEF' },
      { id: '21', role: 'SAM',  x: 60, y: 46, team: 'DEF' },
    ]
  },

  // ---------------------------------------------------------------------------
  // OFFENSIVE FORMATION READS (ALL LOOKS)
  // ---------------------------------------------------------------------------
  {
    id: 'off1',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 1 RB, 1 TE inline left, 3 WRs aligned right.',
    correctAnswer: '11 Personnel / Trips Right',
    choices: ['11 Personnel / Trips Right', '22 Personnel / Heavy I-Form', '10 Personnel / Empty Backfield', 'Pistol Alignment'],
    keyRead: '11 Personnel Trips: 1 RB + 1 TE + 3 WRs. Overloads right side passing zones.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'TE', x: 32, y: 60, team: 'OFF' },
      { id: '9', role: 'W1', x: 74, y: 60, team: 'OFF', isKeyRead: true },
      { id: '10', role: 'W2', x: 82, y: 60, team: 'OFF', isKeyRead: true },
      { id: '11', role: 'W3', x: 90, y: 60, team: 'OFF', isKeyRead: true },
      { id: '12', role: 'FS',   x: 50, y: 20, team: 'DEF' }, { id: '13', role: 'SS',   x: 75, y: 35, team: 'DEF' },
      { id: '14', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '15', role: 'CB2',  x: 90, y: 35, team: 'DEF' },
      { id: '16', role: 'MIKE', x: 50, y: 46, team: 'DEF' }, { id: '17', role: 'WILL', x: 40, y: 46, team: 'DEF' },
      { id: '18', role: 'DE1',  x: 30, y: 55, team: 'DEF' }, { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' },
      { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' }, { id: '21', role: 'DE2',  x: 68, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'off2',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 2 Running Backs stacked under center with 2 Tight Ends.',
    correctAnswer: '22 Personnel / Heavy I-Form',
    choices: ['11 Personnel / Trips Right', '22 Personnel / Heavy I-Form', '10 Personnel / Empty Backfield', 'Unbalanced Line / Tackle Over'],
    keyRead: '22 Personnel: Heavy run alignment requiring an 8-man box.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 68, team: 'OFF' }, { id: '2', role: 'FB', x: 50, y: 76, team: 'OFF', isKeyRead: true },
      { id: '3', role: 'RB', x: 50, y: 84, team: 'OFF', isKeyRead: true }, { id: '4', role: 'T1', x: 32, y: 60, team: 'OFF' },
      { id: '5', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '6', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '7', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '8', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '9', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '10', role: 'T2', x: 68, y: 60, team: 'OFF' },
      { id: '11', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '12', role: 'FS',   x: 50, y: 20, team: 'DEF' }, { id: '13', role: 'SS',   x: 65, y: 44, team: 'DEF' },
      { id: '14', role: 'CB1',  x: 10, y: 40, team: 'DEF' }, { id: '15', role: 'CB2',  x: 90, y: 40, team: 'DEF' },
      { id: '16', role: 'MIKE', x: 50, y: 48, team: 'DEF' }, { id: '17', role: 'WILL', x: 42, y: 48, team: 'DEF' },
      { id: '18', role: 'SAM',  x: 58, y: 48, team: 'DEF' }, { id: '19', role: 'DE1',  x: 30, y: 55, team: 'DEF' },
      { id: '20', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '21', role: 'DE2',  x: 70, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'off3',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 3 WRs tightly bunched together outside.',
    correctAnswer: '11 Personnel / Bunch Concept',
    choices: ['11 Personnel / Bunch Concept', '22 Personnel / Heavy I-Form', '13 Personnel / Jumbo Package', 'Wildcat Package'],
    keyRead: 'Bunch Formation: WRs stack close together to create pick/rub routes.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'TE', x: 32, y: 60, team: 'OFF' },
      { id: '9', role: 'W1', x: 80, y: 60, team: 'OFF', isKeyRead: true },
      { id: '10', role: 'W2', x: 84, y: 62, team: 'OFF', isKeyRead: true },
      { id: '11', role: 'W3', x: 88, y: 60, team: 'OFF', isKeyRead: true },
      { id: '12', role: 'FS',   x: 50, y: 20, team: 'DEF' }, { id: '13', role: 'SS',   x: 75, y: 35, team: 'DEF' },
      { id: '14', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '15', role: 'CB2',  x: 82, y: 35, team: 'DEF' },
      { id: '16', role: 'MIKE', x: 50, y: 46, team: 'DEF' }, { id: '17', role: 'WILL', x: 40, y: 46, team: 'DEF' },
      { id: '18', role: 'DE1',  x: 30, y: 55, team: 'DEF' }, { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' },
      { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' }, { id: '21', role: 'DE2',  x: 68, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'off4',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 1 RB directly behind QB in shotgun with H-Back offset.',
    correctAnswer: 'Pistol Alignment',
    choices: ['11 Personnel / Trips Right', 'Pistol Alignment', '10 Personnel / Empty Backfield', '22 Personnel / Heavy I-Form'],
    keyRead: 'Pistol: RB aligns directly behind QB for downhill run flow.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 68, team: 'OFF', isKeyRead: true },
      { id: '2', role: 'RB', x: 50, y: 76, team: 'OFF', isKeyRead: true },
      { id: '3', role: 'HB', x: 58, y: 64, team: 'OFF', isKeyRead: true },
      { id: '4', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '5', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '6', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '7', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '8', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '9', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '10', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '11', role: 'Y', x: 30, y: 60, team: 'OFF' },
      { id: '12', role: 'FS',   x: 50, y: 20, team: 'DEF' }, { id: '13', role: 'SS',   x: 68, y: 38, team: 'DEF' },
      { id: '14', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '15', role: 'CB2',  x: 90, y: 35, team: 'DEF' },
      { id: '16', role: 'MIKE', x: 50, y: 46, team: 'DEF' }, { id: '17', role: 'WILL', x: 40, y: 46, team: 'DEF' },
      { id: '18', role: 'DE1',  x: 34, y: 55, team: 'DEF' }, { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' },
      { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' }, { id: '21', role: 'DE2',  x: 66, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'off5',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: No running back in backfield. 5 wide receivers spread across line.',
    correctAnswer: '10 Personnel / Empty Backfield',
    choices: ['11 Personnel / Trips Right', '22 Personnel / Heavy I-Form', '10 Personnel / Empty Backfield', 'Wildcat Package'],
    keyRead: 'Empty Backfield: 100% pass threat or QB draw. Defense must check to nickel/dime coverage.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF', isKeyRead: true },
      { id: '2', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '3', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '4', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '5', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '6', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '7', role: 'W1', x: 8,  y: 60, team: 'OFF' },
      { id: '8', role: 'W2', x: 22, y: 60, team: 'OFF' }, { id: '9', role: 'W3', x: 74, y: 60, team: 'OFF' },
      { id: '10', role: 'W4', x: 84, y: 60, team: 'OFF' }, { id: '11', role: 'W5', x: 94, y: 60, team: 'OFF' },
      { id: '12', role: 'FS',   x: 35, y: 20, team: 'DEF' }, { id: '13', role: 'SS',   x: 65, y: 20, team: 'DEF' },
      { id: '14', role: 'CB1',  x: 8,  y: 35, team: 'DEF' }, { id: '15', role: 'CB2',  x: 94, y: 35, team: 'DEF' },
      { id: '16', role: 'NC1',  x: 22, y: 35, team: 'DEF' }, { id: '17', role: 'NC2',  x: 84, y: 35, team: 'DEF' },
      { id: '18', role: 'MIKE', x: 50, y: 46, team: 'DEF' }, { id: '19', role: 'DE1',  x: 36, y: 55, team: 'DEF' },
      { id: '20', role: 'DT1',  x: 48, y: 55, team: 'DEF' }, { id: '21', role: 'DE2',  x: 64, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'off6',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: Left Tackle flipped to the right side next to Right Tackle (6 linemen right).',
    correctAnswer: 'Unbalanced Line / Tackle Over',
    choices: ['11 Personnel / Trips Right', 'Unbalanced Line / Tackle Over', '22 Personnel / Heavy I-Form', 'Pistol Alignment'],
    keyRead: 'Unbalanced Line: Offense creates an extra gap on the right side. Defense must shift box alignment.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'TE', x: 30, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 38, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 44, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 50, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 56, y: 60, team: 'OFF' }, { id: '8', role: 'LT', x: 62, y: 60, team: 'OFF', isKeyRead: true },
      { id: '9', role: 'TE2', x: 68, y: 60, team: 'OFF' }, { id: '10', role: 'X', x: 10, y: 60, team: 'OFF' },
      { id: '11', role: 'Z',  x: 90, y: 60, team: 'OFF' },
      { id: '12', role: 'FS',   x: 50, y: 20, team: 'DEF' }, { id: '13', role: 'SS',   x: 68, y: 40, team: 'DEF' },
      { id: '14', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '15', role: 'CB2',  x: 90, y: 35, team: 'DEF' },
      { id: '16', role: 'MIKE', x: 50, y: 46, team: 'DEF' }, { id: '17', role: 'WILL', x: 40, y: 46, team: 'DEF' },
      { id: '18', role: 'SAM',  x: 62, y: 46, team: 'DEF' }, { id: '19', role: 'DE1',  x: 28, y: 55, team: 'DEF' },
      { id: '20', role: 'DT1',  x: 44, y: 55, team: 'DEF' }, { id: '21', role: 'DE2',  x: 70, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'off7',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 2 Tight Ends inline on opposite sides of line.',
    correctAnswer: '12 Personnel "ACE"',
    choices: ['12 Personnel "ACE"', '22 Personnel / Heavy I-Form', '10 Personnel / Empty Backfield', '11 Personnel / Trips Right'],
    keyRead: '12 Personnel: Balanced double TE formation creating dual C-Gaps.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 80, team: 'OFF' },
      { id: '3', role: 'T1', x: 32, y: 60, team: 'OFF', isKeyRead: true }, { id: '4', role: 'LT', x: 38, y: 60, team: 'OFF' },
      { id: '5', role: 'LG', x: 44, y: 60, team: 'OFF' }, { id: '6', role: 'C',  x: 50, y: 60, team: 'OFF' },
      { id: '7', role: 'RG', x: 56, y: 60, team: 'OFF' }, { id: '8', role: 'RT', x: 62, y: 60, team: 'OFF' },
      { id: '9', role: 'T2', x: 68, y: 60, team: 'OFF', isKeyRead: true }, { id: '10', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '11', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '12', role: 'FS',   x: 50, y: 20, team: 'DEF' },
      { id: '13', role: 'SS',   x: 68, y: 38, team: 'DEF' }, { id: '14', role: 'CB1',  x: 10, y: 35, team: 'DEF' },
      { id: '15', role: 'CB2',  x: 90, y: 35, team: 'DEF' }, { id: '16', role: 'MIKE', x: 50, y: 46, team: 'DEF' },
      { id: '17', role: 'WILL', x: 40, y: 46, team: 'DEF' }, { id: '18', role: 'DE1',  x: 30, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 70, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'off8',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 3 Tight Ends packed on line (Goal Line / Short Yardage).',
    correctAnswer: '13 Personnel / Jumbo Package',
    choices: ['13 Personnel / Jumbo Package', '11 Personnel / Trips Right', '10 Personnel / Empty Backfield', 'Pistol Alignment'],
    keyRead: '13 Personnel: Heavy power gap setup for goal-line or 3rd & 1.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 68, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 78, team: 'OFF' },
      { id: '3', role: 'T1', x: 26, y: 60, team: 'OFF', isKeyRead: true }, { id: '4', role: 'T2', x: 32, y: 60, team: 'OFF', isKeyRead: true },
      { id: '5', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '6', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '7', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '8', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '9', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '10', role: 'T3', x: 68, y: 60, team: 'OFF', isKeyRead: true },
      { id: '11', role: 'X',  x: 90, y: 60, team: 'OFF' }, { id: '12', role: 'FS',   x: 50, y: 25, team: 'DEF' },
      { id: '13', role: 'SS',   x: 60, y: 44, team: 'DEF' }, { id: '14', role: 'CB1',  x: 90, y: 40, team: 'DEF' },
      { id: '15', role: 'MIKE', x: 50, y: 48, team: 'DEF' }, { id: '16', role: 'WILL', x: 40, y: 48, team: 'DEF' },
      { id: '17', role: 'SAM',  x: 32, y: 48, team: 'DEF' }, { id: '18', role: 'DE1',  x: 24, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 42, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 58, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 70, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'off9',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 2 RBs split on either side of QB in shotgun formation.',
    correctAnswer: '20 Personnel / Split Backs',
    choices: ['20 Personnel / Split Backs', '22 Personnel / Heavy I-Form', '11 Personnel / Trips Right', 'Wildcat Package'],
    keyRead: 'Split Backs: Dual RB pass protection and option run threat.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' },
      { id: '2', role: 'R1', x: 42, y: 72, team: 'OFF', isKeyRead: true }, { id: '3', role: 'R2', x: 58, y: 72, team: 'OFF', isKeyRead: true },
      { id: '4', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '5', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '6', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '7', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '8', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '9', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '10', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '11', role: 'Y', x: 26, y: 60, team: 'OFF' },
      { id: '12', role: 'FS',   x: 50, y: 20, team: 'DEF' }, { id: '13', role: 'SS',   x: 68, y: 38, team: 'DEF' },
      { id: '14', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '15', role: 'CB2',  x: 90, y: 35, team: 'DEF' },
      { id: '16', role: 'MIKE', x: 50, y: 46, team: 'DEF' }, { id: '17', role: 'WILL', x: 40, y: 46, team: 'DEF' },
      { id: '18', role: 'DE1',  x: 34, y: 55, team: 'DEF' }, { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' },
      { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' }, { id: '21', role: 'DE2',  x: 66, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'off10',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: RB taking direct snap in shotgun (No traditional QB).',
    correctAnswer: 'Wildcat Package',
    choices: ['Wildcat Package', '11 Personnel / Trips Right', 'Pistol Alignment', '10 Personnel / Empty Backfield'],
    keyRead: 'Wildcat: Direct snap to RB gains an extra power blocker.',
    players: [
      { id: '1', role: 'RB', x: 50, y: 72, team: 'OFF', isKeyRead: true },
      { id: '2', role: 'FB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'TE', x: 68, y: 60, team: 'OFF' },
      { id: '9', role: 'WR', x: 10, y: 60, team: 'OFF' }, { id: '10', role: 'QB', x: 90, y: 60, team: 'OFF' },
      { id: '11', role: 'T2', x: 32, y: 60, team: 'OFF' }, { id: '12', role: 'FS',   x: 50, y: 20, team: 'DEF' },
      { id: '13', role: 'SS',   x: 65, y: 40, team: 'DEF' }, { id: '14', role: 'CB1',  x: 10, y: 35, team: 'DEF' },
      { id: '15', role: 'CB2',  x: 90, y: 35, team: 'DEF' }, { id: '16', role: 'MIKE', x: 50, y: 46, team: 'DEF' },
      { id: '17', role: 'WILL', x: 40, y: 46, team: 'DEF' }, { id: '18', role: 'DE1',  x: 30, y: 55, team: 'DEF' },
      { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' }, { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 70, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'off11',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 2 WRs split left, 2 WRs split right in shotgun (Spread).',
    correctAnswer: '10 Personnel / 2x2 Spread',
    choices: ['10 Personnel / 2x2 Spread', '11 Personnel / Trips Right', '22 Personnel / Heavy I-Form', 'Pistol Alignment'],
    keyRead: '10 Personnel 2x2: Balanced spread formation opening deep passing seams.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 44, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'W1', x: 10, y: 60, team: 'OFF' },
      { id: '9', role: 'W2', x: 24, y: 60, team: 'OFF' }, { id: '10', role: 'W3', x: 76, y: 60, team: 'OFF' },
      { id: '11', role: 'W4', x: 90, y: 60, team: 'OFF' }, { id: '12', role: 'FS',   x: 35, y: 20, team: 'DEF' },
      { id: '13', role: 'SS',   x: 65, y: 20, team: 'DEF' }, { id: '14', role: 'CB1',  x: 10, y: 35, team: 'DEF' },
      { id: '15', role: 'CB2',  x: 90, y: 35, team: 'DEF' }, { id: '16', role: 'NC1',  x: 24, y: 38, team: 'DEF' },
      { id: '17', role: 'NC2',  x: 76, y: 38, team: 'DEF' }, { id: '18', role: 'MIKE', x: 50, y: 46, team: 'DEF' },
      { id: '19', role: 'DE1',  x: 34, y: 55, team: 'DEF' }, { id: '20', role: 'DT1',  x: 48, y: 55, team: 'DEF' },
      { id: '21', role: 'DE2',  x: 64, y: 55, team: 'DEF' },
    ]
  },
  {
    id: 'off12',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: WR running full speed motion across formation before snap.',
    correctAnswer: 'Jet Motion / Fly Sweep',
    choices: ['Jet Motion / Fly Sweep', 'Pistol Alignment', '10 Personnel / Empty Backfield', 'Unbalanced Line / Tackle Over'],
    keyRead: 'Jet Motion: Tests zone leverage and forces linebackers to communicate gap shifts.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'TE', x: 68, y: 60, team: 'OFF' },
      { id: '9', role: 'X',  x: 10, y: 60, team: 'OFF' }, { id: '10', role: 'Z',  x: 90, y: 60, team: 'OFF' },
      { id: '11', role: 'MOT', x: 40, y: 68, team: 'OFF', isKeyRead: true },
      { id: '12', role: 'FS',   x: 50, y: 20, team: 'DEF' }, { id: '13', role: 'SS',   x: 68, y: 38, team: 'DEF' },
      { id: '14', role: 'CB1',  x: 10, y: 35, team: 'DEF' }, { id: '15', role: 'CB2',  x: 90, y: 35, team: 'DEF' },
      { id: '16', role: 'MIKE', x: 50, y: 46, team: 'DEF' }, { id: '17', role: 'WILL', x: 40, y: 46, team: 'DEF' },
      { id: '18', role: 'DE1',  x: 34, y: 55, team: 'DEF' }, { id: '19', role: 'DT1',  x: 45, y: 55, team: 'DEF' },
      { id: '20', role: 'DT2',  x: 55, y: 55, team: 'DEF' }, { id: '21', role: 'DE2',  x: 66, y: 55, team: 'DEF' },
    ]
  }
];

// Helper: Fisher-Yates Shuffle
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// =============================================================================
// MAIN DEFAULT APP COMPONENT
// =============================================================================
export default function App() {
  const [allScenarios, setAllScenarios] = useState(initialScenarios);
  const [useTeamPlaybook, setUseTeamPlaybook] = useState(true); // Defaults to UK Team Playbook
  const [mode, setMode] = useState('DEFENSE');
  const [activeQueue, setActiveQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  
  // Option button shuffling state
  const [shuffledChoices, setShuffledChoices] = useState([]);

  // Admin & Score States
  const [showAdmin, setShowAdmin] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastEarnedPoints, setLastEarnedPoints] = useState(0);

  // Re-filter and Shuffle Scenario Queue when mode or source changes
  useEffect(() => {
    const filtered = allScenarios.filter(
      (s) => s.isTeamPlaybook === useTeamPlaybook && (useTeamPlaybook || s.mode === mode)
    );
    setActiveQueue(shuffleArray(filtered.length ? filtered : initialScenarios));
    setIndex(0);
    setSelected(null);
    setTimeLeft(15);
  }, [mode, useTeamPlaybook, allScenarios]);

  const currentScenario = activeQueue[index] || initialScenarios[0];
  const currentPotentialPoints = Math.round((timeLeft / 15) * 100);

  // Shuffle Choice Button Positions whenever currentScenario changes
  useEffect(() => {
    if (currentScenario && currentScenario.choices) {
      setShuffledChoices(shuffleArray(currentScenario.choices));
    }
  }, [currentScenario, index]);

  // 15-Second Timer Tick
  useEffect(() => {
    let interval;
    if (timeLeft > 0 && !selected && !showAdmin) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && !selected && !showAdmin) {
      setSelected('EXPIRED');
      setStreak(0);
      setLastEarnedPoints(0);
    }
    return () => clearInterval(interval);
  }, [timeLeft, selected, showAdmin]);

  const handleChoice = (choice) => {
    if (selected) return;
    setSelected(choice);

    if (choice === currentScenario.correctAnswer) {
      const earned = currentPotentialPoints;
      setLastEarnedPoints(earned);
      setTotalScore((prev) => prev + earned);
      setStreak((prev) => prev + 1);
    } else {
      setLastEarnedPoints(0);
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setTimeLeft(15);
    if (index + 1 >= activeQueue.length) {
      setActiveQueue(shuffleArray(activeQueue));
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const handleAddCustomPlay = (newPlay) => {
    setAllScenarios((prev) => [newPlay, ...prev]);
    setUseTeamPlaybook(true);
    setShowAdmin(false);
  };

  if (showAdmin) {
    return <CoachAdminScreen onSave={handleAddCustomPlay} onCancel={() => setShowAdmin(false)} />;
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        {/* Main Title & Coach Admin Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Pre-Snap Football IQ</Text>
          <TouchableOpacity style={styles.adminBtn} onPress={() => setShowAdmin(true)}>
            <Text style={styles.adminBtnText}>⚙️ COACH ADMIN</Text>
          </TouchableOpacity>
        </View>

        {/* Scoreboard Header */}
        <View style={styles.scoreBoard}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>SCORE</Text>
            <Text style={styles.scoreValue}>{totalScore}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>STREAK</Text>
            <Text style={styles.streakValue}>🔥 {streak}</Text>
          </View>
        </View>

        {/* Playbook Source Toggle */}
        <View style={styles.sourceToggleRow}>
          <TouchableOpacity
            style={[styles.sourceBtn, !useTeamPlaybook && styles.activeSourceBtn]}
            onPress={() => setUseTeamPlaybook(false)}
          >
            <Text style={styles.sourceText}>FORMATION READS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sourceBtn, useTeamPlaybook && styles.activeTeamBtn]}
            onPress={() => setUseTeamPlaybook(true)}
          >
            <Text style={styles.sourceText}>🇬🇧 MY TEAM PLAYMAKER</Text>
          </TouchableOpacity>
        </View>

        {/* Mode Switcher (Visible on General Mode) */}
        {!useTeamPlaybook && (
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'DEFENSE' && styles.activeToggle]}
              onPress={() => setMode('DEFENSE')}
            >
              <Text style={styles.toggleText}>READ DEFENSE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'OFFENSE' && styles.activeToggle]}
              onPress={() => setMode('OFFENSE')}
            >
              <Text style={styles.toggleText}>READ OFFENSE</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Countdown Clock */}
        <View style={styles.clockContainer}>
          <Text style={[styles.clockText, timeLeft <= 3 && styles.clockWarning]}>
            ⏱️ 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </Text>
          <Text style={styles.valueText}>
            Potential: <Text style={styles.valueHighlight}>+{currentPotentialPoints} pts</Text>
          </Text>
        </View>

        <Text style={styles.prompt}>{currentScenario.prompt}</Text>

        {/* Centered Tactical Chalkboard Canvas */}
        <View style={styles.fieldBoardWrapper}>
          <View style={styles.fieldBoard}>
            <View style={[styles.yardLine, { top: '20%' }]} />
            <View style={[styles.yardLine, { top: '40%' }]} />
            <View style={[styles.yardLine, { top: '60%' }]} />
            <View style={[styles.yardLine, { top: '80%' }]} />
            <View style={styles.scrimmageLine} />

            {currentScenario.players.map((p) => {
              const posX = (p.x / 100) * (FIELD_WIDTH - 24);
              const posY = (p.y / 100) * (FIELD_HEIGHT - 24);
              const isOffense = p.team === 'OFF';

              return (
                <View
                  key={p.id}
                  style={[
                    styles.playerNode,
                    { left: posX, top: posY },
                    isOffense ? styles.offenseNode : styles.defenseNode,
                    p.isKeyRead && styles.keyReadHighlight,
                  ]}
                >
                  <Text style={styles.nodeText}>{p.role}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Choice Buttons (Randomized Order) */}
        <View style={styles.buttonGrid}>
          {(shuffledChoices.length ? shuffledChoices : currentScenario.choices).map((choice) => (
            <TouchableOpacity
              key={choice}
              disabled={selected !== null}
              style={[
                styles.choiceBtn,
                selected === choice &&
                  (choice === currentScenario.correctAnswer ? styles.correctBtn : styles.wrongBtn),
              ]}
              onPress={() => handleChoice(choice)}
            >
              <Text style={styles.btnText}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback Panel */}
        {selected && (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackTitle}>
              {selected === currentScenario.correctAnswer
                ? `✅ Correct Read! (+${lastEarnedPoints} pts)`
                : selected === 'EXPIRED'
                ? '⏰ Time Expired! (+0 pts)'
                : '❌ Incorrect (+0 pts)'}
            </Text>
            <Text style={styles.feedbackText}>{currentScenario.keyRead}</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>NEXT PLAY ➡️</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// =============================================================================
// COACH ADMIN SCREEN BUILDER
// =============================================================================
function CoachAdminScreen({ onSave, onCancel }) {
  const [playMode, setPlayMode] = useState('OFFENSE');
  const [playName, setPlayName] = useState('');
  const [promptText, setPromptText] = useState('');
  const [distractor1, setDistractor1] = useState('');
  const [distractor2, setDistractor2] = useState('');
  const [distractor3, setDistractor3] = useState('');
  const [keyReadNote, setKeyReadNote] = useState('');
  const [selectedRole, setSelectedRole] = useState('QB');
  const [players, setPlayers] = useState([]);

  const handleFieldTap = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const xPct = Math.round((locationX / FIELD_WIDTH) * 100);
    const yPct = Math.round((locationY / FIELD_HEIGHT) * 100);
    const isDefRole = ['FS', 'SS', 'CB', 'MIKE', 'WILL', 'SAM', 'DE', 'DT'].includes(selectedRole);

    setPlayers((prev) => [
      ...prev,
      { id: Date.now().toString(), role: selectedRole, x: xPct, y: yPct, team: isDefRole ? 'DEF' : 'OFF' },
    ]);
  };

  const handleSave = () => {
    if (!playName || !distractor1) {
      alert('Please enter a play name and at least one wrong choice.');
      return;
    }

    onSave({
      id: `custom_${Date.now()}`,
      isTeamPlaybook: true,
      mode: playMode,
      prompt: promptText || '🇬🇧 MY TEAM READ: Identify the correct call.',
      correctAnswer: playName,
      choices: [playName, distractor1, distractor2 || 'Cover 2 Zone', distractor3 || 'Spread 10 Jet'],
      keyRead: keyReadNote || 'Coach Note: Execute pre-snap assignment precisely.',
      players: players.length ? players : initialScenarios[0].players,
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 32 }}>
        <Text style={styles.title}>📋 Coach Playmaker Builder</Text>
        <Text style={{ color: '#94A3B8', fontSize: 11, marginBottom: 12 }}>Tap field to place play nodes</Text>

        <TextInput
          style={styles.adminInput}
          placeholder="Play Call Name (e.g., Bench 10 (2 x 2))"
          placeholderTextColor="#64748B"
          value={playName}
          onChangeText={setPlayName}
        />
        <TextInput
          style={styles.adminInput}
          placeholder="Prompt Context for Players"
          placeholderTextColor="#64748B"
          value={promptText}
          onChangeText={setPromptText}
        />
        <TextInput
          style={styles.adminInput}
          placeholder="Wrong Choice 1"
          placeholderTextColor="#64748B"
          value={distractor1}
          onChangeText={setDistractor1}
        />
        <TextInput
          style={styles.adminInput}
          placeholder="Wrong Choice 2"
          placeholderTextColor="#64748B"
          value={distractor2}
          onChangeText={setDistractor2}
        />
        <TextInput
          style={styles.adminInput}
          placeholder="Coach Breakdown Note"
          placeholderTextColor="#64748B"
          value={keyReadNote}
          onChangeText={setKeyReadNote}
        />

        {/* Role Palette */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
          {['QB', 'RB', 'FB', 'X', 'Z', 'Y', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'FS', 'SS', 'CB', 'MIKE', 'WILL', 'DE', 'DT'].map((role) => (
            <TouchableOpacity
              key={role}
              style={[styles.roleChip, selectedRole === role && styles.activeRoleChip]}
              onPress={() => setSelectedRole(role)}
            >
              <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>{role}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Interactive Placement Field */}
        <TouchableOpacity activeOpacity={0.9} style={styles.fieldBoard} onPress={handleFieldTap}>
          <View style={[styles.yardLine, { top: '20%' }]} />
          <View style={[styles.yardLine, { top: '40%' }]} />
          <View style={[styles.yardLine, { top: '60%' }]} />
          <View style={[styles.yardLine, { top: '80%' }]} />
          <View style={styles.scrimmageLine} />

          {players.map((p) => {
            const posX = (p.x / 100) * (FIELD_WIDTH - 24);
            const posY = (p.y / 100) * (FIELD_HEIGHT - 24);
            return (
              <View
                key={p.id}
                style={[
                  styles.playerNode,
                  { left: posX, top: posY },
                  p.team === 'OFF' ? styles.offenseNode : styles.defenseNode,
                ]}
              >
                <Text style={styles.nodeText}>{p.role}</Text>
              </View>
            );
          })}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#16A34A' }]} onPress={handleSave}>
            <Text style={styles.btnText}>💾 SAVE PLAY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#DC2626' }]} onPress={onCancel}>
            <Text style={styles.btnText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// =============================================================================
// APP STYLES
// =============================================================================
const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    paddingHorizontal: 12,
    // Add explicitly heavy top padding to clear device status bar, camera notches & battery status
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 24 : 44,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  adminBtn: { backgroundColor: '#334155', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  adminBtnText: { color: '#F59E0B', fontWeight: 'bold', fontSize: 10 },

  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginVertical: 6,
  },
  scoreItem: { alignItems: 'center' },
  scoreLabel: { color: '#64748B', fontSize: 9, fontWeight: 'bold' },
  scoreValue: { color: '#38BDF8', fontSize: 16, fontWeight: 'bold' },
  streakValue: { color: '#F59E0B', fontSize: 16, fontWeight: 'bold' },

  sourceToggleRow: { flexDirection: 'row', width: '100%', justifyContent: 'center', marginBottom: 4 },
  sourceBtn: { backgroundColor: '#1E293B', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, marginHorizontal: 3 },
  activeSourceBtn: { backgroundColor: '#2563EB' },
  activeTeamBtn: { backgroundColor: '#16A34A' },
  sourceText: { color: '#FFF', fontWeight: 'bold', fontSize: 10 },

  toggleRow: { flexDirection: 'row', marginBottom: 4 },
  toggleBtn: { backgroundColor: '#1E293B', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 6, marginHorizontal: 3 },
  activeToggle: { backgroundColor: '#2563EB' },
  toggleText: { color: '#FFF', fontWeight: 'bold', fontSize: 10 },

  clockContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 6, marginBottom: 2 },
  clockText: { color: '#22C55E', fontWeight: 'bold', fontSize: 15 },
  clockWarning: { color: '#EF4444' },
  valueText: { color: '#94A3B8', fontSize: 11 },
  valueHighlight: { color: '#F59E0B', fontWeight: 'bold' },

  prompt: { fontSize: 11, color: '#CBD5E1', marginBottom: 6, textAlign: 'center' },

  fieldBoardWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  fieldBoard: {
    width: FIELD_WIDTH,
    height: FIELD_HEIGHT,
    backgroundColor: '#144322',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1E293B',
    position: 'relative',
  },
  yardLine: { position: 'absolute', width: '100%', height: 1, backgroundColor: '#FFFFFF', opacity: 0.2 },
  scrimmageLine: { position: 'absolute', top: '58%', width: '100%', height: 2, backgroundColor: '#38BDF8', opacity: 0.7 },

  playerNode: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  offenseNode: { backgroundColor: '#22C55E' },
  defenseNode: { backgroundColor: '#EF4444' },
  keyReadHighlight: { borderColor: '#F59E0B', borderWidth: 3 },
  nodeText: { color: '#FFF', fontSize: 8, fontWeight: 'bold' },

  buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', marginTop: 6 },
  choiceBtn: { backgroundColor: '#1E293B', width: '48%', padding: 10, borderRadius: 8, marginBottom: 6, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 10 },
  correctBtn: { backgroundColor: '#16A34A' },
  wrongBtn: { backgroundColor: '#DC2626' },

  feedbackBox: { backgroundColor: '#1E293B', padding: 10, borderRadius: 8, marginTop: 2, width: '100%', alignItems: 'center' },
  feedbackTitle: { color: '#F59E0B', fontWeight: 'bold', fontSize: 13, marginBottom: 2 },
  feedbackText: { color: '#CBD5E1', fontSize: 10, textAlign: 'center', marginBottom: 6 },
  nextBtn: { backgroundColor: '#2563EB', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6 },
  nextBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 10 },

  adminInput: { backgroundColor: '#1E293B', color: '#FFF', padding: 8, borderRadius: 6, fontSize: 11, marginBottom: 6 },
  roleChip: { backgroundColor: '#1E293B', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginRight: 4 },
  activeRoleChip: { backgroundColor: '#F59E0B' },
  actionBtn: { width: '48%', padding: 10, borderRadius: 6, alignItems: 'center' },
});
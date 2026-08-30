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
  Alert,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FIELD_WIDTH = SCREEN_WIDTH - 32;
const FIELD_HEIGHT = 240;

// =============================================================================
// MASTER CHOICE POOL
// =============================================================================
const MASTER_CHOICE_POOL = [
  'Cover 0 (Zero Pressure)', 'Cover 1 Man', 'Cover 2 Zone', 'Cover 3 Sky',
  'Cover 4 Quarters', 'Cover 6 Hybrid', 'Double A-Gap Blitz', 'Nickel Corner Blitz',
  '4-3 Base Front', '3-4 Base Front', '4-4 Heavy Front', '5-2 Eagle Front',
  '46 Bear Front', 'Nickel 4-2-5 Defense', 'Dime 4-1-6 Defense',
  'Cover 3 Buzz (Safety Down)', 'Cover 2 Invert (CB Deep Split)', 'Mugged LB Overload Blitz',
  'BENCH 10 - (2 x 2)', 'DEEP OUT 11 - (3 x 1)', 'FAN BUNCH (3 x 1)',
  'GADGETS HOOK & LADDER', 'EMPTY(00) Double Bench', "CATS 5-2 Pressure Front ('TIGER')",
  '11 Personnel / Trips Right', '22 Personnel / Heavy I-Form', 'Pistol Alignment',
  '10 Personnel / Empty Backfield', '12 Personnel / Ace Wing Right',
  '21 Personnel / Split-Back Pro', '13 Personnel / Jumbo Goal Line',
  'Wildcat Unbalanced Heavy', 'Trips Stack / Off-Line Release',
  'Empty Quad Left / Boundary Isolation', '3x1 Bunch Flex Alignment',
  'Wishbone Triple Option Alignment', 'Diamond / Pistol Overload',
  'Smash-Seam High-Low Concept', 'Mesh-Wheel Crosser Concept',
  'Check to Hot Quick Slant / Sight Adjust', 'Deep Middle Seam (Tampa Gap)',
  'Curl-Flat / Sail Concept', 'Check to Inside Zone / Mid-Zone Run',
  'Check to Quick Hitch / Out-Route', 'Trap / B-Gap Interior Run',
  'Slide Protection Center/Guard & Squeeze Box', 'Fade-Out / Rub Route Concept',
  'Underneath Dig / Shallow Crosser', 'Check Run Away From Slant (Boundary)',
  'Check to Bubble Screen / Flash Flat'
];

// =============================================================================
// COMPLETE MASTER PLAYBOOK DATABASE (UNABRIDGED)
// =============================================================================
const baseScenarios = [
  // --- TACTICAL READS ---
  {
    id: 'tac_01',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL READ: Defense shows Cover 0 pressure (8 in box, no deep safety). What is your pre-snap check?',
    correctAnswer: 'Check to Hot Quick Slant / Sight Adjust',
    choices: ['Check to Hot Quick Slant / Sight Adjust', 'Keep 7-Step Drop Four Verticals', 'Outside Zone Run', 'Slow Developing Play Action'],
    keyRead: 'Cover 0 Check: Zero safety help over top. Throw Hot immediately to beat unblocked pressure.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF', isKeyRead: true },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'FS', x: 42, y: 46, team: 'DEF', isKeyRead: true },
      { id: '11', role: 'SS', x: 58, y: 46, team: 'DEF', isKeyRead: true }, { id: '12', role: 'MIKE', x: 50, y: 50, team: 'DEF' }
    ]
  },
  {
    id: 'tac_02',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL READ: Safeties split wide to 15 yards (Cover 2). Where is your primary passing window?',
    correctAnswer: 'Deep Middle Seam (Tampa Gap)',
    choices: ['Deep Middle Seam (Tampa Gap)', 'Underneath Flat', 'Off-Coverage Sideline', 'A-Gap Scrimmage'],
    keyRead: 'Cover 2 Read: Split safeties leave a high-value void down the center field pipe.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'Y',  x: 68, y: 60, team: 'OFF', isKeyRead: true },
      { id: '3', role: 'FS', x: 30, y: 15, team: 'DEF', isKeyRead: true }, { id: '4', role: 'SS', x: 70, y: 15, team: 'DEF', isKeyRead: true },
      { id: '5', role: 'MIKE', x: 50, y: 42, team: 'DEF' }
    ]
  },
  {
    id: 'tac_03',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL READ: Single-high safety center field, CBs off at 8 yards (Cover 3 Sky). How do you attack the flats?',
    correctAnswer: 'Curl-Flat / Sail Concept',
    choices: ['Curl-Flat / Sail Concept', 'Inside Zone Run', 'Deep Post Route', 'QB Sneak'],
    keyRead: 'Cover 3 Read: High-low horizontal stress on the curl/flat defender isolates the single walked-down safety.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'FS', x: 50, y: 15, team: 'DEF', isKeyRead: true },
      { id: '3', role: 'SS', x: 72, y: 44, team: 'DEF', isKeyRead: true }, { id: '4', role: 'CB1', x: 10, y: 25, team: 'DEF' },
      { id: '5', role: 'CB2', x: 90, y: 25, team: 'DEF' }
    ]
  },
  {
    id: 'tac_04',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL READ: Defense presents a light 5-man box vs 11 Personnel. What is the pre-snap check?',
    correctAnswer: 'Check to Inside Zone / Mid-Zone Run',
    choices: ['Check to Inside Zone / Mid-Zone Run', 'Check to Max Protect Pass', 'Call Timeout', 'Throw Bubble Screen'],
    keyRead: 'Box Count Read: 5-man box gives offense a +1 blocking advantage in the run game.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'DE1', x: 34, y: 55, team: 'DEF' }, { id: '4', role: 'DT1', x: 45, y: 55, team: 'DEF' },
      { id: '5', role: 'DT2', x: 55, y: 55, team: 'DEF' }, { id: '6', role: 'DE2', x: 66, y: 55, team: 'DEF' },
      { id: '7', role: 'MIKE', x: 50, y: 46, team: 'DEF', isKeyRead: true }
    ]
  },
  {
    id: 'tac_05',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL READ: Cornerback playing 10 yards off receiver on 3rd & 3. What is the optimal conversion check?',
    correctAnswer: 'Check to Quick Hitch / Out-Route',
    choices: ['Check to Quick Hitch / Out-Route', 'Check to Four Verticals', 'Check to HB Draw', 'Check to Cross Screen'],
    keyRead: 'Off-Leverage Read: Cushion leverage gives easy completion before CB can break on ball.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'X',  x: 10, y: 60, team: 'OFF', isKeyRead: true },
      { id: '3', role: 'CB1', x: 10, y: 25, team: 'DEF', isKeyRead: true }
    ]
  },
  {
    id: 'tac_06',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL READ: Defensive End aligned in 9-technique wide shoulder. How do you exploit this front?',
    correctAnswer: 'Trap / B-Gap Interior Run',
    choices: ['Trap / B-Gap Interior Run', 'Outside Jet Sweep', 'Flea Flicker', 'Sprintout Rollout Right'],
    keyRead: 'Front Technique Read: Wide DE opens B-gap interior lanes for quick trap and iso concepts.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RT', x: 62, y: 60, team: 'OFF' },
      { id: '3', role: 'DE2', x: 76, y: 55, team: 'DEF', isKeyRead: true }
    ]
  },
  {
    id: 'tac_07',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL READ: Double A-Gap Blitz look pre-snap. What pass protection adjustment is required?',
    correctAnswer: 'Slide Protection Center/Guard & Squeeze Box',
    choices: ['Slide Protection Center/Guard & Squeeze Box', 'Free Release Full Backfield', '5-Man Fan Protection', 'Max Protect 2-Receiver Route'],
    keyRead: 'Blitz Pickup Read: Squeezing A-gaps prevents direct up-the-middle path to QB.',
    players: [
      { id: '1', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '2', role: 'MIKE', x: 47, y: 52, team: 'DEF', isKeyRead: true },
      { id: '3', role: 'WILL', x: 53, y: 52, team: 'DEF', isKeyRead: true }
    ]
  },
  {
    id: 'tac_08',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL READ: Strong Safety walked down to 4 yards over Slot Receiver in Press alignment.',
    correctAnswer: 'Fade-Out / Rub Route Concept',
    choices: ['Fade-Out / Rub Route Concept', 'Inside Zone Run', 'Slow QB Draw', 'Mid-Field Post'],
    keyRead: 'Slot Man Read: Press slot leverage creates high-low pick opportunities for stacked receivers.',
    players: [
      { id: '1', role: 'W2', x: 76, y: 60, team: 'OFF', isKeyRead: true },
      { id: '2', role: 'SS', x: 76, y: 48, team: 'DEF', isKeyRead: true }
    ]
  },
  {
    id: 'tac_09',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL READ: Both Safeties aligned deep at 18 yards (Cover 4 Quarters). What short concept opens up?',
    correctAnswer: 'Underneath Dig / Shallow Crosser',
    choices: ['Underneath Dig / Shallow Crosser', 'Four Verticals', 'Deep Post Corner', 'Hail Mary'],
    keyRead: 'Cover 4 Read: Deep 4ths defense concedes short underneath middle space.',
    players: [
      { id: '1', role: 'FS', x: 35, y: 15, team: 'DEF', isKeyRead: true },
      { id: '2', role: 'SS', x: 65, y: 15, team: 'DEF', isKeyRead: true }
    ]
  },
  {
    id: 'tac_10',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL READ: Defensive Line slanting hard to field side pre-snap. How do you audible?',
    correctAnswer: 'Check Run Away From Slant (Boundary)',
    choices: ['Check Run Away From Slant (Boundary)', 'Run Straight Into Slant', 'Slow Screen Field Side', 'Quarterback Sweep Field Side'],
    keyRead: 'DL Slant Read: Running opposite of DL stunt momentum captures easy cutback lanes.',
    players: [
      { id: '1', role: 'DT1', x: 48, y: 55, team: 'DEF', isKeyRead: true },
      { id: '2', role: 'DE1', x: 42, y: 56, team: 'DEF', isKeyRead: true }
    ]
  },
  {
    id: 'tac_11',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL READ: Defense shows 8-man blitz pre-snap but Safety is creeping into High-Flat. What is the check?',
    correctAnswer: 'Check to Bubble Screen / Flash Flat',
    choices: ['Check to Bubble Screen / Flash Flat', 'Check to Inside Zone / Mid-Zone Run', 'Keep 7-Step Drop Four Verticals', 'QB Draw'],
    keyRead: 'Disguised Blitz: Heavy interior pressure with soft flats invites quick perimeter screen throws.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'X',  x: 10, y: 60, team: 'OFF', isKeyRead: true }, { id: '4', role: 'W2', x: 22, y: 60, team: 'OFF', isKeyRead: true },
      { id: '5', role: 'CB1', x: 10, y: 38, team: 'DEF', isKeyRead: true }, { id: '6', role: 'SS', x: 30, y: 48, team: 'DEF', isKeyRead: true }
    ]
  },
  {
    id: 'tac_12',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL READ: Defense shows Cover 2, but Corners drop deep while Safety rolls into the hole pre-snap.',
    correctAnswer: 'Cover 2 Invert (CB Deep Split)',
    choices: ['Cover 2 Invert (CB Deep Split)', 'Cover 0 (Zero Pressure)', 'Cover 4 Quarters', 'Double A-Gap Blitz'],
    keyRead: 'Cover 2 Invert: Field corners guard deep 1/2 zones while safeties rob the low middle.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' },
      { id: '2', role: 'CB1', x: 15, y: 18, team: 'DEF', isKeyRead: true }, { id: '3', role: 'CB2', x: 85, y: 18, team: 'DEF', isKeyRead: true },
      { id: '4', role: 'FS', x: 50, y: 42, team: 'DEF', isKeyRead: true }
    ]
  },
  {
    id: 'tac_13',
    isTeamPlaybook: false,
    mode: 'DEFENSE',
    prompt: 'TACTICAL READ: Linebackers mugged in both B-Gaps with 1-on-1 single coverage outside.',
    correctAnswer: 'Mugged LB Overload Blitz',
    choices: ['Mugged LB Overload Blitz', 'Cover 3 Sky', '4-3 Base Front', 'Cover 4 Quarters'],
    keyRead: 'Mugged B-Gaps: Linebackers crowding guard gaps create immediate 6-on-5 protection dilemmas.',
    players: [
      { id: '1', role: 'C', x: 50, y: 60, team: 'OFF' }, { id: '2', role: 'LG', x: 44, y: 60, team: 'OFF' }, { id: '3', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '4', role: 'MIKE', x: 41, y: 53, team: 'DEF', isKeyRead: true }, { id: '5', role: 'WILL', x: 59, y: 53, team: 'DEF', isKeyRead: true }
    ]
  },

  // --- OFFENSIVE FORMATIONS & CONCEPTS ---
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
    choices: ['11 Personnel / Trips Right', '22 Personnel / Heavy I-Form', '10 Personnel / Empty Backfield', '12 Personnel / Ace Wing Right'],
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
    id: 'off4',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 1 RB directly behind QB in shotgun with H-Back offset.',
    correctAnswer: 'Pistol Alignment',
    choices: ['11 Personnel / Trips Right', 'Pistol Alignment', '10 Personnel / Empty Backfield', '21 Personnel / Split-Back Pro'],
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
    choices: ['11 Personnel / Trips Right', '22 Personnel / Heavy I-Form', '10 Personnel / Empty Backfield', 'Empty Quad Left / Boundary Isolation'],
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
    prompt: 'OFFENSIVE READ: 1 RB, 2 TEs (1 inline left, 1 wing right), 2 WRs wide.',
    correctAnswer: '12 Personnel / Ace Wing Right',
    choices: ['12 Personnel / Ace Wing Right', '21 Personnel / Split-Back Pro', '11 Personnel / Trips Right', 'Wishbone Triple Option Alignment'],
    keyRead: '12 Personnel Ace Wing: Balanced 2-TE set creating dual C-gap edge threats for power runs.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'Y1', x: 32, y: 60, team: 'OFF', isKeyRead: true },
      { id: '9', role: 'Y2', x: 68, y: 64, team: 'OFF', isKeyRead: true }, { id: '10', role: 'X',  x: 10, y: 60, team: 'OFF' },
      { id: '11', role: 'Z',  x: 90, y: 60, team: 'OFF' }
    ]
  },
  {
    id: 'off7',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 2 RBs split parallel behind QB with 1 TE inline and 2 WRs wide.',
    correctAnswer: '21 Personnel / Split-Back Pro',
    choices: ['21 Personnel / Split-Back Pro', '22 Personnel / Heavy I-Form', 'Pistol Alignment', 'Diamond / Pistol Overload'],
    keyRead: '21 Split-Back Pro: Classic dual-back set enabling misdirection, option pitches, and full slide protections.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 68, team: 'OFF' },
      { id: '2', role: 'HB1', x: 42, y: 76, team: 'OFF', isKeyRead: true },
      { id: '3', role: 'HB2', x: 58, y: 76, team: 'OFF', isKeyRead: true },
      { id: '4', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '5', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '6', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '7', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '8', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '9', role: 'TE', x: 68, y: 60, team: 'OFF' },
      { id: '10', role: 'X',  x: 10, y: 60, team: 'OFF' }, { id: '11', role: 'Z',  x: 90, y: 60, team: 'OFF' }
    ]
  },
  {
    id: 'off8',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 3 TEs packed tight with 1 Fullback under center on short yardage.',
    correctAnswer: '13 Personnel / Jumbo Goal Line',
    choices: ['13 Personnel / Jumbo Goal Line', '22 Personnel / Heavy I-Form', 'Wildcat Unbalanced Heavy', 'Wishbone Triple Option Alignment'],
    keyRead: '13 Jumbo Goal Line: Maximum blocking mass inside the 5-yard line. Forces goal-line defense.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 66, team: 'OFF' }, { id: '2', role: 'FB', x: 50, y: 73, team: 'OFF' },
      { id: '3', role: 'RB', x: 50, y: 80, team: 'OFF' },
      { id: '4', role: 'TE1', x: 32, y: 60, team: 'OFF', isKeyRead: true }, { id: '5', role: 'LT', x: 38, y: 60, team: 'OFF' },
      { id: '6', role: 'LG',  x: 44, y: 60, team: 'OFF' }, { id: '7', role: 'C',  x: 50, y: 60, team: 'OFF' },
      { id: '8', role: 'RG',  x: 56, y: 60, team: 'OFF' }, { id: '9', role: 'RT', x: 62, y: 60, team: 'OFF' },
      { id: '10', role: 'TE2', x: 68, y: 60, team: 'OFF', isKeyRead: true }, { id: '11', role: 'TE3', x: 74, y: 60, team: 'OFF', isKeyRead: true }
    ]
  },
  {
    id: 'off9',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: Running Back lined up directly at Center with QB split wide.',
    correctAnswer: 'Wildcat Unbalanced Heavy',
    choices: ['Wildcat Unbalanced Heavy', 'Pistol Alignment', '10 Personnel / Empty Backfield', '21 Personnel / Split-Back Pro'],
    keyRead: 'Wildcat Snap: Direct snap to RB creates an immediate +1 blocking advantage at line of scrimmage.',
    players: [
      { id: '1', role: 'RB(C)', x: 50, y: 72, team: 'OFF', isKeyRead: true },
      { id: '2', role: 'QB(W)', x: 90, y: 60, team: 'OFF', isKeyRead: true },
      { id: '3', role: 'FB', x: 44, y: 72, team: 'OFF' },
      { id: '4', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '5', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '6', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '7', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '8', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '9', role: 'TE', x: 68, y: 60, team: 'OFF' },
      { id: '10', role: 'X',  x: 10, y: 60, team: 'OFF' }, { id: '11', role: 'H',  x: 32, y: 60, team: 'OFF' }
    ]
  },
  {
    id: 'off10',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 2 WRs stacked directly behind each other on the perimeter.',
    correctAnswer: 'Trips Stack / Off-Line Release',
    choices: ['Trips Stack / Off-Line Release', '3x1 Bunch Flex Alignment', '11 Personnel / Trips Right', 'Empty Quad Left / Boundary Isolation'],
    keyRead: 'Receiver Stack: Eliminates press coverage attempts by creating immediate pick/rub routes.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 42, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' },
      { id: '8', role: 'W1', x: 86, y: 60, team: 'OFF', isKeyRead: true },
      { id: '9', role: 'W2', x: 86, y: 65, team: 'OFF', isKeyRead: true },
      { id: '10', role: 'W3', x: 72, y: 60, team: 'OFF' }, { id: '11', role: 'X',  x: 10, y: 60, team: 'OFF' }
    ]
  },
  {
    id: 'off11',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 4 receivers overloaded to left side with 1 single WR isolated right.',
    correctAnswer: 'Empty Quad Left / Boundary Isolation',
    choices: ['Empty Quad Left / Boundary Isolation', '10 Personnel / Empty Backfield', 'Trips Stack / Off-Line Release', '3x1 Bunch Flex Alignment'],
    keyRead: 'Quad Overload: Stresses defensive zone shifts while creating 1-on-1 boundary ISO on the right.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' },
      { id: '2', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '3', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '4', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '5', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '6', role: 'RT', x: 62, y: 60, team: 'OFF' },
      { id: '7', role: 'W1', x: 8,  y: 60, team: 'OFF', isKeyRead: true },
      { id: '8', role: 'W2', x: 18, y: 60, team: 'OFF', isKeyRead: true },
      { id: '9', role: 'W3', x: 28, y: 60, team: 'OFF', isKeyRead: true },
      { id: '10', role: 'W4', x: 38, y: 64, team: 'OFF', isKeyRead: true },
      { id: '11', role: 'X',  x: 92, y: 60, team: 'OFF' }
    ]
  },
  {
    id: 'off12',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: 3-man backfield forming a triangle around the QB in shotgun.',
    correctAnswer: 'Diamond / Pistol Overload',
    choices: ['Diamond / Pistol Overload', 'Wishbone Triple Option Alignment', '21 Personnel / Split-Back Pro', 'Pistol Alignment'],
    keyRead: 'Diamond Formation: Provides 2 lead blockers for power runs to either A/B gap or max pass protection.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' },
      { id: '2', role: 'FB1', x: 42, y: 72, team: 'OFF', isKeyRead: true },
      { id: '3', role: 'FB2', x: 58, y: 72, team: 'OFF', isKeyRead: true },
      { id: '4', role: 'RB',  x: 50, y: 80, team: 'OFF', isKeyRead: true },
      { id: '5', role: 'LT',  x: 38, y: 60, team: 'OFF' }, { id: '6', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '7', role: 'C',   x: 50, y: 60, team: 'OFF' }, { id: '8', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '9', role: 'RT',  x: 62, y: 60, team: 'OFF' }, { id: '10', role: 'X', x: 10, y: 60, team: 'OFF' },
      { id: '11', role: 'Z',  x: 90, y: 60, team: 'OFF' }
    ]
  },
  {
    id: 'off13',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: Under center with FB close and 2 Halfbacks flared out in a "V" shape.',
    correctAnswer: 'Wishbone Triple Option Alignment',
    choices: ['Wishbone Triple Option Alignment', '22 Personnel / Heavy I-Form', 'Diamond / Pistol Overload', '21 Personnel / Split-Back Pro'],
    keyRead: 'Wishbone: Classic option formation giving QB immediate give, keeper, or pitch reads.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 66, team: 'OFF' },
      { id: '2', role: 'FB', x: 50, y: 73, team: 'OFF', isKeyRead: true },
      { id: '3', role: 'HB1', x: 40, y: 80, team: 'OFF', isKeyRead: true },
      { id: '4', role: 'HB2', x: 60, y: 80, team: 'OFF', isKeyRead: true },
      { id: '5', role: 'LT',  x: 38, y: 60, team: 'OFF' }, { id: '6', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '7', role: 'C',   x: 50, y: 60, team: 'OFF' }, { id: '8', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '9', role: 'RT',  x: 62, y: 60, team: 'OFF' }, { id: '10', role: 'X', x: 10, y: 60, team: 'OFF' },
      { id: '11', role: 'Z',  x: 90, y: 60, team: 'OFF' }
    ]
  },
  {
    id: 'off14',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: Outside WR running Hitch/Hitch-Out while Slot WR attacks middle seam.',
    correctAnswer: 'Smash-Seam High-Low Concept',
    choices: ['Smash-Seam High-Low Concept', 'Mesh-Wheel Crosser Concept', 'Curl-Flat / Sail Concept', 'Fade-Out / Rub Route Concept'],
    keyRead: 'Smash Concept: High-lows the Cornerback in Cover 2 to force him to choose between hitch and seam.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' },
      { id: '2', role: 'W1', x: 80, y: 60, team: 'OFF', isKeyRead: true },
      { id: '3', role: 'W2', x: 92, y: 60, team: 'OFF', isKeyRead: true },
      { id: '4', role: 'CB2', x: 88, y: 45, team: 'DEF', isKeyRead: true },
      { id: '5', role: 'SS',  x: 75, y: 20, team: 'DEF' }
    ]
  },
  {
    id: 'off15',
    isTeamPlaybook: false,
    mode: 'OFFENSE',
    prompt: 'OFFENSIVE READ: Shallow shallow-crossers running under each other with RB releasing to wheel.',
    correctAnswer: 'Mesh-Wheel Crosser Concept',
    choices: ['Mesh-Wheel Crosser Concept', 'Smash-Seam High-Low Concept', 'RPO Inside Zone / Peak Read', 'Curl-Flat / Sail Concept'],
    keyRead: 'Mesh Concept: Rubs man-coverage defenders while exposing middle voids in zone coverage.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' },
      { id: '2', role: 'RB', x: 40, y: 72, team: 'OFF', isKeyRead: true },
      { id: '3', role: 'X',  x: 10, y: 60, team: 'OFF', isKeyRead: true },
      { id: '4', role: 'Z',  x: 90, y: 60, team: 'OFF', isKeyRead: true },
      { id: '5', role: 'MIKE', x: 50, y: 48, team: 'DEF' }
    ]
  },

  // --- DEFENSIVE FRONTS & COVERAGES ---
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
    keyRead: '4-4 Front: Places 8 defenders in the box with 4 LBs for heavy run gap control.',
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

  // --- WEMBLEY STALLIONS SENIOR PASS PLAYS ---
  {
    id: 'uk_play_01',
    isTeamPlaybook: true,
    mode: 'OFFENSE',
    prompt: '🇬🇧 WEMBLEY STALLIONS: Identify this 10 Personnel 2x2 spread concept.',
    correctAnswer: 'BENCH 10 - (2 x 2)',
    choices: ['BENCH 10 - (2 x 2)', 'BILLIE 10 - (2 x 2)', 'DEEP OUT 10 - (2 x 2)', 'SLANTS 10 - (2 x 2)'],
    keyRead: 'Stallions Call: BENCH 10 targeting flat defenders out of a 2x2 spread.',
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
    prompt: '🇬🇧 WEMBLEY STALLIONS: Identify this 11 Personnel 3x1 unbalanced concept.',
    correctAnswer: 'DEEP OUT 11 - (3 x 1)',
    choices: ['BENCH 11 - (3 x 1)', 'DEEP OUT 11 - (3 x 1)', 'FAN BUNCH (3 x 1)', 'FLOOD 11 - (3 x 1)'],
    keyRead: 'Stallions Call: DEEP OUT 11 featuring 1 TE inline left with 3 receivers stacked right.',
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
    prompt: '🇬🇧 WEMBLEY STALLIONS: Identify this 3x1 bunch alignment.',
    correctAnswer: 'FAN BUNCH (3 x 1)',
    choices: ['FAN BUNCH (3 x 1)', 'BENCH BUNCH (3 x 1)', 'BILLIE BUNCH (3 x 1)', 'MESH BUNCH (3 x 1)'],
    keyRead: 'Stallions Call: FAN BUNCH 3x1 receiver cluster to release wide fan routes.',
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
  {
    id: 'uk_play_04',
    isTeamPlaybook: true,
    mode: 'OFFENSE',
    prompt: '🇬🇧 WEMBLEY STALLIONS: Identify this trick play design.',
    correctAnswer: 'GADGETS HOOK & LADDER',
    choices: ['GADGETS HOOK & LADDER', 'GADGETS SLIP SCREEN', 'GADGETS CROSS SCREEN', 'GADGETS Tunnel Screen'],
    keyRead: 'Stallions Gadget: Hook route curl with immediate lateral pitch to trailing receiver.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 44, y: 72, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'X',  x: 10, y: 60, team: 'OFF', isKeyRead: true },
      { id: '9', role: 'Z',  x: 90, y: 60, team: 'OFF' }, { id: '10', role: 'Y', x: 26, y: 60, team: 'OFF', isKeyRead: true }
    ]
  },
  {
    id: 'uk_play_05',
    isTeamPlaybook: true,
    mode: 'OFFENSE',
    prompt: '🇬🇧 WEMBLEY STALLIONS: Identify this empty 5-receiver package.',
    correctAnswer: 'EMPTY(00) Double Bench',
    choices: ['EMPTY(00) Double Bench', 'EMPTY(00) Jet Sweep Pop', 'EMPTY(00) OB Draw', 'EMPTY(00) Deep Out'],
    keyRead: 'Stallions Empty Set: 5 receivers split out running bench/out concepts.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF', isKeyRead: true },
      { id: '2', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '3', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '4', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '5', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '6', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '7', role: 'W1', x: 8,  y: 60, team: 'OFF' },
      { id: '8', role: 'W2', x: 22, y: 60, team: 'OFF' }, { id: '9', role: 'W3', x: 74, y: 60, team: 'OFF' },
      { id: '10', role: 'W4', x: 84, y: 60, team: 'OFF' }, { id: '11', role: 'W5', x: 94, y: 60, team: 'OFF' }
    ]
  },
  {
    id: 'uk_play_06',
    isTeamPlaybook: true,
    mode: 'DEFENSE',
    prompt: '🇬🇧 WEMBLEY STALLIONS: Identify this defensive front check.',
    correctAnswer: "CATS 5-2 Pressure Front ('TIGER')",
    choices: ["CATS 5-2 Pressure Front ('TIGER')", 'CATS Crow', 'KNIGHTS 4-2-5 Defence', 'KNIGHTS 5-2 Cover 1'],
    keyRead: 'Stallions Defensive Check: 5-2 pressure alignment designed to plug running gaps.',
    players: [
      { id: '1', role: 'QB', x: 50, y: 72, team: 'OFF' }, { id: '2', role: 'RB', x: 50, y: 82, team: 'OFF' },
      { id: '3', role: 'LT', x: 38, y: 60, team: 'OFF' }, { id: '4', role: 'LG', x: 44, y: 60, team: 'OFF' },
      { id: '5', role: 'C',  x: 50, y: 60, team: 'OFF' }, { id: '6', role: 'RG', x: 56, y: 60, team: 'OFF' },
      { id: '7', role: 'RT', x: 62, y: 60, team: 'OFF' }, { id: '8', role: 'E1', x: 30, y: 55, team: 'DEF', isKeyRead: true },
      { id: '9', role: 'T1', x: 40, y: 55, team: 'DEF', isKeyRead: true }, { id: '10', role: 'N', x: 50, y: 55, team: 'DEF', isKeyRead: true },
      { id: '11', role: 'T2', x: 60, y: 55, team: 'DEF', isKeyRead: true }, { id: '12', role: 'E2', x: 70, y: 55, team: 'DEF', isKeyRead: true }
    ]
  }
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// =============================================================================
// ADVANCED DYNAMIC PROCEDURAL ENGINE (FIXED FILTERING)
// =============================================================================
const generateDynamicVariations = (baseList, isTeamMode, currentMode) => {
  // Safe Mode Filter: Ensures scenarios without an explicit mode are included properly
  const filtered = baseList.filter((s) => {
    if (isTeamMode) {
      return s.isTeamPlaybook === true;
    } else {
      return !s.isTeamPlaybook && (s.mode === currentMode || !s.mode);
    }
  });

  const pool = filtered.length ? filtered : baseList;
  const proceduralQueue = [];

  for (let i = 0; i < 40; i++) {
    const archetype = pool[i % pool.length];
    
    // VARIATION CONTROLS
    const shouldFlipFormation = Math.random() > 0.4;
    const isUnbalancedShift = Math.random() > 0.7;
    const hasPreSnapMotion = Math.random() > 0.6;
    const isDisguisedCoverage = Math.random() > 0.65;
    
    // RANDOM OFFSETS
    const hashShiftX = Math.round((Math.random() - 0.5) * 16);
    const safetyDepthShiftY = Math.round((Math.random() - 0.5) * 12);
    const secondaryCreepX = Math.round((Math.random() - 0.5) * 8);

    const transformedPlayers = archetype.players.map((p) => {
      let newX = p.x;
      let newY = p.y;

      if (shouldFlipFormation) {
        newX = 100 - newX;
      }

      newX = newX + hashShiftX;

      if (isUnbalancedShift && p.team === 'OFF' && (p.role === 'RT' || p.role === 'Y' || p.role === 'Z')) {
        newX = shouldFlipFormation ? newX - 10 : newX + 10;
      }

      if (isDisguisedCoverage && p.team === 'DEF') {
        if (p.role === 'FS' || p.role === 'SS') {
          newY = newY + 14; 
          newX = newX + secondaryCreepX;
        } else if (p.role === 'CB1' || p.role === 'CB2') {
          newY = Math.max(15, newY - 10);
        }
      } else if (p.role === 'FS' || p.role === 'SS') {
        newY = newY + safetyDepthShiftY;
      }

      if (hasPreSnapMotion && (p.role === 'W2' || p.role === 'RB' || p.role === 'HB')) {
        newX = shouldFlipFormation ? newX + 18 : newX - 18;
        newY = newY + 4;
      }

      newX = Math.max(6, Math.min(94, newX));
      newY = Math.max(12, Math.min(88, newY));

      return {
        ...p,
        x: newX,
        y: newY,
        role: (hasPreSnapMotion && (p.role === 'W2' || p.role === 'RB')) ? `${p.role} (Mot)` : p.role
      };
    });

    let promptModifier = '';
    if (shouldFlipFormation) promptModifier += ' [FLIPPED]';
    if (hasPreSnapMotion) promptModifier += ' [IN MOTION]';
    if (isDisguisedCoverage) promptModifier += ' [DISGUISED LOOK]';

    const wrongDistractors = shuffleArray(
      MASTER_CHOICE_POOL.filter((c) => c !== archetype.correctAnswer)
    ).slice(0, 3);

    const dynamicChoices = shuffleArray([archetype.correctAnswer, ...wrongDistractors]);

    proceduralQueue.push({
      ...archetype,
      id: `${archetype.id}_gen_${i}_${Date.now()}`,
      prompt: `${archetype.prompt}${promptModifier}`,
      players: transformedPlayers,
      choices: dynamicChoices,
    });
  }

  return shuffleArray(proceduralQueue);
};

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================
export default function App() {
  const [allScenarios, setAllScenarios] = useState(baseScenarios);
  const [useTeamPlaybook, setUseTeamPlaybook] = useState(false);
  const [mode, setMode] = useState('DEFENSE');
  const [activeQueue, setActiveQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastEarnedPoints, setLastEarnedPoints] = useState(0);

  useEffect(() => {
    const dynamicQueue = generateDynamicVariations(allScenarios, useTeamPlaybook, mode);
    setActiveQueue(dynamicQueue);
    setIndex(0);
    setSelected(null);
    setTimeLeft(15);
  }, [mode, useTeamPlaybook, allScenarios]);

  const currentScenario = activeQueue[index] || baseScenarios[0];
  const currentPotentialPoints = Math.round((timeLeft / 15) * 100);

  useEffect(() => {
    if (currentScenario && currentScenario.choices) {
      setShuffledChoices(shuffleArray(currentScenario.choices));
    }
  }, [currentScenario, index]);

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
      const newQueue = generateDynamicVariations(allScenarios, useTeamPlaybook, mode);
      setActiveQueue(newQueue);
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

  const handleBulkImport = (importedPlays) => {
    setAllScenarios((prev) => [...importedPlays, ...prev]);
    setUseTeamPlaybook(true);
    setShowAdmin(false);
  };

  if (showAdmin) {
    return (
      <CoachAdminScreen
        onSave={handleAddCustomPlay}
        onBulkSave={handleBulkImport}
        onCancel={() => setShowAdmin(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Pre-Snap Football IQ</Text>
          <TouchableOpacity style={styles.adminBtn} onPress={() => setShowAdmin(true)}>
            <Text style={styles.adminBtnText}>⚙️ COACH ADMIN</Text>
          </TouchableOpacity>
        </View>

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

        <View style={styles.clockContainer}>
          <Text style={[styles.clockText, timeLeft <= 3 && styles.clockWarning]}>
            ⏱️ 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </Text>
          <Text style={styles.valueText}>
            Potential: <Text style={styles.valueHighlight}>+{currentPotentialPoints} pts</Text>
          </Text>
        </View>

        <Text style={styles.prompt}>{currentScenario.prompt}</Text>

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
// COACH ADMIN SCREEN BUILDER WITH BULK JSON IMPORTER
// =============================================================================
function CoachAdminScreen({ onSave, onBulkSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('SINGLE');
  const [playMode, setPlayMode] = useState('OFFENSE');
  const [playName, setPlayName] = useState('');
  const [promptText, setPromptText] = useState('');
  const [distractor1, setDistractor1] = useState('');
  const [distractor2, setDistractor2] = useState('');
  const [distractor3, setDistractor3] = useState('');
  const [keyReadNote, setKeyReadNote] = useState('');
  const [selectedRole, setSelectedRole] = useState('QB');
  const [players, setPlayers] = useState([]);

  const [jsonInput, setJsonInput] = useState('');

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

  const handleSaveSingle = () => {
    if (!playName || !distractor1) {
      Alert.alert('Missing Fields', 'Please enter a play name and at least one wrong choice.');
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
      players: players.length ? players : baseScenarios[0].players,
    });
  };

  const handleProcessBulkJson = () => {
    if (!jsonInput.trim()) {
      Alert.alert('Empty Input', 'Please paste valid JSON text into the box.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const playsArray = Array.isArray(parsed) ? parsed : [parsed];

      const validatedPlays = playsArray.map((play, i) => ({
        id: play.id || `bulk_${Date.now()}_${i}`,
        isTeamPlaybook: true,
        mode: play.mode || 'OFFENSE',
        prompt: play.prompt || '🇬🇧 MY TEAM READ: Identify pre-snap check.',
        correctAnswer: play.correctAnswer || `Custom Play ${i + 1}`,
        choices: play.choices || [play.correctAnswer, 'Cover 2 Zone', 'Cover 3 Sky', 'BENCH 10 - (2 x 2)'],
        keyRead: play.keyRead || 'Coach Note: Execute assignment as drawn.',
        players: play.players || baseScenarios[0].players,
      }));

      onBulkSave(validatedPlays);
      Alert.alert('Success!', `Successfully imported ${validatedPlays.length} custom plays.`);
    } catch (err) {
      Alert.alert('JSON Error', 'Could not parse JSON. Check formatting and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 32 }}>
        <Text style={styles.title}>📋 Coach Playmaker Builder</Text>

        <View style={{ flexDirection: 'row', marginVertical: 12 }}>
          <TouchableOpacity
            style={[styles.toggleBtn, activeTab === 'SINGLE' && styles.activeToggle]}
            onPress={() => setActiveTab('SINGLE')}
          >
            <Text style={styles.toggleText}>DRAW SINGLE PLAY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, activeTab === 'BULK' && styles.activeToggle]}
            onPress={() => setActiveTab('BULK')}
          >
            <Text style={styles.toggleText}>📥 BULK JSON IMPORTER</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'SINGLE' ? (
          <>
            <TextInput
              style={styles.adminInput}
              placeholder="Play Call Name (e.g., BENCH 10 - (2 x 2))"
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
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#16A34A' }]} onPress={handleSaveSingle}>
                <Text style={styles.btnText}>💾 SAVE PLAY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#DC2626' }]} onPress={onCancel}>
                <Text style={styles.btnText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={{ color: '#94A3B8', fontSize: 11, marginBottom: 8 }}>
              Paste formatted JSON array of custom plays below:
            </Text>
            <TextInput
              style={[styles.adminInput, { height: 180, textAlignVertical: 'top', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }]}
              multiline
              placeholder={`[\n  {\n    "prompt": "🇬🇧 READ: BENCH 10",\n    "correctAnswer": "BENCH 10 - (2 x 2)",\n    "choices": ["BENCH 10 - (2 x 2)", "BILLIE 10", "DEEP OUT 10", "SLANTS 10"],\n    "keyRead": "Stallions Bench concept...",\n    "players": [{ "id": "1", "role": "QB", "x": 50, "y": 72, "team": "OFF" }]\n  }\n]`}
              placeholderTextColor="#64748B"
              value={jsonInput}
              onChangeText={setJsonInput}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2563EB' }]} onPress={handleProcessBulkJson}>
                <Text style={styles.btnText}>📥 IMPORT JSON</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#DC2626' }]} onPress={onCancel}>
                <Text style={styles.btnText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
  nodeText: { color: '#FFF', fontSize: 6.5, fontWeight: 'bold' },

  buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', marginTop: 6 },
  choiceBtn: { backgroundColor: '#1E293B', width: '48%', padding: 10, borderRadius: 8, marginBottom: 6, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 10, textAlign: 'center' },
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

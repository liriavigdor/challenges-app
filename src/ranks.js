export const MILITARY_RANKS = [
  { id: 0, name: 'Recruit', heName: 'טירון', xpRequired: 0 },
  { id: 1, name: 'Private', heName: 'טוראי', xpRequired: 10 },
  { id: 2, name: 'Gefreiter', heName: 'טוראי ראשון', xpRequired: 50 },
  { id: 3, name: 'Corporal', heName: 'רב טוראי', xpRequired: 150 },
  { id: 4, name: 'Master Corporal', heName: 'רב טוראי מתקדם', xpRequired: 370 },
  { id: 5, name: 'Sergeant', heName: 'סמל', xpRequired: 710 },
  { id: 6, name: 'Staff Sergeant', heName: 'סמל ראשון', xpRequired: 1230 },
  { id: 7, name: 'Master Sergeant', heName: 'רב סמל', xpRequired: 2000 },
  { id: 8, name: 'First Sergeant', heName: 'רב סמל ראשון', xpRequired: 2900 },
  { id: 9, name: 'Sergeant-Major', heName: 'רב סמל מתקדם', xpRequired: 4100 },
  { id: 10, name: 'Warrant Officer 1', heName: 'רב נגד משנה', xpRequired: 5700 },
  { id: 11, name: 'Warrant Officer 2', heName: 'רב נגד', xpRequired: 7600 },
  { id: 12, name: 'Warrant Officer 3', heName: 'רב נגד ראשון', xpRequired: 9800 },
  { id: 13, name: 'Warrant Officer 4', heName: 'רב נגד בכיר', xpRequired: 12500 },
  { id: 14, name: 'Warrant Officer 5', heName: 'רב נגד מיוחד', xpRequired: 15600 },
  { id: 15, name: 'Third Lieutenant', heName: 'סגן משנה', xpRequired: 19200 },
  { id: 16, name: 'Second Lieutenant', heName: 'סגן', xpRequired: 23300 },
  { id: 17, name: 'First Lieutenant', heName: 'סרן', xpRequired: 28000 },
  { id: 18, name: 'Captain', heName: 'רב סרן', xpRequired: 33200 },
  { id: 19, name: 'Major', heName: 'סגן אלוף', xpRequired: 39000 },
  { id: 20, name: 'Lieutenant Colonel', heName: 'אלוף משנה', xpRequired: 45500 },
  { id: 21, name: 'Colonel', heName: 'תת אלוף', xpRequired: 52700 },
  { id: 22, name: 'Brigadier', heName: 'אלוף', xpRequired: 60600 },
  { id: 23, name: 'Major General', heName: 'רב אלוף', xpRequired: 69200 },
  { id: 24, name: 'Lieutenant General', heName: 'מפקד צבא', xpRequired: 78700 },
  { id: 25, name: 'General', heName: 'גנרל', xpRequired: 88900 },
  { id: 26, name: 'Marshal', heName: 'מרשל', xpRequired: 100000 },
  { id: 27, name: 'Fieldmarshal', heName: 'פילדמרשל', xpRequired: 112200 },
  { id: 28, name: 'Commander', heName: 'קומנדר', xpRequired: 125500 },
  { id: 29, name: 'Generalissimo', heName: 'גנרליסימו', xpRequired: 140000 }
];

export const getUserRank = (xp) => {
  const effectiveXp = xp || 0;
  for (let i = MILITARY_RANKS.length - 1; i >= 0; i--) {
    if (effectiveXp >= MILITARY_RANKS[i].xpRequired) {
      return MILITARY_RANKS[i];
    }
  }
  return MILITARY_RANKS[0];
};

export const getNextRank = (currentRankId) => {
  if (currentRankId < MILITARY_RANKS.length - 1) {
    return MILITARY_RANKS[currentRankId + 1];
  }
  return null;
};

export const calculateArenaXP = (currentXp, isHomeGame, isWinner) => {
  const currentRank = getUserRank(currentXp);
  const rankFloor = currentRank.xpRequired;

  if (isWinner) {
    return currentXp + (isHomeGame ? 15 : 40);
  } else {
    return Math.max(rankFloor, currentXp - 15);
  }
};

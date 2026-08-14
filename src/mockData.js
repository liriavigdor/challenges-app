export const initialUsers = [
  {
    id: "user_1",
    name: "רועי כהן",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    xp: 2450,
    rank: 1,
    completedChallengesCount: 18,
    badges: ["🔥 רצף של 7 ימים", "🏃 מרתוניסט", "⛰️ כובש פסגות"],
    activeChallenges: ["run_10k", "pushups_100"],
    reportsCount: 0,
    isBlocked: false,
    hardChallengesCompleted: 3,
    streak: 7,
    followers: ["user_2", "user_3"],
    following: ["user_2", "user_4"],
    stats: { strength: 78, stamina: 85, agility: 62, zen: 45 }
  },
  {
    id: "user_2",
    name: "יובל לוי",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    xp: 1980,
    rank: 2,
    completedChallengesCount: 14,
    badges: ["💪 איש הברזל", "⚡ זריז במיוחד"],
    activeChallenges: ["plank_30d"],
    reportsCount: 0,
    isBlocked: false,
    hardChallengesCompleted: 2,
    streak: 5,
    followers: ["user_1", "user_4"],
    following: ["user_1", "user_3"],
    stats: { strength: 90, stamina: 70, agility: 80, zen: 30 }
  },
  {
    id: "user_3",
    name: "דניאל מזרחי",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
    xp: 1620,
    rank: 3,
    completedChallengesCount: 11,
    badges: ["🚲 מדווש על", "🏔️ חובב גבהים"],
    activeChallenges: ["run_10k", "plank_30d"],
    reportsCount: 0,
    isBlocked: false,
    hardChallengesCompleted: 1,
    streak: 3,
    followers: ["user_2"],
    following: ["user_1"],
    stats: { strength: 65, stamina: 88, agility: 70, zen: 50 }
  },
  {
    id: "user_4",
    name: "שירה אלוני",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    xp: 1400,
    rank: 4,
    completedChallengesCount: 9,
    badges: ["🧘 יוגה מאסטר"],
    activeChallenges: ["pushups_100"],
    reportsCount: 0,
    isBlocked: false,
    hardChallengesCompleted: 0,
    streak: 12,
    followers: ["user_1"],
    following: ["user_2"],
    stats: { strength: 50, stamina: 60, agility: 55, zen: 95 }
  }
];

export const initialNotifications = [
  {
    id: "notif_1",
    type: "follow",
    senderId: "user_4",
    senderName: "שירה אלוני",
    senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    text: "התחילה לעקוב אחריך",
    timestamp: "לפני 10 דקות",
    read: false
  },
  {
    id: "notif_2",
    type: "joint_challenge",
    senderId: "user_2",
    senderName: "יובל לוי",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    text: "הזמין אותך לאתגר משותף: 100 שכיבות סמיכה ברצף",
    challengeId: "pushups_100",
    timestamp: "לפני שעה",
    read: false,
    status: "pending" // pending, accepted, declined
  }
];

export const initialChallenges = [
  {
    id: "run_10k",
    title: "אתגר ריצת 10 קילומטר",
    description: "רוצו מרחק של 10 קילומטרים בקצב שלכם ותעדו את תוצאת האפליקציה או השעון.",
    category: "אירובי",
    difficulty: "בינוני",
    xpReward: 300,
    participantsCount: 47,
    duration: "חד פעמי",
    creator: "Pulse Team",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&auto=format&fit=crop&q=80",
    difficultyGrades: [3, 4, 3, 2, 4],
    isIconic: false
  },
  {
    id: "pushups_100",
    title: "100 שכיבות סמיכה ברצף",
    description: "מבחן כוח אמיתי. בצעו 100 שכיבות סמיכה בסט אחד (או עם הפסקות קצרות של עד 5 שניות במצב פלאנק).",
    category: "כוח",
    difficulty: "קשה",
    xpReward: 500,
    participantsCount: 32,
    duration: "חד פעמי",
    creator: "רועי כהן",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
    difficultyGrades: [4, 5, 4, 5, 4],
    isIconic: false
  },
  {
    id: "plank_30d",
    title: "30 ימי פלאנק",
    description: "אתגר יומיומי: מתחילים מדקה ביום הראשון ומגיעים ל-5 דקות פלאנק ביום ה-30.",
    category: "ליבה",
    difficulty: "קל",
    xpReward: 400,
    participantsCount: 118,
    duration: "30 ימים",
    creator: "שירה אלוני",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    difficultyGrades: [2, 2, 3, 1, 2],
    isIconic: false
  },
  {
    id: "climb_mount",
    title: "טיפוס לפסגת החרמון",
    description: "כבשו את הפסגה הגבוהה במדינה ברגל. העלו תמונה מציגת נוף ותחנת הרכבל העליונה.",
    category: "שטח",
    difficulty: "קשה מאוד",
    xpReward: 800,
    participantsCount: 14,
    duration: "חד פעמי",
    creator: "דניאל מזרחי",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
    difficultyGrades: [5, 5, 4, 5],
    isIconic: true,
    badgeReward: "🧗 כובש החרמון"
  },
  {
    id: "marathon_run",
    title: "ריצת מרתון שלם (42.2 ק\"מ)",
    description: "האתגר האולטימטיבי של הריצה. לרוץ 42.195 קילומטרים ולסיים בגאווה.",
    category: "אירובי",
    difficulty: "קשה מאוד",
    xpReward: 1000,
    participantsCount: 5,
    duration: "חד פעמי",
    creator: "Pulse Team",
    image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&auto=format&fit=crop&q=80",
    difficultyGrades: [5, 5, 5],
    isIconic: true,
    badgeReward: "🏅 מרתוניסט"
  }
];

export const initialFeed = [
  {
    id: "feed_1",
    userId: "user_1",
    userName: "רועי כהן",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    challengeTitle: "אתגר ריצת 10 קילומטר",
    achievementDetail: "השלמתי את ה-10 קילומטרים בזמן שיא של 44:21 דקות! 🔥🏃‍♂️ ההרגשה מטורפת. מי מנסה לעקוף אותי?",
    proofImage: "https://images.unsplash.com/photo-1502224562085-639556652f33?w=600&auto=format&fit=crop&q=80",
    likes: 24,
    claps: 12,
    hasLiked: false,
    hasClapped: false,
    timestamp: "לפני שעתיים",
    streak: 7,
    comments: [
      {
        id: "c_1",
        userName: "יובל לוי",
        text: "קצב מטורף רועי! כל הכבוד 💪"
      },
      {
        id: "c_2",
        userName: "שירה אלוני",
        text: "השראה לכולנו! ⚡"
      }
    ]
  },
  {
    id: "feed_2",
    userId: "user_2",
    userName: "יובל לוי",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    challengeTitle: "100 שכיבות סמיכה ברצף",
    achievementDetail: "סוף סוף הצלחתי! 100 שכיבות סמיכה נקיות. הידיים רועדות אבל זה שווה את זה. 💪🏅",
    proofImage: "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=600&auto=format&fit=crop&q=80",
    likes: 18,
    claps: 22,
    hasLiked: false,
    hasClapped: false,
    timestamp: "לפני 4 שעות",
    streak: 5,
    comments: [
      {
        id: "c_3",
        userName: "דניאל מזרחי",
        text: "סט אחד בלי הפסקה בכלל? וואו."
      }
    ]
  },
  {
    id: "feed_3",
    userId: "user_3",
    userName: "דניאל מזרחי",
    userAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
    challengeTitle: "טיפוס לפסגת החרמון",
    achievementDetail: "כבשתי את החרמון! הנוף משוגע, האוויר קפוא והחוויה בלתי נשכחת. 🏔️👣",
    proofImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
    likes: 31,
    claps: 40,
    hasLiked: false,
    hasClapped: false,
    timestamp: "לפני יום",
    streak: 3,
    comments: []
  },
  {
    id: "feed_4",
    userId: "user_4",
    userName: "שירה אלוני",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    challengeTitle: "30 ימי פלאנק",
    achievementDetail: "יום 15 של הפלאנק! הגעתי כבר ל-3 וחצי דקות פלאנק רצוף! אל תוותרו לעצמכם! ✨🧘‍♀️",
    proofImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    likes: 15,
    claps: 10,
    hasLiked: false,
    hasClapped: false,
    timestamp: "לפני יומיים",
    streak: 12,
    comments: []
  }
];

export const initialStories = [
  {
    id: "story_1",
    userId: "user_1",
    userName: "רועי כהן",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    slides: [
      {
        id: "slide_1_1",
        title: "ריצת 10 קילומטר",
        text: "מתחילים את הבוקר בריצה חזקה בפארק! 🏃‍♂️💪",
        image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&auto=format&fit=crop&q=80",
        timestamp: "לפני שעה"
      },
      {
        id: "slide_1_2",
        title: "הוכחה והישגים",
        text: "44:21 דקות. ה-XP שלי עולה! הצטרפו לאתגר שלי!",
        image: "https://images.unsplash.com/photo-1502224562085-639556652f33?w=600&auto=format&fit=crop&q=80",
        timestamp: "לפני שעה"
      }
    ]
  },
  {
    id: "story_2",
    userId: "user_2",
    userName: "יובל לוי",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    slides: [
      {
        id: "slide_2_1",
        title: "100 שכיבות סמיכה ברצף",
        text: "מתכונן לסט המושלם... הצלחתי! 💯",
        image: "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=600&auto=format&fit=crop&q=80",
        timestamp: "לפני 4 שעות"
      }
    ]
  },
  {
    id: "story_3",
    userId: "user_3",
    userName: "דניאל מזרחי",
    userAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
    slides: [
      {
        id: "slide_3_1",
        title: "טיפוס לחרמון",
        text: "הנוף פשוט משוגע מכאן למעלה 🏔️🦅",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
        timestamp: "לפני 5 שעות"
      }
    ]
  },
  {
    id: "story_4",
    userId: "user_4",
    userName: "שירה אלוני",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    slides: [
      {
        id: "slide_4_1",
        title: "30 ימי פלאנק",
        text: "יום 15 - כבר מרגישה את החוזק בליבה! 🧘‍♀️✨",
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
        timestamp: "לפני 8 שעות"
      }
    ]
  }
];

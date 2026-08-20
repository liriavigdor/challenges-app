import React, { useState, useEffect } from 'react';
import { 
  FireIcon, 
  TrophyIcon, 
  SwordsIcon, 
  MedalIcon, 
  UserIcon, 
  ActivityIcon, 
  PlusIcon, 
  HeartIcon, 
  CommentIcon, 
  CalendarIcon, 
  SearchIcon, 
  SunIcon, 
  MoonIcon,
  CameraIcon,
  CloseIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BellIcon,
  TargetIcon
} from './icons';
import { initialUsers, initialChallenges, initialFeed, initialStories, initialNotifications, initialMatches, initialArenas, initialGlobalTournament } from './mockData';
import AIRefereeCourt from './AIRefereeCourt';
import AvatarPodium from './AvatarPodium';



import { 
  getUsers, 
  updateUser, 
  getChallenges, 
  saveChallenge, 
  getFeed, 
  addFeedPost, 
  updateFeedPost 
} from './dbService';

const getPostVideo = (post) => {
  if (post.proofVideo) return post.proofVideo;
  const title = (post.challengeTitle || '').toLowerCase();
  if (title.includes('ריצ') || title.includes('מרתון') || title.includes('run')) {
    return 'https://assets.mixkit.co/videos/preview/mixkit-girl-doing-running-exercise-on-a-treadmill-40283-large.mp4';
  }
  if (title.includes('סמיכה') || title.includes('כוח') || title.includes('pushups')) {
    return 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-push-ups-in-a-park-41618-large.mp4';
  }
  if (title.includes('פלאנק') || title.includes('ליבה') || title.includes('plank')) {
    return 'https://assets.mixkit.co/videos/preview/mixkit-young-athletic-woman-doing-plank-exercise-43160-large.mp4';
  }
  return 'https://assets.mixkit.co/videos/preview/mixkit-hiking-in-the-snow-in-winter-41865-large.mp4';
};

const isUserGeneratedChallenge = (challenge) => {
  if (!challenge) return false;
  if (challenge.isUserGenerated !== undefined) return challenge.isUserGenerated;
  const systemCreators = [
    "Pulse Team",
    "התאחדות הטריאתלון",
    "מועצה אזורית עמק הירדן",
    "עיריית תל אביב",
    "רשות הטבע והגנים",
    "מועדון השחייה אילת",
    "סובב עמק",
    "אופני החרמון",
    "החברה להגנת הטבע",
    "מועדון ריצה רמון",
    "מועדון הולמס פלייס עזריאלי",
    "התאחדות הצלילה"
  ];
  return !systemCreators.includes(challenge.creator);
};

function ChallengeMap({ userCoords, mapLocations, selectedLocation, onSelectLocation, filteredChallenges, theme }) {
  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const markersRef = React.useRef([]);
  const userMarkerRef = React.useRef(null);
  const tileLayerRef = React.useRef(null);

  // 1. Initialize Map Instance Once
  React.useEffect(() => {
    if (!mapRef.current) return;

    const L = window.L;
    if (!L) return;

    const map = L.map(mapRef.current, {
      center: userCoords,
      zoom: 12,
      zoomControl: false
    });
    mapInstanceRef.current = map;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // User Location marker
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `<div class="user-pulse-marker"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    userMarkerRef.current = L.marker(userCoords, { icon: userIcon }).addTo(map).bindPopup('אתה כאן 📍');

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // 1.2 Reactively update map tile layer when theme changes
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = window.L;
    if (!L) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    // CARTO Voyager for Light mode, Dark Matter for Dark mode
    const tileUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);
  }, [theme]);

  // 1.5 Reactively update user position marker and center map when userCoords changes
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userCoords);
    }
    map.setView(userCoords, map.getZoom());
  }, [userCoords]);

  // 2. Reactively manage markers and selected state changes
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const L = window.L;
    if (!L) return;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    const bounds = [userCoords];

    // Add pins for challenges
    mapLocations.forEach((loc) => {
      const challengeObj = filteredChallenges.find(ch => ch.id === loc.challengeId);
      if (!challengeObj) return;

      const isSelected = selectedLocation?.id === loc.id;
      const isUserGen = isUserGeneratedChallenge(challengeObj);
      
      const pinIcon = L.divIcon({
        className: `custom-map-pin ${isSelected ? 'selected' : ''} ${isUserGen ? 'user-gen-pin' : ''}`,
        html: `<div class="pin-inner" style="font-size: ${isUserGen ? '18px' : '15px'}; display: flex; align-items: center; justify-content: center; height: 100%; width: 100%;">${isUserGen ? '⚔️' : '📍'}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: pinIcon }).addTo(map);
      markersRef.current.push(marker);
      bounds.push([loc.lat, loc.lng]);

      marker.on('click', () => {
        onSelectLocation(loc);
        map.setView([loc.lat, loc.lng], 13, { animate: true, duration: 0.8 });
      });
    });

    // Handle center/zoom view changes
    if (selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lng], 13, { animate: true });
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [mapLocations, filteredChallenges, selectedLocation]);

  return (
    <div 
      ref={mapRef} 
      id="leaflet-map-element"
      style={{ 
        width: '100%', 
        height: '100%', 
        borderRadius: '16px',
        background: '#121212'
      }} 
    />
  );
}

const getUserRank = (xp) => {
  if (xp >= 2200) return { name: 'Generalissimo', icon: '👑', className: 'rank-generalissimo', label: 'גנרליסימו' };
  if (xp >= 1500) return { name: 'Major', icon: '🌟', className: 'rank-major', label: 'מייג׳ור' };
  if (xp >= 1100) return { name: 'Sergeant', icon: '⚔️', className: 'rank-sergeant', label: 'סמל' };
  if (xp >= 900) return { name: 'Private', icon: '🎖️', className: 'rank-private', label: 'טוראי' };
  return { name: 'Recruit', icon: '🥾', className: 'rank-recruit', label: 'טירון' };
};

export default function App() {

  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('feed');
  const [matches, setMatches] = useState(initialMatches);
  const [activeJudgeMatchId, setActiveJudgeMatchId] = useState(null);
  const [arenas, setArenas] = useState(initialArenas);
  const [globalTournament, setGlobalTournament] = useState(initialGlobalTournament);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  const getCurrentArena = (trophies) => {
    return initialArenas.find(a => (trophies || 1000) >= a.minTrophies && (trophies || 1000) < a.maxTrophies) || initialArenas[initialArenas.length - 1];
  };


  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('challenges_language');
    return saved || 'he';
  });
  const [seenStoryIds, setSeenStoryIds] = useState(() => {
    const saved = localStorage.getItem('challenges_seen_stories');
    return saved ? JSON.parse(saved) : [];
  });
  const [creationStep, setCreationStep] = useState(1);

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'he' ? 'en' : 'he';
      localStorage.setItem('challenges_language', next);
      return next;
    });
  };

  const [users, setUsers] = useState(initialUsers);
  const [challenges, setChallenges] = useState(initialChallenges);
  const [feed, setFeed] = useState(initialFeed);
  const [stories, setStories] = useState(() => {
    const saved = localStorage.getItem('challenges_stories');
    return saved ? JSON.parse(saved) : initialStories;
  });

  // Chats & Messages states
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('challenges_chats');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "chat_general_1",
        name: "יובל לוי",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        type: "dm",
        messages: [
          { sender: "user_2", senderName: "יובל לוי", text: "אהלן רועי, ראיתי שהשלמת את הריצת 10 ק\"מ! קצב מעולה 💪", time: "18:02" },
          { sender: "user_1", senderName: "רועי כהן", text: "תודה רבה יובל! יום חזק. מתי אתה עושה את זה?", time: "18:04" }
        ],
        participants: ["user_1", "user_2"]
      },
      {
        id: "chat_general_2",
        name: "שירה אלוני",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
        type: "dm",
        messages: [
          { sender: "user_4", senderName: "שירה אלוני", text: "רועי, האם מתאים לך לעשות את אתגר הפלאנק השבוע?", time: "לפני יומיים" }
        ],
        participants: ["user_1", "user_4"]
      }
    ];
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatInputText, setChatInputText] = useState("");

  useEffect(() => {
    localStorage.setItem('challenges_chats', JSON.stringify(chats));
  }, [chats]);

  // Map & location challenges states
  const [challengesViewMode, setChallengesViewMode] = useState('challenges');
  const [selectedMapLocation, setSelectedMapLocation] = useState(null);
  const [userCoords, setUserCoords] = useState([32.0853, 34.7818]); // Default Tel Aviv

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log("Could not obtain user location: ", error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  const baseMapLocations = [
    {
      id: "loc_yarkon",
      name: "🌳 פארק הירקון, תל אביב",
      lat: 32.0991,
      lng: 34.8016,
      challengeId: "run_10k",
      description: "פארק הירקון מציע מסלולי ריצה פסטורליים לאורך הנחל. בצעו את הריצה כאן!"
    },
    {
      id: "loc_holmes",
      name: "🏋️‍♂️ מועדון הולמס פלייס עזריאלי",
      lat: 32.0780,
      lng: 34.7925,
      challengeId: "pushups_100",
      description: "אתגר שכיבות הסמיכה המושלם לביצוע בתוך המועדון הממוזג והמאובזר."
    },
    {
      id: "loc_beach",
      name: "🏖️ טיילת חוף גורדון",
      lat: 32.0754,
      lng: 34.7628,
      challengeId: "plank_30d",
      description: "החול החם והבריזה מהים יוצרים אתגר פלאנק מרענן במיוחד."
    },
    {
      id: "loc_hermon",
      name: "🏔️ הר החרמון",
      lat: 33.3146,
      lng: 35.7820,
      challengeId: "climb_mount",
      description: "ההר הגבוה במדינה. האתגר פעיל רק למי שמטפס בפועל ומגיע לפסגה."
    },
    {
      id: "loc_israman",
      name: "🏊‍♂️ טריאתלון ישראמן, אילת",
      lat: 29.5581,
      lng: 34.9482,
      challengeId: "israman_eilat",
      description: "מסלול הטריאתלון המאתגר בישראל. הירשמו והוכיחו הגעה וביצוע באילת."
    },
    {
      id: "loc_galilee",
      name: "🌊 חוף צמח, כנרת",
      lat: 32.7050,
      lng: 35.5900,
      challengeId: "galilee_swim",
      description: "נקודת ההזנקה הרשמית של צליחת הכנרת. שחו מכאן לכיוון עין גב."
    },
    {
      id: "loc_masada",
      name: "🏰 שביל הנחש, מצדה",
      lat: 31.3125,
      lng: 35.3620,
      challengeId: "masada_sunrise",
      description: "העפילו אל המבצר ההיסטורי דרך שביל הנחש לפנות בוקר והעלו הוכחה."
    },
    {
      id: "loc_sovev_emek",
      name: "🌲 משמר העמק, סובב עמק",
      lat: 32.5847,
      lng: 35.1378,
      challengeId: "sovev_emek_100",
      description: "מסלול האולטרה-מרתון המפורסם בישראל. הריצה מתבצעת בגבעות המנשה."
    },
    {
      id: "loc_hermon_cycle",
      name: "🚴‍♂️ מעלה מג'דל שמס, חרמון",
      lat: 33.2652,
      lng: 35.7725,
      challengeId: "hermon_cycle",
      description: "העלייה המפרכת לחרמון באופניים. הוכיחו את הטיפוס מנקודה זו."
    },
    {
      id: "loc_ramon",
      name: "🏜️ מכתש רמון, מצפה רמון",
      lat: 30.6120,
      lng: 34.8030,
      challengeId: "ramon_crater_run",
      description: "צאו לריצה מרהיבה ומאתגרת בנוף הירחי המדברי של מכתש רמון."
    },
    {
      id: "loc_freedive",
      name: "🐬 חוף האלמוגים, אילת",
      lat: 29.5100,
      lng: 34.9180,
      challengeId: "freedive_20m",
      description: "אתגר צלילה חופשית ל-20 מטרים במים העמוקים ליד חוף האלמוגים."
    }
  ];

  // Derive dynamic map locations from user-pinned challenges
  const mapLocations = React.useMemo(() => {
    const locations = [...baseMapLocations];
    challenges.forEach(c => {
      if (c.lat && c.lng && !locations.some(loc => loc.challengeId === c.id)) {
        locations.push({
          id: `loc_${c.id}`,
          name: c.locationName || `⚔️ ${c.title}`,
          lat: Number(c.lat),
          lng: Number(c.lng),
          challengeId: c.id,
          description: c.locationDescription || c.description
        });
      }
    });
    return locations;
  }, [challenges]);

  
  // Camera Story states
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraFilter, setCameraFilter] = useState('normal'); // 'normal', 'warm', 'cool', 'neon', 'retro'
  const [storyCaption, setStoryCaption] = useState('');
  const [storyTaggedChallenge, setStoryTaggedChallenge] = useState('');
  const [cameraFacingMode, setCameraFacingMode] = useState('user');
  const [isCameraFlashing, setIsCameraFlashing] = useState(false);

  // Stories active view states
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);

   useEffect(() => {
    localStorage.setItem('challenges_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    if (activeStoryIndex !== null) {
      const activeStory = stories[activeStoryIndex];
      if (activeStory && !seenStoryIds.includes(activeStory.id)) {
        const updated = [...seenStoryIds, activeStory.id];
        setSeenStoryIds(updated);
        localStorage.setItem('challenges_seen_stories', JSON.stringify(updated));
      }
    }
  }, [activeStoryIndex, stories, seenStoryIds]);

  // Reels interactive animation states
  const [doubleTapPostId, setDoubleTapPostId] = useState(null);
  const [commentSheetPostId, setCommentSheetPostId] = useState(null);
  
  const [currentUser, setCurrentUser] = useState(initialUsers[0]);

  const [dicebearStyle, setDicebearStyle] = useState('adventurer');
  const [dicebearSeed, setDicebearSeed] = useState('Roy');

  useEffect(() => {
    if (isEditingAvatar && currentUser && currentUser.avatar) {
      const url = currentUser.avatar;
      if (url.includes('dicebear.com')) {
        try {
          const parts = url.split('/9.x/');
          if (parts.length > 1) {
            const subparts = parts[1].split('/svg');
            const style = subparts[0];
            const urlObj = new URL(url);
            const seed = urlObj.searchParams.get('seed') || 'Roy';
            setDicebearStyle(style);
            setDicebearSeed(seed);
          }
        } catch (e) {
          console.error("Failed to parse dicebear URL:", e);
        }
      }
    }
  }, [isEditingAvatar, currentUser]);

  // Social & Notifications states
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('challenges_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteTargetUserId, setInviteTargetUserId] = useState(null);

  useEffect(() => {
    if (isUserModalOpen && selectedUserForModal && selectedUserForModal.id === currentUser.id) {
      setIsUserModalOpen(false);
      setActiveTab('profile');
    }
  }, [isUserModalOpen, selectedUserForModal, currentUser.id]);
  
  // Search and Explore States
  const [peopleSearchQuery, setPeopleSearchQuery] = useState('');
  const [selectedExplorePost, setSelectedExplorePost] = useState(null);
  const [exploreReelsStartIndex, setExploreReelsStartIndex] = useState(null);
  const [activeBadgeDetail, setActiveBadgeDetail] = useState(null);

  const handleRefereeVerdict = (matchId, winnerId, verdictText) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const updatedMatches = matches.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          status: 'completed',
          winnerId,
          verdict: verdictText
        };
      }
      return m;
    });
    setMatches(updatedMatches);

    if (winnerId && winnerId !== 'draw') {
      const staked = match.trophiesStaked;
      const loserId = winnerId === match.challengerId ? match.opponentId : match.challengerId;

      setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === winnerId) {
          const updated = { 
            ...u, 
            trophies: (u.trophies || 1000) + staked, 
            xp: u.xp + 150 
          };
          if (u.id === currentUser.id) {
            setCurrentUser(updated);
          }
          return updated;
        }
        if (u.id === loserId) {
          const updated = { 
            ...u, 
            trophies: Math.max(100, (u.trophies || 1000) - Math.round(staked * 0.7)),
            xp: Math.max(0, u.xp - 30)
          };
          if (u.id === currentUser.id) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      }));
    }

    setActiveJudgeMatchId(null);
  };

  const handleCreateDuel = (opponentId, challengeId, trophiesStaked) => {
    const ch = challenges.find(c => c.id === challengeId) || { title: "אתגר כושר" };
    const newMatch = {
      id: `match_${Date.now()}`,
      challengeId,
      challengeTitle: ch.title,
      challengerId: currentUser.id,
      opponentId,
      trophiesStaked: Number(trophiesStaked),
      status: "active",
      challengerProof: null,
      opponentProof: null,
      verdict: null,
      winnerId: null
    };

    setMatches([newMatch, ...matches]);
    
    const newNotif = {
      id: `notif_${Date.now()}`,
      type: "joint_challenge",
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: `הזמין אותך לדו-קרב ראש בראש: ${ch.title} על ${trophiesStaked} גביעים! ⚔️`,
      challengeId,
      timestamp: "לפני דקה",
      read: false,
      status: "pending"
    };
    setNotifications([newNotif, ...notifications]);
  };



  useEffect(() => {
    localStorage.setItem('challenges_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    async function loadData() {
      const dbUsers = await getUsers();
      const dbChallenges = await getChallenges();
      const dbFeed = await getFeed();
      
      setUsers(dbUsers);
      setChallenges(dbChallenges);
      setFeed(dbFeed);
      
      const foundUser = dbUsers.find(u => u.id === 'user_1') || dbUsers[0];
      setCurrentUser(foundUser);
    }
    loadData();
  }, []);

  // Camera WebRTC activation and controller
  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isCameraOpen, cameraFacingMode]);

  const startCamera = async () => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacingMode },
        audio: false
      });
      setCameraStream(stream);
    } catch (err) {
      console.warn("Could not access camera, using fallback/simulator:", err);
      setCameraStream(null);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    setIsCameraFlashing(true);
    setTimeout(() => setIsCameraFlashing(false), 200);

    if (cameraStream) {
      const video = document.getElementById('camera-video-feed');
      if (video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 1136;
        const ctx = canvas.getContext('2d');
        
        // Mirror front camera
        if (cameraFacingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Reset transformation
        if (cameraFacingMode === 'user') {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        return;
      }
    }
    
    // Premium Mockup Capture backgrounds
    const fallbacks = [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&auto=format&fit=crop&q=80"
    ];
    const randomImg = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    setCapturedImage(randomImg);
  };

  const handlePublishStory = () => {
    if (!capturedImage) return;

    const newSlide = {
      id: `slide_${Date.now()}`,
      title: storyTaggedChallenge || "אתגר כללי",
      text: storyCaption || "בדרך למטרה! 💪",
      image: capturedImage,
      timestamp: "כרגע"
    };

    setStories(prev => {
      const userStoryIdx = prev.findIndex(s => s.userId === currentUser.id);
      let updatedStories = [...prev];
      if (userStoryIdx !== -1) {
        updatedStories[userStoryIdx] = {
          ...updatedStories[userStoryIdx],
          slides: [newSlide, ...updatedStories[userStoryIdx].slides]
        };
      } else {
        updatedStories = [{
          id: `story_${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          slides: [newSlide]
        }, ...updatedStories];
      }
      return updatedStories;
    });

    setIsCameraOpen(false);
    setCapturedImage(null);
    setStoryCaption('');
    setStoryTaggedChallenge('');
    setCameraFilter('normal');
    alert("הסטורי פורסם בהצלחה! 🎉");
  };

  // Story auto-progress timer
  useEffect(() => {
    let timer;
    if (activeStoryIndex !== null) {
      timer = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
            handleNextSlide();
            return 0;
          }
          return prev + 2; // Auto advance in 5 seconds (100ms * 50 steps = 5000ms)
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [activeStoryIndex, activeSlideIndex]);

  const handleNextSlide = () => {
    if (activeStoryIndex === null) return;
    const currentStory = stories[activeStoryIndex];
    if (!currentStory) return;

    if (activeSlideIndex < currentStory.slides.length - 1) {
      setActiveSlideIndex(prev => prev + 1);
      setStoryProgress(0);
    } else {
      // Move to next user's story
      if (activeStoryIndex < stories.length - 1) {
        setActiveStoryIndex(prev => prev + 1);
        setActiveSlideIndex(0);
        setStoryProgress(0);
      } else {
        // Last user, last slide -> Close viewer
        setActiveStoryIndex(null);
        setActiveSlideIndex(0);
        setStoryProgress(0);
      }
    }
  };

  const handlePrevSlide = () => {
    if (activeStoryIndex === null) return;
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(prev => prev - 1);
      setStoryProgress(0);
    } else {
      // Go to previous user's story
      if (activeStoryIndex > 0) {
        const prevStory = stories[activeStoryIndex - 1];
        setActiveStoryIndex(prev => prev - 1);
        setActiveSlideIndex(prevStory.slides.length - 1);
        setStoryProgress(0);
      } else {
        // First slide of first user -> Close
        setActiveStoryIndex(null);
        setActiveSlideIndex(0);
        setStoryProgress(0);
      }
    }
  };

  const handleStoryJoinChallenge = (challengeTitle) => {
    const chal = challenges.find(c => c.title === challengeTitle || c.title.includes(challengeTitle));
    if (chal) {
      toggleJoinChallenge(chal.id);
      alert(`הצטרפת לאתגר: ${chal.title}! בהצלחה 💪`);
      setActiveStoryIndex(null);
      setActiveTab('challenges');
    } else {
      alert(`האתגר "${challengeTitle}" אינו זמין כעת להצטרפות.`);
    }
  };

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChallengeId, setExpandedChallengeId] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Form states for creating a new challenge
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [newChallengeDesc, setNewChallengeDesc] = useState('');
  const [newChallengeCategory, setNewChallengeCategory] = useState('כוח');
  const [newChallengeDifficulty, setNewChallengeDifficulty] = useState('קל');
  const [newChallengeXp, setNewChallengeXp] = useState(200);
  const [newChallengeProofText, setNewChallengeProofText] = useState('');
  const [newChallengeProofImage, setNewChallengeProofImage] = useState('');
  const [newChallengePinLocation, setNewChallengePinLocation] = useState(false);
  const [newChallengeLocationName, setNewChallengeLocationName] = useState('');
  const [newChallengeLat, setNewChallengeLat] = useState('');
  const [newChallengeLng, setNewChallengeLng] = useState('');
  const [newChallengeLocationDesc, setNewChallengeLocationDesc] = useState('');

  // Form states for completing a challenge (Proof upload simulation)
  const [proofChallengeId, setProofChallengeId] = useState('');
  const [proofText, setProofText] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [proofDifficultyGrade, setProofDifficultyGrade] = useState(3);

  // Comment input state
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleJoinChallengeChat = (challengeId, challengeTitle) => {
    const chatRoomId = `group_${challengeId}`;
    setChats(prev => {
      const exists = prev.find(c => c.id === chatRoomId);
      if (exists) {
        return prev.map(c => {
          if (c.id === chatRoomId) {
            const hasUser = c.participants.includes(currentUser.id);
            return {
              ...c,
              participants: hasUser ? c.participants : [...c.participants, currentUser.id]
            };
          }
          return c;
        });
      } else {
        const challenge = challenges.find(ch => ch.id === challengeId);
        const otherParticipants = users
          .filter(u => u.activeChallenges.includes(challengeId) && u.id !== currentUser.id)
          .map(u => u.id);

        const newGroupChat = {
          id: chatRoomId,
          name: `צ'אט אתגר: ${challengeTitle}`,
          avatar: challenge?.image || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=100&auto=format&fit=crop&q=80",
          type: "group",
          challengeId: challengeId,
          messages: [
            { sender: "system", senderName: "מערכת", text: `ברוכים הבאים לצ'אט הקבוצתי של האתגר: ${challengeTitle}! 🎉`, time: "כרגע" }
          ],
          participants: [currentUser.id, ...otherParticipants]
        };
        return [newGroupChat, ...prev];
      }
    });
    setActiveChatId(chatRoomId);
    setActiveTab('chats');
  };

  // Join or Leave a challenge
  const toggleJoinChallenge = async (challengeId) => {
    if (currentUser.isBlocked) {
      alert("חשבונך חסום. אינך יכול להצטרף לאתגרים.");
      return;
    }
    let updatedActiveChallenges;
    let joined = false;
    if (currentUser.activeChallenges.includes(challengeId)) {
      updatedActiveChallenges = currentUser.activeChallenges.filter(id => id !== challengeId);
    } else {
      updatedActiveChallenges = [...currentUser.activeChallenges, challengeId];
      joined = true;
    }
    
    const updatedUser = { ...currentUser, activeChallenges: updatedActiveChallenges };
    setCurrentUser(updatedUser);
    
    // Update in users list
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    await updateUser(updatedUser);

    if (joined) {
      const challenge = challenges.find(c => c.id === challengeId);
      const wantChat = window.confirm(`האם ברצונך להצטרף לצ'אט הקבוצתי של האתגר "${challenge?.title || ''}"?`);
      if (wantChat) {
        handleJoinChallengeChat(challengeId, challenge?.title);
      }
    }
  };


  // Follow/Unfollow a user
  const handleFollowUser = async (targetUserId) => {
    if (targetUserId === currentUser.id) return;
    
    let isFollowing = (currentUser.following || []).includes(targetUserId);
    let updatedFollowing;
    if (isFollowing) {
      updatedFollowing = (currentUser.following || []).filter(id => id !== targetUserId);
    } else {
      updatedFollowing = [...(currentUser.following || []), targetUserId];
    }

    const updatedCurrentUser = {
      ...currentUser,
      following: updatedFollowing
    };
    setCurrentUser(updatedCurrentUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedCurrentUser : u));
    await updateUser(updatedCurrentUser);

    // Update target user's followers
    setUsers(prev => prev.map(u => {
      if (u.id === targetUserId) {
        let updatedFollowers;
        if (isFollowing) {
          updatedFollowers = (u.followers || []).filter(id => id !== currentUser.id);
        } else {
          updatedFollowers = [...(u.followers || []), currentUser.id];
          
          // Send notification
          const newNotif = {
            id: `notif_${Date.now()}`,
            type: "follow",
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            text: "התחיל לעקוב אחריך",
            timestamp: "כרגע",
            read: false
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
        }
        const updatedTarget = { ...u, followers: updatedFollowers };
        updateUser(updatedTarget);
        
        // If showing in modal, update it
        if (selectedUserForModal && selectedUserForModal.id === targetUserId) {
          setSelectedUserForModal(updatedTarget);
        }
        return updatedTarget;
      }
      return u;
    }));
  };

  // Send a joint challenge invite
  const handleSendJointChallenge = (targetUserId, challengeId) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    // Send invite notice
    const newNotif = {
      id: `notif_${Date.now()}`,
      type: "joint_challenge",
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: `הזמין אותך לאתגר משותף: ${challenge.title}`,
      challengeId: challengeId,
      timestamp: "כרגע",
      read: false,
      status: "pending"
    };

    setNotifications(prev => [newNotif, ...prev]);
    alert("ההזמנה לאתגר המשותף נשלחה בהצלחה! ✉️");
    setIsInviteModalOpen(false);
  };

  // Accept a joint challenge
  const handleAcceptJointChallenge = async (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, status: 'accepted' } : n));
    
    if (!currentUser.activeChallenges.includes(notif.challengeId)) {
      const updatedUser = {
        ...currentUser,
        activeChallenges: [...currentUser.activeChallenges, notif.challengeId]
      };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      await updateUser(updatedUser);
    }
    
    alert(`הסכמת לאתגר המשותף! האתגר נוסף לרשימה שלך. 💪`);
  };

  // Decline a joint challenge
  const handleDeclineJointChallenge = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, status: 'declined' } : n));
  };

  // Like a post on the feed
  const handleLikePost = (postId) => {
    if (currentUser.isBlocked) {
      alert("חשבונך חסום. אינך יכול לבצע פעולות.");
      return;
    }
    setFeed(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked
        };
      }
      return post;
    }));
  };

  // Double tap to clap/fire with animation trigger
  const handleDoubleTapPost = (postId) => {
    if (currentUser.isBlocked) return;
    
    // Trigger pop animation
    setDoubleTapPostId(postId);
    setTimeout(() => setDoubleTapPostId(null), 800);

    // Perform clap if not already clapped
    setFeed(prev => prev.map(post => {
      if (post.id === postId && !post.hasClapped) {
        return {
          ...post,
          claps: post.claps + 1,
          hasClapped: true
        };
      }
      return post;
    }));
  };

  // Clap/Fire a post
  const handleClapPost = (postId) => {
    if (currentUser.isBlocked) {
      alert("חשבונך חסום. אינך יכול לבצע פעולות.");
      return;
    }
    setFeed(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          claps: post.hasClapped ? post.claps - 1 : post.claps + 1,
          hasClapped: !post.hasClapped
        };
      }
      return post;
    }));
  };

  // Post a comment
  const handleAddComment = async (postId) => {
    if (currentUser.isBlocked) {
      alert("חשבונך חסום. אינך יכול להגיב.");
      return;
    }
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    let updatedPost;
    setFeed(prev => prev.map(post => {
      if (post.id === postId) {
        updatedPost = {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `c_${Date.now()}`,
              userName: currentUser.name,
              text: text
            }
          ]
        };
        return updatedPost;
      }
      return post;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    if (updatedPost) {
      await updateFeedPost(updatedPost);
    }
  };

  // Report a false completion post
  const handleReportPost = async (postId) => {
    if (currentUser.isBlocked) {
      alert("חשבונך חסום. אינך יכול לדווח.");
      return;
    }

    let authorId;
    let alreadyReported = false;

    setFeed(prev => prev.map(post => {
      if (post.id === postId) {
        authorId = post.userId;
        const reports = post.reports || [];
        if (reports.includes(currentUser.id)) {
          alreadyReported = true;
          return post;
        }
        return {
          ...post,
          reports: [...reports, currentUser.id]
        };
      }
      return post;
    }));

    if (alreadyReported) {
      alert("כבר דיווחת על פוסט זה בעבר.");
      return;
    }

    if (authorId) {
      const author = users.find(u => u.id === authorId);
      if (author) {
        const newReportsCount = (author.reportsCount || 0) + 1;
        const shouldBlock = newReportsCount >= 3;
        const updatedAuthor = {
          ...author,
          reportsCount: newReportsCount,
          isBlocked: shouldBlock || author.isBlocked
        };

        // Update in users list
        setUsers(prev => prev.map(u => u.id === authorId ? updatedAuthor : u));
        await updateUser(updatedAuthor);

        // If reporting oneself or simulated active user
        if (authorId === currentUser.id) {
          setCurrentUser(updatedAuthor);
        }

        if (shouldBlock) {
          alert(`דיווחת בהצלחה. המשתמש ${author.name} נחסם כעת עקב דיווחים מרובים על שקרים!`);
        } else {
          alert("הדיווח התקבל בהצלחה. תודה על השמירה על אמינות הקהילה!");
        }
      }
    }
  };

  // Create a new Challenge
  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    if (currentUser.isBlocked) {
      alert("חשבונך חסום. אינך יכול ליצור אתגרים חדשים.");
      return;
    }
    if (!newChallengeTitle.trim() || !newChallengeProofText.trim()) {
      alert("יש למלא את פרטי האתגר ואת הוכחת הביצוע שלך.");
      return;
    }

    const challengeId = `challenge_${Date.now()}`;
    const newChallenge = {
      id: challengeId,
      title: newChallengeTitle,
      description: newChallengeDesc,
      category: newChallengeCategory,
      difficulty: newChallengeDifficulty,
      xpReward: Number(newChallengeXp),
      participantsCount: 1,
      duration: "חד פעמי",
      creator: currentUser.name,
      isUserGenerated: true,
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      difficultyGrades: [newChallengeDifficulty === 'קל' ? 1 : newChallengeDifficulty === 'בינוני' ? 3 : newChallengeDifficulty === 'קשה' ? 4 : 5],
      isIconic: false,
      ...(newChallengePinLocation && newChallengeLat && newChallengeLng ? {
        lat: Number(newChallengeLat),
        lng: Number(newChallengeLng),
        locationName: newChallengeLocationName || `מיקום: ${newChallengeTitle}`,
        locationDescription: newChallengeLocationDesc || newChallengeDesc
      } : {})
    };

    // Auto-completion feed post (since they must complete it to share it)
    const newFeedItem = {
      id: `feed_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      challengeTitle: newChallengeTitle,
      achievementDetail: newChallengeProofText,
      proofImage: newChallengeProofImage || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
      likes: 0,
      claps: 0,
      hasLiked: false,
      hasClapped: false,
      timestamp: "כרגע",
      comments: [],
      reports: []
    };

    // Calculate dynamic XP reward with multiplier
    const diff = newChallengeDifficulty;
    const multiplier = diff === 'בינוני' ? 1.2 : diff === 'קשה' ? 1.5 : diff === 'קשה מאוד' ? 2.0 : 1.0;
    const finalXpReward = Math.round(Number(newChallengeXp) * multiplier);

    const isHard = ['קשה', 'קשה מאוד'].includes(newChallengeDifficulty);

    const updatedXp = currentUser.xp + finalXpReward;
    const updatedCompletedCount = currentUser.completedChallengesCount + 1;
    const updatedHardCount = isHard ? (currentUser.hardChallengesCompleted || 0) + 1 : (currentUser.hardChallengesCompleted || 0);

    const updatedUser = {
      ...currentUser,
      xp: updatedXp,
      completedChallengesCount: updatedCompletedCount,
      hardChallengesCompleted: updatedHardCount
    };

    setChallenges(prev => [newChallenge, ...prev]);
    await saveChallenge(newChallenge);

    setFeed(prev => [newFeedItem, ...prev]);
    await addFeedPost(newFeedItem);

    setCurrentUser(updatedUser);
    setUsers(prev => {
      const unsorted = prev.map(u => u.id === currentUser.id ? updatedUser : u);
      return unsorted.sort((a, b) => b.xp - a.xp).map((u, index) => ({ ...u, rank: index + 1 }));
    });
    await updateUser(updatedUser);

    // Notify followers
    const newNotif = {
      id: `notif_${Date.now()}`,
      type: "new_challenge",
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: `העלה אתגר חדש: ${newChallengeTitle}`,
      challengeId: challengeId,
      timestamp: "כרגע",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Reset inputs & Go to Challenges Tab
    setNewChallengeTitle('');
    setNewChallengeDesc('');
    setNewChallengeProofText('');
    setNewChallengeProofImage('');
    setNewChallengePinLocation(false);
    setNewChallengeLocationName('');
    setNewChallengeLat('');
    setNewChallengeLng('');
    setNewChallengeLocationDesc('');
    setCreationStep(1);
    setActiveTab('challenges');
  };

  // Submit proof and complete a challenge
  const handleCompleteChallenge = async (e) => {
    e.preventDefault();
    if (currentUser.isBlocked) {
      alert("חשבונך חסום. אינך יכול לבצע אתגרים.");
      return;
    }
    if (!proofChallengeId) return;

    const challenge = challenges.find(c => c.id === proofChallengeId);
    if (!challenge) return;

    // 1. Update difficulty grades of the challenge
    const updatedGrades = [...(challenge.difficultyGrades || []), Number(proofDifficultyGrade)];
    const updatedChallenge = {
      ...challenge,
      difficultyGrades: updatedGrades
    };
    
    setChallenges(prev => prev.map(c => c.id === challenge.id ? updatedChallenge : c));
    await saveChallenge(updatedChallenge);

    // 2. Create a new Feed post
    const newFeedItem = {
      id: `feed_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      challengeTitle: challenge.title,
      achievementDetail: proofText || `השלמתי את האתגר "${challenge.title}" בהצלחה! 💪`,
      proofImage: proofImage || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
      likes: 0,
      claps: 0,
      hasLiked: false,
      hasClapped: false,
      timestamp: "כרגע",
      comments: [],
      reports: []
    };

    setFeed(prev => [newFeedItem, ...prev]);
    await addFeedPost(newFeedItem);

    // 3. Reward XP with multiplier based on difficulty
    const diff = challenge.difficulty;
    const multiplier = diff === 'בינוני' ? 1.2 : diff === 'קשה' ? 1.5 : diff === 'קשה מאוד' ? 2.0 : 1.0;
    const finalXpReward = Math.round(challenge.xpReward * multiplier);

    // 4. Iconic badge check
    let updatedBadges = [...(currentUser.badges || [])];
    if (challenge.isIconic && challenge.badgeReward && !updatedBadges.includes(challenge.badgeReward)) {
      updatedBadges.push(challenge.badgeReward);
      alert(`מזל טוב! קיבלת תג מיוחד: ${challenge.badgeReward}`);
    }

    const isHard = ['קשה', 'קשה מאוד'].includes(challenge.difficulty);
    const updatedXp = currentUser.xp + finalXpReward;
    const updatedCompletedCount = currentUser.completedChallengesCount + 1;
    const updatedActiveChallenges = currentUser.activeChallenges.filter(id => id !== challenge.id);
    const updatedHardCount = isHard ? (currentUser.hardChallengesCompleted || 0) + 1 : (currentUser.hardChallengesCompleted || 0);

    const updatedUser = {
      ...currentUser,
      xp: updatedXp,
      completedChallengesCount: updatedCompletedCount,
      activeChallenges: updatedActiveChallenges,
      badges: updatedBadges,
      hardChallengesCompleted: updatedHardCount
    };

    setCurrentUser(updatedUser);
    await updateUser(updatedUser);
    
    // Update users list and sort by rank
    setUsers(prev => {
      const unsorted = prev.map(u => u.id === currentUser.id ? updatedUser : u);
      return unsorted.sort((a, b) => b.xp - a.xp).map((u, index) => ({ ...u, rank: index + 1 }));
    });

    // Reset proof form
    setProofChallengeId('');
    setProofText('');
    setProofImage('');
    setProofDifficultyGrade(3);
    setActiveTab('feed');
  };

  // Star filter state
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  // Filter categories helper
  const categories = ['הכל', 'כוח', 'אירובי', 'ליבה', 'שטח'];
  const filteredChallenges = challenges.filter(c => {
    const matchesCategory = selectedCategory === 'הכל' || c.category === selectedCategory;
    const matchesSearch = c.title.includes(searchQuery) || c.description.includes(searchQuery);
    
    if (challengesViewMode === 'iconic') {
      return matchesCategory && matchesSearch && c.isIconic;
    } else if (challengesViewMode === 'challenges') {
      return matchesCategory && matchesSearch && !c.isIconic;
    }
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, padding: '0.75rem 1.5rem', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--glass-border)' }}>
        {/* Left side: Symbol & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 10 }}>
          <div 
            onClick={() => {
              setActiveTab('notifications');
              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            }}
            style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}
            title="התראות"
          >
            <ActivityIcon className="logo-icon" size={26} style={{ color: 'var(--accent)' }} />
            {notifications.some(n => !n.read) && (
              <span className="notification-dot" style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: '#ff4d4d', borderRadius: '50%' }}></span>
            )}
          </div>
          <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%', border: 'none', background: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title={theme === 'light' ? "מצב כהה" : "מצב בהיר"}>
            {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </button>
          <button onClick={toggleLanguage} className="btn btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold' }} title="שנה שפה / Change Language">
            {language === 'he' ? '🇺🇸 EN' : '🇮🇱 HE'}
          </button>
        </div>

        {/* Middle: Name (centered) */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <span className="logo-text">Pulse</span>
        </div>

        {/* Right side: Add button or user info (when not on feed) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 10 }}>
          {activeTab === 'feed' ? (
            <button 
              onClick={() => setActiveTab('create')} 
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '2rem',
                fontWeight: '300',
                cursor: 'pointer',
                padding: '0 0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1
              }}
              title="צור אתגר חדש"
            >
              +
            </button>
          ) : (
            <div className="user-info" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setActiveTab('profile')}>
              <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" style={{ width: 28, height: 28, borderRadius: '50%' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{currentUser.name}</span>
            </div>
          )}
        </div>
      </header>

      {/* CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: activeTab === 'feed' ? 'hidden' : 'auto', padding: activeTab === 'feed' ? '0' : '1rem 1.5rem' }}>
        
        {currentUser.isBlocked && (
          <div className="glass-card" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '1rem', margin: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff4d4d' }}>
            <span>⛔</span>
            <span style={{ fontWeight: 'bold' }}>החשבון שלך חסום לצמיתות עקב דיווחים מהקהילה על דיווח שקרי. חלק מהפעולות מוגבלות.</span>
          </div>
        )}
        
        {/* TAB: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem 0', width: '100%', direction: 'rtl' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <button 
                onClick={() => setActiveTab('feed')} 
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
              >
                ← חזרה לפיד
              </button>
              <h2 style={{ fontWeight: 800, margin: 0, fontSize: '1.5rem', flex: 1, textAlign: 'right' }}>התראות 🔔</h2>
            </div>

            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>אין התראות חדשות. כשתקבל לייקים, תגובות או עוקבים הם יופיעו כאן!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`glass-card notif-item ${!n.read ? 'unread' : ''}`}
                    style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      padding: '1rem', 
                      borderRadius: '12px', 
                      alignItems: 'center', 
                      border: '1px solid var(--glass-border)',
                      background: !n.read ? 'rgba(168, 85, 247, 0.08)' : 'var(--glass-bg)',
                      boxShadow: 'var(--shadow)',
                      direction: 'rtl',
                      textAlign: 'right'
                    }}
                  >
                    <img 
                      src={n.senderAvatar} 
                      alt="" 
                      className="notif-avatar" 
                      onClick={() => {
                        const targetUsr = users.find(u => u.id === n.senderId);
                        if (targetUsr) {
                          setSelectedUserForModal(targetUsr);
                          setIsUserModalOpen(true);
                        }
                      }}
                      style={{ cursor: 'pointer', width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div className="notif-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ fontSize: '0.9rem' }}>
                        <strong 
                          style={{ cursor: 'pointer', color: 'var(--accent)' }}
                          onClick={() => {
                            const targetUsr = users.find(u => u.id === n.senderId);
                            if (targetUsr) {
                              setSelectedUserForModal(targetUsr);
                              setIsUserModalOpen(true);
                            }
                          }}
                        >
                          {n.senderName}
                        </strong>{' '}
                        {n.text}
                      </div>
                      <span className="notif-time" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                      
                      {n.type === 'joint_challenge' && (
                        <div className="notif-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {n.status === 'pending' ? (
                            <>
                              <button 
                                className="btn btn-primary" 
                                style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: 'var(--success)', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                onClick={() => handleAcceptJointChallenge(n)}
                              >
                                אשר 👍
                              </button>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}
                                onClick={() => handleDeclineJointChallenge(n.id)}
                              >
                                סרב ✖
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: n.status === 'accepted' ? 'var(--success)' : 'var(--text-muted)', fontWeight: 'bold' }}>
                              {n.status === 'accepted' ? 'התקבל ✓' : 'סורב'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: FEED */}
        {activeTab === 'feed' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            {/* Instagram-style Stories Slider */}
            <div className="stories-wrapper" style={{ flexShrink: 0 }}>
              <div className="stories-container">
                {/* User's own active challenge indicator / Create shortcut */}
                <div className="story-circle" onClick={() => {
                  if (currentUser.isBlocked) {
                    alert("חשבונך חסום. אינך יכול להעלות סטורי.");
                    return;
                  }
                  setIsCameraOpen(true);
                }}>
                  <div className="story-avatar-wrapper user-has-none">
                    <img src={currentUser.avatar} alt="You" className="story-avatar-img" />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold', border: '2px solid var(--bg-secondary)' }}>+</div>
                  </div>
                  <span className="story-username">הסטורי שלי</span>
                </div>

                {/* Other users' stories */}
                {stories.map((story, index) => {
                  const isSeen = seenStoryIds.includes(story.id);
                  return (
                    <div key={story.id} className="story-circle" onClick={() => {
                      setActiveStoryIndex(index);
                      setActiveSlideIndex(0);
                      setStoryProgress(0);
                    }}>
                      <div className={`story-avatar-wrapper ${isSeen ? 'viewed' : ''}`}>
                        <img src={story.userAvatar} alt={story.userName} className="story-avatar-img" />
                      </div>
                      <span className="story-username">{story.userName}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reels-style swiping container */}
            <div className="reels-feed-container" style={{ flex: 1, minHeight: 0 }}>
              {feed.map(post => {
                const postAuthor = users.find(u => u.id === post.userId);
                const isAuthorBlocked = postAuthor ? postAuthor.isBlocked : false;
                const associatedChallenge = challenges.find(c => c.title === post.challengeTitle);
                const isJoinedChallenge = currentUser.activeChallenges.includes(associatedChallenge?.id);

                return (
                  <div 
                    key={post.id} 
                    className="reel-card"
                    onDoubleClick={() => handleDoubleTapPost(post.id)}
                  >
                    {/* Background visual */}
                    {post.proofImage && (
                      <img src={post.proofImage} alt="הישג" className="reel-bg-image" />
                    )}

                    {/* Gradient Overlay for text contrast */}
                    <div className="reel-overlay-gradient"></div>

                    {/* Double-tap Floating Fire pop animation */}
                    {doubleTapPostId === post.id && (
                      <div className="double-tap-fire-anim">
                        <FireIcon size={80} fill="currentColor" />
                      </div>
                    )}

                    {/* Left vertical actions column (Instagram Reels layout) */}
                    <div className="reel-actions-column">
                      {/* Claps */}
                      <div className="reel-action-btn-wrapper" onClick={() => handleClapPost(post.id)}>
                        <div className={`reel-action-circle ${post.hasClapped ? 'active-clap' : ''}`}>
                          <FireIcon size={24} fill={post.hasClapped ? "currentColor" : "none"} />
                        </div>
                        <span className="reel-action-text">{post.claps}</span>
                      </div>

                      {/* Comments Sheet Trigger */}
                      <div className="reel-action-btn-wrapper" onClick={() => setCommentSheetPostId(post.id)}>
                        <div className="reel-action-circle">
                          <CommentIcon size={24} />
                        </div>
                        <span className="reel-action-text">{post.comments ? post.comments.length : 0}</span>
                      </div>

                      {/* Addictive Call to Action: "Join/Challenge myself too!" */}
                      {associatedChallenge && (
                        <div className="reel-action-btn-wrapper" onClick={() => {
                          toggleJoinChallenge(associatedChallenge.id);
                          if (!isJoinedChallenge) {
                            alert(`💪 הצטרפת לאתגר: ${associatedChallenge.title}! צבור גביעים עכשיו! 🏆`);
                          }
                        }}>
                          <div className="reel-action-circle" style={{ color: isJoinedChallenge ? 'var(--success)' : 'var(--accent)' }}>
                          <SwordsIcon size={22} />
                          </div>
                          <span className="reel-action-text" style={{ fontSize: '0.65rem' }}>{isJoinedChallenge ? 'משתתף' : 'אתגר אותי'}</span>
                        </div>
                      )}
                    </div>

                    {/* Reel text information overlay */}
                    <div className="reel-info-container">
                      <div className="reel-author-row" style={{ cursor: 'pointer' }} onClick={() => {
                        const targetUsr = users.find(u => u.id === post.userId) || users.find(u => u.name === post.userName);
                        if (targetUsr) {
                          setSelectedUserForModal(targetUsr);
                          setIsUserModalOpen(true);
                        }
                      }}>
                        <img src={post.userAvatar} alt={post.userName} className="reel-author-avatar" />
                        <span className="reel-author-name">{post.userName}</span>
                        {isAuthorBlocked && (
                          <span style={{ background: '#ff4d4d', color: '#fff', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>חסום ⛔</span>
                        )}
                        <span className="reel-streak-tag">
                          🔥 רצף {post.streak || 5} ימים
                        </span>
                      </div>

                      <div className="reel-challenge-tag">
                        🏆 {post.challengeTitle}
                      </div>

                      <div className="reel-desc">
                        {post.achievementDetail}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CHALLENGES */}
        {activeTab === 'challenges' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 800 }}>אתגרים פתוחים 💪</h2>
              <button onClick={() => setActiveTab('create')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <PlusIcon size={18} /> יוזמה חדשה
              </button>
            </div>

            {/* Filters toggle button row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
              <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                style={{
                  background: isFiltersOpen ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: isFiltersOpen ? '#000' : 'var(--text-primary)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '24px',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.25s ease',
                  boxShadow: isFiltersOpen ? '0 4px 12px var(--accent-glow)' : 'var(--shadow-sm)'
                }}
              >
                <span>🔍 מסננים</span>
                <span style={{ fontSize: '0.75rem' }}>{isFiltersOpen ? '▲' : '▼'}</span>
              </button>

              {(selectedCategory !== 'הכל' || searchQuery !== '') && (
                <button
                  onClick={() => {
                    setSelectedCategory('הכל');
                    setSearchQuery('');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent)',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    padding: '0.25rem 0.5rem'
                  }}
                >
                  נקה הכל ✕
                </button>
              )}
            </div>

            {/* Dropdown Filter Panel */}
            {isFiltersOpen && (
              <div 
                className="filters-glass-panel"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  animation: 'modal-pop-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                {/* Search Bar */}
                <div className="search-bar-wrapper" style={{ display: 'flex', gap: '0.5rem' }}>
                  <div className="search-input-container" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', borderRadius: '30px', padding: '0.25rem 0.75rem', border: '1px solid var(--border)' }}>
                    <SearchIcon size={18} style={{ color: 'var(--text-muted)', marginLeft: '0.5rem', marginRight: '0.25rem' }} />
                    <input 
                      type="text" 
                      className="search-input-clean" 
                      placeholder="חפשו לפי שם, קושי או תיאור..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        padding: '0.4rem 0.25rem',
                        direction: 'rtl'
                      }}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="category-filter" style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                  {categories.map(cat => {
                    let emoji = '';
                    if (cat === 'הכל') emoji = '🌟';
                    if (cat === 'כוח') emoji = '💪';
                    if (cat === 'אירובי') emoji = '🏃‍♂️';
                    if (cat === 'שטח') emoji = '🏕️';
                    if (cat === 'ליבה') emoji = '🧘';
                    
                    return (
                      <button 
                        key={cat} 
                        className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.4rem 1rem',
                          borderRadius: '30px',
                          border: selectedCategory === cat ? 'none' : '1px solid var(--border)',
                          background: selectedCategory === cat ? 'var(--accent)' : 'var(--bg-tertiary)',
                          color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span>{emoji}</span> {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Segmented View Toggle (Map / Challenges / Iconic) */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <div className="view-toggle-container" style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: '30px', padding: '0.25rem', border: '1px solid var(--border)', width: '100%', maxWidth: '480px' }}>
                <button 
                  onClick={() => setChallengesViewMode('map')} 
                  className={`toggle-btn ${challengesViewMode === 'map' ? 'active' : ''}`}
                  style={{ 
                    flex: 1,
                    padding: '0.45rem 0.5rem', 
                    borderRadius: '30px', 
                    border: 'none', 
                    background: challengesViewMode === 'map' ? 'var(--accent)' : 'transparent', 
                    color: challengesViewMode === 'map' ? '#fff' : 'var(--text-secondary)', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    boxShadow: challengesViewMode === 'map' ? '0 2px 8px var(--accent-glow)' : 'none',
                    fontSize: '0.8rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}
                >
                  🗺️ מפה
                </button>
                <button 
                  onClick={() => setChallengesViewMode('challenges')} 
                  className={`toggle-btn ${challengesViewMode === 'challenges' ? 'active' : ''}`}
                  style={{ 
                    flex: 1,
                    padding: '0.45rem 0.5rem', 
                    borderRadius: '30px', 
                    border: 'none', 
                    background: challengesViewMode === 'challenges' ? 'var(--accent)' : 'transparent', 
                    color: challengesViewMode === 'challenges' ? '#fff' : 'var(--text-secondary)', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    boxShadow: challengesViewMode === 'challenges' ? '0 2px 8px var(--accent-glow)' : 'none',
                    fontSize: '0.8rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}
                >
                  📋 אתגרים
                </button>
                <button 
                  onClick={() => setChallengesViewMode('iconic')} 
                  className={`toggle-btn ${challengesViewMode === 'iconic' ? 'active' : ''}`}
                  style={{ 
                    flex: 1,
                    padding: '0.45rem 0.5rem', 
                    borderRadius: '30px', 
                    border: 'none', 
                    background: challengesViewMode === 'iconic' ? 'var(--accent)' : 'transparent', 
                    color: challengesViewMode === 'iconic' ? '#fff' : 'var(--text-secondary)', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    boxShadow: challengesViewMode === 'iconic' ? '0 2px 8px var(--accent-glow)' : 'none',
                    fontSize: '0.8rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}
                >
                  👑 אייקוניים
                </button>
                <button 
                  onClick={() => setChallengesViewMode('duels')} 
                  className={`toggle-btn ${challengesViewMode === 'duels' ? 'active' : ''}`}
                  style={{ 
                    flex: 1,
                    padding: '0.45rem 0.5rem', 
                    borderRadius: '30px', 
                    border: 'none', 
                    background: challengesViewMode === 'duels' ? 'var(--accent)' : 'transparent', 
                    color: challengesViewMode === 'duels' ? '#fff' : 'var(--text-secondary)', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    boxShadow: challengesViewMode === 'duels' ? '0 2px 8px var(--accent-glow)' : 'none',
                    fontSize: '0.8rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}
                >
                  ⚔️ דו-קרב
                </button>
              </div>
            </div>

            {challengesViewMode === 'challenges' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', direction: 'rtl', textAlign: 'right' }}>
                
                {/* 1. Clash-Style Trophy Road */}
                {(() => {
                  const currentArena = getCurrentArena(currentUser.trophies);
                  return (
                    <div className="trophy-road-wrapper">
                      <div className="trophy-road-header">
                        <div>
                          <h3 style={{ margin: 0, fontWeight: 900, color: '#fbbf24', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>🛣️ דרך הגביעים (Trophy Road)</h3>
                          <span style={{ fontSize: '0.75rem', opacity: 0.8, color: '#fff' }}>התקדמו בארנות על ידי השלמת אתגרים וצבירת גביעים!</span>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.4rem 0.8rem', borderRadius: '12px', border: '1px solid rgba(251,191,36,0.3)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '1.1rem' }}>🏆</span>
                          <strong style={{ fontSize: '0.9rem', color: '#ffd700' }}>{currentUser.trophies || 1000}</strong>
                        </div>
                      </div>

                      <div className="trophy-road-scroll">
                        <div className="trophy-road-path-line" />
                        
                        {arenas.map((arena, idx) => {
                          const isActive = currentArena.id === arena.id;
                          const isPast = currentUser.trophies >= arena.maxTrophies;
                          const isLocked = currentUser.trophies < arena.minTrophies;
                          
                          let nodeClass = 'arena-milestone-node';
                          let statusText = '🔒 נעול';
                          let borderAccent = 'rgba(255,255,255,0.1)';
                          let nodeGlow = 'none';

                          if (isActive) {
                            nodeClass += ' node-active';
                            statusText = '⚔️ זירה פעילה';
                            borderAccent = '#ffd700';
                            nodeGlow = '0 0 15px rgba(251, 191, 36, 0.3)';
                          } else if (isPast) {
                            statusText = '✅ הושלם';
                            borderAccent = '#10b981';
                          } else {
                            nodeClass += ' node-locked';
                          }

                          let arenaEmoji = '🌳';
                          if (arena.id === 'arena_2') arenaEmoji = '🏖️';
                          if (arena.id === 'arena_3') arenaEmoji = '🏔️';

                          return (
                            <div 
                              key={arena.id} 
                              className={nodeClass}
                              style={{ 
                                borderColor: borderAccent,
                                boxShadow: nodeGlow
                              }}
                            >
                              <div className="arena-node-header">
                                <span>{isActive ? '🌟' : ''}</span>
                                <span>{arena.id === 'arena_3' ? 'ARENA 3' : arena.id === 'arena_2' ? 'ARENA 2' : 'ARENA 1'}</span>
                                <span>{isActive ? '🌟' : ''}</span>
                              </div>

                              <div className="arena-node-icon">{arenaEmoji}</div>
                              <h4 style={{ margin: '0.2rem 0', fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{arena.name.replace(/🌳|🏖|🏔️|🌴/g, '')}</h4>
                              <div style={{ fontSize: '0.75rem', opacity: 0.8, color: '#94a3b8', margin: '0.25rem 0' }}>{statusText}</div>

                              <div className="arena-node-trophies">
                                <span>🏆 {arena.minTrophies}</span>
                                {arena.maxTrophies < 9000 && <span>- {arena.maxTrophies}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* 2. Main Game Mode Buttons */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => setChallengesViewMode('duels')}
                    className="btn"
                    style={{ 
                      flex: 1, 
                      padding: '1.25rem 1rem', 
                      background: 'linear-gradient(135deg, #ef4444, #b91c1c)', 
                      color: '#fff', 
                      borderRadius: '16px', 
                      border: 'none', 
                      fontWeight: 'bold', 
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span style={{ fontSize: '1.8rem' }}>⚔️</span>
                    <strong style={{ fontSize: '1rem' }}>דו-קרב חברים</strong>
                    <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>שחק על גביעים מול חברים</span>
                  </button>

                  <button 
                    onClick={() => {
                      alert(`הרשמה לטורניר: "${globalTournament.title}"\n\n${globalTournament.description}\n\nהקלט פעילות ריצה כדי להיכנס אוטומטית ללובי!`);
                    }}
                    className="btn"
                    style={{ 
                      flex: 1, 
                      padding: '1.25rem 1rem', 
                      background: 'linear-gradient(135deg, #a855f7, #6b21a8)', 
                      color: '#fff', 
                      borderRadius: '16px', 
                      border: 'none', 
                      fontWeight: 'bold', 
                      boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span style={{ fontSize: '1.8rem' }}>🏆</span>
                    <strong style={{ fontSize: '1rem' }}>טורניר שבועי</strong>
                    <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>{globalTournament.timeLeft}</span>
                  </button>
                </div>

                {/* 3. My active Challenge Deck */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontWeight: 800, margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>🃏 חפיסת האתגרים שלי (Active Deck)</h3>
                    <button 
                      onClick={() => setChallengesViewMode('iconic')}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      + הוסף אתגר
                    </button>
                  </div>


                  {currentUser.activeChallenges.length === 0 ? (
                    <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--border)' }}>
                      <p style={{ color: 'var(--text-secondary)', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>אין לך אתגרים פעילים בחפיסה כרגע.</p>
                      <button 
                        onClick={() => setChallengesViewMode('iconic')} 
                        className="btn btn-primary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                      >
                        עיין באתגרים אייקוניים 👑
                      </button>
                    </div>
                  ) : (
                    <div className="clash-battle-deck">
                      {currentUser.activeChallenges.map(challengeId => {
                        const c = challenges.find(ch => ch.id === challengeId);
                        if (!c) return null;

                        // Determine card rarity based on attributes
                        let rarity = 'common';
                        let rarityLabel = 'שכיח';
                        if (c.isIconic) {
                          rarity = 'legendary';
                          rarityLabel = '👑 אגדי';
                        } else if (c.difficulty === 'קשה' || c.difficulty === 'hard') {
                          rarity = 'epic';
                          rarityLabel = '💜 אפי';
                        } else if (c.difficulty === 'בינוני' || c.difficulty === 'medium') {
                          rarity = 'rare';
                          rarityLabel = '💙 נדיר';
                        } else {
                          rarityLabel = '💚 נפוץ';
                        }

                        // Dynamic Level
                        const level = (c.xpReward % 7) + 1;

                        return (
                          <div 
                            key={c.id} 
                            className={`clash-battle-card rarity-${rarity}`}
                            onClick={() => setExpandedChallengeId(c.id)}
                          >
                            <div className="clash-card-level">Lvl {level}</div>
                            <div className="clash-card-rarity-label">{rarityLabel}</div>
                            
                            <div>
                              <h4 className="clash-card-title">{c.title}</h4>
                              <div className="clash-card-difficulty" style={{ color: rarity === 'legendary' ? '#fbbf24' : rarity === 'epic' ? '#c084fc' : rarity === 'rare' ? '#60a5fa' : '#94a3b8' }}>
                                {c.category} • {c.difficulty}
                              </div>
                            </div>

                            <div>
                              <div className="clash-card-stats">
                                <span>🏆 {c.xpReward} XP</span>
                                <span>⚔️ +{c.xpReward * 2}</span>
                              </div>
                              
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginBottom: '0.15rem' }}>
                                <span>התקדמות</span>
                                <span>50%</span>
                              </div>
                              <div style={{ height: '6px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ width: '50%', height: '100%', background: rarity === 'legendary' ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : rarity === 'epic' ? '#a855f7' : '#3b82f6', borderRadius: '3px' }}></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Global Active Tournament details panel */}
                <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)', background: 'linear-gradient(to right, rgba(168,85,247,0.05), transparent)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', fontSize: '0.95rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>🏆</span> {globalTournament.title}
                  </h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {globalTournament.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>👥 {globalTournament.participantsCount} נרשמו כבר</span>
                    <span style={{ color: '#a855f7', fontWeight: 'bold' }}>{globalTournament.timeLeft}</span>
                  </div>
                </div>
              </div>
            )}

            {challengesViewMode === 'iconic' && (
              <>
                <div className="challenges-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  {filteredChallenges.map(c => {
                    const isJoined = currentUser.activeChallenges.includes(c.id);
                    return (
                      <div 
                        key={c.id} 
                        className="challenge-grid-card"
                        onClick={() => setExpandedChallengeId(c.id)}
                        style={{
                          cursor: 'pointer',
                          position: 'relative',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          background: c.isIconic ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(212, 175, 55, 0.03))' : 'var(--bg-secondary)',
                          border: c.isIconic ? '1.5px solid #ffd700' : '1px solid var(--border)',
                          boxShadow: c.isIconic ? '0 4px 15px rgba(255, 215, 0, 0.1)' : 'var(--shadow)',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        {/* Image banner */}
                        <div style={{ position: 'relative', height: '110px', width: '100%', overflow: 'hidden' }}>
                          <img 
                            src={c.image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80'} 
                            alt={c.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}></div>
                          
                          {/* Iconic star */}
                          {c.isIconic && (
                            <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#ffd700', color: '#000', padding: '0.15rem 0.4rem', borderRadius: '12px', fontSize: '0.65rem', fontWeight: '900', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
                              ★ אייקוני
                            </span>
                          )}

                          {/* Creator type badge */}
                          {(() => {
                            const isUserGen = isUserGeneratedChallenge(c);
                            return (
                              <span style={{ 
                                position: 'absolute', 
                                top: '8px', 
                                right: '8px', 
                                background: isUserGen ? 'rgba(239, 68, 68, 0.85)' : 'rgba(16, 185, 129, 0.85)', 
                                color: '#fff', 
                                padding: '0.15rem 0.4rem', 
                                borderRadius: '12px', 
                                fontSize: '0.62rem', 
                                fontWeight: 'bold', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '3px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                                backdropFilter: 'blur(4px)'
                              }}>
                                {isUserGen ? <SwordsIcon size={11} /> : <TargetIcon size={11} />}
                                {isUserGen ? 'ראש בראש' : 'אתגר עצמי'}
                              </span>
                            );
                          })()}
                          
                           {/* Trophy tag in bottom right of image */}
                          <span style={{ position: 'absolute', bottom: '6px', right: '8px', background: 'rgba(0,0,0,0.65)', color: '#fff', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 'bold' }}>
                            🏆 {c.xpReward} גביעים
                          </span>
                        </div>

                        {/* Card Info */}
                        <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, direction: 'rtl', textAlign: 'right' }}>
                          <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{c.title}</h4>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 'auto' }}>
                            <span className={`difficulty-tag difficulty-${c.difficulty}`} style={{ padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem' }}>{c.difficulty}</span>
                            <span style={{ fontSize: '0.65rem' }}>👥 {c.participantsCount} פעילים</span>
                          </div>
                        </div>

                        {/* Joined status indicator line */}
                        {isJoined && (
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'var(--success)' }}></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Modal Detail Popup Overlay */}
                {expandedChallengeId && (() => {
                  const c = challenges.find(ch => ch.id === expandedChallengeId);
                  if (!c) return null;
                  const isJoined = currentUser.activeChallenges.includes(c.id);
                  return (
                    <div 
                      className="challenge-detail-backdrop" 
                      onClick={() => setExpandedChallengeId(null)}
                      style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 1200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(8px)',
                        padding: '1rem'
                      }}
                    >
                      <div 
                        className="challenge-detail-modal" 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '100%',
                          maxWidth: '380px',
                          background: 'var(--bg-secondary)',
                          border: '1.5px solid var(--border)',
                          borderRadius: '24px',
                          boxShadow: 'var(--shadow-lg)',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          direction: 'rtl',
                          textAlign: 'right'
                        }}
                      >
                        {/* Header Image banner */}
                        <div style={{ position: 'relative', height: '160px', width: '100%' }}>
                          <img 
                            src={c.image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80'} 
                            alt={c.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-secondary) 0%, transparent 100%)' }}></div>
                          <button 
                            onClick={() => setExpandedChallengeId(null)}
                            style={{
                              position: 'absolute',
                              top: '12px',
                              left: '12px',
                              background: 'rgba(0,0,0,0.6)',
                              border: 'none',
                              color: '#fff',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '1rem'
                            }}
                          >
                            ✕
                          </button>
                        </div>

                        {/* Modal Content */}
                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div>
                            <h3 style={{ fontWeight: 900, fontSize: '1.3rem', margin: 0, color: 'var(--text-primary)' }}>{c.title}</h3>
                            
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                              <span className={`difficulty-tag difficulty-${c.difficulty}`} style={{ padding: '0.2rem 0.5rem', borderRadius: '6px' }}>{c.difficulty}</span>
                              <span style={{ background: 'var(--accent-glow)', color: 'var(--accent)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 'bold' }}>🏆 {c.xpReward} גביעים</span>
                              <span style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>👥 {c.participantsCount} משתתפים</span>
                            </div>
                          </div>

                          {/* Challenge type banner */}
                          {(() => {
                            const isUserGen = isUserGeneratedChallenge(c);
                            return (
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                background: 'var(--bg-tertiary)', 
                                padding: '0.5rem 0.75rem', 
                                borderRadius: '12px', 
                                fontSize: '0.85rem',
                                border: '1px solid var(--border)',
                                marginTop: '0.25rem'
                              }}>
                                <span style={{ color: isUserGen ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center' }}>
                                  {isUserGen ? <SwordsIcon size={18} /> : <TargetIcon size={18} />}
                                </span>
                                <div>
                                  <strong style={{ color: 'var(--text-primary)', display: 'block' }}>
                                    {isUserGen ? 'דו-קרב ראש בראש' : 'אתגר עצמי'}
                                  </strong>
                                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                    {isUserGen ? `נוצר על ידי המשתמש: ${c.creator}` : `אתגר רשמי מטעם: ${c.creator}`}
                                  </span>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Community difficulty grade */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span>📊 קושי קהילה:</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                              {c.difficultyGrades && c.difficultyGrades.length > 0
                                ? `⭐ ${(c.difficultyGrades.reduce((sum, val) => sum + val, 0) / c.difficultyGrades.length).toFixed(1)} / 5`
                                : 'אין דירוג עדיין'}
                            </span>
                          </div>

                          {/* Iconic tag reward info */}
                          {c.isIconic && c.badgeReward && (
                            <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px dashed #ffd700', padding: '0.5rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', color: '#ffd700', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                              <span>🏆 מעניק תג מיוחד:</span>
                              <strong>{c.badgeReward}</strong>
                            </div>
                          )}

                          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0.25rem 0 0.5rem 0' }}>
                            {c.description}
                          </p>

                          {/* Action buttons */}
                          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button 
                              onClick={() => {
                                toggleJoinChallenge(c.id);
                              }} 
                              className={`btn ${isJoined ? 'btn-secondary' : 'btn-primary'}`} 
                              style={{ flex: 1, padding: '0.65rem' }}
                            >
                              {isJoined ? 'עזוב אתגר' : 'הצטרף לאתגר'}
                            </button>
                            
                            {isJoined && (
                              <button 
                                onClick={() => {
                                  setProofChallengeId(c.id);
                                  setActiveTab('complete-challenge');
                                  setExpandedChallengeId(null);
                                }} 
                                className="btn btn-primary" 
                                style={{ background: 'var(--success)', padding: '0.65rem' }}
                              >
                                העלה הוכחה 📷
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}

            {challengesViewMode === 'map' && (
              /* INTERACTIVE MAP VIEW */
              <div className="interactive-map-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  לחצו על הסימונים במפה כדי לגלות אתגרים בלעדיים שזמינים לביצוע במיקום זה בלבד! 📍
                </p>

                <div 
                  className="real-map-canvas" 
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: 'calc(100vh - 290px)', 
                    minHeight: '480px', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <ChallengeMap 
                    userCoords={userCoords}
                    mapLocations={mapLocations}
                    selectedLocation={selectedMapLocation}
                    onSelectLocation={setSelectedMapLocation}
                    filteredChallenges={filteredChallenges}
                    theme={theme}
                  />

                  {/* Location quick summary drawer placed inside map absolute container to prevent component recreation */}
                  {selectedMapLocation && (() => {
                    const linkedChallenge = challenges.find(ch => ch.id === selectedMapLocation.challengeId);
                    const isJoined = linkedChallenge ? currentUser.activeChallenges.includes(linkedChallenge.id) : false;
                    return (
                      <div 
                        className="location-summary-drawer" 
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'var(--bg-tertiary)',
                          borderTop: '2px solid var(--border)',
                          padding: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem',
                          borderTopLeftRadius: '16px',
                          borderTopRightRadius: '16px',
                          boxShadow: '0 -4px 15px rgba(0,0,0,0.3)',
                          direction: 'rtl',
                          textAlign: 'right',
                          zIndex: 1000
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ fontWeight: 800, fontSize: '1.05rem', margin: 0, color: 'var(--accent)' }}>{selectedMapLocation.name}</h4>
                          <button 
                            onClick={() => setSelectedMapLocation(null)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.1rem', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{selectedMapLocation.description}</p>
                        
                        {linkedChallenge && (
                          <div 
                            style={{ 
                              background: 'var(--bg-secondary)', 
                              padding: '0.75rem', 
                              borderRadius: '8px', 
                              border: '1px solid var(--border)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <h5 style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>{linkedChallenge.title}</h5>
                              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                <span className={`difficulty-tag difficulty-${linkedChallenge.difficulty}`}>{linkedChallenge.difficulty}</span>
                                <span>🏆 {linkedChallenge.xpReward} גביעים</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                onClick={() => toggleJoinChallenge(linkedChallenge.id)}
                                className={`btn ${isJoined ? 'btn-secondary' : 'btn-primary'}`}
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                              >
                                {isJoined ? 'עזוב אתגר' : 'הצטרף לאתגר'}
                              </button>
                              {isJoined && (
                                <button 
                                  onClick={() => {
                                    setProofChallengeId(linkedChallenge.id);
                                    setActiveTab('complete-challenge');
                                  }}
                                  className="btn btn-primary"
                                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'var(--success)' }}
                                >
                                  הוכחה 📷
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                {/* Floating Action Button (FAB) to create new challenge */}
                <button 
                  onClick={() => setActiveTab('create')} 
                  style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '24px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    color: '#000',
                    border: 'none',
                    boxShadow: '0 4px 15px var(--accent-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 99,
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px var(--accent-glow)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px var(--accent-glow)';
                  }}
                  title="צור אתגר חדש"
                >
                  <PlusIcon size={28} />
                </button>
              </div>
            </div>
          )}

          {challengesViewMode === 'duels' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* 1. Create a Duel Box */}
              <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontWeight: 800, margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>⚔️ הזמן חבר לדו-קרב חדש</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  
                  {/* Opponent Selection */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>בחר חבר:</label>
                    <select 
                      id="duel-opponent-select"
                      style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '8px', outline: 'none' }}
                    >
                      <option value="">-- בחר מתוך רשימת המעקב --</option>
                      {users.filter(u => u.id !== currentUser.id).map(u => (
                        <option key={u.id} value={u.id}>{u.name} (🏆 {u.trophies || 1000})</option>
                      ))}
                    </select>
                  </div>

                  {/* Challenge Selection */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>בחר אתגר:</label>
                    <select 
                      id="duel-challenge-select"
                      style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '8px', outline: 'none' }}
                    >
                      <option value="">-- בחר סוג אתגר --</option>
                      {challenges.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stake Selection */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>סכום גביעים על הכף:</label>
                    <select 
                      id="duel-trophies-select"
                      style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '8px', outline: 'none' }}
                    >
                      <option value="15">15 גביעים 🏆</option>
                      <option value="25">25 גביעים 🏆 (מומלץ)</option>
                      <option value="50">50 גביעים 🏆 (קרב רציני!)</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => {
                      const oppId = document.getElementById('duel-opponent-select').value;
                      const chId = document.getElementById('duel-challenge-select').value;
                      const trophies = document.getElementById('duel-trophies-select').value;
                      if (!oppId || !chId) {
                        alert('אנא בחר חבר ואתגר כדי להתחיל בדו-קרב!');
                        return;
                      }
                      handleCreateDuel(oppId, chId, trophies);
                      alert('דו-קרב חדש נוצר והזמנה נשלחה לחבר!');
                    }}
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.25rem' }}
                  >
                    שלח הזמנה לדו-קרב ⚔️
                  </button>
                </div>
              </div>

              {/* 2. Active Duels list */}
              <div>
                <h3 style={{ fontWeight: 800, margin: '0 0 0.75rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>⚔️ קרבות פעילים והכרעות שופט</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {matches.map(m => {
                    const challengerUser = users.find(u => u.id === m.challengerId);
                    const opponentUser = users.find(u => u.id === m.opponentId);
                    
                    return (
                      <div key={m.id} className="clash-versus-card" style={{ padding: '1rem' }}>
                        {/* Header: challenge title + trophy stake */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{m.challengeTitle}</span>
                          <span className="trophy-pill" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: '1.5px solid rgba(251, 191, 36, 0.4)', fontWeight: 900, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                            🏆 {m.trophiesStaked} גביעים
                          </span>
                        </div>

                        {/* Split-panel battle view */}
                        <div className="clash-versus-matchup">
                          {/* Challenger side — cyan */}
                          <div className={`clash-versus-player-panel panel-challenger ${m.winnerId === m.challengerId ? 'duel-side-winner' : ''}`}>
                            <div className="clash-avatar-shield-frame side-challenger">
                              <img src={challengerUser?.avatar} alt="" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {challengerUser?.name}
                                {m.winnerId === m.challengerId && <span style={{ marginRight: '0.3rem', fontSize: '0.75rem', color: '#ffd700' }}>👑</span>}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: m.challengerProof ? '#22d3ee' : '#94a3b8', fontWeight: 'bold' }}>
                                {m.challengerProof ? '✅ הגיש תוצאה' : '⏳ ממתין...'}
                              </div>
                              <div className="clash-health-bar-container">
                                <div className="clash-health-bar-fill fill-challenger" style={{ width: m.challengerProof ? '100%' : '0%' }} />
                              </div>
                            </div>
                          </div>

                          {/* VS Badge */}
                          <div className="duel-vs-badge" style={{ margin: '0 0.25rem' }}>VS</div>

                          {/* Opponent side — fire */}
                          <div className={`clash-versus-player-panel panel-opponent ${m.winnerId === m.opponentId ? 'duel-side-winner' : ''}`}>
                            <div className="clash-avatar-shield-frame side-opponent">
                              <img src={opponentUser?.avatar} alt="" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {m.winnerId === m.opponentId && <span style={{ marginLeft: '0.3rem', fontSize: '0.75rem', color: '#ffd700' }}>👑</span>}
                                {opponentUser?.name}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: m.opponentProof ? '#fb7185' : '#94a3b8', fontWeight: 'bold' }}>
                                {m.opponentProof ? '✅ הגיש תוצאה' : '⏳ ממתין...'}
                              </div>
                              <div className="clash-health-bar-container">
                                <div className="clash-health-bar-fill fill-opponent" style={{ width: m.opponentProof ? '100%' : '0%' }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status Actions */}
                        {m.status === 'referee_court' && (
                          <div style={{ marginTop: '1rem', background: 'rgba(251, 191, 36, 0.05)', border: '1px solid rgba(251, 191, 36, 0.2)', padding: '0.75rem', borderRadius: '16px', textAlign: 'center' }}>
                            <p style={{ margin: '0 0 0.6rem 0', fontSize: '0.8rem', color: '#fbbf24', fontWeight: 'bold' }}>
                              ⚖️ הדו-קרב הסתיים! הוגש ערעור על מהימנות התוצאות.
                            </p>
                            <button 
                              onClick={() => setActiveJudgeMatchId(m.id)}
                              className="btn royal-referee-court-btn" 
                              style={{ width: '100%', padding: '0.6rem' }}
                            >
                              כנס אל בית הדין של שופט ה-AI ⚖️
                            </button>
                          </div>
                        )}

                        {m.status === 'active' && (
                          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={() => {
                                const updated = matches.map(matchObj => {
                                  if (matchObj.id === m.id) {
                                    return {
                                      ...matchObj,
                                      challengerProof: {
                                        duration: "20:50",
                                        avgSpeed: "14.4 קמ\"ש",
                                        maxSpeed: "17.0 קמ\"ש",
                                        avgHeartRate: 168,
                                        device: "Garmin Epix Gen 2",
                                        isManual: false
                                      }
                                    };
                                  }
                                  return matchObj;
                                });
                                setMatches(updated);
                                alert('הגשת את נתוני הריצה שלך בהצלחה!');
                              }}
                              disabled={m.challengerProof}
                              className="btn btn-secondary" 
                              style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem' }}
                            >
                              {m.challengerProof ? 'התוצאה שלך הוגשה' : 'סנכרן פעילות ריצה מסטרבה 🏃'}
                            </button>
                            
                            {m.challengerProof && m.opponentProof && (
                              <button 
                                onClick={() => {
                                  const updated = matches.map(matchObj => {
                                    if (matchObj.id === m.id) {
                                      return { ...matchObj, status: 'referee_court' };
                                    }
                                    return matchObj;
                                  });
                                  setMatches(updated);
                                }}
                                className="btn btn-primary" 
                                style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}
                              >
                                שלח לשופט ה-AI ⚖️
                              </button>
                            )}
                          </div>
                        )}

                        {m.status === 'completed' && (
                          <div style={{ marginTop: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: '12px' }}>
                            <strong style={{ display: 'block', fontSize: '0.8rem', color: '#10b981', marginBottom: '0.25rem' }}>🏆 המנצח: {users.find(u => u.id === m.winnerId)?.name || 'תיקו'}</strong>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.verdict}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}


        {/* TAB 3: CREATE CHALLENGE (INSTAGRAM / TIKTOK POST STYLE WIZARD) */}
        {activeTab === 'create' && (
          <div className="creator-container">
            <div className="creator-header-row">
              <h2 className="creator-main-title" style={{ fontWeight: 800 }}>פרסום יוזמה חברתית חדשה</h2>
              <span className="creator-subtitle">צרו אתגר והוכיחו ביצוע בסגנון Instagram / TikTok</span>
            </div>

            {currentUser.isBlocked ? (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '1.1rem' }}>חשבונך חסום. אינך יכול לפרסם אתגרים חדשים.</p>
              </div>
            ) : (
              <div>
                {/* Step indicator */}
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1.5rem', direction: 'rtl', padding: '0 0.5rem' }}>
                  <div style={{ fontWeight: creationStep === 1 ? 'bold' : 'normal', color: creationStep === 1 ? 'var(--accent)' : 'var(--text-muted)', borderBottom: creationStep === 1 ? '2px solid var(--accent)' : 'none', paddingBottom: '4px' }}>1. רקע ואווירה 🖼️</div>
                  <div style={{ fontWeight: creationStep === 2 ? 'bold' : 'normal', color: creationStep === 2 ? 'var(--accent)' : 'var(--text-muted)', borderBottom: creationStep === 2 ? '2px solid var(--accent)' : 'none', paddingBottom: '4px' }}>2. פרטי האתגר 📝</div>
                  <div style={{ fontWeight: creationStep === 3 ? 'bold' : 'normal', color: creationStep === 3 ? 'var(--accent)' : 'var(--text-muted)', borderBottom: creationStep === 3 ? '2px solid var(--accent)' : 'none', paddingBottom: '4px' }}>3. הוכחה ופרס 🏆</div>
                </div>

                <form onSubmit={handleCreateChallenge} className="creator-split-grid">
                  
                  {/* LEFT COLUMN: TikTok / Instagram Style Live Preview */}
                  <div className="creator-preview-pane">
                    <div className="creator-card-label">תצוגה מקדימה של הפוסט</div>
                    
                    {/* Mock Phone Viewport */}
                    <div className="mock-post-card">
                      {/* Image Preview */}
                      <div className="mock-post-media">
                        <img 
                          src={newChallengeProofImage || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"} 
                          alt="Preview" 
                          className="mock-media-img"
                        />
                        <div className="mock-post-gradient-overlay"></div>
                        
                        {/* Floating TikTok Style Badges */}
                        <div className="mock-post-badges">
                          <span className={`mock-badge diff-${newChallengeDifficulty}`}>
                            ⚡ {newChallengeDifficulty}
                          </span>
                          <span className="mock-badge category">
                            🏷️ {newChallengeCategory}
                          </span>
                        </div>

                        {/* Bottom Info Overlay inside Media */}
                        <div className="mock-post-bottom-info">
                          <div className="mock-user-row">
                            <img src={currentUser.avatar} alt="" className="mock-user-avatar" />
                            <span className="mock-user-name">{currentUser.name}</span>
                          </div>
                          <h4 className="mock-challenge-title">{newChallengeTitle || "שם האתגר שלכם..."}</h4>
                          <p className="mock-challenge-desc">{newChallengeProofText || "הוכחת הביצוע שלכם תופיע כאן..."}</p>
                          
                          {/* Dynamic Trophies counter */}
                          <div className="mock-xp-row">
                            <span>גביעים מוענקים:</span>
                            <span className="mock-xp-glow">
                              +{Math.round(Number(newChallengeXp) * (newChallengeDifficulty === 'בינוני' ? 1.2 : newChallengeDifficulty === 'קשה' ? 1.5 : newChallengeDifficulty === 'קשה מאוד' ? 2.0 : 1.0))} 🏆
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Step-by-Step Settings Panels */}
                  <div className="creator-details-pane">
                    
                    {/* Step 1: Media Selection */}
                    {creationStep === 1 && (
                      <div className="glass-card creator-section-card">
                        <h3 className="section-title" style={{ fontWeight: 700 }}>🖼️ רקע ואווירה</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>בחרו תמונה המשקפת את רוח האימון או האתגר שלכם:</p>
                        
                        <div className="media-preset-section" style={{ padding: 0, margin: 0 }}>
                          <div className="media-presets-grid">
                            {[
                              { name: "ריצה", url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=300&auto=format&fit=crop&q=80" },
                              { name: "כוח/משקולות", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80" },
                              { name: "אימון ביתי", url: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=300&auto=format&fit=crop&q=80" },
                              { name: "ריצה/אירובי", url: "https://images.unsplash.com/photo-1502224562085-639556652f33?w=300&auto=format&fit=crop&q=80" },
                              { name: "שטח/טיפוס", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop&q=80" }
                            ].map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className={`preset-thumb-btn ${newChallengeProofImage === preset.url ? 'active' : ''}`}
                                onClick={() => setNewChallengeProofImage(preset.url)}
                              >
                                <img src={preset.url} alt={preset.name} />
                                <span>{preset.name}</span>
                              </button>
                            ))}
                          </div>

                          <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="form-label" style={{ fontSize: '0.8rem' }}>או כתובת תמונה מותאמת אישית (URL):</label>
                            <input 
                              type="url" 
                              className="form-control" 
                              placeholder="https://..."
                              value={newChallengeProofImage}
                              onChange={(e) => setNewChallengeProofImage(e.target.value)}
                              style={{ fontSize: '0.8rem' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Core Details */}
                    {creationStep === 2 && (
                      <div className="glass-card creator-section-card">
                        <h3 className="section-title" style={{ fontWeight: 700 }}>✍️ פרטי האתגר</h3>
                        
                        <div className="form-group">
                          <label className="form-label">שם האתגר</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="לדוגמה: 100 שכיבות סמיכה ברצף" 
                            value={newChallengeTitle}
                            onChange={(e) => setNewChallengeTitle(e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">תיאור האתגר ומטרות</label>
                          <textarea 
                            className="form-control" 
                            rows="2"
                            placeholder="הסבירו מה צריך לעשות..." 
                            value={newChallengeDesc}
                            onChange={(e) => setNewChallengeDesc(e.target.value)}
                            required
                          ></textarea>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label">קטגוריה</label>
                            <select 
                              className="form-control"
                              value={newChallengeCategory}
                              onChange={(e) => setNewChallengeCategory(e.target.value)}
                            >
                              <option value="כוח">כוח 💪</option>
                              <option value="אירובי">אירובי 🏃‍♂️</option>
                              <option value="ליבה">ליבה 🧘</option>
                              <option value="שטח">שטח ⛰️</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label">רמת קושי</label>
                            <select 
                              className="form-control"
                              value={newChallengeDifficulty}
                              onChange={(e) => setNewChallengeDifficulty(e.target.value)}
                            >
                              <option value="קל">קל</option>
                              <option value="בינוני">בינוני</option>
                              <option value="קשה">קשה</option>
                              <option value="קשה מאוד">קשה מאוד</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Proof, Location & Rewards */}
                    {creationStep === 3 && (
                      <>
                        <div className="glass-card creator-section-card">
                          <h3 className="section-title" style={{ fontWeight: 700 }}>🏆 הוכחת ביצוע וטקסט פוסט (Caption)</h3>
                          
                          <div className="form-group">
                            <label className="form-label">איך ביצעתם את האתגר בעצמכם? (חובה לפרסום)</label>
                            <textarea 
                              className="form-control" 
                              rows="3"
                              placeholder="שתפו את הזמן, המרחק או החוויה שלכם. הפוסט יתפרסם בפיד הראשי!" 
                              value={newChallengeProofText}
                              onChange={(e) => setNewChallengeProofText(e.target.value)}
                              required
                            ></textarea>

                            {/* Hashtag helpers */}
                            <div className="hashtag-helpers" style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                              {["#Fitness", "#Pulse", "#NoExcuses", "#WorkoutDone", "#ChallengeAccepted"].map(tag => (
                                <button
                                  type="button"
                                  key={tag}
                                  className="hashtag-btn"
                                  onClick={() => {
                                    if (!newChallengeProofText.includes(tag)) {
                                      setNewChallengeProofText(prev => prev + " " + tag);
                                    }
                                  }}
                                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.2rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Location Pinning Component */}
                          <div className="form-group" style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <input 
                                type="checkbox" 
                                id="pin-location-check"
                                checked={newChallengePinLocation}
                                onChange={(e) => {
                                  setNewChallengePinLocation(e.target.checked);
                                  if (e.target.checked && userCoords) {
                                    setNewChallengeLat(userCoords[0]);
                                    setNewChallengeLng(userCoords[1]);
                                  }
                                }}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                              />
                              <label htmlFor="pin-location-check" style={{ fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                📍 נעיצת מיקום גיאוגרפי במפת האתגרים
                              </label>
                            </div>

                            {newChallengePinLocation && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>שם המיקום במפה</label>
                                  <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="לדוגמה: גינת ספורט שכונתית"
                                    value={newChallengeLocationName}
                                    onChange={(e) => setNewChallengeLocationName(e.target.value)}
                                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                    required={newChallengePinLocation}
                                  />
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>תיאור קצר למיקום</label>
                                  <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="הנחיות הגעה או פרטים נוסםים..."
                                    value={newChallengeLocationDesc}
                                    onChange={(e) => setNewChallengeLocationDesc(e.target.value)}
                                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                  />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                  <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>קו רוחב (Lat)</label>
                                    <input 
                                      type="number" 
                                      step="0.0001"
                                      className="form-control" 
                                      value={newChallengeLat}
                                      onChange={(e) => setNewChallengeLat(e.target.value)}
                                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                      required={newChallengePinLocation}
                                    />
                                  </div>
                                  <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>קו אורך (Lng)</label>
                                    <input 
                                      type="number" 
                                      step="0.0001"
                                      className="form-control" 
                                      value={newChallengeLng}
                                      onChange={(e) => setNewChallengeLng(e.target.value)}
                                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                      required={newChallengePinLocation}
                                    />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => {
                                    if (navigator.geolocation) {
                                      navigator.geolocation.getCurrentPosition((pos) => {
                                        setNewChallengeLat(pos.coords.latitude.toFixed(4));
                                        setNewChallengeLng(pos.coords.longitude.toFixed(4));
                                      });
                                    }
                                  }}
                                  style={{ padding: '0.4rem', fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                                >
                                  🎯 דגום את המיקום הנוכחי שלי
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Rewards & Publish */}
                        <div className="glass-card creator-section-card" style={{ border: '1px solid var(--accent)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <span style={{ fontWeight: 'bold' }}>בסיס גביעים לפרס 🏆:</span>
                            <input 
                              type="number" 
                              value={newChallengeXp}
                              onChange={(e) => setNewChallengeXp(Number(e.target.value))}
                              className="form-control"
                              style={{ width: '80px', padding: '0.25rem 0.5rem', textAlign: 'center' }}
                              min="50"
                              max="1000"
                            />
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>הגביעים הסופיים מחושבים אוטומטית לפי רמת הקושי שבחרתם.</p>
                          
                          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'var(--accent)', color: '#000', fontWeight: 'bold', fontSize: '1.05rem', boxShadow: '0 4px 15px var(--accent-glow)' }}>
                            אשר ביצוע ושתף לפוסט 🚀
                          </button>
                        </div>
                      </>
                    )}

                    {/* Navigation Buttons for Wizard */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'space-between', direction: 'rtl' }}>
                      {creationStep < 3 ? (
                        <button 
                          type="button" 
                          className="btn btn-primary" 
                          onClick={() => {
                            if (creationStep === 1 && !newChallengeProofImage) {
                              // Set default image if none selected
                              setNewChallengeProofImage("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80");
                            }
                            if (creationStep === 2 && (!newChallengeTitle.trim() || !newChallengeDesc.trim())) {
                              alert("אנא הזן שם ותיאור עבור האתגר.");
                              return;
                            }
                            setCreationStep(prev => prev + 1);
                          }}
                          style={{ flex: 1, background: 'var(--accent)', color: '#000', fontWeight: 'bold' }}
                        >
                          המשך ←
                        </button>
                      ) : null}
                      
                      {creationStep > 1 && (
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={() => setCreationStep(prev => prev - 1)}
                          style={{ flex: 1 }}
                        >
                          → חזור
                        </button>
                      )}
                    </div>
                  </div>

                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB: CHATS */}
        {activeTab === 'chats' && (
          <div className="chats-tab-container" style={{ display: 'flex', flex: 1, minHeight: '500px', background: 'var(--bg-secondary)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', direction: 'rtl' }}>
            {/* Sidebar list of chats */}
            {!activeChatId && (
              <div className="chats-sidebar" style={{ width: '100%', background: 'var(--bg-tertiary)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', textAlign: 'right' }}>שיחות וצ'אטים 💬</h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {chats.map(c => {
                    const lastMsg = c.messages[c.messages.length - 1];
                    return (
                      <div 
                        key={c.id} 
                        onClick={() => setActiveChatId(c.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.85rem 1rem',
                          cursor: 'pointer',
                          background: 'transparent',
                          borderBottom: '1px solid var(--border)',
                          transition: 'all 0.2s',
                          textAlign: 'right'
                        }}
                      >
                        <img 
                          src={c.avatar} 
                          alt="" 
                          style={{ width: '42px', height: '42px', borderRadius: c.type === 'group' ? '8px' : '50%', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</strong>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{lastMsg ? lastMsg.time : ''}</span>
                          </div>
                          <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : 'אין הודעות'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {chats.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      אין שיחות פעילות כרגע.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chat viewport */}
            {activeChatId && (
              <div className="chat-viewport" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', width: '100%' }}>
                {(() => {
                  const currentChat = chats.find(c => c.id === activeChatId);
                  if (!currentChat) return null;
                  return (
                    <>
                      <div className="chat-header" style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <button 
                            onClick={() => setActiveChatId(null)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: 'var(--text-primary)', 
                              fontSize: '1.2rem', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0.25rem 0.5rem',
                              marginLeft: '0.5rem'
                            }}
                            title="חזרה לרשימה"
                          >
                            <ChevronRightIcon size={20} />
                          </button>
                          <img 
                            src={currentChat.avatar} 
                            alt="" 
                            style={{ width: '38px', height: '38px', borderRadius: currentChat.type === 'group' ? '8px' : '50%', objectFit: 'cover' }}
                          />
                          <div style={{ textAlign: 'right' }}>
                            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{currentChat.name}</h4>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {currentChat.type === 'group' ? `${currentChat.participants.length} משתתפים` : 'צ\'אט ישיר'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {currentChat.messages.map((m, idx) => {
                          if (m.sender === 'system') {
                            return (
                              <div key={idx} style={{ alignSelf: 'center', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.75rem', border: '1px solid var(--border)' }}>
                                {m.text}
                              </div>
                            );
                          }
                          const isMe = m.sender === currentUser.id;
                          return (
                            <div key={idx} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                              {!isMe && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>{m.senderName}</span>}
                              <div style={{
                                background: isMe ? 'var(--accent)' : 'var(--bg-tertiary)',
                                color: isMe ? '#000' : 'var(--text-primary)',
                                padding: '0.55rem 0.85rem',
                                borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                                fontSize: '0.85rem',
                                boxShadow: 'var(--shadow-sm)',
                                lineHeight: '1.4',
                                textAlign: 'right'
                              }}>
                                {m.text}
                              </div>
                              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{m.time}</span>
                            </div>
                          );
                        })}
                      </div>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!chatInputText.trim()) return;
                          const newMsg = {
                            sender: currentUser.id,
                            senderName: currentUser.name,
                            text: chatInputText,
                            time: "כרגע"
                          };
                          setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, newMsg] } : c));
                          setChatInputText('');
                        }}
                        style={{ padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}
                      >
                        <input 
                          type="text" 
                          placeholder="כתבו הודעה לקבוצה..." 
                          value={chatInputText}
                          onChange={(e) => setChatInputText(e.target.value)}
                          style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', textAlign: 'right' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ borderRadius: '24px', padding: '0.6rem 1.25rem' }}>שלח</button>
                      </form>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* TAB: COMPLETE CHALLENGE (UPLOAD PROOF) */}
        {activeTab === 'complete-challenge' && (
          <div className="glass-card">
            <h2 style={{ marginBottom: '1.25rem', fontWeight: 800 }}>תיעוד והעלאת הוכחה</h2>
            <form onSubmit={handleCompleteChallenge}>
              <div className="form-group">
                <label className="form-label">איזה אתגר השלמת?</label>
                <select 
                  className="form-control"
                  value={proofChallengeId}
                  onChange={(e) => setProofChallengeId(e.target.value)}
                  required
                >
                  <option value="">בחר אתגר...</option>
                  {challenges.filter(c => currentUser.activeChallenges.includes(c.id)).map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">ספר לחברים איך היה (תיעוד)</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  placeholder="איך היה? מה הזמן שלכם? טיפ למשתתפים הבאים..." 
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">תמונת הוכחה (קישור לתמונה/צילום מסך)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="הדבק קישור לתמונה (או השאר ריק לתמונת ברירת מחדל)" 
                    value={proofImage}
                    onChange={(e) => setProofImage(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.75rem' }}>
                    <CameraIcon size={20} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">דרג את רמת הקושי בפועל (1 עד 5 כוכבים)</label>
                <select
                  className="form-control"
                  value={proofDifficultyGrade}
                  onChange={(e) => setProofDifficultyGrade(Number(e.target.value))}
                  required
                >
                  <option value={1}>⭐ 1 - קל מאוד</option>
                  <option value={2}>⭐⭐ 2 - קל</option>
                  <option value={3}>⭐⭐⭐ 3 - בינוני</option>
                  <option value={4}>⭐⭐⭐⭐ 4 - קשה</option>
                  <option value={5}>⭐⭐⭐⭐⭐ 5 - קשה מאוד</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', background: 'var(--success)' }}>
                אשר ופרסם בפיד 🏆
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: SEARCH & EXPLORE */}
        {activeTab === 'search' && (
          <div>
            <div style={{ marginBottom: '1rem', position: 'relative' }}>
              <div className="search-bar-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <SearchIcon size={20} style={{ position: 'absolute', right: '1rem', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="חפש חברים ואנשים..."
                  value={peopleSearchQuery}
                  onChange={(e) => setPeopleSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'var(--transition)',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
              </div>

              {/* Autocomplete Dropdown */}
              {peopleSearchQuery && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: 0, 
                    right: 0, 
                    background: 'var(--bg-secondary)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '12px', 
                    boxShadow: 'var(--shadow-lg)', 
                    zIndex: 10, 
                    marginTop: '0.5rem', 
                    maxHeight: '250px', 
                    overflowY: 'auto',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  {users
                    .filter(u => u.id !== currentUser.id)
                    .filter(u => u.name.toLowerCase().includes(peopleSearchQuery.toLowerCase()))
                    .map(user => (
                      <div 
                        key={user.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          background: 'var(--bg-tertiary)',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setSelectedUserForModal(user);
                          setIsUserModalOpen(true);
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={user.avatar} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 700, margin: 0, fontSize: '0.85rem' }}>{user.name}</h4>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                              <span>{getUserRank(user.xp).icon} {getUserRank(user.xp).label}</span>
                              <span>•</span>
                              <span style={{ color: '#fbbf24' }}>🏆 {user.trophies || 1000}</span>
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollowUser(user.id);
                          }}
                          className={`btn ${currentUser.following?.includes(user.id) ? 'btn-secondary' : 'btn-primary'}`}
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '6px' }}
                        >
                          {currentUser.following?.includes(user.id) ? 'עוקב' : 'עקוב'}
                        </button>
                      </div>
                    ))}
                  {users.filter(u => u.id !== currentUser.id).filter(u => u.name.toLowerCase().includes(peopleSearchQuery.toLowerCase())).length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '0.5rem' }}>לא נמצאו אנשים מתאימים</p>
                  )}
                </div>
              )}
            </div>

            {/* Video grid layout */}
            <div className="search-explore-grid">
              {feed.map((post, index) => (
                <div 
                  key={post.id} 
                  className="explore-card"
                  onClick={() => setExploreReelsStartIndex(index)}
                >
                  <video 
                    src={getPostVideo(post)} 
                    poster={post.proofImage}
                    className="explore-video" 
                    loop 
                    muted 
                    autoPlay 
                    playsInline 
                  />
                  <div className="explore-overlay">
                    <div className="explore-challenge-title">{post.challengeTitle}</div>
                    <div className="explore-user-row">
                      <img src={post.userAvatar} alt={post.userName} className="explore-user-avatar" />
                      <span className="explore-username">{post.userName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && (
          <div>
            {/* Redesigned Instagram-style Profile Header */}
            <div className="glass-card game-hud-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '16px' }}>
              {/* 1. Profile Details Header (profile pic, name, stats, XP progress) */}
              {(() => {
                const avatarTier = currentUser.xp >= 2500 ? 'tier-gold' : currentUser.xp >= 1000 ? 'tier-fire' : '';
                const userLevel = Math.floor(currentUser.xp / 500) + 1;
                return (
                  <div className="game-profile-header" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem' }}>
                    <div
                      className={`game-avatar-wrapper ${avatarTier}`}
                      style={{ width: '72px', height: '72px' }}
                      title={`${currentUser.name} • דרגה ${userLevel}`}
                    >
                      <img src={currentUser.avatar} alt={currentUser.name} className="game-avatar-img" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    </div>
                    <div className="game-user-details" style={{ flex: 1 }}>
                      <h2 style={{ fontWeight: 800, margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {currentUser.name}
                        {currentUser.isBlocked && (
                          <span style={{ background: '#ff4d4d', color: '#fff', fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>חסום ⛔</span>
                        )}
                      </h2>

                      {/* Rank badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                        {(() => {
                          const r = getUserRank(currentUser.xp);
                          return (
                            <span className={`rank-badge ${r.className}`}>
                              {r.icon} {r.label}
                            </span>
                          );
                        })()}
                      </div>

                      {/* Premium Stat Pills */}
                      <div className="avatar-stats-row" style={{ justifyContent: 'flex-start', marginTop: '0.6rem' }}>
                        <span className="stat-pill stat-pill-level" style={{ animationDelay: '0s' }}>
                          ⚡ דרגה {userLevel}
                        </span>
                        <span className="stat-pill stat-pill-xp" style={{ animationDelay: '0.1s' }}>
                          💠 {currentUser.xp} XP
                        </span>
                        <span className="stat-pill stat-pill-trophies" style={{ animationDelay: '0.2s' }}>
                          🏆 {currentUser.trophies || 1000}
                        </span>
                      </div>

                      {/* Level Progress Bar */}
                      <div style={{ marginTop: '0.65rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          <span>{currentUser.xp % 500} / 500 XP לדרגה הבאה</span>
                          <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>דרגה {userLevel + 1}</span>
                        </div>
                        <div className="game-stat-bar-bg" style={{ height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${(currentUser.xp % 500) / 5}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), #a855f7)', borderRadius: '4px', transition: 'width 1s ease-out' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 2. Social Stats Row (Followers/Following/Posts count) */}
              <div className="social-stats-row" style={{ display: 'flex', justifyContent: 'space-around', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '0.75rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="social-stat-item" style={{ textAlign: 'center' }}>
                  <span className="social-stat-value" style={{ display: 'block', fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{currentUser.followers?.length || 0}</span>
                  <span className="social-stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>עוקבים</span>
                </div>
                <div className="social-stat-item" style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '0 1.5rem' }}>
                  <span className="social-stat-value" style={{ display: 'block', fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{currentUser.following?.length || 0}</span>
                  <span className="social-stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>עוקב אחרי</span>
                </div>
                <div className="social-stat-item" style={{ textAlign: 'center' }}>
                  <span className="social-stat-value" style={{ display: 'block', fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{feed.filter(p => p.userId === currentUser.id).length}</span>
                  <span className="social-stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>פוסטים</span>
                </div>
              </div>

              {/* 3. 3D Avatar Display & Customizer */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                {isEditingAvatar ? (
                  <div className="dicebear-creator-container" style={{ width: '100%', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ position: 'relative', width: '130px', height: '130px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', padding: '8px', border: '3px solid var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={`https://api.dicebear.com/9.x/${dicebearStyle}/svg?seed=${encodeURIComponent(dicebearSeed)}`} 
                        alt="Dicebear Preview" 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'contain' }} 
                      />
                    </div>

                    {/* Randomize button */}
                    <button 
                      onClick={() => setDicebearSeed(Math.random().toString(36).substring(2, 9))} 
                      className="btn btn-secondary" 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                    >
                      🎲 אקראי
                    </button>

                    {/* Seed Input */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'right' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>זרע לעיצוב (Seed):</label>
                      <input 
                        type="text" 
                        value={dicebearSeed} 
                        onChange={(e) => setDicebearSeed(e.target.value)} 
                        placeholder="הקלד/י טקסט כלשהו..."
                        dir="ltr"
                        style={{
                          width: '100%',
                          padding: '0.6rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          background: 'rgba(0, 0, 0, 0.2)',
                          color: '#fff',
                          outline: 'none',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    {/* Style Selector Grid */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'right' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>סגנון אוואטר:</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', width: '100%' }}>
                        {[
                          { id: 'adventurer', label: '🦸 הרפתקן' },
                          { id: 'bottts', label: '🤖 רובוטים' },
                          { id: 'lorelei', label: '🌸 לורליי' },
                          { id: 'pixel-art', label: '👾 פיקסל' },
                          { id: 'avataaars', label: '🧑 דמויות' },
                          { id: 'open-peeps', label: '👥 אנשים' },
                          { id: 'micah', label: '🎨 מיקה' },
                          { id: 'multiavatars', label: '🔮 צבעוני' },
                          { id: 'shapes', label: '🔷 צורות' }
                        ].map((styleOpt) => (
                          <button
                            key={styleOpt.id}
                            onClick={() => setDicebearStyle(styleOpt.id)}
                            style={{
                              padding: '0.5rem 0.25rem',
                              fontSize: '0.75rem',
                              borderRadius: '8px',
                              border: dicebearStyle === styleOpt.id ? '2px solid var(--cyan)' : '1px solid rgba(255,255,255,0.08)',
                              background: dicebearStyle === styleOpt.id ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.02)',
                              color: dicebearStyle === styleOpt.id ? 'var(--cyan)' : 'var(--text-secondary)',
                              cursor: 'pointer',
                              fontWeight: dicebearStyle === styleOpt.id ? 'bold' : 'normal',
                              transition: 'all 0.2s',
                            }}
                          >
                            {styleOpt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
                      <button
                        onClick={() => {
                          const finalUrl = `https://api.dicebear.com/9.x/${dicebearStyle}/svg?seed=${encodeURIComponent(dicebearSeed)}`;
                          const updated = { ...currentUser, avatar: finalUrl };
                          setCurrentUser(updated);
                          setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
                          setIsEditingAvatar(false);
                        }}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
                      >
                        💾 שמור שינויים
                      </button>
                    </div>
                  </div>
                ) : (
                  <AvatarPodium 
                    avatarConfig={currentUser.avatarConfig || { base: 'base_male_1', top: 'tshirt_black', bottom: 'shorts_black', shoes: 'sneakers_white', glowColor: '#00ffff' }}
                    isCustomizable={true}
                  />
                )}
                <button 
                  onClick={() => setIsEditingAvatar(!isEditingAvatar)} 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.75rem', padding: '0.4rem 1rem', marginTop: '0.75rem', width: '100%', maxWidth: '200px' }}
                >
                  {isEditingAvatar ? 'ביטול עיצוב' : 'ערוך דמות אוואטר 👕'}
                </button>
              </div>
            </div>

            {/* Shiny Collectible Badges Grid */}
            <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🏆</span>
                <h3 style={{ fontWeight: 800, margin: 0, fontSize: '1.15rem' }}>תגים נוצצים והישגים</h3>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>תגים ייחודיים שאספת מאתגרים מיוחדים. רחפו מעליהם כדי לראות את אפקט הניצוץ והאנימציה!</p>
              
              <div className="scout-patch-container">
                {currentUser.badges.map((b, idx) => {
                  const parts = b.split(' ');
                  const emoji = parts[0] || '🏅';
                  const title = parts.slice(1).join(' ') || b;
                  
                  // Unique military/scout patch colors & metal rim variants
                  const patchColors = [
                    { bg: '#132a13', border: '#ffd700' }, // Forest Green & Gold Rim
                    { bg: '#0f2027', border: '#cbd5e1' }, // Deep Midnight Blue & Silver Rim
                    { bg: '#3a0ca3', border: '#f72585' }, // Neon Violet & Electric Pink Metal Rim
                    { bg: '#4a154b', border: '#ffb703' }, // Indigo & Amber Gold Rim
                    { bg: '#1f1f2e', border: '#8ecae6' }  // Dark Slate & Sky Blue Chrome Rim
                  ];
                  const colorConfig = patchColors[idx % patchColors.length];

                  // Diverse patch shapes
                  const shapes = ['circle', 'shield', 'hexagon', 'diamond', 'octagon'];
                  const shape = shapes[idx % shapes.length];

                  // Diverse patch sizes
                  const sizes = ['sm', 'md', 'lg'];
                  const size = sizes[idx % sizes.length];

                  // Emoji sizes based on patch size (large and full-scaled, not trimmed)
                  const emojiFontSize = size === 'sm' ? '1.8rem' : size === 'md' ? '2.4rem' : '2.9rem';

                  // Description mockup for popup
                  const getBadgeDesc = (titleStr) => {
                    if (titleStr.includes('רצף') || titleStr.includes('7 ימים')) {
                      return 'הוענק על שמירה על מוטיבציה ופעילות רציפה באפליקציה במשך שבוע שלם ללא הפסקה!';
                    }
                    if (titleStr.includes('מרתון')) {
                      return 'הוענק על השלמת אתגר ריצה מפרך למרחק רב. כוח רצון של פלדה!';
                    }
                    if (titleStr.includes('פסגות')) {
                      return 'הוענק למטפסי הרים כבירים שהשלימו אתגר גובה יוצא דופן!';
                    }
                    if (titleStr.includes('ברזל')) {
                      return 'הוענק למי שהוכיח עמידות פיזית קיצונית וכוח סיבולת על-אנושי באתגרי כוח קשים!';
                    }
                    if (titleStr.includes('זריז')) {
                      return 'הוענק על ביצוע אתגרים במהירות שיא וזמן תגובה מדהים!';
                    }
                    return 'תג הצטיינות מיוחד המוענק לחברי תנועת האתגרים על השלמת יעדים ייחודיים!';
                  };

                  const badgeDetail = {
                    title,
                    emoji,
                    desc: getBadgeDesc(title),
                    colorConfig,
                    shape,
                    size
                  };

                  return (
                    <div 
                      key={b} 
                      className="scout-patch-badge"
                      title={`תג הישג: ${title} - לחץ לפרטים`}
                      onClick={() => setActiveBadgeDetail(badgeDetail)}
                    >
                      <div 
                        className={`scout-patch-circle patch-shape-${shape} patch-size-${size}`}
                        style={{
                          background: colorConfig.bg,
                          '--metal-border': colorConfig.border
                        }}
                      >
                        <div className="scout-patch-gloss"></div>
                        <span className="scout-patch-emoji" style={{ fontSize: emojiFontSize }}>{emoji}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instagram Style Posts Grid */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📸</span>
                <h3 style={{ fontWeight: 800, margin: 0, fontSize: '1.15rem' }}>הפוסטים שלי</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>({feed.filter(p => p.userId === currentUser.id).length})</span>
              </div>
              
              {feed.filter(p => p.userId === currentUser.id).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>עדיין לא שיתפת אף פוסט. בצע אתגר והעלה הוכחה כדי להתחיל!</p>
                </div>
              ) : (
                <div className="instagram-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
                  {feed.filter(p => p.userId === currentUser.id).map(post => (
                    <div 
                      key={post.id} 
                      className="instagram-grid-item"
                      style={{ 
                        position: 'relative', 
                        aspectRatio: '1', 
                        overflow: 'hidden', 
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: '#000',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                      onClick={() => {
                        setSelectedExplorePost(post);
                      }}
                    >
                      <img 
                        src={post.proofImage} 
                        alt={post.challengeTitle} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        className="insta-img"
                      />
                      <div 
                        className="instagram-grid-overlay"
                        style={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          width: '100%', 
                          height: '100%', 
                          background: 'rgba(0, 0, 0, 0.65)', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '0.8rem',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>❤️ {post.likes}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>💬 {post.comments?.length || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Challenges list */}
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>האתגרים הפעילים שלך</h3>
              {currentUser.activeChallenges.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>אין לך אתגרים פעילים כרגע. לך ללשונית אתגרים והצטרף לאחד!</p>
              ) : (
                <div className="challenges-grid">
                  {challenges.filter(c => currentUser.activeChallenges.includes(c.id)).map(c => (
                    <div key={c.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: 700 }}>{c.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>פרס: {c.xpReward} גביעים 🏆</span>
                      </div>
                      <button 
                        onClick={() => {
                          setProofChallengeId(c.id);
                          setActiveTab('complete-challenge');
                        }} 
                        className="btn btn-primary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'var(--success)' }}
                      >
                        שלח הוכחה 📷
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* TAB NAVIGATION BAR */}
      <nav className="tab-navigation">
        <button className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
          <ActivityIcon size={20} />
        </button>
        
        <button className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`} onClick={() => setActiveTab('challenges')}>
          <SwordsIcon size={20} />
        </button>

        <button className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')}>
          <CommentIcon size={20} />
        </button>
        
        <button className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
          <SearchIcon size={20} />
        </button>
        
        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <UserIcon size={20} />
        </button>
      </nav>


      {/* STORY VIEWER MODAL */}
      {activeStoryIndex !== null && (
        <div className="story-viewer-backdrop">
          <div className="story-viewer-content">
            {/* Progress Bars */}
            <div className="story-progress-container" style={{ flexDirection: language === 'he' ? 'row-reverse' : 'row' }}>
              {stories[activeStoryIndex].slides.map((slide, idx) => (
                <div key={slide.id} className="story-progress-track">
                  <div 
                    className="story-progress-fill" 
                    style={{ 
                      width: idx < activeSlideIndex 
                        ? '100%' 
                        : idx === activeSlideIndex 
                          ? `${storyProgress}%` 
                          : '0%' 
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header Info */}
            <div className="story-viewer-header" style={{ direction: language === 'he' ? 'rtl' : 'ltr' }}>
              <div className="story-viewer-user">
                <img src={stories[activeStoryIndex].userAvatar} alt="" className="story-viewer-avatar" />
                <span className="story-viewer-name">{stories[activeStoryIndex].userName}</span>
                <span className="story-viewer-time">{stories[activeStoryIndex].slides[activeSlideIndex].timestamp}</span>
              </div>
              <button className="story-close-btn" onClick={() => { setActiveStoryIndex(null); setActiveSlideIndex(0); setStoryProgress(0); }}>
                <CloseIcon size={24} />
              </button>
            </div>

            {/* Media Content */}
            <div className="story-media-container">
              <button className="story-nav-btn story-nav-prev" onClick={language === 'he' ? handleNextSlide : handlePrevSlide}>
                <ChevronLeftIcon size={24} />
              </button>

              <img src={stories[activeStoryIndex].slides[activeSlideIndex].image} alt="" className="story-image" />

              <button className="story-nav-btn story-nav-next" onClick={language === 'he' ? handlePrevSlide : handleNextSlide}>
                <ChevronRightIcon size={24} />
              </button>
            </div>

            {/* Bottom details overlay */}
            <div className="story-overlay-details">
              <span className="story-overlay-title">🏆 {stories[activeStoryIndex].slides[activeSlideIndex].title}</span>
              <p className="story-overlay-text">{stories[activeStoryIndex].slides[activeSlideIndex].text}</p>
              
              <button 
                onClick={() => handleStoryJoinChallenge(stories[activeStoryIndex].slides[activeSlideIndex].title)}
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '0.5rem', background: 'var(--accent)', color: '#000', fontWeight: 'bold' }}
              >
                🔥 גם אני רוצה לעשות את זה!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMMENTS SHEET MODAL */}
      {commentSheetPostId !== null && (() => {
        const post = feed.find(p => p.id === commentSheetPostId);
        if (!post) return null;
        return (
          <div className="comments-sheet-backdrop" onClick={() => setCommentSheetPostId(null)}>
            <div className="comments-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="comments-sheet-header">
                <span className="comments-sheet-title">תגובות ({post.comments ? post.comments.length : 0})</span>
                <button className="story-close-btn" style={{ color: 'var(--text-primary)' }} onClick={() => setCommentSheetPostId(null)}>
                  <CloseIcon size={22} />
                </button>
              </div>

              {/* Comments list */}
              <div className="comments-list">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map(c => (
                    <div key={c.id} className="comment-row">
                      <div className="comment-content">
                        <div className="comment-author">{c.userName}</div>
                        <div>{c.text}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>אין תגובות עדיין. היו הראשונים להגיב!</p>
                )}
              </div>

              {/* Input container */}
              <div className="comment-input-container" style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="comment-control" 
                  placeholder="הוסיפו תגובה מעודדת..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                  style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                />
                <button 
                  onClick={() => handleAddComment(post.id)}
                  className="btn btn-primary" 
                  style={{ borderRadius: '24px', padding: '0.6rem 1.2rem' }}
                >
                  שלח
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* INSTAGRAM-STYLE CAMERA MODAL */}
      {isCameraOpen && (
        <div className="camera-modal-backdrop">
          <div className="camera-modal-container">
            {/* Camera Viewport */}
            <div className={`camera-viewport ${isCameraFlashing ? 'flash-active' : ''}`}>
              {cameraStream ? (
                <video 
                  id="camera-video-feed"
                  autoPlay 
                  playsInline 
                  muted 
                  ref={el => {
                    if (el && cameraStream && el.srcObject !== cameraStream) {
                      el.srcObject = cameraStream;
                    }
                  }}
                  className={`camera-video filter-${cameraFilter} facing-${cameraFacingMode}`}
                />
              ) : (
                /* High-fidelity Mock camera view if WebRTC is unavailable */
                <div className={`camera-simulator-bg filter-${cameraFilter}`}>
                  <div className="simulator-overlay-mesh"></div>
                  <div className="simulator-message">
                    <span>📷 מדמה מצלמה פעילה</span>
                    <p>השתמשו בכפתור הצילום למטה כדי ליצור סטורי</p>
                  </div>
                  {/* Floating elements to feel dynamic */}
                  <div className="pulsing-record-indicator">
                    <span className="dot"></span> LIVE
                  </div>
                </div>
              )}

              {/* Viewfinder Grid overlay */}
              <div className="camera-grid-overlay">
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
              </div>

              {/* Captured Image Preview Overlay (if taken but not yet published) */}
              {capturedImage && (
                <div className="camera-preview-overlay">
                  <img src={capturedImage} alt="Preview" className={`camera-preview-img filter-${cameraFilter}`} />
                  
                  {/* Floating text preview on the photo */}
                  {storyCaption && (
                    <div className="story-floating-text-preview">
                      {storyCaption}
                    </div>
                  )}

                  {/* Floating Tag Preview */}
                  {storyTaggedChallenge && (
                    <div className="story-floating-tag-preview">
                      🏆 {storyTaggedChallenge}
                    </div>
                  )}
                </div>
              )}

              {/* Top controls (Flash / Switch Camera / Close) */}
              <div className="camera-top-controls">
                <button 
                  className="camera-circle-btn" 
                  onClick={() => {
                    setIsCameraOpen(false);
                    setCapturedImage(null);
                  }}
                >
                  <CloseIcon size={22} />
                </button>

                {!capturedImage && (
                  <>
                    <button 
                      className="camera-circle-btn" 
                      onClick={() => setCameraFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
                    >
                      🔄
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Customization Panel & Actions */}
              <div className="camera-bottom-panel">
                {!capturedImage ? (
                  /* Capture Mode controls */
                  <>
                    {/* Select Challenge to Tag */}
                    <div className="camera-tag-section">
                      <label style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' }}>תייגו אתגר בסטורי:</label>
                      <select 
                        value={storyTaggedChallenge} 
                        onChange={(e) => setStoryTaggedChallenge(e.target.value)}
                        className="camera-select"
                      >
                        <option value="">בחר אתגר לתיוג (אופציונלי)...</option>
                        {challenges.map(c => (
                          <option key={c.id} value={c.title}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Filter Selector carousel */}
                    <div className="camera-filters-carousel">
                      {[
                        { id: 'normal', name: 'רגיל' },
                        { id: 'warm', name: 'זהב' },
                        { id: 'cool', name: 'אקווה' },
                        { id: 'neon', name: 'ניאון' },
                        { id: 'retro', name: 'וינטג\'' }
                      ].map(f => (
                        <button 
                          key={f.id} 
                          onClick={() => setCameraFilter(f.id)}
                          className={`filter-selector-btn ${cameraFilter === f.id ? 'active' : ''}`}
                        >
                          <div className={`filter-preview-circle filter-${f.id}`}></div>
                          <span>{f.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Capturing buttons */}
                    <div className="camera-shutter-row">
                      {/* File upload fallback */}
                      <label className="camera-upload-btn" title="העלאת תמונה">
                        🖼️
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setCapturedImage(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          style={{ display: 'none' }} 
                        />
                      </label>

                      {/* Shutter Circle */}
                      <button className="camera-shutter-btn" onClick={capturePhoto}>
                        <div className="inner-shutter"></div>
                      </button>

                      <div style={{ width: 44 }}></div>
                    </div>
                  </>
                ) : (
                  /* Edit / Share Mode controls */
                  <div className="camera-preview-actions">
                    <div className="form-group" style={{ width: '100%', marginBottom: '1rem' }}>
                      <input 
                        type="text" 
                        placeholder="כתבו משהו על הסטורי..." 
                        value={storyCaption}
                        onChange={(e) => setStoryCaption(e.target.value)}
                        className="form-control"
                        style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', textAlign: 'center' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                      <button className="btn btn-secondary" style={{ flex: 1, background: 'rgba(255,255,255,0.2)', color: '#fff' }} onClick={() => setCapturedImage(null)}>
                        🔄 צלם מחדש
                      </button>
                      <button className="btn btn-primary" style={{ flex: 1, background: 'var(--success)', color: '#000' }} onClick={handlePublishStory}>
                        🚀 שתף לסטורי
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* USER PROFILE MODAL */}
      {isUserModalOpen && selectedUserForModal && selectedUserForModal.id !== currentUser.id && (
        <div className="user-profile-modal-backdrop" onClick={() => setIsUserModalOpen(false)}>
          <div className="user-profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-close">
              <h3 style={{ fontWeight: 800, margin: 0 }}>פרופיל שחקן</h3>
              <button className="story-close-btn" style={{ color: 'var(--text-primary)' }} onClick={() => setIsUserModalOpen(false)}>
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div style={{ padding: '1rem' }}>
              {/* 1. Player Details Header */}
              <div className="game-profile-header" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem' }}>
                <div className="game-avatar-wrapper" style={{ width: 50, height: 50 }}>
                  <img src={selectedUserForModal.avatar} alt="" className="game-avatar-img" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                <div className="game-user-details">
                  <h4 style={{ fontWeight: 800, margin: 0, fontSize: '1.2rem' }}>{selectedUserForModal.name}</h4>
                  <span className="game-level-tag" style={{ fontSize: '0.65rem' }}>דרגה {Math.floor(selectedUserForModal.xp / 500) + 1}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginRight: '0.5rem', fontWeight: 'bold' }}>
                    {Math.floor(selectedUserForModal.xp / 500) + 1 >= 5 ? '🏅 אלוף מיתולוגי' :
                     Math.floor(selectedUserForModal.xp / 500) + 1 >= 4 ? '🛡️ גיבור' :
                     Math.floor(selectedUserForModal.xp / 500) + 1 >= 3 ? '⚔️ לוחם' :
                     Math.floor(selectedUserForModal.xp / 500) + 1 >= 2 ? '⚡ מתלמד' : '🌱 טירון'}
                  </span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 'bold', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>🏆 {selectedUserForModal.xp} גביעים</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>• מקום {selectedUserForModal.rank || '#'}</span>
                  </div>
                </div>
              </div>

              {/* 2. 3D Avatar Podium */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <AvatarPodium 
                  avatarConfig={selectedUserForModal.avatarConfig || { base: 'base_male_1', top: 'tshirt_black', bottom: 'shorts_black', shoes: 'sneakers_white', glowColor: '#00ffff' }}
                  isCustomizable={false}
                />
              </div>

              {/* Follow / Joint Challenge buttons */}
              {selectedUserForModal.id !== currentUser.id && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <button 
                    onClick={() => handleFollowUser(selectedUserForModal.id)} 
                    className={`btn ${currentUser.following?.includes(selectedUserForModal.id) ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem 0' }}
                  >
                    {currentUser.following?.includes(selectedUserForModal.id) ? '✓ עוקב' : 'עקוב'}
                  </button>
                  <button 
                    onClick={() => {
                      setInviteTargetUserId(selectedUserForModal.id);
                      setIsInviteModalOpen(true);
                      setIsUserModalOpen(false);
                    }}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem 0', background: 'var(--accent)', color: '#000', fontWeight: 'bold' }}
                  >
                    🤝 אתגר יחד
                  </button>
                </div>
              )}

              {/* Social Stats Row */}
              <div className="social-stats-row">
                <div className="social-stat-item">
                  <span className="social-stat-value">{selectedUserForModal.followers?.length || 0}</span>
                  <span className="social-stat-label">עוקבים</span>
                </div>
                <div className="social-stat-item" style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', padding: '0 1.5rem' }}>
                  <span className="social-stat-value">{selectedUserForModal.following?.length || 0}</span>
                  <span className="social-stat-label">עוקב אחרי</span>
                </div>
                <div className="social-stat-item">
                  <span className="social-stat-value">{selectedUserForModal.completedChallengesCount}</span>
                  <span className="social-stat-label">השלמות</span>
                </div>
              </div>

              {/* Achievements */}
              <h4 style={{ fontSize: '0.85rem', color: '#ffd700', fontWeight: 'bold', margin: '1rem 0 0.5rem' }}>תגים נוצצים</h4>
              <div className="scout-patch-container" style={{ marginTop: '0.5rem' }}>
                {selectedUserForModal.badges?.map((b, idx) => {
                  const parts = b.split(' ');
                  const emoji = parts[0] || '🏅';
                  const title = parts.slice(1).join(' ') || b;
                  
                  const patchColors = [
                    { bg: '#132a13', border: '#ffd700' },
                    { bg: '#0f2027', border: '#cbd5e1' },
                    { bg: '#3a0ca3', border: '#f72585' },
                    { bg: '#4a154b', border: '#ffb703' },
                    { bg: '#1f1f2e', border: '#8ecae6' }
                  ];
                  const colorConfig = patchColors[idx % patchColors.length];
                  const shapes = ['circle', 'shield', 'hexagon', 'diamond', 'octagon'];
                  const shape = shapes[idx % shapes.length];
                  const sizes = ['sm', 'md', 'lg'];
                  const size = sizes[idx % sizes.length];
                  const emojiFontSize = size === 'sm' ? '1.8rem' : size === 'md' ? '2.4rem' : '2.9rem';

                  const getBadgeDesc = (titleStr) => {
                    if (titleStr.includes('רצף') || titleStr.includes('7 ימים')) {
                      return 'הוענק על שמירה על מוטיבציה ופעילות רציפה באפליקציה במשך שבוע שלם ללא הפסקה!';
                    }
                    if (titleStr.includes('מרתון')) {
                      return 'הוענק על השלמת אתגר ריצה מפרך למרחק רב. כוח רצון של פלדה!';
                    }
                    if (titleStr.includes('פסגות')) {
                      return 'הוענק למטפסי הרים כבירים שהשלימו אתגר גובה יוצא דופן!';
                    }
                    if (titleStr.includes('ברזל')) {
                      return 'הוענק למי שהוכיח עמידות פיזית קיצונית וכוח סיבולת על-אנושי באתגרי כוח קשים!';
                    }
                    if (titleStr.includes('זריז')) {
                      return 'הוענק על ביצוע אתגרים במהירות שיא וזמן תגובה מדהים!';
                    }
                    return 'תג הצטיינות מיוחד המוענק לחברי תנועת האתגרים על השלמת יעדים ייחודיים!';
                  };

                  const badgeDetail = {
                    title,
                    emoji,
                    desc: getBadgeDesc(title),
                    colorConfig,
                    shape,
                    size
                  };

                  return (
                    <div 
                      key={b} 
                      className="scout-patch-badge"
                      title={`תג הישג: ${title} - לחץ לפרטים`}
                      onClick={() => setActiveBadgeDetail(badgeDetail)}
                    >
                      <div 
                        className={`scout-patch-circle patch-shape-${shape} patch-size-${size}`}
                        style={{
                          background: colorConfig.bg,
                          '--metal-border': colorConfig.border
                        }}
                      >
                        <div className="scout-patch-gloss"></div>
                        <span className="scout-patch-emoji" style={{ fontSize: emojiFontSize }}>{emoji}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JOINT CHALLENGE INVITATION MODAL */}
      {isInviteModalOpen && inviteTargetUserId && (
        <div className="user-profile-modal-backdrop" onClick={() => setIsInviteModalOpen(false)}>
          <div className="user-profile-modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.25rem' }}>
            <div className="modal-header-close" style={{ padding: 0, marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 800, margin: 0 }}>הזמן לאתגר משותף 🤝</h3>
              <button className="story-close-btn" style={{ color: 'var(--text-primary)' }} onClick={() => setIsInviteModalOpen(false)}>
                <CloseIcon size={24} />
              </button>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              בחר אתגר מתוך רשימת האתגרים הזמינים כדי להזמין את{' '}
              <strong>{users.find(u => u.id === inviteTargetUserId)?.name}</strong> להשלים ביחד איתך:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {challenges.map(c => (
                <div 
                  key={c.id} 
                  className="glass-card" 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', cursor: 'pointer', border: '1px solid var(--border)' }}
                  onClick={() => handleSendJointChallenge(inviteTargetUserId, c.id)}
                >
                  <div>
                    <h4 style={{ fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>{c.title}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>פרס: {c.xpReward} גביעים 🏆</span>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', background: 'var(--accent)', color: '#000', fontWeight: 'bold' }}
                  >
                    הזמן
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EXPLORE SCROLLABLE REELS MODAL */}
      {exploreReelsStartIndex !== null && (
        <div className="story-viewer-backdrop" style={{ zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
          {/* Header row in modal */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 1.5rem',
            zIndex: 1001,
            color: '#fff',
            direction: 'rtl'
          }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>אקספלור סרטונים 🎬</span>
            <button 
              onClick={() => setExploreReelsStartIndex(null)} 
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '1.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              ✕
            </button>
          </div>

          {/* Scrolling Reels Container */}
          <div 
            ref={(el) => {
              if (el && exploreReelsStartIndex !== null) {
                const selectedCard = el.children[exploreReelsStartIndex];
                if (selectedCard) {
                  selectedCard.scrollIntoView({ behavior: 'auto' });
                }
              }
            }}
            className="reels-feed-container" 
            style={{ 
              borderRadius: 0, 
              width: '100%', 
              height: '100vh',
              maxHeight: '100vh',
              border: 'none'
            }}
          >
            {feed.map((post, idx) => {
              const postAuthor = users.find(u => u.id === post.userId);
              const isAuthorBlocked = postAuthor ? postAuthor.isBlocked : false;
              const associatedChallenge = challenges.find(c => c.title === post.challengeTitle);
              const isJoinedChallenge = currentUser.activeChallenges.includes(associatedChallenge?.id);

              return (
                <div 
                  key={`explore_reel_${post.id}`} 
                  className="reel-card"
                  onDoubleClick={() => handleDoubleTapPost(post.id)}
                >
                  {/* Background visual */}
                  {post.proofImage && (
                    <img src={post.proofImage} alt="הישג" className="reel-bg-image" />
                  )}

                  {/* Gradient Overlay for text contrast */}
                  <div className="reel-overlay-gradient"></div>

                  {/* Double-tap Floating Fire pop animation */}
                  {doubleTapPostId === post.id && (
                    <div className="double-tap-fire-anim">
                      <FireIcon size={80} fill="currentColor" />
                    </div>
                  )}

                  {/* Left vertical actions column */}
                  <div className="reel-actions-column">
                    {/* Claps */}
                    <div className="reel-action-btn-wrapper" onClick={() => handleClapPost(post.id)}>
                      <div className={`reel-action-circle ${post.hasClapped ? 'active-clap' : ''}`}>
                        <FireIcon size={24} fill={post.hasClapped ? "currentColor" : "none"} />
                      </div>
                      <span className="reel-action-text">{post.claps}</span>
                    </div>

                    {/* Comments Sheet Trigger */}
                    <div className="reel-action-btn-wrapper" onClick={() => setCommentSheetPostId(post.id)}>
                      <div className="reel-action-circle">
                        <CommentIcon size={24} />
                      </div>
                      <span className="reel-action-text">{post.comments ? post.comments.length : 0}</span>
                    </div>

                    {/* Dumbbell Icon to join challenge */}
                    {associatedChallenge && (
                      <div className="reel-action-btn-wrapper" onClick={() => {
                        toggleJoinChallenge(associatedChallenge.id);
                        if (!isJoinedChallenge) {
                          alert(`💪 הצטרפת לאתגר: ${associatedChallenge.title}! צבור גביעים עכשיו! 🏆`);
                        }
                      }}>
                        <div className="reel-action-circle" style={{ color: isJoinedChallenge ? 'var(--success)' : 'var(--accent)' }}>
                          <SwordsIcon size={22} />
                        </div>
                        <span className="reel-action-text" style={{ fontSize: '0.65rem' }}>{isJoinedChallenge ? 'משתתף' : 'אתגר אותי'}</span>
                      </div>
                    )}
                  </div>

                  {/* Reel text information overlay */}
                  <div className="reel-info-container">
                    <div className="reel-author-row" style={{ cursor: 'pointer' }} onClick={() => {
                      const targetUsr = users.find(u => u.id === post.userId) || users.find(u => u.name === post.userName);
                      if (targetUsr) {
                        setSelectedUserForModal(targetUsr);
                        setIsUserModalOpen(true);
                        setExploreReelsStartIndex(null);
                      }
                    }}>
                      <img src={post.userAvatar} alt={post.userName} className="reel-author-avatar" />
                      <span className="reel-author-name">{post.userName}</span>
                      {isAuthorBlocked && (
                        <span style={{ background: '#ff4d4d', color: '#fff', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>חסום ⛔</span>
                      )}
                      <span className="reel-streak-tag">
                        🔥 רצף {post.streak || 5} ימים
                      </span>
                    </div>

                    <div className="reel-challenge-tag">
                      🏆 {post.challengeTitle}
                    </div>

                    <div className="reel-desc">
                      {post.achievementDetail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SCOUT BADGE DETAILS MODAL */}
      {activeBadgeDetail && (
        <div className="user-profile-modal-backdrop" onClick={() => setActiveBadgeDetail(null)} style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)' }}>
          <div 
            className="user-profile-modal-content challenge-detail-modal" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              padding: '2.5rem 1.5rem 1.5rem', 
              maxWidth: '380px', 
              width: '90%',
              textAlign: 'center', 
              background: 'var(--bg-secondary)', 
              color: 'var(--text-primary)',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div className="modal-header-close" style={{ padding: 0, justifyContent: 'flex-end', marginBottom: '0.5rem', display: 'flex' }}>
              <button 
                className="story-close-btn" 
                style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }} 
                onClick={() => setActiveBadgeDetail(null)}
              >
                <CloseIcon size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0 1.5rem' }}>
              <div 
                className={`scout-patch-circle patch-shape-${activeBadgeDetail.shape} patch-size-lg`}
                style={{
                  background: activeBadgeDetail.colorConfig.bg,
                  color: activeBadgeDetail.colorConfig.border,
                  width: '110px',
                  height: '110px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  transform: 'scale(1.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifycontent: 'center'
                }}
              >
                <div className="scout-patch-gloss"></div>
                <span className="scout-patch-emoji" style={{ fontSize: '3.5rem', display: 'block', lineHeight: 1 }}>{activeBadgeDetail.emoji}</span>
              </div>
            </div>

            <h3 style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.75rem', direction: 'rtl' }}>
              {activeBadgeDetail.title}
            </h3>
            
            <div style={{
              background: 'var(--bg-tertiary)',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid var(--border)',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
              direction: 'rtl'
            }}>
              {activeBadgeDetail.desc}
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', borderRadius: '9999px', background: 'var(--accent)' }} 
              onClick={() => setActiveBadgeDetail(null)}
            >
              המשך
            </button>
          </div>
        </div>
      )}

      {/* AI REFEREE COURT MODAL */}
      {activeJudgeMatchId && (() => {
        const match = matches.find(m => m.id === activeJudgeMatchId);
        if (!match) return null;
        const challenger = users.find(u => u.id === match.challengerId);
        const opponent = users.find(u => u.id === match.opponentId);
        return (
          <AIRefereeCourt 
            match={match}
            challenger={challenger}
            opponent={opponent}
            onClose={() => setActiveJudgeMatchId(null)}
            onVerdict={handleRefereeVerdict}
          />
        );
      })()}
    </div>

  );
}

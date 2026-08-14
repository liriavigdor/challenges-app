import React, { useState, useEffect } from 'react';
import { 
  FireIcon, 
  TrophyIcon, 
  DumbbellIcon, 
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
  BellIcon
} from './icons';
import { initialUsers, initialChallenges, initialFeed, initialStories, initialNotifications } from './mockData';
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

export default function App() {

  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('feed');
  const [users, setUsers] = useState(initialUsers);
  const [challenges, setChallenges] = useState(initialChallenges);
  const [feed, setFeed] = useState(initialFeed);
  const [stories, setStories] = useState(() => {
    const saved = localStorage.getItem('challenges_stories');
    return saved ? JSON.parse(saved) : initialStories;
  });
  
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

  // Reels interactive animation states
  const [doubleTapPostId, setDoubleTapPostId] = useState(null);
  const [commentSheetPostId, setCommentSheetPostId] = useState(null);
  
  // Current user simulator (רועי כהן)
  const [currentUser, setCurrentUser] = useState(initialUsers[0]);

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
  
  // Search and Explore States
  const [peopleSearchQuery, setPeopleSearchQuery] = useState('');
  const [selectedExplorePost, setSelectedExplorePost] = useState(null);


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

  // Form states for creating a new challenge
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [newChallengeDesc, setNewChallengeDesc] = useState('');
  const [newChallengeCategory, setNewChallengeCategory] = useState('כוח');
  const [newChallengeDifficulty, setNewChallengeDifficulty] = useState('קל');
  const [newChallengeXp, setNewChallengeXp] = useState(200);
  const [newChallengeProofText, setNewChallengeProofText] = useState('');
  const [newChallengeProofImage, setNewChallengeProofImage] = useState('');

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

  // Join or Leave a challenge
  const toggleJoinChallenge = async (challengeId) => {
    if (currentUser.isBlocked) {
      alert("חשבונך חסום. אינך יכול להצטרף לאתגרים.");
      return;
    }
    let updatedActiveChallenges;
    if (currentUser.activeChallenges.includes(challengeId)) {
      updatedActiveChallenges = currentUser.activeChallenges.filter(id => id !== challengeId);
    } else {
      updatedActiveChallenges = [...currentUser.activeChallenges, challengeId];
    }
    
    const updatedUser = { ...currentUser, activeChallenges: updatedActiveChallenges };
    setCurrentUser(updatedUser);
    
    // Update in users list
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    await updateUser(updatedUser);
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

  // Double tap to like with animation trigger
  const handleDoubleTapPost = (postId) => {
    if (currentUser.isBlocked) return;
    
    // Trigger pop animation
    setDoubleTapPostId(postId);
    setTimeout(() => setDoubleTapPostId(null), 800);

    // Perform like if not already liked
    setFeed(prev => prev.map(post => {
      if (post.id === postId && !post.hasLiked) {
        return {
          ...post,
          likes: post.likes + 1,
          hasLiked: true
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
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      difficultyGrades: [newChallengeDifficulty === 'קל' ? 1 : newChallengeDifficulty === 'בינוני' ? 3 : newChallengeDifficulty === 'קשה' ? 4 : 5],
      isIconic: false
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

  // Filter categories helper
  const categories = ['הכל', 'כוח', 'אירובי', 'ליבה', 'שטח'];
  const filteredChallenges = challenges.filter(c => {
    const matchesCategory = selectedCategory === 'הכל' || c.category === selectedCategory;
    const matchesSearch = c.title.includes(searchQuery) || c.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <div 
          className="logo-container" 

          onClick={() => {
            if (activeTab === 'feed') {
              setIsNotifOpen(!isNotifOpen);
              if (!isNotifOpen) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              }
            }
          }}
          style={{ cursor: activeTab === 'feed' ? 'pointer' : 'default', position: 'relative' }}
        >
          <ActivityIcon className="logo-icon" size={28} style={{ color: 'var(--accent)' }} />
          <span className="logo-text">Pulse ⚡</span>
          {activeTab === 'feed' && notifications.some(n => !n.read) && (
            <span className="notification-dot" style={{ position: 'absolute', top: '-4px', right: '-4px' }}></span>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
          <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
          </button>


          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="notifications-dropdown">
              <div className="notif-header">
                <span>התראות</span>
                <button className="story-close-btn" style={{ color: 'var(--text-primary)', fontSize: '0.75rem' }} onClick={() => setIsNotifOpen(false)}>סגור</button>
              </div>
              {notifications.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>אין התראות חדשות</p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                    <img 
                      src={n.senderAvatar} 
                      alt="" 
                      className="notif-avatar" 
                      onClick={() => {
                        const targetUsr = users.find(u => u.id === n.senderId);
                        if (targetUsr) {
                          setSelectedUserForModal(targetUsr);
                          setIsUserModalOpen(true);
                          setIsNotifOpen(false);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <div className="notif-content">
                      <div>
                        <strong 
                          style={{ cursor: 'pointer', color: 'var(--accent)' }}
                          onClick={() => {
                            const targetUsr = users.find(u => u.id === n.senderId);
                            if (targetUsr) {
                              setSelectedUserForModal(targetUsr);
                              setIsUserModalOpen(true);
                              setIsNotifOpen(false);
                            }
                          }}
                        >
                          {n.senderName}
                        </strong>{' '}
                        {n.text}
                      </div>
                      <span className="notif-time">{n.timestamp}</span>
                      
                      {n.type === 'joint_challenge' && (
                        <div className="notif-actions">
                          {n.status === 'pending' ? (
                            <>
                              <button 
                                className="btn btn-primary" 
                                style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', background: 'var(--success)' }}
                                onClick={() => handleAcceptJointChallenge(n)}
                              >
                                אשר 👍
                              </button>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                                onClick={() => handleDeclineJointChallenge(n.id)}
                              >
                                סרב ✖
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: n.status === 'accepted' ? 'var(--success)' : 'var(--text-muted)', fontWeight: 'bold' }}>
                              {n.status === 'accepted' ? 'התקבל ✓' : 'סורב'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          <div className="user-info" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
            <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" style={{ width: 34, height: 34 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {currentUser.name}
                <span style={{ color: '#ffa500', fontSize: '0.8rem' }}>🔥 {currentUser.streak || 7}</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>Level {Math.floor(currentUser.xp / 500) + 1}</span>
            </div>
          </div>
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
        
        {/* TAB 1: FEED */}
        {activeTab === 'feed' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Instagram-style Stories Slider */}
            <div className="stories-wrapper">
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
                {stories.map((story, index) => (
                  <div key={story.id} className="story-circle" onClick={() => {
                    setActiveStoryIndex(index);
                    setActiveSlideIndex(0);
                    setStoryProgress(0);
                  }}>
                    <div className="story-avatar-wrapper">
                      <img src={story.userAvatar} alt={story.userName} className="story-avatar-img" />
                    </div>
                    <span className="story-username">{story.userName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reels-style swiping container */}
            <div className="reels-feed-container">
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

                    {/* Double-tap Floating Heart pop animation */}
                    {doubleTapPostId === post.id && (
                      <div className="double-tap-heart-anim">
                        <HeartIcon size={80} fill="currentColor" />
                      </div>
                    )}

                    {/* Left vertical actions column (Instagram Reels layout) */}
                    <div className="reel-actions-column">
                      {/* Likes */}
                      <div className="reel-action-btn-wrapper" onClick={() => handleLikePost(post.id)}>
                        <div className={`reel-action-circle ${post.hasLiked ? 'active-heart' : ''}`}>
                          <HeartIcon size={24} fill={post.hasLiked ? "currentColor" : "none"} />
                        </div>
                        <span className="reel-action-text">{post.likes}</span>
                      </div>

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
                            alert(`💪 הצטרפת לאתגר: ${associatedChallenge.title}! צבור נקודות XP עכשיו!`);
                          }
                        }}>
                          <div className="reel-action-circle" style={{ background: isJoinedChallenge ? 'var(--success)' : 'var(--accent)', color: '#000' }}>
                            <DumbbellIcon size={22} />
                          </div>
                          <span className="reel-action-text" style={{ fontSize: '0.65rem' }}>{isJoinedChallenge ? 'משתתף' : 'אתגר אותי'}</span>
                        </div>
                      )}

                      {/* Report button */}
                      <div className="reel-action-btn-wrapper" onClick={() => handleReportPost(post.id)} style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>🚩</span>
                        <span className="reel-action-text" style={{ fontSize: '0.65rem' }}>דווח</span>
                      </div>
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
              <h2 style={{ fontWeight: 800 }}>אתגרים פתוחים</h2>
              <button onClick={() => setActiveTab('create')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <PlusIcon size={18} /> יוזמה חדשה
              </button>
            </div>

            {/* Filters */}
            <div className="category-filter">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="חפשו אתגר ספציפי..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div className="challenges-grid">
              {filteredChallenges.map(c => {
                const isJoined = currentUser.activeChallenges.includes(c.id);
                const isExpanded = expandedChallengeId === c.id;
                return (
                  <div key={c.id} className="glass-card challenge-card" style={{ position: 'relative', padding: '1rem' }}>
                    {c.isIconic && (
                      <div className="iconic-ribbon" style={{ position: 'absolute', top: '10px', right: '10px', background: 'linear-gradient(135deg, #ffd700, #ffa500)', color: '#000', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 2 }}>
                        ⭐ אתגר אייקוני
                      </div>
                    )}
                    
                    <div 
                      className="accordion-header" 
                      onClick={() => setExpandedChallengeId(isExpanded ? null : c.id)}
                    >
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{c.title}</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          <span className={`difficulty-tag difficulty-${c.difficulty}`}>{c.difficulty}</span>
                          <span>⚡ {c.xpReward} XP</span>
                          <span>👥 {c.participantsCount} משתתפים</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '1.2rem', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                        ▼
                      </span>
                    </div>

                    <div className={`accordion-content ${isExpanded ? 'expanded' : ''}`}>
                      {c.image && <img src={c.image} alt={c.title} className="challenge-img" style={{ maxHeight: '140px', marginTop: '0.5rem' }} />}
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>📊 קושי קהילה:</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                          {c.difficultyGrades && c.difficultyGrades.length > 0
                            ? `⭐ ${(c.difficultyGrades.reduce((sum, val) => sum + val, 0) / c.difficultyGrades.length).toFixed(1)} / 5`
                            : 'אין דירוג עדיין'}
                        </span>
                      </div>

                      {c.isIconic && c.badgeReward && (
                        <div style={{ background: 'rgba(255,215,0,0.1)', border: '1px dashed #ffd700', padding: '0.3rem 0.5rem', borderRadius: '8px', margin: '0.5rem 0', fontSize: '0.8rem', color: '#ffd700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>🏆 מעניק תג:</span>
                          <strong>{c.badgeReward}</strong>
                        </div>
                      )}
                      
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.75rem 0' }}>{c.description}</p>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => toggleJoinChallenge(c.id)} 
                          className={`btn ${isJoined ? 'btn-secondary' : 'btn-primary'}`} 
                          style={{ flex: 1 }}
                        >
                          {isJoined ? 'עזוב אתגר' : 'הצטרף לאתגר'}
                        </button>
                        
                        {isJoined && (
                          <button 
                            onClick={() => {
                              setProofChallengeId(c.id);
                              setActiveTab('complete-challenge');
                            }} 
                            className="btn btn-primary" 
                            style={{ background: 'var(--success)' }}
                          >
                            העלה הוכחה 📷
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
              <form onSubmit={handleCreateChallenge} className="creator-split-grid">
                
                {/* LEFT COLUMN: TikTok / Instagram Style Live Preview & Media Selector */}
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
                        
                        {/* Dynamic XP counter */}
                        <div className="mock-xp-row">
                          <span>XP מוענק:</span>
                          <span className="mock-xp-glow">
                            +{Math.round(Number(newChallengeXp) * (newChallengeDifficulty === 'בינוני' ? 1.2 : newChallengeDifficulty === 'קשה' ? 1.5 : newChallengeDifficulty === 'קשה מאוד' ? 2.0 : 1.0))} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preset Sporty Media Options */}
                  <div className="media-preset-section">
                    <span className="section-label">בחרו תמונת אווירה ספורטיבית:</span>
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

                    <div className="form-group" style={{ marginTop: '0.75rem' }}>
                      <input 
                        type="url" 
                        className="form-control" 
                        placeholder="או הדביקו כתובת תמונה מותאמת אישית..."
                        value={newChallengeProofImage}
                        onChange={(e) => setNewChallengeProofImage(e.target.value)}
                        style={{ fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Details & Settings Panel */}
                <div className="creator-details-pane">
                  {/* Step 1: Core Details */}
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

                  {/* Step 2: Proof & Captions */}
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

                    <div className="form-group">
                      <label className="form-label">תג מיקום (Location Tag)</label>
                      <select className="form-control">
                        <option value="">בחר מיקום (אופציונלי)...</option>
                        <option value="פארק הירקון">🌳 פארק הירקון, תל אביב</option>
                        <option value="הולמס פלייס">🏋️‍♂️ מועדון הולמס פלייס</option>
                        <option value="חוף הים">🏖️ טיילת חוף הים</option>
                        <option value="החרמון">🏔️ הר החרמון</option>
                      </select>
                    </div>
                  </div>

                  {/* Rewards & Publish */}
                  <div className="glass-card creator-section-card" style={{ border: '1px solid var(--accent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 'bold' }}>בסיס XP לפרס:</span>
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
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>הניקוד הסופי מחושב אוטומטית לפי רמת הקושי שבחרתם.</p>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'var(--accent)', color: '#000', fontWeight: 'bold', fontSize: '1.05rem', boxShadow: '0 4px 15px var(--accent-glow)' }}>
                      אשר ביצוע ושתף לפוסט 🚀
                    </button>
                  </div>
                </div>

              </form>
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
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LEVEL {Math.floor(user.xp / 500) + 1} • {user.xp} XP</span>
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
              {feed.map(post => (
                <div 
                  key={post.id} 
                  className="explore-card"
                  onClick={() => setSelectedExplorePost(post)}
                >
                  <video 
                    src={getPostVideo(post)} 
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
            {/* RPG Character Profile Card */}
            <div className="game-hud-card">
              <div className="game-profile-header">
                <div className="game-avatar-wrapper">
                  <img src={currentUser.avatar} alt={currentUser.name} className="game-avatar-img" />
                </div>
                <div className="game-user-details">
                  <h2 style={{ fontWeight: 800, margin: 0, fontSize: '1.4rem' }}>
                    {currentUser.name}
                    {currentUser.isBlocked && (
                      <span style={{ marginRight: '0.5rem', background: '#ff4d4d', color: '#fff', fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>חסום ⛔</span>
                    )}
                  </h2>
                  
                  {/* Gamer Title & Level */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                    <span className="game-level-tag">LEVEL {Math.floor(currentUser.xp / 500) + 1}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {Math.floor(currentUser.xp / 500) + 1 >= 5 ? '🏅 אלוף מיתולוגי' :
                       Math.floor(currentUser.xp / 500) + 1 >= 4 ? '🛡️ גיבור' :
                       Math.floor(currentUser.xp / 500) + 1 >= 3 ? '⚔️ לוחם' :
                       Math.floor(currentUser.xp / 500) + 1 >= 2 ? '⚡ מתלמד' : '🌱 טירון'}
                    </span>
                  </div>

                  {/* Level Progress Bar */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      <span>XP {currentUser.xp % 500} / 500</span>
                      <span>התקדמות לדרגה הבאה</span>
                    </div>
                    <div className="game-stat-bar-bg" style={{ height: '6px' }}>
                      <div className="game-stat-bar-fill fill-agility" style={{ width: `${(currentUser.xp % 500) / 5}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Stats Row */}
              <div className="social-stats-row" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '0.5rem' }}>
                <div className="social-stat-item">
                  <span className="social-stat-value">{currentUser.followers?.length || 0}</span>
                  <span className="social-stat-label">עוקבים</span>
                </div>
                <div className="social-stat-item" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '0 1.5rem' }}>
                  <span className="social-stat-value">{currentUser.following?.length || 0}</span>
                  <span className="social-stat-label">עוקב אחרי</span>
                </div>
                <div className="social-stat-item">
                  <span className="social-stat-value">{currentUser.completedChallengesCount}</span>
                  <span className="social-stat-label">השלמות</span>
                </div>
              </div>

              {/* RPG Stats / Attributes */}
              <h3 style={{ fontSize: '0.9rem', color: '#c084fc', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.35rem', margin: '1rem 0 0.5rem' }}>מאפייני דמות RPG</h3>
              <div className="game-stats-container">
                <div className="game-stat-row">
                  <div className="game-stat-label">
                    <span>כוח 💪</span>
                    <span>{currentUser.stats?.strength || 50}</span>
                  </div>
                  <div className="game-stat-bar-bg">
                    <div className="game-stat-bar-fill fill-strength" style={{ width: `${currentUser.stats?.strength || 50}%` }}></div>
                  </div>
                </div>
                
                <div className="game-stat-row">
                  <div className="game-stat-label">
                    <span>סיבולת 🏃‍♂️</span>
                    <span>{currentUser.stats?.stamina || 50}</span>
                  </div>
                  <div className="game-stat-bar-bg">
                    <div className="game-stat-bar-fill fill-stamina" style={{ width: `${currentUser.stats?.stamina || 50}%` }}></div>
                  </div>
                </div>

                <div className="game-stat-row">
                  <div className="game-stat-label">
                    <span>זריזות ⚡</span>
                    <span>{currentUser.stats?.agility || 50}</span>
                  </div>
                  <div className="game-stat-bar-bg">
                    <div className="game-stat-bar-fill fill-agility" style={{ width: `${currentUser.stats?.agility || 50}%` }}></div>
                  </div>
                </div>

                <div className="game-stat-row">
                  <div className="game-stat-label">
                    <span>רוגע/מיינד 🧘‍♀️</span>
                    <span>{currentUser.stats?.zen || 50}</span>
                  </div>
                  <div className="game-stat-bar-bg">
                    <div className="game-stat-bar-fill fill-zen" style={{ width: `${currentUser.stats?.zen || 50}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shiny Collectible Badges Grid */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '0.25rem', fontSize: '1.15rem' }}>תגים נוצצים והישגים 🏆</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>תגים יוקרתיים שאספת מאתגרים מיוחדים. רחפו מעליהם כדי לראות את אפקט הניצוץ!</p>
              
              <div className="badges-container">
                {currentUser.badges.map((b, idx) => {
                  const parts = b.split(' ');
                  const emoji = parts[0] || '🏅';
                  const title = parts.slice(1).join(' ') || b;
                  return (
                    <div key={b} className="shiny-badge-card" title="לחצו להציג מידע מלא">
                      <div className="badge-emoji-container">{emoji}</div>
                      <span className="badge-title-text">{title}</span>
                    </div>
                  );
                })}
              </div>
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
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>פרס: {c.xpReward} XP</span>
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
          <DumbbellIcon size={20} />
        </button>

        <button className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
          <PlusIcon size={20} />
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
            <div className="story-progress-container">
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
            <div className="story-viewer-header">
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
              <button className="story-nav-btn story-nav-prev" onClick={handlePrevSlide}>
                <ChevronLeftIcon size={24} />
              </button>

              <img src={stories[activeStoryIndex].slides[activeSlideIndex].image} alt="" className="story-image" />

              <button className="story-nav-btn story-nav-next" onClick={handleNextSlide}>
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
      {isUserModalOpen && selectedUserForModal && (
        <div className="user-profile-modal-backdrop" onClick={() => setIsUserModalOpen(false)}>
          <div className="user-profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-close">
              <h3 style={{ fontWeight: 800, margin: 0 }}>פרופיל שחקן</h3>
              <button className="story-close-btn" style={{ color: 'var(--text-primary)' }} onClick={() => setIsUserModalOpen(false)}>
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div style={{ padding: '1rem' }}>
              <div className="game-profile-header" style={{ marginBottom: '1rem' }}>
                <div className="game-avatar-wrapper" style={{ width: 70, height: 70 }}>
                  <img src={selectedUserForModal.avatar} alt="" className="game-avatar-img" />
                </div>
                <div className="game-user-details">
                  <h4 style={{ fontWeight: 800, margin: 0, fontSize: '1.2rem' }}>{selectedUserForModal.name}</h4>
                  <span className="game-level-tag" style={{ fontSize: '0.65rem' }}>LEVEL {Math.floor(selectedUserForModal.xp / 500) + 1}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginRight: '0.5rem', fontWeight: 'bold' }}>
                    {Math.floor(selectedUserForModal.xp / 500) + 1 >= 5 ? '🏅 אלוף מיתולוגי' :
                     Math.floor(selectedUserForModal.xp / 500) + 1 >= 4 ? '🛡️ גיבור' :
                     Math.floor(selectedUserForModal.xp / 500) + 1 >= 3 ? '⚔️ לוחם' :
                     Math.floor(selectedUserForModal.xp / 500) + 1 >= 2 ? '⚡ מתלמד' : '🌱 טירון'}
                  </span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 'bold', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>⭐ {selectedUserForModal.xp} XP</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>• מקום {selectedUserForModal.rank || '#'}</span>
                  </div>
                </div>

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

              {/* RPG Stats */}
              <h4 style={{ fontSize: '0.85rem', color: '#c084fc', fontWeight: 'bold', margin: '0.75rem 0 0.5rem' }}>מאפייני RPG</h4>
              <div className="game-stats-container" style={{ margin: 0, gap: '0.75rem' }}>
                <div className="game-stat-row">
                  <div className="game-stat-label" style={{ fontSize: '0.75rem' }}>
                    <span>כוח 💪</span>
                    <span>{selectedUserForModal.stats?.strength || 50}</span>
                  </div>
                  <div className="game-stat-bar-bg" style={{ height: '8px' }}>
                    <div className="game-stat-bar-fill fill-strength" style={{ width: `${selectedUserForModal.stats?.strength || 50}%` }}></div>
                  </div>
                </div>
                <div className="game-stat-row">
                  <div className="game-stat-label" style={{ fontSize: '0.75rem' }}>
                    <span>סיבולת 🏃‍♂️</span>
                    <span>{selectedUserForModal.stats?.stamina || 50}</span>
                  </div>
                  <div className="game-stat-bar-bg" style={{ height: '8px' }}>
                    <div className="game-stat-bar-fill fill-stamina" style={{ width: `${selectedUserForModal.stats?.stamina || 50}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <h4 style={{ fontSize: '0.85rem', color: '#ffd700', fontWeight: 'bold', margin: '1rem 0 0.5rem' }}>תגים נוצצים</h4>
              <div className="badges-container" style={{ gap: '0.5rem' }}>
                {selectedUserForModal.badges?.map(b => {
                  const parts = b.split(' ');
                  const emoji = parts[0] || '🏅';
                  const title = parts.slice(1).join(' ') || b;
                  return (
                    <div key={b} className="shiny-badge-card" style={{ padding: '0.5rem 0.25rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{title}</span>
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
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>פרס: {c.xpReward} XP</span>
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

      {/* EXPLORE POST DETAIL MODAL */}
      {selectedExplorePost && (
        <div className="user-profile-modal-backdrop" onClick={() => setSelectedExplorePost(null)}>
          <div className="user-profile-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header-close">
              <h3 style={{ fontWeight: 800, margin: 0 }}>תיעוד אתגר</h3>
              <button className="story-close-btn" style={{ color: 'var(--text-primary)' }} onClick={() => setSelectedExplorePost(null)}>
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div style={{ position: 'relative', width: '100%', aspectRatio: '9 / 16', background: '#000' }}>
              <video 
                src={getPostVideo(selectedExplorePost)} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                controls 
                autoPlay 
                loop
                playsInline
              />
            </div>
            
            <div style={{ padding: '1rem', direction: 'rtl', textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <img 
                  src={selectedExplorePost.userAvatar} 
                  alt="" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', objectFit: 'cover' }}
                  onClick={() => {
                    const postUser = users.find(u => u.id === selectedExplorePost.userId);
                    if (postUser) {
                      setSelectedUserForModal(postUser);
                      setIsUserModalOpen(true);
                      setSelectedExplorePost(null);
                    }
                  }}
                />
                <div>
                  <h4 style={{ fontWeight: 800, margin: 0, fontSize: '1rem' }}>{selectedExplorePost.userName}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedExplorePost.timestamp}</span>
                </div>
              </div>
              
              <h5 style={{ fontWeight: 800, color: 'var(--accent)', marginBottom: '0.25rem' }}>{selectedExplorePost.challengeTitle}</h5>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{selectedExplorePost.achievementDetail}</p>
              
              {/* Like / Clap action row */}
              <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '0.5rem 0', marginBottom: '1rem' }}>
                <button 
                  onClick={() => handleLikePost(selectedExplorePost.id)}
                  style={{ background: 'none', border: 'none', color: selectedExplorePost.hasLiked ? '#ef4444' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}
                >
                  <span>❤️ {selectedExplorePost.likes}</span>
                </button>
                <button 
                  onClick={() => handleClapPost(selectedExplorePost.id)}
                  style={{ background: 'none', border: 'none', color: selectedExplorePost.hasClapped ? 'var(--warning)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}
                >
                  <span>🔥 {selectedExplorePost.claps}</span>
                </button>
              </div>

              {/* Comments Section */}
              <h5 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem' }}>תגובות ({selectedExplorePost.comments?.length || 0})</h5>
              <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {(selectedExplorePost.comments || []).map(comment => (
                  <div key={comment.id} style={{ background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <strong>{comment.userName}: </strong>
                    <span>{comment.text}</span>
                  </div>
                ))}
                {(!selectedExplorePost.comments || selectedExplorePost.comments.length === 0) && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>אין עדיין תגובות. היה הראשון להגיב!</p>
                )}
              </div>

              {/* Add Comment Input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const text = e.target.commentText.value.trim();
                  if (!text) return;
                  
                  // Add comment
                  const newComment = {
                    id: `c_${Date.now()}`,
                    userName: currentUser.name,
                    text: text
                  };

                  // Update database and states
                  const updatedComments = [...(selectedExplorePost.comments || []), newComment];
                  const updatedPost = { ...selectedExplorePost, comments: updatedComments };
                  
                  setFeed(prev => prev.map(p => p.id === selectedExplorePost.id ? updatedPost : p));
                  setSelectedExplorePost(updatedPost);
                  updateFeedPost(updatedPost);
                  
                  e.target.reset();
                }}
                style={{ display: 'flex', gap: '0.5rem' }}
              >
                <input 
                  type="text" 
                  name="commentText" 
                  placeholder="הוסף תגובה..." 
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>שלח</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}

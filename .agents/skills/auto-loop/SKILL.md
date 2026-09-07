---
name: auto-loop
description: >-
  Use this skill when the user asks you to start an autonomous work loop or act autonomously. It instructs the agent to read tasks from agent_tasks.md, execute them one by one, and update agent_status.md.
---

# Autonomous Work Loop Protocol (לופ העבודה האוטונומי)

When invoked, you must follow this autonomous work loop exactly as defined:

1. **קרא משימות**: קרא את המשימות מתוך הקובץ `agent_tasks.md`.
2. **בצע ברצף**: התחל לבצע אותן אחת אחרי השנייה ברצף ובאופן אוטונומי.
3. **עדכן סטטוס**: בכל פעם שסיימת משימה או תיקון, עדכן את הסטטוס ב-`agent_status.md`.
4. **סמן כבוצע**: סמן את המשימה כ-`[x]` ב-`agent_tasks.md`.
5. **בקשת בדיקה ויזואלית**: אם התיקון דורש בדיקה ויזואלית, תרשום ב-`agent_status.md`: `@Reviewer: תוקן, מוכן לבדיקה`
6. **המשך הלאה**: עבור מיד למשימה הבאה במידה שיש כאלו, ללא צורך בהמתנה לאישור מהמשתמש.

הקפד להמשיך בלופ עד שכל המשימות בקובץ `agent_tasks.md` מסומנות כהושלמו.

"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight, CalendarPlus, Check, ChevronRight, CircleUserRound, Clock3,
  LockKeyhole, Map, Palette, Plus, RotateCcw,
  Settings, Sparkles, Star, X, Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import RegistrationCopilot from "@/components/RegistrationCopilot";

type Category = "Housing" | "Financial" | "Academic" | "Orientation" | "Social" | "Other";
type Task = { id: string; title: string; description: string; category: Category; deadline?: string; points: number; completed: boolean; order: number; emailSource?: string; emailSubject?: string; actionRequired?: string };
type EmailSignal = { id:string; sender:string; subject:string; kind:"enhance"|"side"; taskId?:string; title:string; action:string; deadline:string; category:Category; points:number; preview:string };

const categoryMeta: Record<Category, { color: string; icon: string }> = {
  Housing: { color: "#f0b86e", icon: "⌂" }, Financial: { color: "#6ed5a5", icon: "$" },
  Academic: { color: "#7ca7ff", icon: "✦" }, Orientation: { color: "#c48df6", icon: "◆" },
  Social: { color: "#f07e9f", icon: "♥" }, Other: { color: "#9aa6b8", icon: "•" },
};

const seedTasks: Task[] = [
  { id:"l1-1", title:"Pay Enrollment Deposit", description:"Secure your place in the incoming Georgia Tech class.", category:"Financial", deadline:"2026-05-01", points:50, completed:false, order:0 },
  { id:"l1-2", title:"Activate GT Account & Set Up Duo", description:"Your GT welcome email asks you to claim your account and enroll in Duo before accessing student systems.", category:"Academic", deadline:"2026-06-01", points:40, completed:false, order:1 },
  { id:"l1-3", title:"Apply for Housing", description:"Housing reminds incoming students to complete the application and sign their contract before assignments begin.", category:"Housing", deadline:"2026-06-01", points:60, completed:false, order:2 },
  { id:"l1-4", title:"Complete FAFSA / Review Financial Aid", description:"Submit your FAFSA, add Georgia Tech, and review your financial aid offer.", category:"Financial", deadline:"2026-06-01", points:60, completed:false, order:3 },
  { id:"l1-5", title:"Submit Immunization Records", description:"Stamps Health Services requests your vaccine history and required TB screening documents.", category:"Other", deadline:"2026-06-24", points:45, completed:false, order:4 },
  { id:"l1-6", title:"Join FASET Canvas & Register", description:"Transition Programs asks you to join the FASET Canvas page, review orientation steps, and reserve a session.", category:"Orientation", deadline:"2026-06-01", points:50, completed:false, order:5 },
  { id:"l1-7", title:"Upload BuzzCard Photo", description:"The BuzzCard Center requests a clear ID photo so your campus card is ready before arrival.", category:"Other", deadline:"2026-06-24", points:30, completed:false, order:6 },
  { id:"l1-8", title:"Complete Required Online Training", description:"Complete the assigned AlcoholEdu and Sexual Assault Prevention modules before your summer onboarding deadline.", category:"Orientation", deadline:"2026-06-24", points:45, completed:false, order:7 },
  { id:"l1-9", title:"Send Final High School Transcript", description:"Ask your school to send Georgia Tech your official final transcript.", category:"Academic", deadline:"2026-07-30", points:55, completed:false, order:8 },
];
const level2Tasks: Task[] = [
  {id:"l2-1",title:"Complete FASET",description:"Attend or complete your assigned FASET orientation so you are cleared and prepared for first-semester registration.",category:"Orientation",deadline:"2026-07-01",points:45,completed:false,order:0},
  {id:"l2-2",title:"View Your Registration Time Ticket",description:"Find your assigned registration window in OSCAR. Your time ticket determines exactly when Add/Drop becomes available to you.",category:"Academic",deadline:"2026-07-08",points:35,completed:false,order:1},
  {id:"l2-3",title:"Resolve Registration Holds",description:"Check Registration Status and clear any financial, immunization, advising, or location holds before your time ticket opens.",category:"Academic",deadline:"2026-07-12",points:50,completed:false,order:2},
  {id:"l2-4",title:"Learn How Registration Works",description:"Learn CRNs, linked lectures and labs, credit hours, waitlists, closed sections, and the most common OSCAR errors.",category:"Academic",deadline:"2026-07-15",points:45,completed:false,order:3},
  {id:"l2-5",title:"Build Your First Schedule",description:"Search courses, explore degree requirements, check restrictions, and create a primary schedule with backup sections.",category:"Academic",deadline:"2026-07-20",points:60,completed:false,order:4},
  {id:"l2-6",title:"Review Course Prerequisites",description:"Confirm that you meet every prerequisite, test-score requirement, linked-section rule, and major restriction.",category:"Academic",deadline:"2026-07-24",points:45,completed:false,order:5},
  {id:"l2-7",title:"Register for Classes",description:"Enter your CRNs in OSCAR, submit registration, resolve any errors, and verify your completed weekly schedule.",category:"Academic",deadline:"2026-07-30",points:80,completed:false,order:6},
];
const level3Tasks: Task[] = [
  {id:"l3-1",title:"Review Your Housing Assignment",description:"Confirm your residence hall, room assignment, move-in date, and housing checklist.",category:"Housing",deadline:"2026-08-01",points:45,completed:false,order:0},
  {id:"l3-2",title:"Connect With Your Roommate",description:"Introduce yourself, exchange contact information, and talk about your routines and expectations.",category:"Social",deadline:"2026-08-04",points:35,completed:false,order:1},
  {id:"l3-3",title:"Coordinate Move-In Essentials",description:"Decide who will bring shared essentials such as a fan, cleaning supplies, or approved small appliances.",category:"Housing",deadline:"2026-08-07",points:35,completed:false,order:2},
  {id:"l3-4",title:"Choose Your Meal Plan",description:"Review first-year meal plans and select the option that best fits your campus routine.",category:"Housing",deadline:"2026-08-09",points:30,completed:false,order:3},
  {id:"l3-5",title:"Complete Your Packing List",description:"Use the housing checklist, label your boxes, and leave prohibited items at home.",category:"Housing",deadline:"2026-08-12",points:45,completed:false,order:4},
  {id:"l3-6",title:"Select and Confirm Move-In Time",description:"Reserve your arrival window and share the unloading and parking instructions with anyone helping you.",category:"Orientation",deadline:"2026-08-14",points:50,completed:false,order:5},
  {id:"l3-7",title:"Move In and Meet Your Community",description:"Check in, unpack your essentials, meet your neighbors, and get familiar with your new campus community.",category:"Housing",deadline:"2026-08-15",points:100,completed:false,order:6},
];
const level2Guides: Record<string,{why:string;tips:string[];mistake:string;concepts?:Array<[string,string]>;resources:Array<[string,string]>}> = {
  "l2-1":{why:"FASET introduces the systems and advising information you need before choosing courses.",tips:["Finish every assigned Canvas module.","Write down questions for your academic advisor."],mistake:"Treating FASET as optional and missing registration instructions.",resources:[["FASET Orientation","https://transitionprograms.gatech.edu/content/faset-orientation"]]},
  "l2-2":{why:"A time ticket is your personal registration opening. You cannot use Add/Drop before it begins.",tips:["In OSCAR, open Prepare for Registration and select the correct term.","Save the date, time, and time zone in Outlook."],mistake:"Assuming everyone registers at the same time.",resources:[["GT Time Tickets","https://registrar.gatech.edu/registration/time-tickets"],["Registration FAQ","https://registrar.gatech.edu/registration/registration-faq"]]},
  "l2-3":{why:"Any active registration hold can stop you from adding, dropping, or changing courses.",tips:["Check Registration Status several days early.","The department that placed a hold must remove it."],mistake:"Waiting until the time ticket opens to check for holds.",concepts:[["Financial hold","Contact the office shown beside the hold."],["Immunization hold","Review missing health or TB documentation."],["Advising hold","Meet the listed advisor or department."]],resources:[["View and Resolve Holds","https://registrar.gatech.edu/registration/holds"]]},
  "l2-4":{why:"Understanding the vocabulary makes OSCAR much less intimidating and helps you recover from errors.",tips:["A CRN identifies one exact course section.","Linked labs and lectures usually must be submitted together."],mistake:"Copying only the lecture CRN when a linked lab or recitation is required.",concepts:[["CRN","The unique number for one section."],["Lecture / Lab / Recitation","Main class / hands-on work / smaller discussion."],["Credit hours","A measure of course load; verify your total with an advisor."],["Waitlist","A queue for a full section—not a guaranteed seat."],["Closed section","No regular seats are currently available."],["Registration error","OSCAR explains why a requested course was not added."]],resources:[["Registration Assistance","https://registrar.gatech.edu/registration/registration-assistance"],["Common Error Messages","https://registrar.gatech.edu/info/common-registration-error-messages"]]},
  "l2-5":{why:"A prepared draft lets you register quickly when your time ticket opens and gives you alternatives if a section fills.",tips:["Build a primary schedule and at least two backup sections.","Check meeting times, campus, restrictions, and total credits."],mistake:"Creating back-to-back classes on opposite sides of campus—or having no backup CRNs.",resources:[["OSCAR Course Search","https://oscar.gatech.edu/"],["GT Degree Programs","https://catalog.gatech.edu/programs/"]]},
  "l2-6":{why:"Prerequisites protect course sequencing. OSCAR may reject a course if required classes, scores, or linked sections are missing.",tips:["Open Course Details before choosing a section.","Ask your advisor about transfer or test credit that is not yet visible."],mistake:"Assuming an interesting course is automatically open to every major and class year.",concepts:[["Prerequisite","A course or score required beforehand."],["Corequisite","A linked course taken at the same time."],["Restriction","A seat rule based on major, class, campus, or cohort."]],resources:[["Georgia Tech Catalog","https://catalog.gatech.edu/"],["OSCAR Course Details","https://oscar.gatech.edu/"]]},
  "l2-7":{why:"This final mission confirms that your first-semester courses were successfully added—not merely placed in a pending plan.",tips:["Submit all linked CRNs together.","Read every status message and verify the weekly schedule afterward."],mistake:"Closing OSCAR without confirming that each course says Registered.",resources:[["Register for Classes Guide","https://registrar.gatech.edu/registration/registration-assistance"],["OSCAR","https://oscar.gatech.edu/"]]},
};

const pointsFor = (tasks: Task[]) => tasks.filter(t => t.completed).reduce((s,t) => s + t.points, 0);
const path = "M 145 90 C 280 5, 410 35, 475 135 C 535 230, 700 225, 795 145 C 900 55, 1050 75, 1105 185 C 1160 295, 1050 390, 920 385 C 770 378, 695 450, 705 560 C 715 680, 570 720, 460 650 C 350 580, 195 610, 150 720 C 110 820, 240 895, 370 850 C 510 800, 620 855, 665 955 C 715 1065, 870 1060, 950 970 C 1020 890, 1140 920, 1165 1025";
const nodePositions = [[145,90],[420,82],[650,210],[955,91],[1115,300],[840,403],[660,640],[350,615],[1165,1025]];
const savedState = () => {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("first-flight-state") || "null"); } catch { return null; }
};
const merchCoupons: Record<number,string[]> = {
  2:["GT T-Shirt","Buzz Baseball Cap","GT Water Bottle"],
  3:["GT Hoodie","Tech Backpack","GT Stadium Blanket"],
  4:["GT Football Jersey","Gold Buzz Jacket","Buzz Plush"],
};
const merchEmoji:Record<string,string>={"GT T-Shirt":"👕","Buzz Baseball Cap":"🧢","GT Water Bottle":"🧴","GT Hoodie":"🧥","Tech Backpack":"🎒","GT Stadium Blanket":"🟨","GT Football Jersey":"🏈","Gold Buzz Jacket":"✨","Buzz Plush":"🐝"};
const majors = ["Aerospace Engineering","Applied Languages and Intercultural Studies","Applied Physics","Architecture","Astrophysics","Atmospheric and Oceanic Sciences","Biochemistry","Biology","Biomedical Engineering","Business Administration","Chemical and Biomolecular Engineering","Chemistry","Civil Engineering","Computational Media","Computer Engineering","Computer Science","Construction Science and Management","Earth and Atmospheric Sciences","Economics","Economics and International Affairs","Electrical Engineering","Environmental Engineering","Environmental Science","Global Economics and Modern Languages","History, Technology, and Society","Industrial Design","Industrial Engineering","International Affairs","International Affairs and Modern Languages","Literature, Media, and Communication","Materials Science and Engineering","Mathematics","Mathematics and Computing","Mechanical Engineering","Music Technology","Neuroscience","Nuclear and Radiological Engineering","Physics","Psychology","Public Policy","Solid Earth and Planetary Sciences","Urban Planning and Spatial Analytics"];

function Avatar({ color="#eabf71", accessory="cap", small=false, skin="#9a603f", hair="#28201d", variant="male" }: {color?:string; accessory?:string; small?:boolean; skin?:string; hair?:string; variant?:string}) {
  return <div className={`avatar person-avatar avatar-${variant} ${small ? "avatar-small" : ""}`} style={{"--avatar":color,"--skin":skin,"--hair":hair} as React.CSSProperties}>
    <div className="person-head">{variant === "female" && <span className="long-hair-back"/>}{accessory === "cap" && <span className="avatar-cap"/>}{accessory === "star" && <span className="avatar-star">★</span>}<span className="person-hair"/><span className="eye left"/><span className="eye right"/><span className="smile"/></div>
    <div className="person-body"><span className="shirt-mark">GT</span><i className="arm left"/><i className="arm right"/></div><div className="person-legs"><i/><i/></div>
  </div>
}

const sampleEmails: EmailSignal[] = [
  {id:"mail-1",sender:"admission@gatech.edu",subject:"Missing Items Needed to Complete Your Enrollment at Tech!",kind:"enhance",taskId:"l1-9",title:"Send Final High School Transcript",action:"Ask your school counselor to send your official final transcript.",deadline:"2026-07-30",category:"Academic",points:55,preview:"Your enrollment checklist still shows a missing final transcript. Submit it by July 30 to complete your record."},
  {id:"mail-2",sender:"transitionprograms@studentlife.gatech.edu",subject:"Join Your FASET Canvas Page",kind:"enhance",taskId:"l1-6",title:"Join FASET Canvas & Register",action:"Join the FASET Canvas page and review the orientation checklist.",deadline:"2026-06-01",category:"Orientation",points:50,preview:"Your FASET Canvas course is ready. Join the page and complete the welcome module before June 1."},
  {id:"mail-3",sender:"buzzcard@gatech.edu",subject:"Action Required: Upload Your BuzzCard Photo",kind:"enhance",taskId:"l1-7",title:"Upload BuzzCard Photo",action:"Upload a clear, approved photo for your campus ID.",deadline:"2026-06-24",category:"Other",points:30,preview:"Upload an approved ID photo by June 24 so your BuzzCard can be ready when you arrive."},
  {id:"mail-4",sender:"ignite@gatech.edu",subject:"Ignite Prep Webinar: Event Reminder",kind:"side",title:"Attend the Ignite Prep Webinar",action:"RSVP for a live preparation webinar and bring your questions.",deadline:"2026-05-28",category:"Social",points:20,preview:"Join other incoming students for a short Ignite preparation webinar, campus tips, and live Q&A."},
  {id:"mail-5",sender:"UndergraduateAcademics@cc.gatech.edu",subject:"Please Read: Fall First Year FASET for CS!",kind:"side",title:"Review the CS FASET Guide",action:"Read the College of Computing’s first-year registration guide.",deadline:"2026-06-24",category:"Academic",points:25,preview:"The College of Computing shared major-specific FASET advice to help you prepare for registration."},
  {id:"mail-6",sender:"registrar@gatech.edu",subject:"Your Registration Time Ticket Opens Tomorrow",kind:"enhance",taskId:"l2-7",title:"Register for Classes",action:"Registration opens tomorrow. Confirm your CRNs and submit your prepared schedule in OSCAR.",deadline:"2026-07-30",category:"Academic",points:80,preview:"Your assigned registration window opens tomorrow. Review your planned sections and be ready to register."},
  {id:"mail-7",sender:"registrar@gatech.edu",subject:"Action Required: Registration Hold Detected",kind:"enhance",taskId:"l2-3",title:"Resolve Registration Holds",action:"Open Registration Status and resolve the listed hold before your time ticket.",deadline:"2026-07-12",category:"Academic",points:50,preview:"An active hold may prevent schedule changes. Review the responsible office and required next step in OSCAR."},
  {id:"mail-8",sender:"academic.advising@gatech.edu",subject:"Suggested First-Semester Courses",kind:"enhance",taskId:"l2-5",title:"Build Your First Schedule",action:"Review your advisor’s suggested courses and add appropriate sections to your draft schedule.",deadline:"2026-07-20",category:"Academic",points:60,preview:"Your advisor shared course suggestions based on your major. Compare them with degree requirements and available sections."},
  {id:"mail-9",sender:"housing@gatech.edu",subject:"Your Fall Housing Assignment Is Ready",kind:"enhance",taskId:"l3-1",title:"Review Your Housing Assignment",action:"Open My Housing and confirm your building, room assignment, and arrival instructions.",deadline:"2026-08-01",category:"Housing",points:45,preview:"Your fall housing assignment and residence hall details are now available in the housing portal."},
  {id:"mail-10",sender:"housing@gatech.edu",subject:"Choose Your Move-In Arrival Time",kind:"enhance",taskId:"l3-6",title:"Select and Confirm Move-In Time",action:"Reserve an available move-in window and review unloading directions.",deadline:"2026-08-14",category:"Orientation",points:50,preview:"Move-in appointment selection is open. Choose a time before arrival windows fill."},
  {id:"mail-11",sender:"transitionprograms@studentlife.gatech.edu",subject:"Week of Welcome Events Are Live",kind:"side",title:"Build Your Week of Welcome Plan",action:"Choose two welcome events where you can meet your campus community.",deadline:"2026-08-16",category:"Social",points:25,preview:"Explore Week of Welcome activities, student organizations, and community events for new Yellow Jackets."},
];

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>(() => savedState()?.version === 2 ? savedState().tasks : seedTasks);
  const [selected, setSelected] = useState<Task | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMerch, setShowMerch] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [onboardingStage, setOnboardingStage] = useState(0);
  const [guideDismissed, setGuideDismissed] = useState(() => savedState()?.guideDismissed ?? false);
  const [emailCursor, setEmailCursor] = useState<number>(() => savedState()?.emailCursor ?? (savedState()?.currentLevel===3?8:savedState()?.currentLevel===2?5:0));
  const [emailPopup, setEmailPopup] = useState<EmailSignal | null>(null);
  const [sideMissions, setSideMissions] = useState<Task[]>(() => savedState()?.sideMissions || []);
  const [onboarded, setOnboarded] = useState(() => savedState()?.onboarded ?? false);
  const avatarType = "student";
  const [skin, setSkin] = useState(() => savedState()?.skin || "#9a603f");
  const [hair, setHair] = useState(() => savedState()?.hair || "#28201d");
  const [merchItems, setMerchItems] = useState<string[]>(() => savedState()?.merchItems || []);
  const [studentName, setStudentName] = useState(() => savedState()?.studentName || "");
  const [major, setMajor] = useState(() => savedState()?.major || "");
  const [previewReward, setPreviewReward] = useState("");
  const [claimedReward, setClaimedReward] = useState("");
  const [currentLevel, setCurrentLevel] = useState(() => savedState()?.currentLevel || 1);
  const [finalReady, setFinalReady] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(0);
  const [celebrate, setCelebrate] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [avatarColor, setAvatarColor] = useState(() => savedState()?.avatarColor || "#e7bd6b");
  const [accessory, setAccessory] = useState(() => savedState()?.accessory || "cap");
  const points = pointsFor(tasks) + pointsFor(sideMissions);
  const completed = tasks.filter(t => t.completed).length;
  const level = currentLevel;
  const emailStart = level===1?0:level===2?5:8;
  const emailEnd = level===1?5:level===2?8:11;
  const progress = completed / tasks.length;
  const levelTitle = level===1?"Becoming a Yellow Jacket":level===2?"Academic Takeoff":"Welcome Home";
  const nextLevelLabel = level===1?"Begin Academic Takeoff":level===2?"Begin Welcome Home":"Celebrate Freshman Readiness";
  const nextTask = tasks.find(task=>!task.completed);
  const levelRewardClaimed = (merchCoupons[level+1] || []).some(item=>merchItems.includes(item));
  const journeyPositions = tasks.map((_,i)=>nodePositions[Math.round(i*(nodePositions.length-1)/Math.max(1,tasks.length-1))]);
  const currentIndex = Math.min(Math.max(0, completed - 1), journeyPositions.length - 1);
  const currentPos = journeyPositions[Math.max(0,currentIndex)];

  useEffect(() => { localStorage.setItem("first-flight-state", JSON.stringify({version:2,currentLevel,emailCursor,tasks,sideMissions,avatarColor,accessory,onboarded,guideDismissed,avatarType,skin,hair,merchItems,studentName,major})); }, [currentLevel,emailCursor,tasks,sideMissions,avatarColor,accessory,onboarded,guideDismissed,skin,hair,merchItems,studentName,major]);
  function chooseReward(item:string) { setMerchItems(current=>[...current.filter(x=>!(merchCoupons[celebrate||0]||[]).includes(x)),item]); setPreviewReward(item); setClaimedReward(item); setToast(`Free ${item} coupon claimed!`); setTimeout(()=>setToast(""),2800); }
  function continueToNextLevel() { const next=level+1;if(next===2){setCurrentLevel(2);setTasks(level2Tasks);setEmailCursor(5)}else if(next===3){setCurrentLevel(3);setTasks(level3Tasks);setEmailCursor(8)}else{setFinalReady(true)}setCelebrate(null);setClaimedReward("");setPreviewReward("");setShowMerch(false);if(next<=3){setToast(`Level ${next} · ${next===2?"Academic Takeoff":"Welcome Home"} unlocked!`);setTimeout(()=>setToast(""),3000)}}
  function resumeCompletedLevel() { if(levelRewardClaimed){if(level===3)setFinalReady(true);else continueToNextLevel()}else{setClaimedReward("");setPreviewReward("");setCelebrate(level+1)} }

  function resolveEmail(accept:boolean) {
    if (!emailPopup) return;
    if (accept && emailPopup.kind === "enhance") {
      setTasks(current => current.map(task => task.id === emailPopup.taskId ? {...task,deadline:emailPopup.deadline,emailSource:emailPopup.sender,emailSubject:emailPopup.subject,actionRequired:emailPopup.action} : task));
      setToast(`Mission updated from ${emailPopup.sender}`);
    } else if (accept) {
      const side:Task={id:`side-${emailPopup.id}`,title:emailPopup.title,description:emailPopup.preview,category:emailPopup.category,deadline:emailPopup.deadline,points:emailPopup.points,completed:false,order:sideMissions.length,emailSource:emailPopup.sender,emailSubject:emailPopup.subject,actionRequired:emailPopup.action};
      setSideMissions(current => current.some(task=>task.id===side.id)?current:[...current,side]);
      setToast("New side mission added!");
    } else setToast("Email dismissed — no mission was changed");
    setTimeout(()=>setToast(""),2600); setEmailPopup(null); setEmailCursor(cursor=>cursor+1);
  }

  function completeTask(task: Task) {
    if (task.id.startsWith("side-")) {
      const updatedSide=sideMissions.map(t=>t.id===task.id?{...t,completed:!t.completed}:t);
      setSideMissions(updatedSide); setSelected({...task,completed:!task.completed});
      if(!task.completed){setToast(`+${task.points} bonus XP · Side mission complete!`);setTimeout(()=>setToast(""),2600)}
      return;
    }
    const updated = tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t);
    setTasks(updated); setSelected({...task, completed: !task.completed});
    if (!task.completed) {
      setToast(`+${task.points} XP · Path illuminated!`);
      setTimeout(() => setToast(""), 2600);
      // Let the avatar and gold path visibly reach the final tip before the
      // full-screen confetti and reward reveal takes over.
      if (updated.every(t=>t.completed)) setTimeout(() => setCelebrate(level + 1), 1750);
    }
  }
  function addCalendar(task: Task) {
    if (!task.deadline) return;
    const end = new Date(`${task.deadline}T12:00:00`);
    end.setDate(end.getDate() + 1);
    const params = new URLSearchParams({
      path: "/calendar/action/compose", rru: "addevent", allday: "true",
      subject: task.title, body: `${task.description} — Buzz Map`,
      startdt: task.deadline, enddt: end.toISOString().slice(0, 10),
    });
    const url = `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }
  function addTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fd = new FormData(e.currentTarget);
    const task: Task = { id: crypto.randomUUID(), title:String(fd.get("title")), description:String(fd.get("description")||"Your custom milestone."), category:fd.get("category") as Category, deadline:String(fd.get("deadline")||""), points:25, completed:false, order:tasks.length };
    // Append against the newest state so a recent email update or another
    // custom mission can never be overwritten by a stale render.
    setTasks(current => [...current, {...task, order:current.length}]); setShowAdd(false); setToast("New mission added alongside your existing missions"); setTimeout(()=>setToast(""),2500);
  }

  return <main className="app-shell">
    <div className="ambient"><i/><i/><i/><i/></div>
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Zap size={19} fill="currentColor"/></div><span>BUZZ<br/><b>MAP</b></span></div>
      <nav><button className={!showMerch?"active":""} onClick={()=>setShowMerch(false)}><Map/><span>Journey</span></button>{level===2&&<button onClick={()=>setShowCopilot(true)}><span className="nav-emoji">🎓</span><span>Copilot</span></button>}<button className={showMerch?"active":""} onClick={()=>setShowMerch(true)}><span className="nav-emoji">👕</span><span>Merch</span></button><button onClick={()=>setShowProfile(true)}><CircleUserRound/><span>Profile</span></button></nav>
      <button className="side-settings"><Settings/></button>
    </aside>

    <section className="content">
      <header>
        <div><div className="eyebrow"><span/> LEVEL {level} · {levelTitle.toUpperCase()}</div><h1>{level===2?"Academic Takeoff":level===3?"Welcome Home":"Ready for takeoff"}, <em>{studentName || "Yellow Jacket"}?</em></h1><p>{level===2?"Seven guided missions to build and register your first schedule.":level===3?"Meet your roommate, prepare your room, and make campus feel like home.":"Every step brings you closer to campus."}</p></div>
        <div className="header-actions">
          <button className="profile-pill" onClick={()=>setShowProfile(true)}><Avatar color={avatarColor} accessory={accessory} skin={skin} hair={hair} variant={avatarType} small/><span><b>{studentName || "Jacket"}</b><small>{major || `LEVEL ${level}`}</small></span><ChevronRight/></button>
        </div>
      </header>

      <div className="stat-row">
        <div className="level-card"><div className="level-hex">{level}</div><div><small>CURRENT LEVEL</small><b>{level === 1 ? "New Recruit" : level === 2 ? "Rising Jacket" : "Campus Navigator"}</b></div></div>
        <div className="progress-card"><div className="progress-label"><span>Journey progress</span><b>{completed} <small>/ {tasks.length} complete</small></b></div><div className="progress-track"><motion.div animate={{width:`${progress*100}%`}} transition={{duration:1,ease:"easeOut"}}/><i style={{left:`${progress*100}%`}}/></div></div>
        <div className="xp-card"><Sparkles/><div><small>TOTAL XP</small><motion.b key={points} initial={{scale:1.3,color:"#fff"}} animate={{scale:1,color:"#efc87d"}}>{points.toLocaleString()}</motion.b></div></div>
        <div className="missions-card"><Check/><div><small>MISSIONS COMPLETE</small><b>{completed} / {tasks.length}</b></div></div>
        <div className="next-reward-card"><span>🎟️</span><div><small>{level===3?"FINAL REWARD":"NEXT REWARD"}</small><b>Free GT Merch Coupon</b><em>{level===1?"Choose a T-shirt, cap, or bottle":level===2?"Choose premium campus gear":"Choose exclusive GT merch"}</em></div></div>
      </div>
      <div className="level-story-bar"><div><small>CURRENT STORY</small><b>Level {level} · {levelTitle}</b></div><div><small>LEVEL PROGRESS</small><b>{completed} / {tasks.length} Missions Complete</b></div>{nextTask?<div className="next-mission-indicator"><small>NEXT MISSION</small><b>{nextTask.title}</b><ChevronRight/></div>:<button className="resume-level" onClick={resumeCompletedLevel}><span><small>{level===3?"JOURNEY COMPLETE":"LEVEL COMPLETE"}</small><b>{level===3?nextLevelLabel:levelRewardClaimed?nextLevelLabel:"Claim rewards to continue"}</b></span><ArrowRight/></button>}</div>

      {showMerch ? <section className="merch-panel"><div className="merch-panel-head"><div><div className="eyebrow"><span/> YOUR GT MERCH</div><h2>{studentName || "Your"}’s reward closet</h2><p>Complete each level, choose something you love, and watch your collection grow.</p></div><div className="merch-count"><small>REWARDS CLAIMED</small><b>{merchItems.length} / 3</b><span>A new choice waits at every level</span></div></div><div className="merch-showcase">{merchItems.length?merchItems.map((item,i)=><motion.article key={item} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:i*.08}}><div>{merchEmoji[item]}</div><small>LEVEL {i+1} REWARD</small><h3>{item}</h3><span>✓ ADDED TO YOUR COLLECTION</span></motion.article>):<div className="empty-merch"><span>🎟️</span><h3>Your merch closet is ready</h3><p>Finish Level 1 and you’ll get to choose your first piece of GT gear.</p><button onClick={()=>setShowMerch(false)}>Back to my journey <ArrowRight/></button></div>}</div><div className="merch-disclaimer"><Sparkles/><p><b>Your rewards, your choice</b>Finish a level, pick your favorite item, and we’ll keep it here in your collection.</p></div></section> : <section className="journey-panel">
        <div className="panel-top"><div><span className="live-dot"/> FLIGHT PATH <small>· FALL 2026</small></div><div className="legend"><span><i className="done"/>Complete</span><span><i className="current"/>Current</span><span><i/>Upcoming</span></div></div>
        <div className="map-wrap">
          <svg viewBox="0 0 1280 1120" preserveAspectRatio="none" aria-label="Onboarding journey map">
            <defs><filter id="glow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="gold" x1="0" x2="1"><stop stopColor="#d89c45"/><stop offset=".55" stopColor="#ffe0a0"/><stop offset="1" stopColor="#d49a49"/></linearGradient></defs>
            <path d={path} className="path-shadow"/><path d={path} className="path-base"/>
            <motion.path d={path} className="path-complete" pathLength={1} initial={false} animate={{pathLength:completed===tasks.length?1:progress}} transition={{duration:1.4,ease:[.16,1,.3,1]}} filter="url(#glow)"/>
          </svg>
          <div className="zone zone-a">FOUNDATIONS</div><div className="zone zone-b">GETTING READY</div><div className="zone zone-c">FINAL APPROACH</div>
          <motion.div className="map-yellow-jacket" aria-label="Georgia Tech yellow jacket mascot" animate={{left:`${Math.min(94,currentPos[0]/12.8+4)}%`,top:`${Math.max(6,currentPos[1]/11.2-5)}%`}} transition={{duration:1.55,ease:[.16,1,.3,1]}}><i className="wing left"/><i className="wing right"/><span className="wasp-head"><b/><b/></span><span className="wasp-body"><i/><i/></span><small>BUZZING ALONGSIDE YOU</small></motion.div>
          {tasks.slice(0,18).map((task,i) => { const [x,y]=journeyPositions[i]; const isCurrent=i===completed; return <motion.button key={task.id} className={`task-node node-${i} ${i%2?"label-up":"label-down"} ${task.completed?"complete":""} ${isCurrent?"current":""} ${i===tasks.length-1?"final-checkpoint":""}`} style={{left:`${x/12.8}%`,top:`${y/11.2}%`,"--cat":categoryMeta[task.category].color} as React.CSSProperties} onClick={()=>setSelected(task)} whileHover={{scale:1.1}} whileTap={{scale:.94}}>
            <span className="node-ring">{task.completed ? <Check/> : isCurrent ? <Star fill="currentColor"/> : i>completed+3 ? <LockKeyhole/> : categoryMeta[task.category].icon}</span>
            {(isCurrent || i===0 || i===5 || i===tasks.length-1) && <label>{i===0?"START":isCurrent?"UP NEXT":i===tasks.length-1?"LEVEL 1 FINISH":"MILESTONE"}<b>{task.title}</b></label>}
          </motion.button>})}
          <motion.div className="map-avatar" animate={{left:`${currentPos[0]/12.8}%`,top:`${currentPos[1]/11.2}%`}} transition={{duration:1.35,ease:[.16,1,.3,1]}}><Avatar color={avatarColor} accessory={accessory} skin={skin} hair={hair} variant={avatarType}/><span>YOU</span></motion.div>
          <div className="map-mission-count"><Check/><span><b>{completed} / {tasks.length}</b> MISSIONS COMPLETE</span></div><button className="add-floating" onClick={()=>setShowAdd(true)}><Plus/> Add a mission</button>{emailCursor<emailEnd&&<button className="simulate-email" onClick={()=>setEmailPopup(sampleEmails[emailCursor])}><span>✦</span> Sync with GT Email <small>{emailCursor-emailStart+1}/{emailEnd-emailStart}</small></button>}
        </div>
      </section>}
      {!showMerch && sideMissions.length>0 && <section className="side-missions"><div className="side-heading"><div><Sparkles/><span><small>EMAIL-DISCOVERED OPPORTUNITIES</small><h2>Side Missions</h2></span></div><b>{sideMissions.filter(t=>t.completed).length}/{sideMissions.length}</b></div><div className="side-grid">{sideMissions.map(task=><button key={task.id} onClick={()=>setSelected(task)} className={task.completed?"complete":""}><span>{categoryMeta[task.category].icon}</span><div><small>OPTIONAL · +{task.points} XP</small><b>{task.title}</b><em>{new Date(`${task.deadline}T12:00:00`).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</em></div><ChevronRight/></button>)}</div><p>Side missions award bonus XP but never block level progress.</p></section>}
    </section>

    <AnimatePresence>
      {emailPopup && <><motion.div className="email-scrim" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/><motion.div className="email-detected" initial={{opacity:0,scale:.9,y:35}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.94,y:20}} transition={{type:"spring",damping:24}}><div className="email-radar"><i/><span>✦</span></div><small>HERE’S WHAT WE FOUND</small><h2>{emailPopup.kind==="side"?"Want to add this to your journey?":"This email matches one of your missions"}</h2><div className="email-envelope"><div><span>FROM</span><b>{emailPopup.sender}</b></div><div><span>SUBJECT</span><b>{emailPopup.subject}</b></div><p>{emailPopup.preview}</p></div><div className="extracted-task"><span>YOUR NEXT STEP</span><h3>{emailPopup.title}</h3><p>{emailPopup.action}</p><div><b>📅 {new Date(`${emailPopup.deadline}T12:00:00`).toLocaleDateString("en-US",{month:"long",day:"numeric"})}</b><b>✨ +{emailPopup.points} XP</b></div></div><div className="email-note">{emailPopup.kind==="enhance"?"You already have this mission, so we’ll add the helpful details without making a duplicate.":"This one is optional. Skip it if it isn’t useful to you."}</div><div className="email-actions"><button onClick={()=>resolveEmail(false)}>Not now</button><button onClick={()=>resolveEmail(true)}>{emailPopup.kind==="enhance"?"Add these details":"Add to my journey"}<ArrowRight/></button></div></motion.div></>}
      {onboarded && !guideDismissed && <motion.div className="progress-guide" initial={{opacity:0}} animate={{opacity:1}}><motion.div initial={{scale:.92,y:22}} animate={{scale:1,y:0}}><div className="guide-badge">01</div><small>YOUR BUZZ MAP JOURNEY</small><h2>Welcome aboard, {studentName}!</h2><p>Your journey to becoming a Yellow Jacket is split into levels, with a few important missions in each one. We’ll help you stay on track along the way.</p><div className="guide-loop"><div><span>✓</span><b>Complete missions</b><small>Take care of the things that matter most</small></div><ArrowRight/><div><span>XP</span><b>Earn XP</b><small>See how far you’ve come</small></div><ArrowRight/><div><span>🎟</span><b>Pick your rewards</b><small>Choose the GT gear you actually want</small></div></div><div className="guide-rewards"><div><span>👕</span><p><b>Your first reward</b>Finish Level 1 and choose a GT T-shirt, Buzz cap, or water bottle.</p></div><div><span>🎒</span><p><b>More to look forward to</b>Every new level brings a fresh set of merch choices.</p></div></div><button className="complete-button" onClick={()=>setGuideDismissed(true)}>Begin Level 1 <ArrowRight/></button></motion.div></motion.div>}
      {!onboarded && <motion.div className="onboarding" initial={{opacity:0}} animate={{opacity:1}}><motion.div className={onboardingStage===0?"welcome-card":"builder-card"} initial={{scale:.94,y:18}} animate={{scale:1,y:0}}>
        {onboardingStage===0 ? <><div className="welcome-logo"><div className="brand-mark"><Zap size={19} fill="currentColor"/></div><span>FIRST <b>FLIGHT</b></span></div><small>WELCOME, YELLOW JACKET</small><div className="helluva-title"><span>YOU’RE A</span><h2>HELLUVA<br/><em>ENGINEER.</em></h2></div><div className="welcome-message"><Sparkles/><div><b>You’ve already made it this far.</b><p>The applications, the decisions, the waiting—you handled all of it. Georgia Tech chose you because you’re ready to build what comes next.</p></div></div><h3 className="go-further">Are you ready to go further?</h3><div className="welcome-choice"><motion.button whileHover={{scale:1.03}} whileTap={{scale:.97}} className="yes-button" onClick={()=>setOnboardingStage(1)}>YES, LET’S TAKE FLIGHT <ArrowRight/></motion.button></div></> : onboardingStage===1 ? <><button className="onboarding-back" onClick={()=>setOnboardingStage(0)}>← Back</button><small>STEP 2 · CREATE YOUR AVATAR</small><h2>Make it yours.</h2><p>Choose your starting look. You’ll unlock more GT gear as you complete missions.</p><div className="single-avatar-preview"><Avatar color={avatarColor} accessory="none" skin={skin} hair={hair} variant="student"/></div><label>Skin tone</label><div className="swatches">{["#f4c9a4","#d99b73","#9a603f","#633c2b","#38251f"].map(c=><button aria-label="Skin tone" key={c} style={{background:c}} className={skin===c?"selected":""} onClick={()=>setSkin(c)}/>)}</div><label>Hair color</label><div className="swatches">{["#2474d2","#7846c8","#e0529c","#c8323e","#171717","#70442c"].map(c=><button aria-label="Hair color" key={c} style={{background:c}} className={hair===c?"selected":""} onClick={()=>setHair(c)}/>)}</div><label>Shirt color</label><div className="swatches">{["#d8ac5c","#6c91d9","#65c1b4","#d887aa","#9d79d4"].map(c=><button aria-label="Shirt color" key={c} style={{background:c}} className={avatarColor===c?"selected":""} onClick={()=>setAvatarColor(c)}/>)}</div><button className="complete-button" onClick={()=>setOnboardingStage(2)}>Continue <ArrowRight/></button></> : <form className="identity-step" onSubmit={e=>{e.preventDefault();setOnboarded(true)}}><button type="button" className="onboarding-back" onClick={()=>setOnboardingStage(1)}>← Back</button><small>STEP 3 · YOUR FLIGHT PLAN</small><h2>One last thing.</h2><p>Tell us what to call you and where your Georgia Tech journey is headed.</p><div className="identity-avatar"><Avatar color={avatarColor} accessory="none" skin={skin} hair={hair} variant="student"/></div><label>Your name</label><input required value={studentName} onChange={e=>setStudentName(e.target.value)} placeholder="What should we call you?" maxLength={30}/><label>Your major</label><select required value={major} onChange={e=>setMajor(e.target.value)}><option value="" disabled>Choose one of 41 majors</option>{majors.map(item=><option key={item} value={item}>{item}</option>)}</select><button className="complete-button" type="submit">Start {studentName ? `${studentName}’s` : "my"} journey <ArrowRight/></button></form>}
      </motion.div></motion.div>}
      {selected && <><motion.div className="scrim" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)}/><motion.aside className="task-drawer" initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:28,stiffness:260}}>
        <button className="close" onClick={()=>setSelected(null)}><X/></button><div className="drawer-orb" style={{"--cat":categoryMeta[selected.category].color} as React.CSSProperties}>{categoryMeta[selected.category].icon}</div>
        <div className="drawer-category">{selected.id.startsWith("side-")?"Optional side mission":`${selected.category} mission`}</div><h2>{selected.title}</h2><p>{selected.description}</p>
        {selected.emailSource&&<div className="email-context"><span>✦ FOUND IN YOUR GT EMAIL</span><b>{selected.emailSubject}</b><small>{selected.emailSource}</small><p><strong>Here’s what to do:</strong> {selected.actionRequired}</p><button onClick={()=>{setToast("Email summary opened");setTimeout(()=>setToast(""),2200)}}>View email summary <ArrowRight/></button></div>}
        {level2Guides[selected.id]&&<div className="academic-guide"><section><small>WHY THIS MATTERS</small><p>{level2Guides[selected.id].why}</p></section>{level2Guides[selected.id].concepts&&<section><small>QUICK EXPLAINER</small><div className="concept-list">{level2Guides[selected.id].concepts!.map(([term,meaning])=><div key={term}><b>{term}</b><span>{meaning}</span></div>)}</div></section>}<section><small>FIRST-YEAR TIPS</small><ul>{level2Guides[selected.id].tips.map(tip=><li key={tip}>{tip}</li>)}</ul></section><div className="common-mistake"><b>⚠ Common mistake</b><p>{level2Guides[selected.id].mistake}</p></div><section><small>HELPFUL RESOURCES</small><div className="resource-links">{level2Guides[selected.id].resources.map(([name,url])=><a key={url} href={url} target="_blank" rel="noreferrer">{name}<ArrowRight/></a>)}</div></section></div>}
        {selected.id.startsWith("l2-")&&<button className="launch-copilot" onClick={()=>{setSelected(null);setShowCopilot(true)}}><span>🎓</span><div><small>REGISTRATION WORKSPACE</small><b>Open Registration Copilot</b></div><ArrowRight/></button>}
        {selected.id === "t13" && <div className="registration-assistant">
          <div className="assistant-heading"><div><Sparkles/><span><small>REGISTRATION ASSISTANT</small><b>Let’s build your first schedule</b></span></div><em>{registrationStep + 1} / 7</em></div>
          <div className="assistant-progress">{Array.from({length:7}).map((_,i)=><i key={i} className={i<=registrationStep?"active":""}/>)}</div>
          <AnimatePresence mode="wait"><motion.div className="assistant-step" key={registrationStep} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}}>
            <span>STEP {registrationStep + 1}</span><h3>{["Check your time ticket","Remove registration holds","Search for classes","Understand course sections","Copy your CRNs","Register in OSCAR","Verify your schedule"][registrationStep]}</h3>
            <p>{["Your time ticket is the exact date and time registration opens for you. Find it in OSCAR under Registration Status.","A hold can block registration. Check Registration Status now and resolve any advising, immunization, or financial holds.","Use the Schedule of Classes to filter by subject, course number, campus, and open seats. Keep two backup options.","Lecture is the main class. Labs are hands-on sessions. Recitations are smaller problem-solving or discussion meetings. Some courses require more than one.","A CRN is the five-digit ID for one specific section. Copy every required lecture, lab, and recitation CRN together.","Open OSCAR’s Add or Drop Classes page, paste your CRNs, and submit. Read every status message before leaving.","Confirm every course says Registered and appears in your weekly schedule. Check meeting times, campus, and total credits."][registrationStep]}</p>
            {registrationStep===3 && <div className="term-chips"><span><b>MWF</b>Mon / Wed / Fri</span><span><b>TR</b>Tue / Thu</span><span><b>R</b>Thursday</span></div>}
          </motion.div></AnimatePresence>
          <div className="assistant-actions"><button disabled={registrationStep===0} onClick={()=>setRegistrationStep(s=>s-1)}>Back</button><button onClick={()=>setRegistrationStep(s=>Math.min(6,s+1))}>{registrationStep===6?"Ready to register":"Next step"}<ChevronRight/></button></div>
          <details><summary>Quick registration glossary <ChevronRight/></summary><div className="glossary"><p><b>Credit hours</b>Usually reflect weekly class time and workload. Most full-time schedules are 12–18 credits.</p><p><b>Closed section</b>No open seats right now. Choose another section or watch for openings.</p><p><b>Waitlist</b>A queue for a closed section. Joining it does not guarantee a seat—watch your GT email for a time-limited offer.</p><p><b>Linked sections</b>A lecture may require a specific lab or recitation. Register for all linked parts at once.</p></div></details>
          <div className="mistake-tip"><span>!</span><p><b>Common first-year mistake</b>Don’t build a schedule with back-to-back classes on opposite sides of campus. Leave time to walk—and always keep backup CRNs.</p></div>
        </div>}
        <div className="task-meta"><div><Clock3/><span><small>DEADLINE</small><b>{selected.deadline ? new Date(selected.deadline+"T12:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}) : "No deadline"}</b></span></div><div><Sparkles/><span><small>REWARD</small><b>+{selected.points} XP</b></span></div></div>
        <button className={`complete-button ${selected.completed?"undo":""}`} onClick={()=>completeTask(selected)}>{selected.completed?<><RotateCcw/> Mark incomplete</>:<><Check/> Mark mission complete <ArrowRight/></>}</button>
        <button className="calendar-button" disabled={!selected.deadline} onClick={()=>addCalendar(selected)}><CalendarPlus/> Add to Outlook Calendar</button>
        <div className="drawer-tip"><span>✦</span><p><b>Flight tip</b>Complete missions in any order. This is your journey, at your pace.</p></div>
      </motion.aside></>}
      {(showAdd||showProfile) && <><motion.div className="scrim" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>{setShowAdd(false);setShowProfile(false)}}/><motion.div className="modal" initial={{opacity:0,scale:.92,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.94}}>
        <button className="close" onClick={()=>{setShowAdd(false);setShowProfile(false)}}><X/></button>
        {showAdd ? <form onSubmit={addTask}><div className="modal-icon"><Plus/></div><small>NEW MISSION</small><h2>Add to your flight plan</h2><label>Mission title<input required name="title" placeholder="e.g. Buy a desk lamp"/></label><div className="form-grid"><label>Category<select name="category">{Object.keys(categoryMeta).map(k=><option key={k}>{k}</option>)}</select></label><label>Deadline<input type="date" name="deadline"/></label></div><label>Notes<textarea name="description" placeholder="Anything you want to remember?"/></label><button className="complete-button">Add mission <ArrowRight/></button></form> : <div className="profile-modal"><div className="modal-icon"><Palette/></div><small>AVATAR HANGAR</small><h2>Make your jacket yours</h2><div className="avatar-stage"><Avatar color={avatarColor} accessory={accessory}/><i/><i/></div><label>Jacket color</label><div className="swatches">{["#e7bd6b","#65c1b4","#809ce8","#d887aa","#9d79d4"].map(c=><button key={c} style={{background:c}} className={c===avatarColor?"selected":""} onClick={()=>setAvatarColor(c)}/>)}</div><label>Accessory</label><div className="accessories"><button className={accessory==="cap"?"selected":""} onClick={()=>setAccessory("cap")}>🧢 Flight cap</button><button className={accessory==="star"?"selected":""} onClick={()=>setAccessory("star")}>⭐ Gold star</button><button className={accessory==="none"?"selected":""} onClick={()=>setAccessory("none")}>No accessory</button></div></div>}
      </motion.div></>}
      {celebrate && <motion.div className="celebration reward-celebration" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>{Array.from({length:24}).map((_,i)=><motion.i key={i} style={{left:`${10+(i*37)%80}%`,background:["#edbd66","#fff0b9","#65c1b4","#d887aa"][i%4]}} initial={{y:-80,rotate:0}} animate={{y:"105vh",rotate:720}} transition={{duration:2+(i%5)*.31,delay:(i%7)*.07}}/>)}<motion.div className="reward-card merch-reward-card" initial={{scale:.5,y:30}} animate={{scale:1,y:0}} transition={{type:"spring",delay:.15}}><Sparkles/><small>🎉 LEVEL {celebrate-1} COMPLETE!</small><h2>You earned a new GT merch reward!</h2><p><b>You did it, {studentName}!</b> Choose the item you’d be most excited to take with you to campus.</p><div className="coupon-ticket"><span>YOUR BUZZ MAP REWARD</span><b>CHOOSE ONE MERCH ITEM</b><em>UNLOCKED AT LEVEL {celebrate-1}</em></div>{!claimedReward?<><h3>🎟️ What are you picking?</h3><div className="reward-options merch-options">{(merchCoupons[celebrate]||merchCoupons[2]).map(item=><button key={item} onMouseEnter={()=>setPreviewReward(item)} onFocus={()=>setPreviewReward(item)} onClick={()=>chooseReward(item)} className={previewReward===item?"selected":""}><span>{merchEmoji[item]}</span><b>{item}</b><small>Choose this one</small></button>)}</div><p className="reward-note">We’ll save your choice in your merch collection.</p></>:<motion.div className="reward-claimed" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}><span>{merchEmoji[claimedReward]}</span><div><small>IT’S YOURS!</small><b>{claimedReward}</b></div><button onClick={continueToNextLevel}>{celebrate===2?"Begin Academic Takeoff":celebrate===3?"Begin Welcome Home":"Finish my journey"} <ArrowRight/></button></motion.div>}</motion.div></motion.div>}
      {finalReady&&<motion.div className="final-ready" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>{Array.from({length:12}).map((_,i)=><motion.span key={i} initial={{y:"110vh",x:0}} animate={{y:"-20vh",x:(i%2?1:-1)*(30+i*4)}} transition={{duration:3+(i%4),repeat:Infinity,delay:i*.18}}>🐝</motion.span>)}<motion.div initial={{scale:.8,y:25}} animate={{scale:1,y:0}}><small>BUZZ MAP COMPLETE</small><h2>You’re officially ready, {studentName}!</h2><p>You completed your essential onboarding, registered for your first semester, prepared for move-in, and claimed your GT merch rewards.</p><div><b>🎓 Classes planned</b><b>🎟️ Merch claimed</b><b>🐝 Yellow Jacket ready</b></div><h3>Welcome to your freshman year at Georgia Tech.</h3><button onClick={()=>{setFinalReady(false);setShowMerch(true)}}>See my merch collection <ArrowRight/></button></motion.div></motion.div>}
      {toast && <motion.div className="toast" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}}><Sparkles/>{toast}</motion.div>}
    </AnimatePresence>
    <AnimatePresence>{showCopilot&&<RegistrationCopilot major={major} onClose={()=>setShowCopilot(false)}/>}</AnimatePresence>
  </main>
}

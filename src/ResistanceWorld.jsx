/*
=================================================================================
 🧠 PROJECT: LOGIC OF RESISTANCE (PART 1/5)
 ---------------------------------------------------------------------------------
 CONCEPT:   A 3D Graph Visualization of Islamic Political Philosophy.
 GOAL:      To visualize the CAUSE & EFFECT relationships in social resistance.
 DATA:      Contains the core "Knowledge Graph" of arguments, not slogans.
 AUTHOR:    AI Assistant (Based on User Vision)
=================================================================================
*/

// ==========================================
// A. IMPORTS (این‌ها را به خط ۱ فایل منتقل کنید)
// ==========================================
import React, { useState, useRef, useMemo, Suspense, useEffect } from 'react';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Line, 
  Billboard, 
  Html, 
  Stars, 
  Sparkles, 
  MeshReflectorMaterial 
} from '@react-three/drei';
import * as THREE from 'three';


// ==========================================
// B. UTILITY FUNCTIONS (توابع کمکی ضروری)
// ==========================================
// (این‌ها را قبل از شروع کامپوننت‌ها قرار دهید)

/**
 * تعیین رنگ بر اساس نوع مفهوم
 * توحید: سفید/آبی روشن (نور مطلق)
 * عمل: طلایی (ارزش)
 * دشمن: قرمز (خطر)
 * هدف: سبز (حیات)
 */

// رنگ‌ها بر اساس نوع مفهوم
const getTypeColor = (type) => {
  switch (type) {
    case 'ROOT': return '#F59E0B'; // Amber
    case 'PRINCIPLE': return '#10B981'; // Emerald
    case 'ENEMY': return '#EF4444'; // Red
    case 'ACTION': return '#3B82F6'; // Blue
    case 'GOAL': return '#06B6D4'; // Cyan
    case 'STRUCTURE': return '#8B5CF6'; // Violet
    default: return '#ffffff';
  }
};

// ==============================================================================
// 1. THE LOGIC DATABASE (پایگاه داده استدلال‌ها)
// ==============================================================================
// در اینجا ما مفاهیم را تعریف می‌کنیم و رابطه منطقی آن‌ها را مشخص می‌کنیم.
// هر آیتم یک "گره" فکری است که توضیحات دقیق دارد.

const LOGIC_GRAPH_DATA = [
  // --- سطح ۱: مبانی هستی‌شناسی (ریشه‌ها) ---
  {
    id: "TAWHID",
    label: "توحید (محوریت خدا)",
    type: "ROOT",
    description: "اعتقاد به اینکه تنها منبع قدرت و قانون در هستی، خداوند است. این اصل، زیربنای نفی هرگونه طاغوت و قدرت غیرالهی است.",
    reasoning: "اگر قدرت مطلق خداست، پس اطاعت از زورگویان شرک است.",
    position: [0, 0, 0],
    color: "#fbbf24" // Gold
  },
  {
    id: "KARAMAT",
    label: "کرامت ذاتی انسان",
    type: "PRINCIPLE",
    description: "انسان به ما هو انسان، دارای ارزش وجودی است و نباید تحقیر شود.",
    reasoning: "چون انسان خلیفه خداست، پذیرش ذلت و بردگیِ سیستم‌های سرمایه‌داری، خلاف خلقت اوست.",
    position: [0, 10, 0],
    color: "#34d399" // Soft Green
  },

  // --- سطح ۲: آسیب‌شناسی اجتماعی (مشکلات) ---
  {
    id: "ISTIKBAR",
    label: "استکبار (Systemic Arrogance)",
    type: "ENEMY",
    description: "جریانی که خود را برتر از قانون و انسان‌ها می‌داند و حق ویژه برای خود قائل است.",
    reasoning: "استکبار با انحصار منابع (رانت)، فرصت رشد را از توده‌ها می‌گیرد.",
    position: [-15, -5, 10],
    color: "#ef4444" // Danger Red
  },
  {
    id: "TAKATHUR",
    label: "تکاثر (Accumulation of Wealth)",
    type: "ENEMY",
    description: "جمع‌آوری حریصانه ثروت و گردش آن فقط در دست اغنیا.",
    reasoning: "وقتی ثروت در دست عده‌ای خاص بلوکه شود، فقر عمومی ایجاد می‌شود (دولة بین الاغنیاء).",
    position: [-20, -15, 15],
    color: "#991b1b" // Dark Red
  },
  {
    id: "ZULM",
    label: "ظلم سیستماتیک",
    type: "ENEMY",
    description: "قرار ندادن اشیاء و اشخاص در جایگاه حق خودشان.",
    reasoning: "نتیجه طبیعی حکومت غیرالهی، توزیع ناعادلانه فرصت‌هاست.",
    position: [-10, -10, 5],
    color: "#7f1d1d"
  },

  // --- سطح ۳: راهکارهای عملیاتی (مبارزه) ---
  {
    id: "QIYAM",
    label: "قیام لله",
    type: "ACTION",
    description: "حرکت جمعی برای تغییر وضعیت موجود به نفع عدالت، بدون نفع شخصی.",
    reasoning: "سکوت در برابر ظلم، مشارکت در ظلم است. تغییر فقط با حرکت جمعی (ناس) رخ می‌دهد.",
    position: [10, -5, 10],
    color: "#60a5fa" // Blue
  },
  {
    id: "ADALAT",
    label: "قسط (عدالت اجتماعی)",
    type: "GOAL",
    description: "فراهم کردن سهم برابر از فرصت‌های عمومی برای تمام آحاد جامعه.",
    reasoning: "هدف ارسال تمام انبیاء، برپایی قسط توسط خود مردم بوده است (لیقوم الناس بالقسط).",
    position: [15, 5, 5],
    color: "#22d3ee" // Cyan
  },
  {
    id: "NAFI_SABIL",
    label: "نفی سبیل (استقلال سیاسی)",
    type: "ACTION",
    description: "مسدود کردن هر راهی که کافران بر مومنان تسلط یابند.",
    reasoning: "وابستگی اقتصادی و سیاسی به دشمن، عزت جامعه اسلامی را از بین می‌برد.",
    position: [10, 15, -5],
    color: "#818cf8"
  },
  {
    id: "WILAYAT",
    label: "ولایت (همبستگی ایمانی)",
    type: "STRUCTURE",
    description: "پیوند عمیق و درهم‌تنیده بین اجزای جامعه ایمانی و رهبری.",
    reasoning: "بدون تشکیلات و رهبری واحد، انرژی‌های مبارزه هدر می‌رود و استکبار پیروز می‌شود.",
    position: [5, 5, -10],
    color: "#f472b6"
  },
  
  // --- سطح ۴: نتایج و آرمانشهر ---
  {
    id: "HAYAT_TAYYIBA",
    label: "حیات طیبه",
    type: "GOAL",
    description: "زندگی پاکیزه که در آن رفاه مادی با آرامش معنوی ترکیب شده است.",
    reasoning: "اسلام دنیا را مزرعه آخرت می‌داند؛ پس آبادانی دنیا مقدمه رشد معنوی است.",
    position: [0, 25, 0],
    color: "#fbbf24"
  },
  {
    id: "INHERITANCE",
    label: "وراثت زمین",
    type: "PROMISE",
    description: "حاکمیت نهایی صالحان بر مدیریت منابع کره زمین.",
    reasoning: "منطق تاریخ حکم می‌کند که باطل رفتنی است و حق پایدار است.",
    position: [0, 35, 0],
    color: "#ffffff"
  }
];

// ==============================================================================
// 2. THE LOGIC LINKS (اتصالات استدلالی)
// ==============================================================================
// این آرایه مشخص می‌کند که کدام مفهوم منطقاً به کدام مفهوم دیگر وصل است.
// این‌ها "رگ‌های" سیستم منطقی ما هستند.

const LOGIC_LINKS = [
  // توحید -> نفی استکبار
  { source: "TAWHID", target: "ISTIKBAR", relation: "در تضاد است با", strength: 5, dashed: true },
  // توحید -> کرامت انسان
  { source: "TAWHID", target: "KARAMAT", relation: "منشا است", strength: 10, dashed: false },
  
  // استکبار -> تکاثر
  { source: "ISTIKBAR", target: "TAKATHUR", relation: "تولید می‌کند", strength: 8, dashed: false },
  // تکاثر -> ظلم
  { source: "TAKATHUR", target: "ZULM", relation: "منجر می‌شود به", strength: 8, dashed: false },
  
  // کرامت انسان -> نفی سبیل
  { source: "KARAMAT", target: "NAFI_SABIL", relation: "ایجاب می‌کند", strength: 7, dashed: false },
  
  // ظلم -> قیام
  { source: "ZULM", target: "QIYAM", relation: "علت واکنش است", strength: 6, dashed: true },
  
  // قیام -> عدالت
  { source: "QIYAM", target: "ADALAT", relation: "با هدفِ", strength: 9, dashed: false },
  
  // ولایت -> قیام
  { source: "WILAYAT", target: "QIYAM", relation: "سازماندهی می‌کند", strength: 10, dashed: false },
  
  // عدالت + نفی سبیل -> حیات طیبه
  { source: "ADALAT", target: "HAYAT_TAYYIBA", relation: "مقدمه است", strength: 8, dashed: false },
  { source: "NAFI_SABIL", target: "HAYAT_TAYYIBA", relation: "شرط لازم است", strength: 7, dashed: false },
  
  // حیات طیبه -> وراثت زمین
  { source: "HAYAT_TAYYIBA", target: "INHERITANCE", relation: "تحقق وعده", strength: 10, dashed: false }
];

// ==============================================================================
// 3. UTILITY FUNCTIONS (توابع کمکی برای محاسبات هندسی)
// ==============================================================================

// محاسبه بردار بین دو نقطه برای رسم خطوط
const getVector = (posArray) => new THREE.Vector3(posArray[0], posArray[1], posArray[2]);

// ایجاد منحنی‌های نرم برای اتصالات منطقی (Bézier Curves for Logic Flow)
const createCurve = (p1, p2, offset = 2) => {
  const v1 = getVector(p1);
  const v2 = getVector(p2);
  
  // نقطه میانی را کمی بالا می‌بریم تا خط قوس داشته باشد
  const mid = v1.clone().add(v2).multiplyScalar(0.5);
  mid.y += offset; 
  
  const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
  return curve;
};


/*
  پایان پارت ۱
  -------------------------------------------------
  در پارت بعدی، ما کامپوننت‌های سه بعدی نودها (LogicNode) 
  و سیستم اتصالات (ConnectionSystem) را می‌سازیم که این دیتاها را 
  تبدیل به اجسام قابل تعامل کنند.
*/
/*
=================================================================================
 🏗️ PROJECT: LOGIC OF RESISTANCE (PART 2/5)
 ---------------------------------------------------------------------------------
 FOCUS:     The 3D Components (Nodes & Connections).
 LOGIC:     Transforming data into interactive 3D geometry.
=================================================================================
*/

// ==========================================
// 4. CONNECTION LINE COMPONENT (رگ‌های استدلال)
// ==========================================

/**
 * این کامپوننت خطوط ارتباطی بین مفاهیم را رسم می‌کند.
 * ذرات نورانی روی این خطوط حرکت می‌کنند تا جریان منطق را نشان دهند.
 */
function LogicConnection({ start, end, relation, dashed, color }) {
  // ساخت منحنی برای زیبایی بصری (خط مستقیم خشک است)
  const curve = useMemo(() => createCurve(start, end, dashed ? 5 : 0), [start, end, dashed]);
  const points = useMemo(() => curve.getPoints(50), [curve]);
  
  // محاسبه موقعیت متن (توضیح رابطه) وسط خط
  const midPoint = curve.getPoint(0.5);

  return (
    <group>
      {/* خط اصلی */}
      <Line 
        points={points} 
        color={color || '#ffffff'} 
        opacity={0.3} 
        transparent 
        lineWidth={dashed ? 1 : 2} 
        dashed={dashed}
      />

      {/* ذره متحرک (پالس منطقی) - نشان‌دهنده جریان فکر */}
      {!dashed && <MovingPulse curve={curve} color={color} />}

      {/* برچسب توضیح رابطه (مثلاً: "منجر می‌شود به") */}
      <Billboard position={[midPoint.x, midPoint.y + 0.5, midPoint.z]}>
        <Text 
          fontSize={0.4} 
          color="#a1a1aa" 
          outlineWidth={0.02} 
          outlineColor="#000"
          backgroundColor="#00000088" // پس‌زمینه تیره برای خوانایی
        >
          {relation}
        </Text>
      </Billboard>
    </group>
  );
}

/**
 * یک ذره نورانی که روی خط حرکت می‌کند
 */
function MovingPulse({ curve, color }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // زمان جاری را می‌گیریم و موقعیت را بین ۰ تا ۱ تکرار می‌کنیم
      const t = (state.clock.getElapsedTime() * 0.5) % 1;
      const pos = curve.getPoint(t);
      meshRef.current.position.copy(pos);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshBasicMaterial color={color || '#fff'} />
    </mesh>
  );
}

// ==========================================
// 5. LOGIC NODE COMPONENT (مغزهای متفکر)
// ==========================================

/**
 * هر "دایره" در صحنه که نماینده یک مفهوم (مثل عدالت یا استکبار) است.
 * وقتی موس روی آن می‌رود، بزرگ می‌شود و وقتی کلیک می‌شود، جزئیات را نشان می‌دهد.
 */
function LogicNode({ data, onClick, isActive }) {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);

  // انیمیشن نرم برای بزرگ شدن هنگام هاور یا فعال بودن
  useFrame((state) => {
    if (meshRef.current) {
      // چرخش آرام دائمی
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z += 0.002;
      
      // تغییر سایز پویا (Pulsing)
      const baseScale = isActive ? 1.5 : (hovered ? 1.3 : 1);
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.05; // نفس کشیدن
      const targetScale = baseScale + breathe;
      
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const nodeColor = getTypeColor(data.type);

  return (
    <group position={data.position}>
      {/* جسم اصلی نود */}
      <mesh 
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(data); }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        {/* هندسه icosahedron شبیه کریستال است */}
        <icosahedronGeometry args={[1, 1]} /> 
        <meshStandardMaterial 
          color={nodeColor} 
          emissive={nodeColor}
          emissiveIntensity={hovered || isActive ? 2 : 0.5}
          roughness={0.2}
          metalness={0.8}
          wireframe={data.type === 'ENEMY'} // دشمن‌ها توخالی و سیمی‌اند (بی‌محتوا)
        />
      </mesh>
      
      {/* حلقه نورانی دور نود فعال */}
      {isActive && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 2, 32]} />
          <meshBasicMaterial color={nodeColor} side={THREE.DoubleSide} transparent opacity={0.5} />
        </mesh>
      )}

      {/* برچسب نام مفهوم */}
      <Billboard position={[0, 1.5, 0]}>
        <Text
          fontSize={0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {data.label}
        </Text>
      </Billboard>
    </group>
  );
}

// ==========================================
// 6. THE NETWORK SYSTEM (ترکیب همه اجزا)
// ==========================================

/**
 * این کامپوننت وظیفه دارد تمام نودها و لینک‌ها را بر اساس دیتای پارت ۱ رندر کند.
 */
function NetworkSystem({ onNodeSelect, activeNodeId }) {
  return (
    <group>
      {/* رندر کردن اتصالات (خطوط) */}
      {LOGIC_LINKS.map((link, index) => {
        const sourceNode = LOGIC_GRAPH_DATA.find(n => n.id === link.source);
        const targetNode = LOGIC_GRAPH_DATA.find(n => n.id === link.target);
        
        if (!sourceNode || !targetNode) return null;

        return (
          <LogicConnection 
            key={index}
            start={sourceNode.position}
            end={targetNode.position}
            relation={link.relation}
            dashed={link.dashed}
            color={getTypeColor(sourceNode.type)}
          />
        );
      })}

      {/* رندر کردن نودها (مفاهیم) */}
      {LOGIC_GRAPH_DATA.map((node) => (
        <LogicNode 
          key={node.id} 
          data={node} 
          onClick={onNodeSelect}
          isActive={activeNodeId === node.id}
        />
      ))}
    </group>
  );
}

/*
  پایان پارت ۲
  -------------------------------------------------
  اکنون ما اشیاء سه بعدی را داریم. اما هنوز پنل اطلاعاتی (UI) 
  که منطق را توضیح می‌دهد و محیط بصری (اتمسفر) را نداریم.
  پارت ۳ به رابط کاربری و تعامل اختصاص دارد.
*/
/*
=================================================================================
 🖥️ PROJECT: LOGIC OF RESISTANCE (PART 3/5)
 ---------------------------------------------------------------------------------
 FOCUS:     User Interface (UI) & Interaction Logic.
 LOGIC:     Displaying the "Why" and "How" behind each concept.
=================================================================================
*/

// ==========================================
// 7. INFO PANEL COMPONENT (پنل استدلال)
// ==========================================

/**
 * این کامپوننت یک پنل HTML روی صفحه سه بعدی (Overlay) است.
 * وظیفه آن نمایش توضیحات عمیق وقتی کاربر روی یک نود کلیک می‌کند.
 */
// ==========================================
// 7. INFO PANEL COMPONENT (اصلاح شده)
// ==========================================
function InfoPanel({ activeNode, onClose }) {
  if (!activeNode) return null;

  // رنگ کادر بر اساس نوع نود
  const borderColor = getTypeColor(activeNode.type);
  
  // 1. گرفتن مختصات نود فعال
  const [x, y, z] = activeNode.position;

  return (
    <Html 
      // 2. تنظیم موقعیت پنجره دقیقا کنار نود (۳ واحد به راست، ۲ واحد بالا)
      position={[x + 8, y + 2, z+1]} 
      style={{
        width: '300px',
        pointerEvents: 'none',
      }}
      as='div' 
      center 
    >
      <div style={{
        background: 'rgba(0, 0, 0, 0.85)', 
        border: `2px solid ${borderColor}`,
        borderRadius: '10px',
        padding: '20px',
        color: 'white',
        fontFamily: 'Tahoma, sans-serif',
        boxShadow: `0 0 20px ${borderColor}44`, 
        backdropFilter: 'blur(5px)', 
        pointerEvents: 'auto', 
        direction: 'rtl', 
        textAlign: 'right'
      }}>
        <div style={{ borderBottom: `1px solid ${borderColor}`, paddingBottom: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: borderColor }}>
            {activeNode.label}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong style={{ color: '#ccc', fontSize: '0.9rem' }}>تعریف:</strong>
          <p style={{ margin: '5px 0', fontSize: '0.85rem', lineHeight: '1.6' }}>
            {activeNode.description}
          </p>
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: '10px', 
          borderRadius: '5px',
          borderRight: `3px solid ${borderColor}` 
        }}>
          <strong style={{ color: '#fbbf24', fontSize: '0.9rem' }}>منطق و برهان:</strong>
          <p style={{ margin: '5px 0', fontSize: '0.85rem', lineHeight: '1.6', fontStyle: 'italic' }}>
            "{activeNode.reasoning}"
          </p>
        </div>

        <div style={{ marginTop: '15px', fontSize: '0.7rem', color: '#555', textAlign: 'center' }}>
          برای بستن کلیک کنید یا روی فضای خالی بزنید
        </div>
      </div>
    </Html>
  );
}

// ==========================================
// 8. CAMERA CONTROLLER (کارگردان هوشمند)
// ==========================================

/**
 * این کامپوننت دوربین را به آرامی به سمت نود انتخاب شده حرکت می‌دهد.
 * این باعث می‌شود تمرکز کاربر روی "منطق" مورد نظر قفل شود.
 */
function CameraFocus({ targetPosition }) {
  const { camera, controls } = useThree();
  const vec = new THREE.Vector3();
  const [isMoving, setMoving] = useState(false);

  useEffect(() => {
    // هر وقت یک نود جدید انتخاب شد، حرکت دوباره شروع بشه
    if (targetPosition) setMoving(true);
  }, [targetPosition]);

  useFrame(() => {
    if (targetPosition && isMoving) {
      // نقطه هدف دوربین
      vec.set(targetPosition[0] + 10, targetPosition[1] + 5, targetPosition[2] + 20);

      // حرکت نرم
      camera.position.lerp(vec, 0.05);

      if (controls) {
        controls.target.lerp(new THREE.Vector3(...targetPosition), 0.05);
        controls.update();
      }

      // وقتی دوربین نزدیک شد، انیمیشن متوقف می‌شه تا OrbitControls آزاد بشه
      if (camera.position.distanceTo(vec) < 0.2) {
        setMoving(false);
      }
    }
  });
  return null;
}


// ==========================================
// 9. MAIN INTERACTION MANAGER (اصلاح شده)
// ==========================================
function InteractionLayer() {
  const [activeNode, setActiveNode] = useState(null);

  // هندلر کلیک روی نودها
  const handleNodeSelect = (nodeData) => {
    setActiveNode(nodeData);
  };

  // هندلر بستن پنل
  const handleClose = () => {
    setActiveNode(null);
  };

  return (
    // این گروپ باعث می‌شود کلیک روی فضای خالی (Missed Click) تشخیص داده شود
    <group 
      onPointerMissed={(e) => {
        // e.delta مقدار جابجایی موس است.
        // اگر کمتر از 2 پیکسل باشد یعنی کلیک ساده است (درگ نیست) -> پس ببند
        if (e.delta <= 2) {
          handleClose();
        }
      }}
    >
      <NetworkSystem 
        onNodeSelect={handleNodeSelect} 
        activeNodeId={activeNode?.id} 
      />

      {activeNode && (
        <InfoPanel 
          activeNode={activeNode} 
          onClose={(e) => { e.stopPropagation(); handleClose(); }} 
        />
      )}

      <CameraFocus targetPosition={activeNode?.position} />
    </group>
  );
}

/*
  پایان پارت ۳
  -------------------------------------------------
  اکنون ما "منطق" (LogicNode)، "اتصالات" (Connections) و "توضیحات" (InfoPanel) را داریم.
  اما فضا هنوز تاریک و خالی است.
  در پارت ۴، ما "اتمسفر" (Atmosphere) را می‌سازیم: آسمان، زمین ترک خورده، 
  و نورپردازی دراماتیک که حس جدال حق و باطل را القا کند.
*/
/*
=================================================================================
 🌌 PROJECT: LOGIC OF RESISTANCE (PART 4/5)
 ---------------------------------------------------------------------------------
 FOCUS:     Atmosphere, Lighting & Environment.
 LOGIC:     Creating a space where Truth (Light) pierces the Void (Darkness).
=================================================================================
*/

// ==========================================
// 10. LIGHTING SETUP (روشنایی هدایت)
// ==========================================

/**
 * نورپردازی صحنه.
 * منطق: ما نور خورشید کلی نداریم. نور از خود حقایق (نودها) ساطع می‌شود.
 * اما یک نور محیطی ضعیف نیاز داریم تا "سایه‌ها" کاملاً سیاه نباشند.
 */
function LightingSetup() {
  return (
    <group>
      {/* نور محیطی ضعیف: نماد فطرت که هیچوقت کاملاً خاموش نمی‌شود */}
      <ambientLight intensity={0.2} color="#111122" />

      {/* نورهای نقطه‌ای برای ایجاد عمق و سایه‌روشن روی کره‌ها */}
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#4444ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#ff4444" />
      
      {/* نور متمرکز از بالا (نماد امداد الهی) */}
      <spotLight 
        position={[0, 50, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={0.5} 
        castShadow 
      />
    </group>
  );
}

// ==========================================
// 11. THE REFLECTIVE GROUND (زمین بازتاب‌دهنده)
// ==========================================

/**
 * کفی که زیر گراف قرار می‌گیرد.
 * منطق: زمین آینه‌ی اعمال ماست. تاریخ تکرار می‌شود و حقایق در زمین بازتاب دارند.
 * استفاده از MeshReflectorMaterial برای ایجاد بازتاب‌های واقعی و زیبا.
 */
function ReflectiveGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        blur={[300, 100]} // تاری بازتاب (محو شدن در واقعیت)
        resolution={1024} // کیفیت بازتاب
        mixBlur={1} // چقدر تاری با تصویر ترکیب شود
        mixStrength={40} // قدرت بازتاب
        roughness={1} // زبری سطح (زمین سنگلاخ است، نه آینه صاف)
        depthScale={1.2} // عمق بصری
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505" // رنگ پایه زمین (تیره)
        metalness={0.5}
      />
    </mesh>
  );
}

// ==========================================
// 12. ATMOSPHERE PARTICLES (غبار زمان)
// ==========================================

/**
 * ذرات معلق در هوا و ستاره‌ها.
 * منطق: این ذرات نشان‌دهنده گذشت زمان و حضور در یک فضای کیهانی/معنوی هستند.
 * همچنین مه (Fog) کمک می‌کند انتهای جهان محو شود و تمرکز روی گراف بماند.
 */
function Atmosphere() {
  return (
    <group>
      {/* رنگ پس‌زمینه: سیاهی مطلق نیست، سرمه‌ای بسیار تیره (عمق فضا) */}
      <color attach="background" args={['#020203']} />
      
      {/* مه: برای محو کردن افق و ایجاد حس نامتناهی بودن */}
      <fog attach="fog" args={['#020203', 10, 60]} />

      {/* ستاره‌های دوردست: امیدهای پنهان */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5} 
      />

      {/* ذرات معلق نزدیک: غبار میدان مبارزه یا جرقه‌های نور */}
      <Sparkles 
        count={200} 
        scale={30} 
        size={2} 
        speed={0.4} 
        opacity={0.4} 
        color="#ffffff"
      />
    </group>
  );
}

// ==========================================
// 13. POST PROCESSING HINT (جلوه‌های بصری)
// ==========================================

/*
  نکته فنی برای توسعه‌دهنده:
  برای اینکه نودها واقعاً "بدرخشند" (Glow Effect)، در یک پروژه واقعی React-Three-Fiber
  ما معمولاً از کتابخانه @react-three/postprocessing و افکت Bloom استفاده می‌کنیم.
  
  اما برای جلوگیری از پیچیدگی نصب پکیج‌های اضافی در این کد، ما فعلاً از 
  `emissive` و `emissiveIntensity` در متریال‌های نودها (در پارت ۲) استفاده کردیم 
  که اثر مشابهی دارد اما سبک‌تر است.
  
  اگر خواستید بعداً اضافه کنید:
  <EffectComposer>
    <Bloom luminanceThreshold={1} intensity={2} />
  </EffectComposer>
*/

/*
  پایان پارت ۴
  -------------------------------------------------
  ما الان همه اجزا را به صورت جداگانه داریم:
  1. داده‌ها (Data)
  2. اشیاء سه بعدی (Geometry)
  3. رابط کاربری (UI)
  4. محیط (Atmosphere)
  
  پارت ۵ (پارت آخر) جایی است که همه این قطعات را در کامپوننت اصلی `App` 
  مونتاژ می‌کنیم و کتابخانه‌های لازم را ایمپورت می‌کنیم تا کد نهایی 
  قابل اجرا (Run) شود.
*/
/*
=================================================================================
 🚀 PROJECT: LOGIC OF RESISTANCE (PART 5/5 - FINAL ASSEMBLY)
 ---------------------------------------------------------------------------------
 FOCUS:     Imports, Utilities, and Final Export.
 STATUS:    READY TO LAUNCH.
=================================================================================
*/


// ==========================================
// C. MAIN EXPORT (کامپوننت نهایی)
// ==========================================

export default function ResistanceWorld() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      
      {/* راهنمای گوشه صفحه */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 10,
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '0.8rem',
        pointerEvents: 'none'
      }}>
        <h3 style={{ margin: 0, color: 'white' }}>نقشه استدلال مقاومت</h3>
        <p>برای تحلیل منطق، روی مفاهیم کلیک کنید.</p>
        <p>چرخش: کلیک چپ و درگ | زوم: اسکرول</p>
      </div>

      <Canvas 
        camera={{ position: [0, 15, 35], fov: 45 }} 
        gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
        shadows
      >
        <Suspense fallback={
           <Html center>
             <div style={{ color: 'white', fontFamily: 'Tahoma' }}>در حال بارگذاری شبکه استدلال...</div>
           </Html>
        }>
          
          {/* 1. محیط و اتمسفر (پارت ۴) */}
          <Atmosphere />
          <LightingSetup />
          <ReflectiveGround />

          {/* 2. لایه تعاملی شامل گراف و منطق (پارت ۳ که پارت ۲ و ۱ را فراخوانی می‌کند) */}
          <InteractionLayer />

          {/* 3. کنترل‌های استاندارد */}
          <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2 - 0.1} // جلوگیری از رفتن دوربین به زیر زمین
            minDistance={10}
            maxDistance={80}
            enablePan={true}
          />

        </Suspense>
      </Canvas>
    </div>
  );
}

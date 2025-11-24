/*
===========================================================
 Islamic Metaverse: Single Central Text (Manifesto)
 Author: Hossein Mahzadi
 Font: Vazirmatn (Online)
===========================================================
*/
import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Stars,
  Text,
  Float,
  Sparkles
} from "@react-three/drei";

// 📌 لینک فونت وزیر (نسخه ضخیم برای خوانایی بهتر)
const FONT_URL = "https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/ttf/Vazirmatn-Bold.ttf";

// 🔶 کامپوننت نمایش متن تک‌قطعه
function CentralPersianText({ text, position, color, size = 1.5 }) {
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
      <group position={position}>
        {/* متن اصلی */}
        <Text
          font={FONT_URL}
          fontSize={size}
          color={color}
          textAlign="center" // وسط‌چین کردن خطوط
          anchorX="center"
          anchorY="middle"
          lineHeight={1.5} // فاصله بین خطوط
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {text}
          {/* متریال درخشان */}
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={1.5} 
            toneMapped={false} 
          />
        </Text>
        
        {/* نور پس‌زمینه برای خوانایی و جلوه */}
        <pointLight distance={15} intensity={3} color={color} position={[0, 0, 2]} />
      </group>
    </Float>
  );
}

// 🔶 زمین بازتاب دهنده (آینه سیاه)
function ReflectionFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial 
        color="#000000" 
        roughness={0.05} 
        metalness={0.95} 
      />
    </mesh>
  );
}

// 🔶 محتوای اصلی صحنه
function SceneContent() {
  // 📝 متن خود را در اینجا ویرایش کنید (از \n برای رفتن به خط بعد استفاده کنید)
  const myText = `
ما اراده کردیم بر مستضعفان زمین منت نهیم
و آنان را پیشوایان و وارثان زمین قرار دهیم

این وعده تخلف‌ناپذیر خداست`;


  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 5, 50]} />
      <ambientLight intensity={0.3} />
      
      {/* ستاره‌ها در عمق */}
      <Stars radius={120} count={4000} factor={5} fade speed={0.5} />

      <ReflectionFloor />

      {/* === تک متن مرکزی === */}
      <CentralPersianText 
        text={myText}
        position={[0, 2, 0]} // موقعیت در مرکز
        color="#4ade80"       // رنگ سبز نورانی (میتوانید به طلایی #fbbf24 تغییر دهید)
        size={1.2}            // سایز متن
      />

      {/* ذرات معلق اطراف متن برای حس معنوی */}
      <Sparkles 
        count={300} 
        scale={15} 
        size={2} 
        speed={0.2} 
        opacity={0.6} 
        color="#ffffff" 
        position={[0, 2, 0]} // ذرات دور متن باشند
      />

      {/* کنترل دوربین */}
      <OrbitControls 
        enablePan={false} // قفل کردن جابجایی (فقط چرخش)
        enableZoom={true}
        maxPolarAngle={Math.PI / 2 - 0.05}
        autoRotate={true}
        autoRotateSpeed={0.3}
        minDistance={5}
        maxDistance={30}
      />
    </>
  );
}

export default function ResistanceWorld() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }} gl={{ antialias: true }}>
        <Suspense 
          fallback={
            <Html center>
              <div style={{ color: 'white', fontFamily: 'Tahoma', textAlign: 'center' }}>
                در حال بارگذاری کتیبه...
              </div>
            </Html>
          }
        >
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}

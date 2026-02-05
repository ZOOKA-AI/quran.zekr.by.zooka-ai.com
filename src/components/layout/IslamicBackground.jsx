
export default function IslamicBackground({ children, variant = 'default' }) {
  const variants = {
    default: 'from-indigo-950/90 via-slate-900/95 to-slate-950/98',
    emerald: 'from-emerald-950/90 via-slate-900/95 to-slate-950/98',
    purple: 'from-purple-950/90 via-slate-900/95 to-slate-950/98',
    amber: 'from-amber-950/90 via-slate-900/95 to-slate-950/98',
  };

  return (
    <div className="min-h-screen relative" dir="rtl">
      {/* خلفية روحانية إسلامية */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1920&q=80)',
            filter: 'brightness(0.25)'
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${variants[variant]}`} />
        {/* نجوم متلألئة */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(2px 2px at 20px 30px, white, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 90px 40px, white, transparent), radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent), radial-gradient(1px 1px at 200px 80px, white, transparent)',
          backgroundSize: '200px 200px'
        }} />
        {/* زخرفة إسلامية خفيفة */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23fff' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }} />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
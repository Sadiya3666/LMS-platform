'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import PaymentModal from '@/components/PaymentModal';

interface Video {
  id: number;
  title: string;
  duration_seconds: number;
  youtube_video_id?: string;
}

interface Section {
  id: number;
  title: string;
  videos: Video[];
}

interface Subject {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  category: string;
  instructor_name: string;
  difficulty_level: string;
  price: number;
  is_free: boolean;
  rating: number;
  total_students: number;
  total_duration_seconds: number;
  sections: Section[];
}

export default function CourseDetailPage() {
  const { subjectId } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        setLoading(true);
        const [subRes, enrollRes] = await Promise.all([
          apiClient.get(`/api/subjects/${subjectId}`),
          isAuthenticated ? apiClient.get('/api/enrollments/my-courses').catch(() => null) : null
        ]);
        
        setSubject(subRes.data);
        
        if (enrollRes && enrollRes.data) {
          const enrolled = enrollRes.data.some((e: any) => e.id === subjectId?.toString());
          setIsEnrolled(enrolled);
        }
        
      } catch (err: any) {
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    if (subjectId) fetchSubject();
  }, [subjectId, isAuthenticated]);

  const handleEnrollClick = async () => {
    if (!isAuthenticated) return router.push('/auth/login');
    if (isEnrolled) return router.push(`/subjects/${subjectId}/video/${subject?.sections?.[0]?.videos?.[0]?.id}`);
    
    if (subject?.is_free || subject?.price === 0) {
      try {
        await apiClient.post('/api/payments/checkout', { subjectId: subject?.id });
        setIsEnrolled(true);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Enrollment failed');
      }
    } else {
      setPaymentModalOpen(true);
    }
  };

  const formatDuration = (secs: number) => {
    if (!secs) return '0h 0m';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%', maxWidth: '1000px', height: '400px',
          background: 'rgba(255,255,255,0.05)',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '24px'
        }} />
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#fca5a5' }}>
        <h2>Course not found</h2>
        <p>{error}</p>
      </div>
    );
  }

  const parseDescriptionChecklist = (desc: string) => {
    if (!desc) return [];
    const parts = desc.split('. ');
    return parts.filter(p => p.trim().length > 0).slice(0, 5).map(p => p.endsWith('.') ? p : p + '.');
  };

  const checklist = parseDescriptionChecklist(subject.description);
  let totalVideoCount = 0;
  subject.sections?.forEach(s => totalVideoCount += s.videos.length);

  return (
    <main style={{ position: 'relative', zIndex: 1, paddingBottom: '100px' }}>
      {paymentModalOpen && (
        <PaymentModal 
          subject={subject} 
          onClose={() => setPaymentModalOpen(false)} 
          onSuccess={() => { setPaymentModalOpen(false); setIsEnrolled(true); }}
        />
      )}

      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '60vh',
        backgroundImage: subject.thumbnail_url ? `url(${subject.thumbnail_url})` : 'linear-gradient(135deg, #0f0c29, #302b63)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(15, 12, 41, 0.85)',
        display: 'flex',
        alignItems: 'center',
        padding: '60px 5%'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', width: '100%', maxWidth: '1200px', margin: '0 auto', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 600px', color: 'white' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ padding: '6px 14px', background: 'rgba(124,58,237,0.3)', backdropFilter: 'blur(8px)', borderRadius: '9999px', fontSize: '0.85rem', border: '1px solid rgba(124,58,237,0.5)' }}>
                {subject.category}
              </span>
              <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '9999px', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ color: '#fbbf24' }}>★</span> {subject.rating} ({subject.total_students} students)
              </span>
              <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '9999px', fontSize: '0.85rem' }}>
                {subject.difficulty_level}
              </span>
            </div>
            
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.1, background: 'linear-gradient(135deg, #ffffff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {subject.title}
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '30px', maxWidth: '600px', lineHeight: 1.6 }}>
              {subject.description}
            </p>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {subject.instructor_name?.[0] || 'I'}
                </div>
                <span>By <strong>{subject.instructor_name || 'Instructor'}</strong></span>
              </div>
            </div>
          </div>

          {/* CTA Card Desktop */}
          <div className="cta-card" style={{ flex: '1 1 350px', maxWidth: '450px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '24px', padding: '30px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', color: 'white'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>
                {subject.is_free || subject.price === 0 ? <span style={{ color: '#4ade80' }}>FREE</span> : `₹${subject.price / 100}`}
              </div>
              
              <button onClick={handleEnrollClick} style={{
                width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 700,
                background: isEnrolled ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                border: isEnrolled ? '1px solid rgba(255,255,255,0.2)' : 'none',
                color: 'white', cursor: 'pointer', marginBottom: '20px', transition: 'all 0.2s',
                boxShadow: isEnrolled ? 'none' : '0 8px 25px rgba(124,58,237,0.5)'
              }}>
                {isEnrolled ? 'Continue Learning →' : (subject.is_free || subject.price === 0 ? 'Enroll Now' : 'Buy Now')}
              </button>

              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                <p style={{ marginBottom: '10px' }}>✓ Full lifetime access</p>
                <p style={{ marginBottom: '10px' }}>✓ Access on mobile and desktop</p>
                <p>✓ Certificate of completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '60px auto 0', padding: '0 5%', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 600px' }}>
          
          {/* What you'll learn */}
          {checklist.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px', padding: '30px', marginBottom: '40px', color: 'white'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>What you'll learn</h2>
              <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', listStyle: 'none', padding: 0 }}>
                {checklist.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'rgba(255,255,255,0.8)' }}>
                    <span style={{ color: '#4ade80', fontSize: '1.2rem' }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Course Content Accordion */}
          <div style={{ color: 'white' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Course Content</h2>
            <div style={{ display: 'flex', gap: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px', fontSize: '0.9rem' }}>
              <span>{subject.sections?.length || 0} sections</span>
              <span>•</span>
              <span>{totalVideoCount} lectures</span>
              <span>•</span>
              <span>{formatDuration(subject.total_duration_seconds)} total length</span>
            </div>

            <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
              {subject.sections?.map((section, idx) => {
                const isExpanded = expandedSection === idx;
                let sectionDuration = 0;
                section.videos.forEach(v => sectionDuration += (v.duration_seconds || 0));

                return (
                  <div key={section.id} style={{ borderBottom: idx === subject.sections.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                    <div 
                      onClick={() => setExpandedSection(isExpanded ? null : idx)}
                      style={{
                        padding: '20px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', 
                        alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    >
                      <div style={{ fontWeight: 600, display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '0.8rem' }}>{idx + 1}</span>
                        {section.title}
                      </div>
                      <div style={{ display: 'flex', gap: '16px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                        <span>{section.videos.length} lectures • {formatDuration(sectionDuration)}</span>
                        <span>{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div style={{ padding: '10px 0', background: 'rgba(0,0,0,0.2)' }}>
                        {section.videos.map((vid, vIdx) => {
                          const isPreview = !isEnrolled && (idx === 0 && vIdx === 0);
                          const Icon = isEnrolled ? "📺" : (isPreview ? "👁️" : "🔒");
                          return (
                            <div key={vid.id} style={{
                              padding: '12px 20px', display: 'flex', justifyContent: 'space-between',
                              color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem'
                            }}>
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <span style={{ opacity: 0.6 }}>{Icon}</span>
                                <span style={{ color: isPreview ? '#a78bfa' : 'inherit' }}>{vid.title}</span>
                              </div>
                              <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>{formatDuration(vid.duration_seconds)}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

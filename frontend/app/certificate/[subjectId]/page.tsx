'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';

interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  instructorName: string;
}

export default function CertificatePage() {
  const { subjectId } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/certificates/${subjectId}`);
        setCertData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load certificate');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [subjectId, isAuthenticated, router]);

  const handleDownload = () => {
    setDownloading(true);
    // Dummy download action
    setTimeout(() => {
      alert('Certificate generated and "downloaded"! (Dummy action)');
      setDownloading(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', minHeight: '80vh', alignItems: 'center' }}>
        <div style={{
          width: '100%', maxWidth: '800px', height: '600px',
          background: 'rgba(255,255,255,0.05)',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '24px'
        }} />
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#fca5a5' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Certificate Unavailable</h2>
        <p style={{ background: 'rgba(239,68,68,0.1)', display: 'inline-block', padding: '16px 24px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.3)' }}>
          {error}
        </p>
        <div style={{ marginTop: '40px' }}>
          <button onClick={() => router.push('/profile')} style={{
            padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer'
          }}>
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <main style={{ padding: '60px 5%', minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Download Action Bar */}
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <button onClick={() => router.push('/profile')} style={{
          padding: '10px 20px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', cursor: 'pointer', transition: 'all 0.2s'
        }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
          ← Back
        </button>

        <button onClick={handleDownload} disabled={downloading} style={{
          padding: '12px 30px', background: 'linear-gradient(135deg, #4ade80, #16a34a)', color: 'white', border: 'none', borderRadius: '999px', fontWeight: 600, cursor: downloading ? 'wait' : 'pointer', boxShadow: '0 4px 20px rgba(74,222,128,0.3)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px'
        }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          {downloading ? 'Generating PDF...' : 'Download PDF 📥'}
        </button>
      </div>

      {/* Certificate Frame */}
      <div id="certificate-node" style={{
        width: '100%', maxWidth: '900px', aspectRatio: '1.414 / 1', // A4 Landscape ratio almost
        background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 100px rgba(124,58,237,0.2)',
        position: 'relative', overflow: 'hidden',
        color: '#1e293b'
      }}>
        {/* Inner Border */}
        <div style={{
            position: 'absolute', top: '16px', left: '16px', right: '16px', bottom: '16px',
            border: '4px solid #94a3b8', borderRadius: '4px', zIndex: 1
        }} />
        <div style={{
            position: 'absolute', top: '24px', left: '24px', right: '24px', bottom: '24px',
            border: '1px solid #cbd5e1', borderRadius: '2px', zIndex: 1
        }} />

        {/* Decorative Corners */}
        <div style={{ position: 'absolute', top: '0', left: '0', width: '150px', height: '150px', background: 'linear-gradient(135deg, #7c3aed, transparent)', opacity: 0.1, zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '0', right: '0', width: '150px', height: '150px', background: 'linear-gradient(-45deg, #ec4899, transparent)', opacity: 0.1, zIndex: 0 }} />

        {/* Content Details */}
        <div style={{
            position: 'relative', zIndex: 2, height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '40px'
        }}>
            
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#334155', letterSpacing: '8px', marginBottom: '20px', fontFamily: 'serif' }}>
              CERTIFICATE
            </div>
            <div style={{ fontSize: '1.2rem', color: '#64748b', letterSpacing: '4px', marginBottom: '40px', textTransform: 'uppercase' }}>
              OF COMPLETION
            </div>

            <div style={{ fontSize: '1rem', color: '#475569', marginBottom: '20px' }}>
              This is to proudly certify that
            </div>

            <div style={{ fontSize: '3.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px', fontFamily: '"Dancing Script", cursive, serif', borderBottom: '2px solid #cbd5e1', paddingBottom: '10px', minWidth: '60%' }}>
              {certData.studentName}
            </div>

            <div style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '20px', maxWidth: '80%', lineHeight: 1.6 }}>
              has successfully completed all requirements and videos for the course:
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6', marginBottom: '60px', textShadow: '0 2px 10px rgba(59,130,246,0.2)' }}>
              {certData.courseName}
            </div>

            {/* Footer section of cert */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 'auto', padding: '0 40px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 600, borderBottom: '1px solid #94a3b8', paddingBottom: '8px', marginBottom: '8px', minWidth: '150px' }}>
                  {new Date(certData.completionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</div>
              </div>

              {/* Seal */}
              <div style={{ 
                width: '100px', height: '100px', borderRadius: '50%', 
                background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(217,119,6,0.4)',
                border: '4px double #fef3c7', position: 'relative', marginTop: '-30px'
              }}>
                <div style={{ position: 'absolute', width: '80%', height: '80%', borderRadius: '50%', border: '1px dashed #fcd34d' }} />
                <span style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>★</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', color: '#0f172a', fontFamily: '"Dancing Script", cursive, serif', borderBottom: '1px solid #94a3b8', paddingBottom: '8px', marginBottom: '8px', minWidth: '150px' }}>
                  {certData.instructorName}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Instructor</div>
              </div>

            </div>
            
            <div style={{ position: 'absolute', bottom: '20px', right: '40px', fontSize: '0.6rem', color: '#94a3b8', letterSpacing: '1px' }}>
              Certificate ID: {certData.certificateId}
            </div>
            <div style={{ position: 'absolute', bottom: '20px', left: '40px', fontSize: '0.6rem', color: '#94a3b8', letterSpacing: '1px', fontWeight: 800 }}>
              EDUFLOW ACADEMY
            </div>

        </div>
      </div>

    </main>
  );
}

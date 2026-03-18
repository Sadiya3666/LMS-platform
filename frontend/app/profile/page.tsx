'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import { useRouter } from 'next/navigation';

interface EnrolledCourse {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string;
  progress: number;
  completed_videos: number;
  total_videos: number;
  enrolled_at: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  course_title: string;
  transaction_id: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, paymentsRes] = await Promise.all([
          apiClient.get('/api/enrollments/my-courses').catch(() => ({ data: [] })),
          apiClient.get('/api/payments/my-payments').catch(() => ({ data: [] }))
        ]);

        setCourses(coursesRes.data || []);
        setPayments(paymentsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, router]);

  if (!user || loading) {
    return (
      <div className="p-10 flex justify-center min-h-[80vh] items-center">
        <div className="w-full max-w-3xl h-96 bg-white/5 animate-pulse rounded-3xl" />
      </div>
    );
  }

  const completedCourses = courses.filter(c => c.progress === 100);
  const activeCourses = courses.filter(c => c.progress < 100);
  const totalVideosCompleted = courses.reduce((acc, c) => acc + c.completed_videos, 0);

  return (
    <main className="px-[5%] py-16 max-w-7xl mx-auto profile-text-bright">
      
      {/* Header Profile Card */}
      <div className="profile-card backdrop-blur-xl rounded-[32px] p-10 flex flex-col md:flex-row gap-8 items-center mb-10 shadow-2xl">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-4xl md:text-5xl font-black text-white shadow-[0_0_30px_rgba(124,58,237,0.4)]">
          {user.name?.[0]?.toUpperCase()}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
            {user.name}
          </h1>
          <p className="profile-text-dim text-lg mb-4">
            {user.email}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm opacity-80">
            <span className="px-3 py-1 bg-white/10 rounded-full">
              Full Member
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full">
              {courses.length} Courses
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {[
          { label: 'Courses', value: courses.length, color: 'text-purple-400' },
          { label: 'Completed', value: totalVideosCompleted, color: 'text-green-400' },
          { label: 'Hours', value: '~' + Math.round((totalVideosCompleted * 15) / 60), color: 'text-blue-400' }
        ].map((stat, i) => (
          <div key={i} className="profile-stat-card p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
            <div className={`text-4xl font-black mb-2 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="profile-text-dim text-xs font-bold uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Active Courses */}
      <div className="mb-16">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-purple-500 rounded-full" />
          Active Courses ({activeCourses.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCourses.length === 0 ? (
            <div className="col-span-full p-12 bg-white/5 border border-dashed border-white/10 rounded-3xl text-center opacity-40">
              No active courses. Time to start something new?
            </div>
          ) : (
            activeCourses.map(course => (
              <div key={course.id} className="profile-card flex flex-col rounded-3xl overflow-hidden group">
                <div 
                  className="h-40 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'})` }} 
                />
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-6 line-clamp-1">{course.title}</h3>
                  <div className="mt-auto">
                    <div className="flex justify-between text-[10px] font-bold uppercase mb-2 opacity-60">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 profile-progress-bg rounded-full overflow-hidden mb-6">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" 
                        style={{ width: `${course.progress}%` }} 
                      />
                    </div>
                    <button 
                      onClick={() => router.push(`/subjects/${course.id}`)}
                      className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completed Courses */}
      <div className="mb-16">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-green-500 rounded-full" />
          Completed ({completedCourses.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {completedCourses.length === 0 ? (
            <div className="col-span-full p-12 bg-white/5 border border-dashed border-white/10 rounded-3xl text-center opacity-40">
              No certifications yet. Keep pushing!
            </div>
          ) : (
            completedCourses.map(course => (
              <div key={course.id} className="profile-card p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute -top-6 -right-6 text-8xl opacity-10 rotate-12">🎓</div>
                <h3 className="text-lg font-black mb-2 relative z-10">{course.title}</h3>
                <p className="text-green-400 text-xs font-bold mb-6 relative z-10 flex items-center gap-1">
                  <span>✨</span> Verified Certificate
                </p>
                <button 
                  onClick={() => router.push(`/certificate/${course.id}`)}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white text-xs font-black rounded-xl shadow-lg shadow-green-500/20 transition-all relative z-10"
                >
                  DOWNLOAD CERTI
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-blue-500 rounded-full" />
          Transactions
        </h2>
        
        <div className="profile-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="profile-table-header text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center opacity-40">No transactions yet.</td>
                  </tr>
                ) : (
                  payments.map((p, i) => (
                    <tr key={p.id} className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                      <td className="px-6 py-4 font-bold">{p.course_title}</td>
                      <td className="px-6 py-4 opacity-40 font-mono">{p.transaction_id}</td>
                      <td className="px-6 py-4 opacity-60">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right font-black">₹{p.amount / 100}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </main>
  );
}

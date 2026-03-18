'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import PaymentModal from '@/components/PaymentModal';

interface Subject {
  id: number;
  title: string;
  slug: string;
  description: string;
  is_published: boolean;
  thumbnail_url: string;
  category: string;
  instructor_name: string;
  difficulty_level: string;
  price: number;
  is_free: boolean;
  rating: number;
  total_students: number;
}

export default function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    apiClient.get('/api/subjects/categories')
      .then(res => setCategories(['All', ...res.data]))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const params: any = { q: debouncedSearch, page: 1, pageSize: 12 };
        if (activeCategory !== 'All') {
          params.category = activeCategory;
        }
        const res = await apiClient.get('/api/subjects', { params });
        setSubjects(res.data.subjects || res.data || []);
      } catch (err: any) {
        console.error('Subjects fetch error:', err);
        setError(err.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubjects();
  }, [debouncedSearch, activeCategory]);

  const handleEnrollClick = async (e: React.MouseEvent, subject: Subject) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (subject.is_free || subject.price === 0) {
      try {
        await apiClient.post('/api/payments/checkout', { subjectId: subject.id });
        router.push(`/subjects/${subject.id}`);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Enrollment failed');
      }
    } else {
      setSelectedSubject(subject);
      setPaymentModalOpen(true);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return { color: '#4ade80', shadow: 'rgba(74, 222, 128, 0.4)' };
      case 'intermediate': return { color: '#facc15', shadow: 'rgba(250, 204, 21, 0.4)' };
      case 'advanced': return { color: '#f87171', shadow: 'rgba(248, 113, 113, 0.4)' };
      default: return { color: '#a78bfa', shadow: 'rgba(167, 139, 250, 0.4)' };
    }
  };

  return (
    <main className="relative z-10">
      {paymentModalOpen && selectedSubject && (
        <PaymentModal 
          subject={selectedSubject} 
          onClose={() => setPaymentModalOpen(false)} 
          onSuccess={() => router.push(`/subjects/${selectedSubject.id}`)}
        />
      )}
      
      {/* Hero Section */}
      <div className="pt-16 pb-10 px-10 text-center">
        <h1 className="text-5xl font-extrabold mb-3 dashboard-title">
          Explore Courses
        </h1>
        <p className="text-xl mb-8 dashboard-subtitle">
          Start your learning journey today
        </p>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto relative group">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for subjects..."
            className="w-full py-3.5 pl-12 pr-5 rounded-full outline-none transition-all search-input-glass focus:ring-2 focus:ring-purple-500/50"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
            {search !== debouncedSearch ? '⏳' : '🔍'}
          </span>
        </div>

        <div className="flex justify-center gap-6 flex-wrap mt-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full cursor-pointer transition-all border font-medium ${
                activeCategory === cat 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-transparent text-white shadow-lg shadow-purple-500/30' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-10 pb-16">
        {loading ? (
          [1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
          ))
        ) : error ? (
          <div className="col-span-full p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
            {error}
          </div>
        ) : subjects.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/5 opacity-50">
            <div className="text-4xl mb-4">📚</div>
            <p>No courses found. Try another search!</p>
          </div>
        ) : (
          subjects.map((subject) => {
            const diffStyles = getDifficultyColor(subject.difficulty_level);
            return (
              <div
                key={subject.id}
                onClick={() => router.push(`/subjects/${subject.id}`)}
                className="card-glass rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-500/20 group flex flex-col"
              >
                <div 
                  className="h-44 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${subject.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'})` }}
                >
                  <div className="absolute top-3 left-3 px-3 py-1 bg-purple-600/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                    {subject.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span 
                      className="text-[10px] uppercase font-bold tracking-tighter"
                      style={{ color: diffStyles.color, textShadow: `0 0 10px ${diffStyles.shadow}` }}
                    >
                      {subject.difficulty_level}
                    </span>
                    <span className="text-yellow-400 text-xs">
                      {'★'.repeat(Math.round(subject.rating || 5))}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2 line-clamp-2 card-title">
                    {subject.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">
                      {subject.instructor_name?.[0] || 'I'}
                    </div>
                    <span className="text-xs card-text-muted">{subject.instructor_name}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="text-xl font-bold">
                      {subject.price === 0 ? (
                        <span className="text-green-400 text-shadow-sm shadow-green-400/50">FREE</span>
                      ) : (
                        <span>₹{subject.price / 100}</span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => handleEnrollClick(e, subject)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-xs font-bold text-white shadow-md hover:opacity-90 transition-all active:scale-95"
                    >
                      {subject.price === 0 ? 'Enroll' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}

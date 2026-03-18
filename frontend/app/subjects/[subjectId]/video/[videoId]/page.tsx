"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "../../../../../lib/apiClient";
import { updateProgress, getVideoProgress } from "../../../../../lib/progress";
import { useSidebarStore } from "../../../../../store/sidebarStore";
import { Lock, CheckCircle, ChevronLeft, ChevronRight, MessageSquare, FileText, Download, PlayCircle, Loader2 } from "lucide-react";
import { VideoPlayer } from "../../../../../components/Video/VideoPlayer";

export default function VideoPage() {
  const { subjectId, videoId } = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markVideoCompleted = useSidebarStore(state => state.markVideoCompleted);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [videoRes, progressRes] = await Promise.all([
          apiClient.get(`/api/videos/${videoId}`),
          getVideoProgress(videoId as string),
        ]);
        setVideo(videoRes.data);
        setUserProgress(progressRes);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchData();
    }
  }, [videoId]);

  const handleProgress = (currentTime: number, completed: boolean) => {
    if (video && !video.locked) {
      updateProgress(videoId as string, currentTime, completed);
      if (completed) {
        markVideoCompleted(videoId as string);
      }
    }
  };

  const handleCompleted = () => {
    if (video && !video.locked) {
      updateProgress(videoId as string, video.duration_seconds || userProgress?.last_position_seconds || 0, true);
      markVideoCompleted(videoId as string);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0F172A] text-white">
      <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-[#0F172A]">
      <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl max-w-lg text-center">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!video) return null;

  if (video.locked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 bg-[#0F172A]">
        <div className="bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 flex flex-col items-center text-center max-w-md">
           <div className="bg-white/10 p-6 rounded-full mb-6">
             <Lock className="h-12 w-12 text-white/50" />
           </div>
           <h2 className="text-2xl font-bold text-white mb-2">Lesson Locked</h2>
           <p className="text-white/60 mb-8">
             You need to complete the previous lesson before you can watch this one.
           </p>
           <button 
             onClick={() => router.back()}
             className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
           >
             Go back
           </button>
        </div>
      </div>
    );
  }

  const startPosition = userProgress?.last_position_seconds || 0;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 pb-20">
      
      <div className="video-layout-container">
        
        {/* Left Main Content */}
        <div className="video-main-content">
          
          <VideoPlayer
            videoId={video.id.toString()}
            youtubeUrl={video.youtube_url || video.youtube_video_id || ""}
            thumbnailUrl={video.thumbnail_url}
            startPositionSeconds={startPosition}
            onProgress={handleProgress}
            onCompleted={handleCompleted}
          />

          {/* Lesson Metadata */}
          <div className="video-card">
             <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
               <div>
                 <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
                 <div className="flex items-center gap-3 text-sm text-slate-400">
                   <span className="px-3 py-1 bg-white/10 rounded-full">{video.section_title || 'Section'}</span>
                   <span>•</span>
                   <span>{Math.round((video.duration_seconds || 0) / 60)} mins</span>
                 </div>
               </div>
               
               <div className="flex gap-2">
                 <button 
                    disabled={!video.previous_video_id}
                    onClick={() => router.push(`/subjects/${subjectId}/video/${video.previous_video_id}`)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl disabled:opacity-30 transition-colors"
                 >
                    <ChevronLeft className="w-5 h-5" />
                 </button>
                 <button 
                    disabled={!video.next_video_id}
                    onClick={() => router.push(`/subjects/${subjectId}/video/${video.next_video_id}`)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl disabled:opacity-30 transition-colors"
                 >
                    <ChevronRight className="w-5 h-5" />
                 </button>
               </div>
             </div>
          </div>

          {/* Tabs Section */}
          <div className="video-card !p-0 overflow-hidden">
             <div className="tabs-header">
                {['overview', 'notes', 'resources', 'q&a'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                    >
                      {tab}
                    </button>
                ))}
             </div>
             
             <div className="p-6">
                {activeTab === 'overview' && (
                    <div className="max-w-none">
                       <h3 className="text-xl font-semibold text-white mb-4">About this lesson</h3>
                       <p className="text-slate-300 leading-relaxed text-lg">
                          {video.description || 'Welcome to this lesson! Explore the core concepts covered in this video.'}
                       </p>
                    </div>
                )}
                
                {activeTab === 'notes' && (
                    <div className="space-y-4">
                       <h3 className="text-lg font-semibold text-white">Project Notes</h3>
                       <textarea 
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Type your notes here..."
                          className="w-full h-48 bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500"
                       />
                       <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">Save Changes</button>
                    </div>
                )}
                
                {activeTab === 'resources' && (
                    <div className="space-y-4">
                       <h3 className="text-lg font-semibold text-white">Resources</h3>
                       <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer">
                          <div className="flex items-center gap-4">
                             <FileText className="w-6 h-6 text-blue-400" />
                             <div>
                                <div className="font-medium text-white">Lesson Slides (PDF)</div>
                                <div className="text-xs text-slate-500">2.4 MB</div>
                             </div>
                          </div>
                          <Download size={20} className="text-slate-500" />
                       </div>
                    </div>
                )}
                
                {activeTab === 'q&a' && (
                    <div className="text-center py-10 opacity-50">
                       <MessageSquare className="w-10 h-10 mx-auto mb-4" />
                       <p>Ask a question about this lesson</p>
                    </div>
                )}
             </div>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="w-full lg:w-[30%] flex flex-col gap-6">
           <div className="video-card">
              <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">Instructor</h3>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">EF</div>
                 <div>
                    <div className="font-semibold text-white">EduFlow Expert</div>
                    <div className="text-xs text-slate-400">Senior Developer</div>
                 </div>
              </div>
           </div>
           
           <div className="video-card bg-indigo-900/20 border-indigo-500/20">
              <h3 className="text-xs uppercase tracking-wider text-indigo-400 font-bold mb-4">Course Info</h3>
              <p className="text-sm text-slate-400 mb-6">
                Use the course menu on the left to navigate through lessons.
              </p>
              <div className="space-y-3">
                 <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Course Progress Saved</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

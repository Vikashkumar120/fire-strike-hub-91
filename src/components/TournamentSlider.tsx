
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Trophy, MapPin, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Tournament {
  id: string;
  title: string;
  type: string;
  prize: string;
  entry_fee: number;
  max_players: number;
  current_players: number;
  start_time: string;
  status: string;
  map?: string;
  duration?: string;
  thumbnail?: string;
  custom_code?: string;
}

const TournamentSlider = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .in('status', ['open', 'started'])
        .order('start_time', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Error fetching tournaments:', error);
        return;
      }

      if (data && data.length > 0) {
        setTournaments(data);
      } else {
        // Fallback to sample data if no tournaments in database
        setTournaments([
          {
            id: 'sample-1',
            title: 'Squad Showdown Championship',
            type: 'Squad',
            prize: '₹25,000',
            entry_fee: 100,
            max_players: 64,
            current_players: 32,
            start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            status: 'open',
            map: 'Bermuda',
            duration: '45 min',
            thumbnail: '/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png',
            custom_code: 'SQUAD2024'
          },
          {
            id: 'sample-2',
            title: 'Solo Warriors Battle',
            type: 'Solo',
            prize: '₹15,000',
            entry_fee: 50,
            max_players: 100,
            current_players: 67,
            start_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            status: 'open',
            map: 'Purgatory',
            duration: '30 min',
            thumbnail: '/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png',
            custom_code: 'SOLO2024'
          }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-slide functionality
  useEffect(() => {
    if (tournaments.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === tournaments.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [tournaments.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === tournaments.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? tournaments.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/20 to-cyan-900/20 backdrop-blur-sm border border-purple-500/10">
        <div className="h-64 md:h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/20 to-cyan-900/20 backdrop-blur-sm border border-purple-500/10">
        <div className="h-64 md:h-80 flex items-center justify-center">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No tournaments available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentTournament = tournaments[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/20 to-cyan-900/20 backdrop-blur-sm border border-purple-500/10">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url(${currentTournament.thumbnail || '/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png'})`
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
      
      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 h-64 md:h-80 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 text-sm font-medium rounded-full border border-cyan-500/30">
              {currentTournament.type}
            </span>
            <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 text-sm font-medium rounded-full border border-green-500/30">
              {currentTournament.status === 'open' ? 'Registration Open' : 'Started'}
            </span>
            {currentTournament.custom_code && (
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-sm font-medium rounded-full border border-yellow-500/30">
                Code: {currentTournament.custom_code}
              </span>
            )}
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {currentTournament.title}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center text-green-400">
              <Trophy className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{currentTournament.prize}</span>
            </div>
            <div className="flex items-center text-blue-400">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">{currentTournament.current_players}/{currentTournament.max_players}</span>
            </div>
            {currentTournament.map && (
              <div className="flex items-center text-purple-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{currentTournament.map}</span>
              </div>
            )}
            {currentTournament.duration && (
              <div className="flex items-center text-orange-400">
                <Timer className="w-4 h-4 mr-2" />
                <span className="text-sm">{currentTournament.duration}</span>
              </div>
            )}
          </div>

          <div className="flex items-center text-gray-300 mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {new Date(currentTournament.start_time).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-gray-400 text-sm">Entry Fee</p>
            <p className="text-2xl font-bold text-white">₹{currentTournament.entry_fee}</p>
          </div>
          
          <Link to="/tournaments">
            <Button 
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              Join Tournament
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Controls */}
      {tournaments.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {tournaments.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-cyan-400 scale-110' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TournamentSlider;

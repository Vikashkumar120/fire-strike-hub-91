
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Clock, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Tournament {
  id: number;
  title: string;
  type: string;
  prize: string;
  players: string;
  startTime: string;
  entryFee: string;
  status: string;
  map: string;
  duration: string;
  thumbnail?: string;
  customCode?: string;
}

const TournamentSlider = () => {
  const [tournaments, setTournaments] = React.useState<Tournament[]>([]);

  const loadTournaments = React.useCallback(() => {
    // Load tournaments from localStorage
    const savedTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const defaultTournaments = [
      {
        id: 1,
        title: "Squad Showdown Championship",
        type: "Squad",
        prize: "₹25,000",
        players: "48/64",
        startTime: "2024-01-20 18:00",
        entryFee: "₹100",
        status: "open",
        map: "Bermuda",
        duration: "45 min",
        thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=400&fit=crop",
        customCode: "SQUAD2024"
      },
      {
        id: 2,
        title: "Solo Warriors Battle",
        type: "Solo",
        prize: "₹15,000",
        players: "89/100",
        startTime: "2024-01-20 20:00",
        entryFee: "₹50",
        status: "filling",
        map: "Purgatory",
        duration: "30 min",
        thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop",
        customCode: "SOLO2024"
      },
      {
        id: 3,
        title: "Duo Masters Arena",
        type: "Duo",
        prize: "₹18,000",
        players: "24/32",
        startTime: "2024-01-21 16:00",
        entryFee: "₹150",
        status: "open",
        map: "Kalahari",
        duration: "40 min",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
        customCode: "DUO2024"
      }
    ];

    const allTournaments = savedTournaments.length > 0 ? savedTournaments : defaultTournaments;
    setTournaments(allTournaments);
  }, []);

  React.useEffect(() => {
    loadTournaments();

    // Listen for tournament updates
    const handleTournamentUpdate = () => {
      loadTournaments();
    };

    window.addEventListener('tournamentUpdated', handleTournamentUpdate);
    
    return () => {
      window.removeEventListener('tournamentUpdated', handleTournamentUpdate);
    };
  }, [loadTournaments]);

  if (tournaments.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Tournaments</h2>
        <p className="text-gray-400">No tournaments available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Tournaments</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {tournaments.map((tournament) => (
            <CarouselItem key={tournament.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="bg-black/30 backdrop-blur-md border border-purple-500/20 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={tournament.thumbnail || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=400&fit=crop"} 
                    alt={tournament.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      tournament.status === 'open' ? 'bg-green-500 text-white' :
                      tournament.status === 'filling' ? 'bg-yellow-500 text-black' :
                      'bg-purple-500 text-white'
                    }`}>
                      {tournament.status.toUpperCase()}
                    </span>
                  </div>
                  {tournament.customCode && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-black/70 backdrop-blur-sm text-cyan-400 px-2 py-1 rounded text-xs font-bold flex items-center">
                        <Code className="w-3 h-3 mr-1" />
                        {tournament.customCode}
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2">{tournament.title}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1 text-yellow-400" />
                        {tournament.prize}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-blue-400" />
                        {tournament.players}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-green-400" />
                        {tournament.duration}
                      </span>
                      <span className="text-cyan-400 font-bold">{tournament.entryFee}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {tournament.map} • {new Date(tournament.startTime).toLocaleString()}
                    </div>
                  </div>
                  <Link to="/tournaments" className="block mt-4">
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                      Join Tournament
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-white border-cyan-500 hover:bg-cyan-500" />
        <CarouselNext className="text-white border-cyan-500 hover:bg-cyan-500" />
      </Carousel>
    </div>
  );
};

export default TournamentSlider;

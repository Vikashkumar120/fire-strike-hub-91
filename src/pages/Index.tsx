import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png" 
                alt="Free Fire Tournament Logo" 
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-xl font-bold text-white">FireTourneys</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <Link to="/tournaments">
                <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black">
                  Tournaments
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-slate-900 opacity-70"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Compete, Conquer, <span className="text-cyan-400">Claim Victory</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              Join thrilling tournaments, showcase your skills, and win amazing prizes.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/tournaments">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-8 py-3">
                  Explore Tournaments
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black px-8 py-3">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-black/30 backdrop-blur-md border border-purple-500/20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Massive Prizes</h3>
                <p className="text-gray-300">Win from huge prize pools and exclusive rewards.</p>
              </CardContent>
            </Card>
            <Card className="bg-black/30 backdrop-blur-md border border-cyan-500/20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Fair Gameplay</h3>
                <p className="text-gray-300">Compete in tournaments with a focus on fair play.</p>
              </CardContent>
            </Card>
            <Card className="bg-black/30 backdrop-blur-md border border-purple-500/20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Real-Time Updates</h3>
                <p className="text-gray-300">Stay updated with live scores and tournament progress.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to become a champion?</h2>
          <p className="text-xl text-gray-300 mb-12">Join our community and start your journey to esports glory.</p>
          <div className="flex justify-center">
            <Link to="/register">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-8 py-3">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black/40 border-t border-cyan-500/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} FireTourneys. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

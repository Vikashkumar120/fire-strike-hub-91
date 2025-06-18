
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Star, Play, Target, Zap, Crown, Medal, Calendar, Clock, MapPin, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TournamentSlider from '@/components/TournamentSlider';
import ImageSlider from '@/components/ImageSlider';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Trophy className="w-12 h-12 text-cyan-400" />,
      title: "Tournament Management",
      description: "Organize and participate in exciting gaming tournaments with real prizes"
    },
    {
      icon: <Users className="w-12 h-12 text-purple-400" />,
      title: "Community",
      description: "Join a community of passionate gamers and compete with the best"
    },
    {
      icon: <Star className="w-12 h-12 text-yellow-400" />,
      title: "Rankings",
      description: "Track your performance and climb the leaderboards"
    }
  ];

  const heroImages = [
    '/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png',
    '/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png',
    '/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png" 
                alt="FireTourneys" 
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-xl font-bold text-white">FireTourneys</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/tournaments" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Tournaments
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-cyan-400 transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Contact
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">Welcome, {user?.email?.split('@')[0]}</span>
                  <Link to="/dashboard">
                    <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:bg-white/10"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700">
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/tournaments" 
                  className="text-gray-300 hover:text-cyan-400 transition-colors px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tournaments
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-cyan-400 transition-colors px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-cyan-400 transition-colors px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
                    <span className="text-gray-300 px-2">Welcome, {user?.email?.split('@')[0]}</span>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Image Slider */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <ImageSlider images={heroImages} />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                Fire
              </span>
              Tourneys
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 max-w-2xl mx-auto">
              Join exciting gaming tournaments and compete for amazing prizes
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tournament Slider Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Live Tournaments
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Join these exciting tournaments happening now and compete for amazing prizes
            </p>
          </div>
          <TournamentSlider />
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose FireTourneys?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Experience the ultimate gaming tournament platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-black/30 border-purple-500/20 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-2xl p-8 md:p-12 border border-cyan-500/20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of gamers competing in tournaments and earning amazing prizes
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-lg px-8 py-3 w-full sm:w-auto">
                  <Play className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
              <Link to="/tournaments">
                <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black text-lg px-8 py-3 w-full sm:w-auto">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Tournaments
                </Button>
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <Link to="/tournaments">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-lg px-8 py-3">
                <Trophy className="w-5 h-5 mr-2" />
                Join Tournament
              </Button>
            </Link>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png" 
                alt="FireTourneys" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold text-white">FireTourneys</span>
            </div>
            <p className="text-gray-400 mb-4">
              The ultimate gaming tournament platform
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
              <Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
              <span>© 2024 FireTourneys. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

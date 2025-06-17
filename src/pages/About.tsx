
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Shield, Award, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/30 backdrop-blur-md border-b border-cyan-500/20">
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
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/tournaments" className="text-gray-300 hover:text-white transition-colors">
                Tournaments
              </Link>
              <Link to="/about" className="text-white">
                About
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
            <Link to="/">
              <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              About <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">FireTourneys</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We are the premier destination for Free Fire esports tournaments, connecting players worldwide through competitive gaming.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                FireTourneys was founded with the vision of creating the most fair, exciting, and rewarding Free Fire tournament platform. 
                We believe in providing equal opportunities for all players to showcase their skills and compete at the highest level.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our platform combines cutting-edge technology with a passion for esports to deliver an unmatched gaming experience.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png" 
                alt="Gaming" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Secure Platform</h3>
                <p className="text-gray-300">
                  Advanced security measures ensure fair play and protect your data and transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Competitive Rewards</h3>
                <p className="text-gray-300">
                  Win real cash prizes and exclusive rewards in our premium tournaments.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Global Community</h3>
                <p className="text-gray-300">
                  Join thousands of players from around the world in epic battles.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Our Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-4xl font-bold text-cyan-400">50K+</div>
                <div className="text-gray-300">Players</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400">1000+</div>
                <div className="text-gray-300">Tournaments</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-400">₹10L+</div>
                <div className="text-gray-300">Prizes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400">24/7</div>
                <div className="text-gray-300">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

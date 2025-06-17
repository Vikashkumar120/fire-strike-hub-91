
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Clock, Zap, Shield, Gift, Star, TrendingUp, GamepadIcon, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TournamentSlider from '@/components/TournamentSlider';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-md border-b border-cyan-500/20">
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <img 
                  src="/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png" 
                  alt="Free Fire Tournament Logo" 
                  className="relative w-24 h-24 rounded-2xl shadow-2xl"
                />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Fire
              </span>
              <span className="text-white">Tourneys</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the ultimate Free Fire tournaments and compete with the best players for amazing prizes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tournaments">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-lg px-8 py-3">
                  <Trophy className="w-5 h-5 mr-2" />
                  Join Tournament
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black text-lg px-8 py-3">
                  <Users className="w-5 h-5 mr-2" />
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stats Section */}
      <div className="py-16 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Live Tournament Stats</h2>
            <p className="text-gray-300">Real-time data from our gaming community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-cyan-500/20 rounded-full">
                    <Trophy className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-cyan-400 mb-1">150+</div>
                <div className="text-gray-300 text-sm">Active Tournaments</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <Users className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">25K+</div>
                <div className="text-gray-300 text-sm">Registered Players</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <Gift className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-400 mb-1">₹50L+</div>
                <div className="text-gray-300 text-sm">Prize Money Distributed</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-yellow-500/20 rounded-full">
                    <TrendingUp className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">98%</div>
                <div className="text-gray-300 text-sm">Player Satisfaction</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tournament Slider */}
      <div className="py-20 bg-gradient-to-br from-slate-900/50 to-purple-900/50 backdrop-blur-sm">
        <TournamentSlider />
      </div>

      {/* Features Section */}
      <div className="py-20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose FireTourneys?</h2>
            <p className="text-xl text-gray-300">Experience the best Free Fire tournament platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-black/40 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-10 h-10 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Instant Tournaments</h3>
                <p className="text-gray-300">Join tournaments instantly with our fast-track registration system. No waiting, just pure gaming action.</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-10 h-10 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Secure Payments</h3>
                <p className="text-gray-300">Your money is safe with our secure payment gateway. Quick deposits and instant withdrawals guaranteed.</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Crown className="w-10 h-10 text-green-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Big Prizes</h3>
                <p className="text-gray-300">Compete for massive prize pools up to ₹1 Lakh. Win big and become the ultimate Free Fire champion.</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-10 h-10 text-yellow-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">24/7 Support</h3>
                <p className="text-gray-300">Round-the-clock customer support to help you with any issues. We're always here for our gaming community.</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <GamepadIcon className="w-10 h-10 text-red-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Fair Play</h3>
                <p className="text-gray-300">Advanced anti-cheat systems ensure fair gameplay for all participants. May the best player win!</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-10 h-10 text-indigo-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Pro Features</h3>
                <p className="text-gray-300">Advanced tournament features, live streaming, and detailed match analytics for serious gamers.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Dominate?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of players competing in daily tournaments. Your victory awaits!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tournaments">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-lg px-10 py-4">
                <Trophy className="w-5 h-5 mr-2" />
                Browse Tournaments
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black text-lg px-10 py-4">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-md border-t border-cyan-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png" 
                  alt="Free Fire Tournament Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-lg font-bold text-white">FireTourneys</span>
              </div>
              <p className="text-gray-400 text-sm">
                The ultimate Free Fire tournament platform for competitive gaming.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/tournaments" className="text-gray-400 hover:text-cyan-400 transition-colors">Tournaments</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-cyan-400 transition-colors">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-cyan-400 transition-colors">Register</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Rules</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Discord</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">YouTube</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 FireTourneys. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

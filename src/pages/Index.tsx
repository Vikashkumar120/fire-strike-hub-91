
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Zap, Star, Play, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FireTourneys</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/tournaments" className="text-gray-300 hover:text-cyan-400 transition-colors">Tournaments</Link>
              <Link to="/leaderboard" className="text-gray-300 hover:text-cyan-400 transition-colors">Leaderboard</Link>
              <Link to="/how-to-play" className="text-gray-300 hover:text-cyan-400 transition-colors">How to Play</Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Elite Free Fire
              </span>
              <br />
              Tournament Arena
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the ultimate Free Fire tournament experience. Compete with the best players, 
              win amazing prizes, and climb the leaderboard to become a legend.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tournaments">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-lg px-8 py-4">
                  <Play className="w-5 h-5 mr-2" />
                  Join Tournament
                </Button>
              </Link>
              <Link to="/how-to-play">
                <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black text-lg px-8 py-4">
                  Learn How to Play
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-cyan-400">FireTourneys</span>?
            </h2>
            <p className="text-gray-300 text-lg">Experience the future of competitive gaming</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Trophy,
                title: "Premium Tournaments",
                description: "High-stakes competitions with amazing prize pools"
              },
              {
                icon: Users,
                title: "Active Community",
                description: "Join thousands of passionate Free Fire players"
              },
              {
                icon: Zap,
                title: "Instant Payouts",
                description: "Quick and secure withdrawal system"
              },
              {
                icon: Star,
                title: "Fair Play",
                description: "Advanced anti-cheat and fair play monitoring"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-black/20 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Active Tournaments Preview */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-white">
              Live <span className="text-cyan-400">Tournaments</span>
            </h2>
            <Link to="/tournaments">
              <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black">
                View All
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Squad Showdown",
                prize: "₹10,000",
                players: "48/64",
                time: "2 hours",
                fee: "₹50"
              },
              {
                title: "Solo Championship",
                prize: "₹5,000",
                players: "89/100",
                time: "4 hours",
                fee: "₹25"
              },
              {
                title: "Duo Masters",
                prize: "₹7,500",
                players: "24/32",
                time: "1 hour",
                fee: "₹75"
              }
            ].map((tournament, index) => (
              <Card key={index} className="bg-black/30 backdrop-blur-md border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-purple-600 to-cyan-500 relative">
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute bottom-2 left-4 text-white font-bold text-lg">
                    {tournament.title}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-cyan-400">{tournament.prize}</span>
                    <span className="text-green-400 text-sm">{tournament.players} Players</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
                    <span>Starting in {tournament.time}</span>
                    <span>Entry: {tournament.fee}</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                    Join Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md border-t border-cyan-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FireTourneys</span>
              </div>
              <p className="text-gray-300">The ultimate Free Fire tournament platform for competitive gamers.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/tournaments" className="hover:text-cyan-400 transition-colors">Tournaments</Link></li>
                <li><Link to="/leaderboard" className="hover:text-cyan-400 transition-colors">Leaderboard</Link></li>
                <li><Link to="/how-to-play" className="hover:text-cyan-400 transition-colors">How to Play</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact Us</Link></li>
                <li><Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Connect</h3>
              <p className="text-gray-300 mb-2">Join our community for updates and exclusive tournaments!</p>
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                Join Discord
              </Button>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 FireTourneys. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

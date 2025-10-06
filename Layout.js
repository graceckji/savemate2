
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User as UserIcon, Users, Receipt, LogOut, Home, Target, Trophy, Image } from "lucide-react";
import { User } from "@/entities/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Layout({ children }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  const handleLogout = async () => {
    await User.logout();
  };

  const navItems = [
    { name: "Feed", icon: Image, path: "Feed" },
    { name: "Profile", icon: UserIcon, path: "Profile" },
    { name: "Friends", icon: Users, path: "Friends" },
    { name: "Budget", icon: Target, path: "Budget" },
    { name: "Transactions", icon: Receipt, path: "Transactions" },
    { name: "Leaderboard", icon: Trophy, path: "Leaderboard" },
  ];

  const isActive = (path) => location.pathname === createPageUrl(path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                SaveMate
              </h1>
            </div>

            <div className="flex items-center gap-6">
              {currentUser && (
                <>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50">
                    <span className="text-sm font-medium text-purple-900">
                      ${currentUser.total_saved?.toFixed(2) || '0.00'} saved
                    </span>
                  </div>
                  <Avatar className="w-9 h-9 ring-2 ring-purple-100">
                    <AvatarImage src={currentUser.profile_pic} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white">
                      {currentUser.display_name?.[0] || currentUser.full_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-lg border-t border-gray-100">
        <div className="flex justify-around items-center h-16 px-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={createPageUrl(item.path)}
              className="flex flex-col items-center gap-1"
            >
              <div className={`p-2 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium ${
                isActive(item.path) ? 'text-purple-600' : 'text-gray-500'
              }`}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sidebar Navigation (Desktop) */}
      <div className="hidden md:flex">
        <div className="fixed left-0 top-16 bottom-0 w-64 border-r border-gray-100 bg-white/50 backdrop-blur-sm p-6">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={createPageUrl(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="ml-64 flex-1">
          <main className="pb-20">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Main Content */}
      <div className="md:hidden pb-20">
        {children}
      </div>
    </div>
  );
}

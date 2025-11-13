'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useApplications } from '@/lib/application-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Briefcase,
  Building2,
  BarChart3,
  ChevronDown,
  UserCircle,
  LogOut,
  FileCheck,
  Menu,
  X,
  Star,
} from 'lucide-react';
import { UserRole } from '@/types';

export function Navbar() {
  const { user, switchRole } = useAuth();
  const { getNewApplicationsCount } = useApplications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const newApplicationsCount = getNewApplicationsCount();

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'employee':
        return 'bg-blue-500';
      case 'employer':
        return 'bg-green-500';
    }
  };

  const getNavigationItems = () => {
    const items = [];

    if (user.role === 'employee') {
      items.push(
        { href: '/profile', label: 'My Profile', icon: User },
        { href: '/jobs', label: 'Find Jobs', icon: Briefcase },
        { href: '/applications', label: 'My Applications', icon: FileCheck },
        { href: '/reviews', label: 'Reviews', icon: Star },
      );
    }

    if (user.role === 'employer') {
      items.push(
        { href: '/candidates', label: 'Find Candidates', icon: User },
        { href: '/jobs', label: 'Job Listings', icon: Briefcase },
        { href: '/applications', label: 'Applications', icon: FileCheck, badge: newApplicationsCount > 0 ? newApplicationsCount : undefined },
      );
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="border-b bg-cloud">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/crewfit_logo.png"
              alt="CrewFit Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold text-graphite">CrewFit</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className="flex items-center space-x-2 relative">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs p-0">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Role Badge */}
            <Badge className={getRoleBadgeColor(user.role)}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <UserCircle className="h-5 w-5" />
                  <span className="hidden md:inline">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => switchRole('employee')}
                  className={user.role === 'employee' ? 'bg-blue-50' : ''}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Employee View</span>
                  {user.role === 'employee' && (
                    <Badge className="ml-auto bg-blue-500">Active</Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => switchRole('employer')}
                  className={user.role === 'employer' ? 'bg-green-50' : ''}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>Employer View</span>
                  {user.role === 'employer' && (
                    <Badge className="ml-auto bg-green-500">Active</Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out (Demo)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="py-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start flex items-center space-x-3"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge className="ml-auto h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs p-0">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

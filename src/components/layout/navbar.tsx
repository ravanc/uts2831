'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
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
} from 'lucide-react';
import { UserRole } from '@/types';

export function Navbar() {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'employee':
        return 'bg-blue-500';
      case 'employer':
        return 'bg-green-500';
      case 'executive':
        return 'bg-purple-500';
    }
  };

  const getNavigationItems = () => {
    const items = [];

    if (user.role === 'employee') {
      items.push(
        { href: '/profile', label: 'My Profile', icon: User },
        { href: '/jobs', label: 'Find Jobs', icon: Briefcase },
      );
    }

    if (user.role === 'employer' || user.role === 'executive') {
      items.push(
        { href: '/candidates', label: 'Find Candidates', icon: User },
        { href: '/jobs', label: 'Job Listings', icon: Briefcase },
      );
    }

    if (user.role === 'executive') {
      items.push(
        { href: '/organization', label: 'Organization', icon: Building2 },
        { href: '/analytics', label: 'Team Analytics', icon: BarChart3 },
      );
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
              TM
            </div>
            <span className="text-xl font-bold">TalentMatch</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
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
                <DropdownMenuItem
                  onClick={() => switchRole('executive')}
                  className={user.role === 'executive' ? 'bg-purple-50' : ''}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Executive View</span>
                  {user.role === 'executive' && (
                    <Badge className="ml-auto bg-purple-500">Active</Badge>
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
      </div>
    </nav>
  );
}

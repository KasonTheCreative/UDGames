import { Shield, ShieldCheck, Crown } from 'lucide-react';
import { UserRole } from '../../hooks/useUserRole';

interface RoleBadgeProps {
  role: UserRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const getRoleStyles = () => {
    switch (role) {
      case 'admin':
        return {
          icon: Crown,
          bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          textColor: 'text-white',
          label: 'ADMIN',
          glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]'
        };
      case 'moderator':
        return {
          icon: ShieldCheck,
          bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          textColor: 'text-white',
          label: 'MODERATOR',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]'
        };
      default:
        return {
          icon: Shield,
          bgColor: 'bg-gradient-to-r from-gray-600 to-gray-700',
          textColor: 'text-white',
          label: 'USER',
          glow: 'shadow-[0_0_10px_rgba(107,114,128,0.3)]'
        };
    }
  };

  const { icon: Icon, bgColor, textColor, label, glow } = getRoleStyles();

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${bgColor} ${textColor} ${glow} px-6 py-2 rounded-full flex items-center gap-2 font-bold text-sm backdrop-blur-xl border border-white/20 animate-fade-in`}>
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}

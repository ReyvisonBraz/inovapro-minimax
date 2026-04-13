import { create } from 'zustand';
import { User, AuditLog } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  users: User[];
  auditLogs: AuditLog[];
  
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  
  setUsers: (users: User[]) => void;
  setAuditLogs: (logs: AuditLog[]) => void;
}

const checkAuth = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  return !!token && !!userStr;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: checkAuth(),
  currentUser: (() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  })(),
  users: [],
  auditLogs: [],
  
  login: (user) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, currentUser: user });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    set({ isAuthenticated: false, currentUser: null });
  },
  
  hasPermission: (permission) => {
    const { currentUser } = get();
    if (!currentUser) return false;
    if (currentUser.role === 'owner') return true;
    return currentUser.permissions?.includes(permission) || false;
  },
  
  setUsers: (users) => set({ users }),
  setAuditLogs: (logs) => set({ auditLogs: logs }),
}));

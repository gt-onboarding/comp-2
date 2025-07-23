'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useGT } from 'gt-next';

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
  initialIsCollapsed = false,
}: {
  children: React.ReactNode;
  initialIsCollapsed?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed);

  // Update state if server value changes
  useEffect(() => {
    setIsCollapsed(initialIsCollapsed);
  }, [initialIsCollapsed]);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const t = useGT();
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error(t('useSidebar must be used within a SidebarProvider'));
  }
  return context;
}

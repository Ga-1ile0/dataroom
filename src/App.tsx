import React, { useState, useEffect } from 'react';
import { SignIn } from './components/SignIn';
import { DataRoom } from './components/DataRoom';
import { AdminPanel } from './components/AdminPanel';
import { mockCompanyData } from './data/mockData';
import { CompanyData } from './types';
import { saveCompanyData, loadCompanyData, supabase, signOut } from './lib/supabase';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>(mockCompanyData);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Helper function to validate and fix company data structure
  const validateCompanyData = (data: any): CompanyData => {
    // Ensure metrics is always an array
    if (!data.metrics || !Array.isArray(data.metrics)) {
      data.metrics = mockCompanyData.metrics;
    }
    
    // Ensure other required properties exist
    if (!data.company) data.company = mockCompanyData.company;
    if (!data.documents) data.documents = mockCompanyData.documents;
    if (!data.team) data.team = mockCompanyData.team;
    if (!data.financials) data.financials = mockCompanyData.financials;
    
    return data as CompanyData;
  };

  // Load data from Supabase on mount
  useEffect(() => {
    const initializeApp = async () => {
      // Check for existing Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setIsAuthenticated(true);
        setUser(session.user);
        
        // Check if user is admin based on email or metadata
        const isAdminUser = session.user.email === 'admin@dataroom.app' || 
                           session.user.user_metadata?.role === 'admin';
        setIsAdmin(isAdminUser);

        // Load company data from Supabase
        try {
          const result = await loadCompanyData();
          if (result.success && result.data) {
            const validatedData = validateCompanyData(result.data);
            setCompanyData(validatedData);
          } else {
            // If no data in Supabase, save the mock data
            await saveCompanyData(mockCompanyData);
          }
        } catch (error) {
          console.error('Error loading data:', error);
          // Fallback to localStorage
          const savedData = localStorage.getItem('dataroom_data');
          if (savedData) {
            try {
              const parsedData = JSON.parse(savedData);
              const validatedData = validateCompanyData(parsedData);
              setCompanyData(validatedData);
            } catch (error) {
              console.error('Error parsing saved data:', error);
            }
          }
        }
      }

      setIsLoading(false);
    };

    initializeApp();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setIsAuthenticated(true);
          setUser(session.user);
          
          const isAdminUser = session.user.email === 'admin@dataroom.app' || 
                             session.user.user_metadata?.role === 'admin';
          setIsAdmin(isAdminUser);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthenticate = (adminMode: boolean) => {
    // This will be handled by the auth state change listener
    // The SignIn component will handle the actual authentication
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpdateData = async (newData: CompanyData) => {
    const validatedData = validateCompanyData(newData);
    setCompanyData(validatedData);
    
    // Save to Supabase
    try {
      await saveCompanyData(validatedData);
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      // Fallback to localStorage
      localStorage.setItem('dataroom_data', JSON.stringify(validatedData));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#FAB049] min-h-screen flex items-center justify-center">
        <div className="bg-[#FFF1D6] p-8 rounded-[20px] border-4 border-black shadow-[8px_8px_0px_#000000]">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-[#B74B28] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xl font-bold text-[#B74B28]">Loading DataVault...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignIn onAuthenticate={handleAuthenticate} />;
  }

  if (isAdmin) {
    return (
      <AdminPanel 
        companyData={companyData}
        onUpdateData={handleUpdateData}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <DataRoom 
      companyData={companyData}
      isAdmin={isAdmin}
      onSignOut={handleSignOut}
      onUpdateData={handleUpdateData}
    />
  );
}
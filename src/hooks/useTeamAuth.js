import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { validateUserAccess, checkTeamProblemSelection, clearStoredTeamNumber } from '../services/authService';

export const useTeamAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teamNumber, setTeamNumber] = useState(null);
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  const [hasSelectedProblem, setHasSelectedProblem] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [error, setError] = useState(null);
  const [authAction, setAuthAction] = useState(null); // 'proceed', 'redirect_registration', 'unauthorized'
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setError(null);
      setAuthAction(null);
      setRegistrationData(null);

      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        
        try {
          // Use comprehensive authentication flow
          const authResult = await validateUserAccess(user.email);
          
          setAuthAction(authResult.action);
          
          if (authResult.action === 'proceed') {
            // User has team number - grant access
            setTeamNumber(authResult.teamNumber);
            setIsTeamLeader(authResult.isLeader);
            
            // Check if team has selected a problem statement
            const hasProblem = await checkTeamProblemSelection(authResult.teamNumber);
            setHasSelectedProblem(hasProblem);
            
            setError(null);
          } else if (authResult.action === 'redirect_registration') {
            // User is registered but needs team number assignment
            setRegistrationData(authResult.registrationData);
            setIsTeamLeader(authResult.isLeader);
            setTeamNumber(null);
            setHasSelectedProblem(false);
            setError("Please complete your registration to get your team number.");
          } else {
            // Unauthorized access
            setError(authResult.message);
            setTeamNumber(null);
            setIsTeamLeader(false);
            setHasSelectedProblem(false);
          }
        } catch (error) {
          console.error("Error during authentication check:", error);
          setError("Error loading user data");
          setTeamNumber(null);
          setIsTeamLeader(false);
          setHasSelectedProblem(false);
          setAuthAction('unauthorized');
        }
      } else {
        // User is not authenticated - clear stored data
        setUser(null);
        setIsLoggedIn(false);
        setTeamNumber(null);
        setIsTeamLeader(false);
        setHasSelectedProblem(false);
        setError(null);
        setAuthAction(null);
        setRegistrationData(null);
        
        // Clear stored team number when user logs out
        clearStoredTeamNumber();
      }

      setLoading(false);
      setAuthCheckComplete(true);
    });

    return () => unsubscribe();
  }, []);

  const refreshTeamStatus = async () => {
    if (user && teamNumber) {
      try {
        setLoading(true);
        const hasProblem = await checkTeamProblemSelection(teamNumber);
        setHasSelectedProblem(hasProblem);
      } catch (error) {
        console.error("Error refreshing team status:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    user,
    loading,
    isLoggedIn,
    teamNumber,
    isTeamLeader,
    hasSelectedProblem,
    authCheckComplete,
    error,
    authAction, // 'proceed', 'redirect_registration', 'unauthorized'
    registrationData, // Available when authAction is 'redirect_registration'
    refreshTeamStatus
  };
};
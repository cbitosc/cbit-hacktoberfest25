import { 
  doc, 
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Initialize problem statement document in Firestore if it doesn't exist
 * @param {string} problemId 
 * @param {object} problemData 
 */
export const initializeProblemStatement = async (problemId, problemData) => {
  try {
    const problemRef = doc(db, "problemStatements", problemId);
    const problemSnap = await getDoc(problemRef);
    
    if (!problemSnap.exists()) {
      await setDoc(problemRef, {
        problemNumber: problemData.number,
        title: problemData.title,
        level: problemData.level,
        limit: problemData.maxSlots || 3,
        teamsChosen: 0,
        lastUpdated: new Date(),
        createdAt: new Date()
      });
      // console.log(`Initialized problem statement: ${problemId}`);
    }
  } catch (error) {
    console.error(`Error initializing problem statement ${problemId}:`, error);
  }
};

/**
 * Check if user exists in leaderNumberMap collection (READ ONLY)
 * @param {string} userEmail 
 * @returns {Promise<{exists: boolean, data: object|null, teamNumber: number|null, wasLeaderEarlier: boolean}>}
 */
export const checkLeaderNumberMap = async (userEmail) => {
  try {
    const leaderMapRef = doc(db, "leaderNumberMap", userEmail);
    const leaderMapSnap = await getDoc(leaderMapRef);

    if (leaderMapSnap.exists()) {
      const leaderData = leaderMapSnap.data();
      return {
        exists: true,
        data: leaderData,
        teamNumber: leaderData.teamNumber,
        wasLeaderEarlier: leaderData.wasLeaderEarlier || false
      };
    }

    return { exists: false, data: null, teamNumber: null, wasLeaderEarlier: false };
  } catch (error) {
    console.error("Error checking leaderNumberMap:", error);
    return { exists: false, data: null, teamNumber: null, wasLeaderEarlier: false };
  }
};

/**
 * Check if a team has selected a problem statement
 * @param {number} teamNumber 
 * @returns {Promise<boolean>}
 */
export const checkTeamProblemSelection = async (teamNumber) => {
  try {
    if (teamNumber) {
      const teamProbRef = doc(db, "teamprob", teamNumber.toString());
      const teamProbSnap = await getDoc(teamProbRef);
      
      return teamProbSnap.exists() && !!teamProbSnap.data().problemStatement;
    }
    return false;
  } catch (error) {
    console.error("Error checking team problem selection:", error);
    return false;
  }
};

/**
 * Check if user exists in registrations collection
 * @param {string} userEmail 
 * @returns {Promise<{exists: boolean, data: object|null}>}
 */
export const checkRegistrations = async (userEmail) => {
  try {
    const registrationsRef = collection(db, "registrations");
    const q = query(registrationsRef, where('leaderEmail', '==', userEmail));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const registrationDoc = querySnapshot.docs[0];
      return {
        exists: true,
        data: {
          id: registrationDoc.id,
          ...registrationDoc.data()
        }
      };
    }

    return { exists: false, data: null };
  } catch (error) {
    console.error("Error checking registrations:", error);
    return { exists: false, data: null };
  }
};

/**
 * Store team number in localStorage for persistence
 * @param {number} teamNumber 
 */
export const storeTeamNumber = (teamNumber) => {
  try {
    localStorage.setItem('userTeamNumber', teamNumber.toString());
  } catch (error) {
    console.error("Error storing team number:", error);
  }
};

/**
 * Retrieve team number from localStorage
 * @returns {number|null}
 */
export const getStoredTeamNumber = () => {
  try {
    const teamNumber = localStorage.getItem('userTeamNumber');
    return teamNumber ? parseInt(teamNumber, 10) : null;
  } catch (error) {
    console.error("Error retrieving stored team number:", error);
    return null;
  }
};

/**
 * Clear stored team number from localStorage
 */
export const clearStoredTeamNumber = () => {
  try {
    localStorage.removeItem('userTeamNumber');
  } catch (error) {
    console.error("Error clearing stored team number:", error);
  }
};

/**
 * Comprehensive authentication flow with direct access support:
 * 1. Check stored team number (for direct access)
 * 2. Check leaderNumberMap first (already assigned team numbers)
 * 3. Check registrations collection (registered but no team number yet)
 * 4. Return appropriate action and data
 * @param {string} userEmail 
 * @returns {Promise<{
 *   action: 'proceed'|'redirect_registration'|'unauthorized',
 *   teamNumber: number|null,
 *   isLeader: boolean,
 *   message: string,
 *   registrationData?: object
 * }>}
 */
export const validateUserAccess = async (userEmail) => {
  try {
    // First, check if we have a stored team number (for direct access)
    const storedTeamNumber = getStoredTeamNumber();
    
    // If we have a stored team number, verify it against leaderNumberMap
    if (storedTeamNumber) {
      const leaderMapCheck = await checkLeaderNumberMap(userEmail);
      if (leaderMapCheck.exists && leaderMapCheck.teamNumber === storedTeamNumber) {
        return {
          action: 'proceed',
          teamNumber: leaderMapCheck.teamNumber,
          isLeader: leaderMapCheck.wasLeaderEarlier || true,
          message: "Access granted - stored team number verified"
        };
      } else {
        // Stored team number doesn't match or user not in leaderNumberMap
        // Clear invalid stored team number
        clearStoredTeamNumber();
      }
    }

    // Second, check leaderNumberMap for already assigned team numbers
    const leaderMapCheck = await checkLeaderNumberMap(userEmail);
    
    if (leaderMapCheck.exists && leaderMapCheck.teamNumber) {
      // Store team number for future direct access
      storeTeamNumber(leaderMapCheck.teamNumber);
      
      return {
        action: 'proceed',
        teamNumber: leaderMapCheck.teamNumber,
        isLeader: leaderMapCheck.wasLeaderEarlier || true,
        message: "Access granted - team number found and stored"
      };
    }

    // Third, check registrations collection for registered users without team numbers
    const registrationCheck = await checkRegistrations(userEmail);
    
    if (registrationCheck.exists) {
      return {
        action: 'redirect_registration',
        teamNumber: null,
        isLeader: true, // Assume leader if in registrations
        message: "User is registered but needs team number assignment",
        registrationData: registrationCheck.data
      };
    }

    // User not found in either collection
    return {
      action: 'unauthorized',
      teamNumber: null,
      isLeader: false,
      message: "You are not authorized. Please register first or contact administrators."
    };
  } catch (error) {
    console.error("Error validating user access:", error);
    return {
      action: 'unauthorized',
      teamNumber: null,
      isLeader: false,
      message: "Error validating access"
    };
  }
};

/**
 * Legacy function - ONLY checks leaderNumberMap (kept for backward compatibility)
 * @deprecated Use validateUserAccess for comprehensive authentication
 */
export const validateUserAccessLegacy = async (userEmail) => {
  try {
    // Only check leaderNumberMap - if not found, no access
    const leaderMapCheck = await checkLeaderNumberMap(userEmail);
    
    if (leaderMapCheck.exists && leaderMapCheck.teamNumber) {
      return {
        hasAccess: true,
        teamNumber: leaderMapCheck.teamNumber,
        isLeader: leaderMapCheck.wasLeaderEarlier || true, // Assume leaders if in leaderNumberMap
        message: "Access granted"
      };
    }

    return {
      hasAccess: false,
      teamNumber: null,
      isLeader: false,
      message: "You are not authorized. Only team leaders can access this page."
    };
  } catch (error) {
    console.error("Error validating user access:", error);
    return {
      hasAccess: false,
      teamNumber: null,
      isLeader: false,
      message: "Error validating access"
    };
  }
};
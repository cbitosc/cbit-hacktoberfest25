import { collection, addDoc, doc, getDoc, setDoc, updateDoc, serverTimestamp, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

// Collection reference
const TEAM_MAPPING_COLLECTION = 'teamMappings';

/**
 * Create team mappings for all team members (leader + teammates)
 * @param {Object} registrationData - The registration data
 * @returns {Promise<boolean>} - Success status
 */
export const createTeamMappings = async (registrationData) => {
  try {
    const {
      teamSize,
      leader,
      teammates = []
    } = registrationData;

    // Use batch write for atomic operation
    const batch = writeBatch(db);
    
    // Create mapping for team leader
    if (leader && leader.email) {
      const leaderMappingRef = doc(collection(db, TEAM_MAPPING_COLLECTION));
      batch.set(leaderMappingRef, {
        email: leader.email.toLowerCase(),
        name: leader.name,
        teamSize,
        role: 'leader',
        isSmallTeam: teamSize < 3,
        needsTeamMerging: teamSize < 3,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    // Create mappings for teammates
    teammates.forEach((teammate, index) => {
      if (teammate && teammate.email) {
        const teammateMappingRef = doc(collection(db, TEAM_MAPPING_COLLECTION));
        batch.set(teammateMappingRef, {
          email: teammate.email.toLowerCase(),
          name: teammate.name,
          teamSize,
          role: `teammate_${index + 1}`,
          isSmallTeam: teamSize < 3,
          needsTeamMerging: teamSize < 3,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    });

    // Commit the batch
    await batch.commit();
    
    // console.log('Team mappings created successfully');
    return true;
  } catch (error) {
    console.error('Error creating team mappings:', error);
    throw error;
  }
};

/**
 * Search for team information by email address
 * @param {string} email - The email address to search for
 * @returns {Promise<Object|null>} - Team information or null if not found
 */
export const searchTeamByEmail = async (email) => {
  try {
    if (!email) {
      return null;
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    const mappingsRef = collection(db, TEAM_MAPPING_COLLECTION);
    const q = query(mappingsRef, where('email', '==', normalizedEmail));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const mappingDoc = querySnapshot.docs[0];
      const mappingData = mappingDoc.data();
      
      return {
        email: mappingData.email,
        name: mappingData.name,
        teamSize: mappingData.teamSize,
        role: mappingData.role,
        isSmallTeam: mappingData.isSmallTeam,
        needsTeamMerging: mappingData.needsTeamMerging,
        found: true
      };
    }
    
    return {
      found: false,
      message: 'Email address not found in any registered team'
    };
  } catch (error) {
    console.error('Error searching team by email:', error);
    throw error;
  }
};

/**
 * Update team mapping information
 * @param {string} email - The email address to update
 * @param {Object} updateData - The data to update
 * @returns {Promise<boolean>} - Success status
 */
export const updateTeamMapping = async (email, updateData) => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    const mappingsRef = collection(db, TEAM_MAPPING_COLLECTION);
    const q = query(mappingsRef, where('email', '==', normalizedEmail));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const mappingDoc = querySnapshot.docs[0];
      const mappingRef = doc(db, TEAM_MAPPING_COLLECTION, mappingDoc.id);
      
      await updateDoc(mappingRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating team mapping:', error);
    throw error;
  }
};

/**
 * Create or update team mapping for a single member
 * @param {Object} memberData - The member data
 * @param {number} teamSize - The team size
 * @param {string} role - The member's role
 * @returns {Promise<boolean>} - Success status
 */
export const createOrUpdateTeamMapping = async (memberData, teamSize, role) => {
  try {
    if (!memberData || !memberData.email) {
      return false;
    }

    const normalizedEmail = memberData.email.toLowerCase().trim();
    
    // Check if mapping already exists
    const mappingsRef = collection(db, TEAM_MAPPING_COLLECTION);
    const q = query(mappingsRef, where('email', '==', normalizedEmail));
    const querySnapshot = await getDocs(q);
    
    const mappingData = {
      email: normalizedEmail,
      name: memberData.name,
      teamSize,
      role,
      isSmallTeam: teamSize < 3,
      needsTeamMerging: teamSize < 3,
      updatedAt: serverTimestamp()
    };

    if (!querySnapshot.empty) {
      // Update existing mapping
      const mappingDoc = querySnapshot.docs[0];
      const mappingRef = doc(db, TEAM_MAPPING_COLLECTION, mappingDoc.id);
      await updateDoc(mappingRef, mappingData);
    } else {
      // Create new mapping
      mappingData.createdAt = serverTimestamp();
      const newMappingRef = doc(collection(db, TEAM_MAPPING_COLLECTION));
      await setDoc(newMappingRef, mappingData);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating/updating team mapping:', error);
    throw error;
  }
};

/**
 * Delete team mapping by email
 * @param {string} email - The email address to delete mapping for
 * @returns {Promise<boolean>} - Success status
 */
export const deleteTeamMapping = async (email) => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    const mappingsRef = collection(db, TEAM_MAPPING_COLLECTION);
    const q = query(mappingsRef, where('email', '==', normalizedEmail));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const batch = writeBatch(db);
      
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting team mapping:', error);
    throw error;
  }
};

/**
 * Get all team mappings for a team (by any member's email)
 * @param {string} memberEmail - Any team member's email
 * @returns {Promise<Array>} - Array of team mappings
 */
export const getTeamMappings = async (memberEmail) => {
  try {
    const normalizedEmail = memberEmail.toLowerCase().trim();
    
    // First find the team member to get team info
    const mappingsRef = collection(db, TEAM_MAPPING_COLLECTION);
    const memberQuery = query(mappingsRef, where('email', '==', normalizedEmail));
    const memberSnapshot = await getDocs(memberQuery);
    
    if (memberSnapshot.empty) {
      return [];
    }
    
    const memberData = memberSnapshot.docs[0].data();
    const teamSize = memberData.teamSize;
    
    // Get all mappings for this team size (this is a workaround since we don't have a teamId)
    // In practice, you might want to add a teamId field for better querying
    const teamQuery = query(mappingsRef, where('teamSize', '==', teamSize));
    const teamSnapshot = await getDocs(teamQuery);
    
    const teamMappings = [];
    teamSnapshot.forEach((doc) => {
      teamMappings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return teamMappings;
  } catch (error) {
    console.error('Error getting team mappings:', error);
    throw error;
  }
};
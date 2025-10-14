import { collection, addDoc, doc, getDoc, setDoc, updateDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { createTeamMappings, deleteTeamMapping, updateTeamMapping, createOrUpdateTeamMapping } from './teamMappingService';

// Collection references
const REGISTRATIONS_COLLECTION = 'registrations';

// Check if user is already registered
export const checkUserRegistration = async (userUid) => {
  try {
    if (!userUid) {
      return { isRegistered: false };
    }

    const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(registrationsRef, where('leader.uid', '==', userUid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // User is already registered
      const registrationDoc = querySnapshot.docs[0];
      const registrationData = registrationDoc.data();
      
      return {
        isRegistered: true,
        registration: {
          id: registrationDoc.id,
          teamSize: registrationData.teamSize,
          leaderName: registrationData.leader.name,
          leaderEmail: registrationData.leaderEmail || registrationData.leader.email, // Use top-level field or fallback
          registrationDate: registrationData.registrationDate,
          ...registrationData
        }
      };
    }
    
    return { isRegistered: false };
  } catch (error) {
    console.error('Error checking user registration:', error);
    // Return false on error to avoid blocking registration
    return { isRegistered: false };
  }
};

// Save registration to database
export const saveRegistration = async (registrationData) => {
  try {
    const {
      leaderData,
      teamSize,
      teammates = [],
      techStack = null
    } = registrationData;

    // Prepare registration document
    const registrationDoc = {
      // Team information
      teamSize,
      techStack,
      registrationDate: serverTimestamp(),
      
      // Leader email as top-level field for faster queries
      leaderEmail: leaderData.email,
      
      // Leader information
      leader: {
        name: leaderData.name,
        email: leaderData.email,
        college: leaderData.college,
        degree: leaderData.degree,
        yearOfStudy: leaderData.yearOfStudy,
        branch: leaderData.branch,
        rollNumber: leaderData.rollNumber,
        phoneNumber: leaderData.phoneNumber,
        uid: leaderData.uid || null,
      },
      
      // Teammates information (empty array for solo participants)
      teammates: teammates.map(teammate => ({
        name: teammate.name,
        email: teammate.email,
        college: teammate.college,
        degree: teammate.degree,
        yearOfStudy: teammate.yearOfStudy,
        branch: teammate.branch,
        rollNumber: teammate.rollNumber,
        phoneNumber: teammate.phoneNumber,
      })),
      
      // Status and metadata
      status: 'registered',
      isSmallTeam: teamSize < 3,
      needsTeamMerging: teamSize < 3,
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, REGISTRATIONS_COLLECTION), registrationDoc);
    
    // Create team mappings for email lookup
    try {
      await createTeamMappings({
        teamSize,
        leader: registrationDoc.leader,
        teammates: registrationDoc.teammates
      });
      // console.log('Team mappings created successfully');
    } catch (mappingError) {
      console.error('Error creating team mappings:', mappingError);
      // Don't fail the registration if mapping creation fails
      // but log the error for monitoring
    }
    
    return {
      registrationId: docRef.id,
      success: true
    };
    
  } catch (error) {
    console.error('Error saving registration:', error);
    throw error;
  }
};

// Get registration by ID
export const getRegistration = async (registrationId) => {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Registration not found');
    }
  } catch (error) {
    console.error('Error getting registration:', error);
    throw error;
  }
};

// Update registration status
export const updateRegistrationStatus = async (registrationId, status) => {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    await updateDoc(docRef, {
      status,
      lastUpdated: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating registration status:', error);
    throw error;
  }
};

// Get registration by team leader email
export const getRegistrationByLeaderEmail = async (leaderEmail) => {
  try {
    const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(registrationsRef, where('leaderEmail', '==', leaderEmail));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const registrationDoc = querySnapshot.docs[0];
      return {
        id: registrationDoc.id,
        ...registrationDoc.data()
      };
    } else {
      throw new Error('Registration not found');
    }
  } catch (error) {
    console.error('Error getting registration by leader email:', error);
    throw error;
  }
};

// Update team details
export const updateTeamDetails = async (leaderEmail, updatedData) => {
  try {
    const {
      teamSize,
      leader,
      teammates = [],
      techStack = null,
      removedTeammates = []
    } = updatedData;

    // Get current registration
    const currentRegistration = await getRegistrationByLeaderEmail(leaderEmail);
    
    // Update registration document
    const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(registrationsRef, where('leaderEmail', '==', leaderEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Registration not found');
    }

    const registrationDoc = querySnapshot.docs[0];
    const registrationRef = doc(db, REGISTRATIONS_COLLECTION, registrationDoc.id);

    // Prepare updated registration document
    const updatedRegistration = {
      teamSize,
      techStack,
      // Update leader information
      leader: {
        ...currentRegistration.leader,
        name: leader.name,
        college: leader.college,
        degree: leader.degree,
        yearOfStudy: leader.yearOfStudy,
        branch: leader.branch,
        rollNumber: leader.rollNumber,
        phoneNumber: leader.phoneNumber,
        // Keep email and uid unchanged
        email: currentRegistration.leader.email,
        uid: currentRegistration.leader.uid
      },
      teammates: teammates.map(teammate => ({
        name: teammate.name,
        email: teammate.email,
        college: teammate.college,
        degree: teammate.degree,
        yearOfStudy: teammate.yearOfStudy,
        branch: teammate.branch,
        rollNumber: teammate.rollNumber,
        phoneNumber: teammate.phoneNumber,
      })),
      isSmallTeam: teamSize < 3,
      needsTeamMerging: teamSize < 3,
      lastUpdated: serverTimestamp()
    };

    // Update registration document
    await updateDoc(registrationRef, updatedRegistration);

    // Handle team mapping updates
    try {
      // Remove mappings for removed teammates
      if (removedTeammates && removedTeammates.length > 0) {
        for (const removedTeammate of removedTeammates) {
          if (removedTeammate.email) {
            await deleteTeamMapping(removedTeammate.email);
          }
        }
      }

      // Handle email changes for existing teammates - delete old mappings if emails changed
      const currentTeammateEmails = currentRegistration.teammates?.map(t => t.email).filter(e => e) || [];
      const newTeammateEmails = teammates.map(t => t.email).filter(e => e);
      
      // Find emails that were removed or changed
      for (const oldEmail of currentTeammateEmails) {
        if (!newTeammateEmails.includes(oldEmail)) {
          // This email was either removed or changed to a different email
          await deleteTeamMapping(oldEmail);
        }
      }

      // Update leader mapping with updated information
      await updateTeamMapping(leaderEmail, {
        name: leader.name,
        teamSize,
        isSmallTeam: teamSize < 3,
        needsTeamMerging: teamSize < 3
      });

      // Update/create teammate mappings
      for (let i = 0; i < teammates.length; i++) {
        const teammate = teammates[i];
        if (teammate.email) {
          await createOrUpdateTeamMapping(teammate, teamSize, `teammate_${i + 1}`);
        }
      }
      
      // console.log('Team mappings updated successfully');
    } catch (mappingError) {
      console.error('Error updating team mappings:', mappingError);
      // Don't fail the update if mapping update fails
    }
    
    return {
      success: true,
      registrationId: registrationDoc.id
    };
    
  } catch (error) {
    console.error('Error updating team details:', error);
    throw error;
  }
};
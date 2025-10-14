import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Collection reference
const TEAM_MAPPING_COLLECTION = 'teamMappings';

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result
 */
export const validateEmailFormat = (email) => {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email.trim());

  return {
    isValid,
    error: isValid ? null : 'Please enter a valid email address'
  };
};

/**
 * Check if email is already registered
 * @param {string} email - Email to check
 * @returns {Promise<Object>} - Check result
 */
export const checkEmailUniqueness = async (email) => {
  try {
    if (!email) {
      return {
        isUnique: false,
        error: 'Email is required'
      };
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // First validate email format
    const formatValidation = validateEmailFormat(normalizedEmail);
    if (!formatValidation.isValid) {
      return {
        isUnique: false,
        error: formatValidation.error
      };
    }

    const mappingsRef = collection(db, TEAM_MAPPING_COLLECTION);
    const q = query(mappingsRef, where('email', '==', normalizedEmail));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Email already exists
      const existingMapping = querySnapshot.docs[0].data();
      return {
        isUnique: false,
        error: 'This email address is already registered',
        existingUser: {
          name: existingMapping.name,
          role: existingMapping.role
        }
      };
    }
    
    return {
      isUnique: true,
      error: null
    };
  } catch (error) {
    console.error('Error checking email uniqueness:', error);
    return {
      isUnique: false,
      error: 'Unable to verify email uniqueness. Please try again.'
    };
  }
};

/**
 * Validate multiple emails for uniqueness
 * @param {Array<string>} emails - Array of emails to check
 * @param {string} excludeEmail - Email to exclude from check (for editing scenarios)
 * @returns {Promise<Object>} - Validation result
 */
export const validateMultipleEmails = async (emails, excludeEmail = null) => {
  try {
    const results = {
      isValid: true,
      errors: {},
      duplicateEmails: []
    };

    // Check for duplicates within the provided array
    const emailCounts = {};
    const normalizedEmails = emails.map(email => email ? email.toLowerCase().trim() : '');
    
    normalizedEmails.forEach((email, index) => {
      if (email) {
        emailCounts[email] = emailCounts[email] || [];
        emailCounts[email].push(index);
      }
    });

    // Find internal duplicates
    Object.entries(emailCounts).forEach(([email, indices]) => {
      if (indices.length > 1) {
        results.isValid = false;
        results.duplicateEmails.push({
          email,
          indices
        });
        indices.forEach(index => {
          results.errors[index] = 'This email is duplicated in your team';
        });
      }
    });

    // Check each email for format and uniqueness
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      
      if (!email || !email.trim()) {
        results.isValid = false;
        results.errors[i] = 'Email is required';
        continue;
      }

      // Skip if already marked as duplicate
      if (results.errors[i]) {
        continue;
      }

      // Skip if this is the excluded email
      if (excludeEmail && email.toLowerCase().trim() === excludeEmail.toLowerCase().trim()) {
        continue;
      }

      const validation = await checkEmailUniqueness(email);
      if (!validation.isUnique) {
        results.isValid = false;
        results.errors[i] = validation.error;
      }
    }

    return results;
  } catch (error) {
    console.error('Error validating multiple emails:', error);
    return {
      isValid: false,
      errors: { general: 'Unable to validate emails. Please try again.' }
    };
  }
};

/**
 * Validate a single teammate email in real-time
 * @param {string} email - Email to validate
 * @param {string} leaderEmail - Leader's email to check against
 * @param {Array<string>} otherTeammateEmails - Other teammate emails to check for duplicates
 * @param {Array<string>} existingTeammateEmails - Existing teammate emails to exclude (for editing)
 * @returns {Promise<Object>} - Validation result
 */
export const validateSingleTeammateEmail = async (email, leaderEmail, otherTeammateEmails = [], existingTeammateEmails = []) => {
  try {
    if (!email || !email.trim()) {
      return {
        isValid: true, // Empty email is valid for incomplete forms
        error: null
      };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedLeaderEmail = leaderEmail ? leaderEmail.toLowerCase().trim() : '';
    const normalizedOtherEmails = otherTeammateEmails
      .filter(e => e && e.trim()) // Filter out empty emails first
      .map(e => e.toLowerCase().trim());
    const normalizedExistingEmails = existingTeammateEmails
      .filter(e => e && e.trim()) // Filter out empty emails first  
      .map(e => e.toLowerCase().trim());

    // Validate email format
    const formatValidation = validateEmailFormat(email);
    if (!formatValidation.isValid) {
      return {
        isValid: false,
        error: formatValidation.error
      };
    }

    // Check if email matches leader email
    if (normalizedEmail === normalizedLeaderEmail) {
      return {
        isValid: false,
        error: 'This email matches the team leader\'s email'
      };
    }

    // Check for duplicates with other teammates
    if (normalizedOtherEmails.includes(normalizedEmail)) {
      return {
        isValid: false,
        error: 'This email is duplicated in your team'
      };
    }

    // Skip uniqueness check if this email was already in the team (editing mode)
    if (normalizedExistingEmails.includes(normalizedEmail)) {
      return {
        isValid: true,
        error: null
      };
    }

    // Check database uniqueness
    const uniquenessValidation = await checkEmailUniqueness(email);
    if (!uniquenessValidation.isUnique) {
      return {
        isValid: false,
        error: uniquenessValidation.error
      };
    }

    return {
      isValid: true,
      error: null
    };
  } catch (error) {
    console.error('Error validating single teammate email:', error);
    return {
      isValid: false,
      error: 'Unable to validate email. Please try again.'
    };
  }
};

/**
 * Validate team emails (leader + teammates)
 * @param {string} leaderEmail - Leader's email
 * @param {Array<string>} teammateEmails - Array of teammate emails
 * @param {Array<string>} existingTeammateEmails - Existing teammate emails to exclude from uniqueness check (for editing)
 * @returns {Promise<Object>} - Validation result
 */
export const validateTeamEmails = async (leaderEmail, teammateEmails = [], existingTeammateEmails = []) => {
  try {
    const results = {
      isValid: true,
      leaderError: null,
      teammateErrors: {},
      duplicateEmails: []
    };

    // Normalize all emails
    const normalizedLeaderEmail = leaderEmail ? leaderEmail.toLowerCase().trim() : '';
    const normalizedTeammateEmails = teammateEmails.map(email => email ? email.toLowerCase().trim() : '');
    const normalizedExistingEmails = existingTeammateEmails.map(email => email ? email.toLowerCase().trim() : '');

    // Check for internal duplicates within teammate emails
    const emailCounts = {};
    normalizedTeammateEmails.forEach((email, index) => {
      if (email) {
        emailCounts[email] = emailCounts[email] || [];
        emailCounts[email].push(index);
      }
    });

    // Mark internal duplicates
    Object.entries(emailCounts).forEach(([email, indices]) => {
      if (indices.length > 1) {
        results.isValid = false;
        indices.forEach(index => {
          results.teammateErrors[index] = 'This email is duplicated in your team';
        });
      }
    });

    // Validate each teammate email
    for (let i = 0; i < teammateEmails.length; i++) {
      const email = teammateEmails[i];
      const normalizedEmail = normalizedTeammateEmails[i];
      
      // Skip if email is empty
      if (!email || !email.trim()) {
        continue;
      }

      // Skip if already marked as duplicate
      if (results.teammateErrors[i]) {
        continue;
      }

      // Validate email format
      const formatValidation = validateEmailFormat(email);
      if (!formatValidation.isValid) {
        results.isValid = false;
        results.teammateErrors[i] = formatValidation.error;
        continue;
      }

      // Check if email matches leader email
      if (normalizedEmail === normalizedLeaderEmail) {
        results.isValid = false;
        results.teammateErrors[i] = 'This email matches the team leader\'s email';
        continue;
      }

      // Skip uniqueness check if this email was already in the team (editing mode)
      if (normalizedExistingEmails.includes(normalizedEmail)) {
        continue;
      }

      // Check database uniqueness
      const uniquenessValidation = await checkEmailUniqueness(email);
      if (!uniquenessValidation.isUnique) {
        results.isValid = false;
        results.teammateErrors[i] = uniquenessValidation.error;
      }
    }

    return results;
  } catch (error) {
    console.error('Error validating team emails:', error);
    return {
      isValid: false,
      leaderError: 'Unable to validate team emails. Please try again.',
      teammateErrors: {}
    };
  }
};

/**
 * Get detailed information about an existing email
 * @param {string} email - Email to get info for
 * @returns {Promise<Object|null>} - User information or null
 */
export const getEmailInfo = async (email) => {
  try {
    if (!email) return null;

    const normalizedEmail = email.toLowerCase().trim();
    const mappingsRef = collection(db, TEAM_MAPPING_COLLECTION);
    const q = query(mappingsRef, where('email', '==', normalizedEmail));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        teamSize: userData.teamSize,
        isSmallTeam: userData.isSmallTeam
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting email info:', error);
    return null;
  }
};
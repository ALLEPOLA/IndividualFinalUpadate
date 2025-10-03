// Validation middleware for signup
const validateSignup = (req, res, next) => {
  const { firstName, lastName, phone, role, email, password, ...vendorFields } = req.body;
  const errors = [];

  // Check required user fields
  if (!firstName || firstName.trim().length === 0) {
    errors.push('First name is required');
  }
  // if (!middleName || middleName.trim().length === 0) {
  //   errors.push('Middle name is required');}
  if (!lastName || lastName.trim().length === 0) {
    errors.push('Last name is required');
  }
  if (!phone || phone.trim().length === 0) {
    errors.push('Phone number is required');
  }
  if (!role || !['user', 'vendor', 'admin'].includes(role)) {
    errors.push('Valid role is required (user, vendor, or admin)');
  }
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  
  }
  if (!password || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters');
  }

  // Email format validation
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }

  // Phone format validation 
  if (phone && !/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    errors.push('Invalid phone number format');
  }

  // If role is vendor, validate vendor-specific fields
  if (role === 'vendor') {
    const {
      businessName,
      description,
      address,
      city,
      province,
      postalCode,
      capacity,
      websiteUrl,
      businessRegistrationNumber,
      businessLicenseNumber
    } = vendorFields;

    // Required vendor fields
    if (!businessName || businessName.trim().length === 0) {
      errors.push('Business name is required for vendors');
    }
    if (!description || description.trim().length === 0) {
      errors.push('Business description is required for vendors');
    }
    if (!address || address.trim().length === 0) {
      errors.push('Business address is required for vendors');
    }
    if (!city || city.trim().length === 0) {
      errors.push('City is required for vendors');
    }
    if (!province || province.trim().length === 0) {
      errors.push('Province is required for vendors');
    }
    if (!postalCode || postalCode.trim().length === 0) {
      errors.push('Postal code is required for vendors');
    }
    if (!capacity || isNaN(capacity) || capacity <= 0) {
      errors.push('Valid capacity is required for vendors');
    }
    if (!businessRegistrationNumber || businessRegistrationNumber.trim().length === 0) {
      errors.push('Business registration number is required for vendors');
    }
    if (!businessLicenseNumber || businessLicenseNumber.trim().length === 0) {
      errors.push('Business license number is required for vendors');
    }

    // Optional website URL validation
    if (websiteUrl && websiteUrl.trim().length > 0) {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(websiteUrl)) {
        errors.push('Website URL must be a valid URL starting with http:// or https://');
      }
    }

    // Postal code format validation
    if (postalCode && !/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(postalCode)) {
      errors.push('Invalid postal code format (e.g., A1A 1A1)');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for login
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  }
  if (!password || password.length === 0) {
    errors.push('Password is required');
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for vendor services
const validateVendorService = (req, res, next) => {
  const {
    vendor_id,
    category_id,
    user_id,
    name,
    description,
    base_price,
    price_per_hour,
    capacity,
    advance_percentage,
    isActive
  } = req.body;

  const errors = [];

  // Required fields check
  if (!vendor_id) errors.push('Vendor ID is required');
  if (!category_id) errors.push('Category ID is required');
  if (!user_id) errors.push('User ID is required');
  if (!name || name.trim().length === 0) errors.push('Name is required');
  if (!description || description.trim().length === 0) errors.push('Description is required');
  if (!base_price) errors.push('Base price is required');
  if (!price_per_hour) errors.push('Price per hour is required');
  if (!capacity) errors.push('Capacity is required');
  if (advance_percentage === undefined) errors.push('Advance percentage is required');

  // Name validation
  if (name && (name.length < 3 || name.length > 100)) {
    errors.push('Name must be between 3 and 100 characters');
  }

  // Description validation
  if (description && description.length < 10) {
    errors.push('Description must be at least 10 characters long');
  }

  // Price validation
  if (base_price && base_price < 0) {
    errors.push('Base price cannot be negative');
  }
  if (price_per_hour && price_per_hour < 0) {
    errors.push('Price per hour cannot be negative');
  }

  // Capacity validation
  if (capacity && capacity < 1) {
    errors.push('Capacity must be at least 1');
  }

  // Advance percentage validation
  if (advance_percentage !== undefined && (advance_percentage < 0 || advance_percentage > 100)) {
    errors.push('Advance percentage must be between 0 and 100');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Convert isActive to boolean if provided
  if (isActive !== undefined) {
    // Handle string 'true'/'false' and boolean values properly
    if (typeof isActive === 'string') {
      req.body.isActive = isActive === 'true';
    } else if (typeof isActive === 'boolean') {
      req.body.isActive = isActive;
    } else {
      // Convert other values (0, 1, etc.) to boolean
      req.body.isActive = Boolean(isActive);
    }
  }

  next();
};

// Validation middleware for team member creation
const validateTeamMemberCreate = (req, res, next) => {
  const {
    vendor_id,
    name,
    email,
    phone,
    role,
    hourly_rate,
    is_active
  } = req.body;

  const errors = [];

  // Required fields check for creation
  if (!vendor_id) errors.push('Vendor ID is required');
  if (!name || name.trim().length === 0) errors.push('Name is required');
  if (!email || email.trim().length === 0) errors.push('Email is required');
  if (!role || role.trim().length === 0) errors.push('Role is required');

  // Name validation
  if (name && (name.length < 2 || name.length > 255)) {
    errors.push('Name must be between 2 and 255 characters');
  }

  // Email format validation
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }

  // Phone validation (optional)
  if (phone && phone.trim().length > 20) {
    errors.push('Phone number must not exceed 20 characters');
  }

  // Role validation
  if (role && (role.length < 2 || role.length > 100)) {
    errors.push('Role must be between 2 and 100 characters');
  }

  // Hourly rate validation (optional)
  if (hourly_rate !== undefined && hourly_rate < 0) {
    errors.push('Hourly rate cannot be negative');
  }

  // is_active validation (optional)
  if (is_active !== undefined && typeof is_active !== 'boolean') {
    errors.push('is_active must be a boolean value');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for team member updates (only validates provided fields)
const validateTeamMemberUpdate = (req, res, next) => {
  
  const {
    name,
    email,
    phone,
    role,
    hourly_rate,
    is_active,
    vendor_id // Allow but ignore vendor_id in updates
  } = req.body;

  const errors = [];

  // Only validate fields that are provided (optional validation for updates)
  // Note: vendor_id is ignored in updates - it should not be changed
  
  // Name validation (if provided)
  if (name !== undefined) {
    if (!name || name.trim().length === 0) {
      errors.push('Name cannot be empty');
    } else if (name.length < 2 || name.length > 255) {
      errors.push('Name must be between 2 and 255 characters');
    }
  }

  // Email format validation (if provided)
  if (email !== undefined) {
    if (!email || email.trim().length === 0) {
      errors.push('Email cannot be empty');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format');
    }
  }

  // Phone validation (if provided)
  if (phone !== undefined && phone && phone.trim().length > 20) {
    errors.push('Phone number must not exceed 20 characters');
  }

  // Role validation (if provided)
  if (role !== undefined) {
    if (!role || role.trim().length === 0) {
      errors.push('Role cannot be empty');
    } else if (role.length < 2 || role.length > 100) {
      errors.push('Role must be between 2 and 100 characters');
    }
  }

  // Hourly rate validation (if provided)
  if (hourly_rate !== undefined && hourly_rate < 0) {
    errors.push('Hourly rate cannot be negative');
  }

  // is_active validation (if provided) - more flexible conversion
  if (is_active !== undefined) {
    // Convert string 'true'/'false' to boolean
    if (typeof is_active === 'string') {
      req.body.is_active = is_active === 'true';
    } else if (typeof is_active !== 'boolean') {
      errors.push('is_active must be a boolean value or "true"/"false" string');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Backward compatibility - default to create validation
const validateTeamMember = validateTeamMemberCreate;

// Validation middleware for event creation
const validateEventCreate = (req, res, next) => {
  const {
    name,
    description,
    type,
    date,
    start_time,
    end_time,
    special_requirements,
    vendor_id,
    vendor_name,
    services,
    status
  } = req.body;

  const errors = [];

  // Required fields check
  if (!name || name.trim().length === 0) errors.push('Event name is required');
  if (!description || description.trim().length === 0) errors.push('Event description is required');
  if (!type || type.trim().length === 0) errors.push('Event type is required');
  if (!date) errors.push('Event date is required');
  if (!start_time) errors.push('Start time is required');
  if (!end_time) errors.push('End time is required');
  if (!vendor_id) errors.push('Vendor ID is required');
  if (!vendor_name || vendor_name.trim().length === 0) errors.push('Vendor name is required');

  // Name validation
  if (name && (name.length < 3 || name.length > 255)) {
    errors.push('Event name must be between 3 and 255 characters');
  }

  // Description validation
  if (description && description.length < 10) {
    errors.push('Event description must be at least 10 characters long');
  }

  // Type validation
  if (type && (type.length < 2 || type.length > 100)) {
    errors.push('Event type must be between 2 and 100 characters');
  }

  // Date validation
  if (date) {
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(eventDate.getTime())) {
      errors.push('Invalid date format');
    } else if (eventDate < today) {
      errors.push('Event date cannot be in the past');
    }
  }

  // Time validation
  if (start_time && end_time) {
    const startTime = new Date(`2000-01-01 ${start_time}`);
    const endTime = new Date(`2000-01-01 ${end_time}`);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      errors.push('Invalid time format');
    } else if (startTime >= endTime) {
      errors.push('End time must be after start time');
    }
  }

  // Vendor ID validation
  if (vendor_id && (isNaN(vendor_id) || vendor_id <= 0)) {
    errors.push('Valid vendor ID is required');
  }

  // Vendor name validation
  if (vendor_name && (vendor_name.length < 2 || vendor_name.length > 255)) {
    errors.push('Vendor name must be between 2 and 255 characters');
  }

  // Services validation
  if (services !== undefined) {
    if (!Array.isArray(services)) {
      errors.push('Services must be an array');
    } else {
      for (let i = 0; i < services.length; i++) {
        const service = services[i];
        if (!service || typeof service !== 'object') {
          errors.push('Each service must be an object');
          break;
        }
        if (!service.id || isNaN(service.id) || service.id <= 0) {
          errors.push('Each service must have a valid positive ID');
          break;
        }
        if (!service.name || typeof service.name !== 'string' || service.name.trim().length === 0) {
          errors.push('Each service must have a valid name');
          break;
        }
      }
    }
  }

  // Status validation
  if (status !== undefined) {
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      errors.push('Status must be one of: pending, confirmed, cancelled');
    }
  }

  // Special requirements validation (optional)
  if (special_requirements && special_requirements.length > 1000) {
    errors.push('Special requirements must not exceed 1000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for event updates (only validates provided fields)
const validateEventUpdate = (req, res, next) => {
  const {
    name,
    description,
    type,
    date,
    start_time,
    end_time,
    special_requirements,
    vendor_id,
    vendor_name,
    services,
    status
  } = req.body;

  const errors = [];

  // Only validate fields that are provided (optional validation for updates)
  
  // Name validation (if provided)
  if (name !== undefined) {
    if (!name || name.trim().length === 0) {
      errors.push('Event name cannot be empty');
    } else if (name.length < 3 || name.length > 255) {
      errors.push('Event name must be between 3 and 255 characters');
    }
  }

  // Description validation (if provided)
  if (description !== undefined) {
    if (!description || description.trim().length === 0) {
      errors.push('Event description cannot be empty');
    } else if (description.length < 10) {
      errors.push('Event description must be at least 10 characters long');
    }
  }

  // Type validation (if provided)
  if (type !== undefined) {
    if (!type || type.trim().length === 0) {
      errors.push('Event type cannot be empty');
    } else if (type.length < 2 || type.length > 100) {
      errors.push('Event type must be between 2 and 100 characters');
    }
  }

  // Date validation (if provided)
  if (date !== undefined) {
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(eventDate.getTime())) {
      errors.push('Invalid date format');
    } else if (eventDate < today) {
      errors.push('Event date cannot be in the past');
    }
  }

  // Time validation (if both provided)
  if (start_time !== undefined && end_time !== undefined) {
    const startTime = new Date(`2000-01-01 ${start_time}`);
    const endTime = new Date(`2000-01-01 ${end_time}`);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      errors.push('Invalid time format');
    } else if (startTime >= endTime) {
      errors.push('End time must be after start time');
    }
  }

  // Individual time validation
  if (start_time !== undefined) {
    const startTime = new Date(`2000-01-01 ${start_time}`);
    if (isNaN(startTime.getTime())) {
      errors.push('Invalid start time format');
    }
  }

  if (end_time !== undefined) {
    const endTime = new Date(`2000-01-01 ${end_time}`);
    if (isNaN(endTime.getTime())) {
      errors.push('Invalid end time format');
    }
  }

  // Vendor ID validation (if provided)
  if (vendor_id !== undefined && (isNaN(vendor_id) || vendor_id <= 0)) {
    errors.push('Valid vendor ID is required');
  }

  // Vendor name validation (if provided)
  if (vendor_name !== undefined) {
    if (!vendor_name || vendor_name.trim().length === 0) {
      errors.push('Vendor name cannot be empty');
    } else if (vendor_name.length < 2 || vendor_name.length > 255) {
      errors.push('Vendor name must be between 2 and 255 characters');
    }
  }

  // Services validation (if provided)
  if (services !== undefined) {
    if (!Array.isArray(services)) {
      errors.push('Services must be an array');
    } else {
      for (let i = 0; i < services.length; i++) {
        const service = services[i];
        if (!service || typeof service !== 'object') {
          errors.push('Each service must be an object');
          break;
        }
        if (!service.id || isNaN(service.id) || service.id <= 0) {
          errors.push('Each service must have a valid positive ID');
          break;
        }
        if (!service.name || typeof service.name !== 'string' || service.name.trim().length === 0) {
          errors.push('Each service must have a valid name');
          break;
        }
      }
    }
  }

  // Status validation (if provided)
  if (status !== undefined) {
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      errors.push('Status must be one of: pending, confirmed, cancelled');
    }
  }

  // Special requirements validation (if provided)
  if (special_requirements !== undefined && special_requirements && special_requirements.length > 1000) {
    errors.push('Special requirements must not exceed 1000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Backward compatibility - default to create validation
const validateEvent = validateEventCreate;

// Validation middleware for vendor creation
const validateVendorCreate = (req, res, next) => {
  const {
    userId,
    businessName,
    description,
    address,
    city,
    province,
    postalCode,
    capacity,
    websiteUrl,
    businessRegistrationNumber,
    businessLicenseNumber
  } = req.body;

  const errors = [];

  // Required fields check
  if (!userId) errors.push('User ID is required');
  if (!businessName || businessName.trim().length === 0) errors.push('Business name is required');
  if (!description || description.trim().length === 0) errors.push('Business description is required');
  if (!address || address.trim().length === 0) errors.push('Business address is required');
  if (!city || city.trim().length === 0) errors.push('City is required');
  if (!province || province.trim().length === 0) errors.push('Province is required');
  if (!postalCode || postalCode.trim().length === 0) errors.push('Postal code is required');
  if (!capacity) errors.push('Capacity is required');
  if (!businessRegistrationNumber || businessRegistrationNumber.trim().length === 0) {
    errors.push('Business registration number is required');
  }
  if (!businessLicenseNumber || businessLicenseNumber.trim().length === 0) {
    errors.push('Business license number is required');
  }

  // Business name validation
  if (businessName && (businessName.length < 2 || businessName.length > 100)) {
    errors.push('Business name must be between 2 and 100 characters');
  }

  // Description validation
  if (description && description.length < 10) {
    errors.push('Business description must be at least 10 characters long');
  }

  // Address validation
  if (address && address.length < 5) {
    errors.push('Address must be at least 5 characters long');
  }

  // City validation
  if (city && (city.length < 2 || city.length > 50)) {
    errors.push('City must be between 2 and 50 characters');
  }

  // Province validation
  if (province && (province.length < 2 || province.length > 50)) {
    errors.push('Province must be between 2 and 50 characters');
  }

  // Postal code format validation (Canadian format)
  if (postalCode && !/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(postalCode)) {
    errors.push('Invalid postal code format (e.g., A1A 1A1)');
  }

  // Capacity validation
  if (capacity && (isNaN(capacity) || capacity <= 0)) {
    errors.push('Capacity must be a positive number');
  }

  // User ID validation
  if (userId && (isNaN(userId) || userId <= 0)) {
    errors.push('Valid user ID is required');
  }

  // Website URL validation (optional)
  if (websiteUrl && websiteUrl.trim().length > 0) {
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(websiteUrl)) {
      errors.push('Website URL must be a valid URL starting with http:// or https://');
    }
  }

  // Business registration number validation
  if (businessRegistrationNumber && businessRegistrationNumber.length < 5) {
    errors.push('Business registration number must be at least 5 characters');
  }

  // Business license number validation
  if (businessLicenseNumber && businessLicenseNumber.length < 5) {
    errors.push('Business license number must be at least 5 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for vendor updates (only validates provided fields)
const validateVendorUpdate = (req, res, next) => {
  const {
    businessName,
    description,
    address,
    city,
    province,
    postalCode,
    capacity,
    websiteUrl,
    businessRegistrationNumber,
    businessLicenseNumber
  } = req.body;

  const errors = [];

  // Only validate fields that are provided (optional validation for updates)
  
  // Business name validation (if provided)
  if (businessName !== undefined) {
    if (!businessName || businessName.trim().length === 0) {
      errors.push('Business name cannot be empty');
    } else if (businessName.length < 2 || businessName.length > 100) {
      errors.push('Business name must be between 2 and 100 characters');
    }
  }

  // Description validation (if provided)
  if (description !== undefined) {
    if (!description || description.trim().length === 0) {
      errors.push('Business description cannot be empty');
    } else if (description.length < 10) {
      errors.push('Business description must be at least 10 characters long');
    }
  }

  // Address validation (if provided)
  if (address !== undefined) {
    if (!address || address.trim().length === 0) {
      errors.push('Address cannot be empty');
    } else if (address.length < 5) {
      errors.push('Address must be at least 5 characters long');
    }
  }

  // City validation (if provided)
  if (city !== undefined) {
    if (!city || city.trim().length === 0) {
      errors.push('City cannot be empty');
    } else if (city.length < 2 || city.length > 50) {
      errors.push('City must be between 2 and 50 characters');
    }
  }

  // Province validation (if provided)
  if (province !== undefined) {
    if (!province || province.trim().length === 0) {
      errors.push('Province cannot be empty');
    } else if (province.length < 2 || province.length > 50) {
      errors.push('Province must be between 2 and 50 characters');
    }
  }

  // Postal code validation (if provided)
  if (postalCode !== undefined) {
    if (!postalCode || postalCode.trim().length === 0) {
      errors.push('Postal code cannot be empty');
    } else if (!/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(postalCode)) {
      errors.push('Invalid postal code format (e.g., A1A 1A1)');
    }
  }

  // Capacity validation (if provided)
  if (capacity !== undefined && (isNaN(capacity) || capacity <= 0)) {
    errors.push('Capacity must be a positive number');
  }

  // Website URL validation (if provided)
  if (websiteUrl !== undefined && websiteUrl && websiteUrl.trim().length > 0) {
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(websiteUrl)) {
      errors.push('Website URL must be a valid URL starting with http:// or https://');
    }
  }

  // Business registration number validation (if provided)
  if (businessRegistrationNumber !== undefined) {
    if (!businessRegistrationNumber || businessRegistrationNumber.trim().length === 0) {
      errors.push('Business registration number cannot be empty');
    } else if (businessRegistrationNumber.length < 5) {
      errors.push('Business registration number must be at least 5 characters');
    }
  }

  // Business license number validation (if provided)
  if (businessLicenseNumber !== undefined) {
    if (!businessLicenseNumber || businessLicenseNumber.trim().length === 0) {
      errors.push('Business license number cannot be empty');
    } else if (businessLicenseNumber.length < 5) {
      errors.push('Business license number must be at least 5 characters');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Backward compatibility - default to create validation
const validateVendor = validateVendorCreate;

module.exports = {
  validateSignup,
  validateLogin,
  validateVendorService,
  validateTeamMember,
  validateTeamMemberCreate,
  validateTeamMemberUpdate,
  validateEvent,
  validateEventCreate,
  validateEventUpdate,
  validateVendor,
  validateVendorCreate,
  validateVendorUpdate
};

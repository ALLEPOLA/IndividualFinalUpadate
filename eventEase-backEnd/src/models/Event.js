const { pool } = require('../config/db');

class Event {
  // Calculate pricing based on services
  static calculatePricing(services) {
    let totalAmount = 0;
    let totalAdvanceAmount = 0;

    services.forEach(service => {
      const basePrice = parseFloat(service.base_price) || 0;
      const advancePercentage = parseFloat(service.advance_percentage) || 0;
      
      totalAmount += basePrice;
      totalAdvanceAmount += (basePrice * advancePercentage / 100);
    });

    const remainingAmount = totalAmount - totalAdvanceAmount;
    const overallAdvancePercentage = totalAmount > 0 ? (totalAdvanceAmount / totalAmount * 100) : 0;

    return {
      total_amount: parseFloat(totalAmount.toFixed(2)),
      advance_amount: parseFloat(totalAdvanceAmount.toFixed(2)),
      remaining_amount: parseFloat(remainingAmount.toFixed(2)),
      advance_percentage: parseFloat(overallAdvancePercentage.toFixed(2))
    };
  }

  static async create(eventData) {
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
      user_id,
      status = 'pending'
    } = eventData;

    try {
      const servicesJson = Array.isArray(services) ? JSON.stringify(services) : services;
      
      // Calculate pricing based on services
      const pricing = this.calculatePricing(services);

      const query = `
        INSERT INTO events 
        (name, description, type, date, start_time, end_time, 
         special_requirements, vendor_id, vendor_name, services, user_id,
         total_amount, advance_amount, remaining_amount, advance_percentage, 
         payment_status, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await pool.execute(query, [
        name,
        description,
        type,
        date,
        start_time,
        end_time,
        special_requirements,
        vendor_id,
        vendor_name,
        servicesJson,
        user_id,
        pricing.total_amount,
        pricing.advance_amount,
        pricing.remaining_amount,
        pricing.advance_percentage,
        'pending', // default payment status
        status
      ]);

      return { 
        id: result.insertId, 
        ...eventData, 
        ...pricing,
        payment_status: 'pending'
      };
    } catch (error) {
      throw new Error(`Error creating event: ${error.message}`);
    }
  }

  static async findByUserId(userId) {
    const query = `
      SELECT e.*
      FROM events e
      WHERE e.user_id = ?
      ORDER BY e.date DESC, e.start_time DESC
    `;

    try {
      const [rows] = await pool.execute(query, [userId]);
      
      // Parse services for each event
      const events = rows.map(event => {
        // Handle MySQL JSON field - it might already be parsed or might be a string
        if (event.services) {
          if (typeof event.services === 'string') {
            try {
              event.services = JSON.parse(event.services);
            } catch (parseError) {
              console.error('Error parsing services JSON:', parseError.message);
              event.services = [];
            }
          } else if (typeof event.services === 'object') {
            event.services = event.services;
          }
        } else {
          event.services = [];
        }
        return event;
      });
      
      return events;
    } catch (error) {
      throw new Error(`Error finding events by user ID: ${error.message}`);
    }
  }

  static async findById(id) {
    const query = `
      SELECT e.*
      FROM events e
      WHERE e.id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [id]);
      const event = rows[0] || null;
      
      if (event && event.services) {
        // Handle MySQL JSON field - it might already be parsed or might be a string
        if (typeof event.services === 'string') {
          try {
            event.services = JSON.parse(event.services);
          } catch (parseError) {
            console.error('Error parsing services JSON:', parseError.message);
            event.services = [];
          }
        } else if (typeof event.services === 'object') {
          // Already parsed by MySQL driver
          event.services = event.services;
        }
      } else if (event) {
        event.services = [];
      }
      
      return event;
    } catch (error) {
      throw new Error(`Error finding event: ${error.message}`);
    }
  }

  static async findAll() {
    const query = `
      SELECT e.*
      FROM events e
      ORDER BY e.date DESC, e.start_time DESC
    `;

    try {
      const [rows] = await pool.execute(query);
      
      // Parse services for each event
      const events = rows.map(event => {
        // Handle MySQL JSON field - it might already be parsed or might be a string
        if (event.services) {
          if (typeof event.services === 'string') {
            try {
              event.services = JSON.parse(event.services);
            } catch (parseError) {
              console.error('Error parsing services JSON:', parseError.message);
              event.services = [];
            }
          } else if (typeof event.services === 'object') {
            // Already parsed by MySQL driver
            event.services = event.services;
          }
        } else {
          event.services = [];
        }
        return event;
      });
      
      return events;
    } catch (error) {
      throw new Error(`Error finding all events: ${error.message}`);
    }
  }

  static async findByVendor(vendorId) {
    const query = `
      SELECT e.*
      FROM events e
      WHERE e.vendor_id = ?
      ORDER BY e.date DESC, e.start_time DESC
    `;

    try {
      const [rows] = await pool.execute(query, [vendorId]);
      
      // Parse services for each event
      const events = rows.map(event => {
        // Handle MySQL JSON field - it might already be parsed or might be a string
        if (event.services) {
          if (typeof event.services === 'string') {
            try {
              event.services = JSON.parse(event.services);
            } catch (parseError) {
              console.error('Error parsing services JSON:', parseError.message);
              event.services = [];
            }
          } else if (typeof event.services === 'object') {
            // Already parsed by MySQL driver
            event.services = event.services;
          }
        } else {
          event.services = [];
        }
        return event;
      });
      
      return events;
    } catch (error) {
      throw new Error(`Error finding events by vendor: ${error.message}`);
    }
  }

  static async findByStatus(status) {
    const query = `
      SELECT e.*
      FROM events e
      WHERE e.status = ?
      ORDER BY e.date DESC, e.start_time DESC
    `;

    try {
      const [rows] = await pool.execute(query, [status]);
      
      // Parse services for each event
      const events = rows.map(event => {
        // Handle MySQL JSON field - it might already be parsed or might be a string
        if (event.services) {
          if (typeof event.services === 'string') {
            try {
              event.services = JSON.parse(event.services);
            } catch (parseError) {
              console.error('Error parsing services JSON:', parseError.message);
              event.services = [];
            }
          } else if (typeof event.services === 'object') {
            // Already parsed by MySQL driver
            event.services = event.services;
          }
        } else {
          event.services = [];
        }
        return event;
      });
      
      return events;
    } catch (error) {
      throw new Error(`Error finding events by status: ${error.message}`);
    }
  }

  static async findByDateRange(startDate, endDate) {
    const query = `
      SELECT e.*
      FROM events e
      WHERE e.date BETWEEN ? AND ?
      ORDER BY e.date ASC, e.start_time ASC
    `;

    try {
      const [rows] = await pool.execute(query, [startDate, endDate]);
      
      // Parse services for each event
      const events = rows.map(event => {
        // Handle MySQL JSON field - it might already be parsed or might be a string
        if (event.services) {
          if (typeof event.services === 'string') {
            try {
              event.services = JSON.parse(event.services);
            } catch (parseError) {
              console.error('Error parsing services JSON:', parseError.message);
              event.services = [];
            }
          } else if (typeof event.services === 'object') {
            // Already parsed by MySQL driver
            event.services = event.services;
          }
        } else {
          event.services = [];
        }
        return event;
      });
      
      return events;
    } catch (error) {
      throw new Error(`Error finding events by date range: ${error.message}`);
    }
  }

  static async update(id, eventData) {
    // Define allowed fields for update
    const allowedFields = [
      'name', 'description', 'type', 'date', 'start_time', 'end_time',
      'special_requirements', 'vendor_id', 'vendor_name', 'services', 'status'
    ];

    // Filter only allowed fields
    const updateFields = {};
    let servicesUpdated = false;
    
    Object.keys(eventData).forEach(key => {
      if (allowedFields.includes(key) && eventData[key] !== undefined) {
        if (key === 'services' && Array.isArray(eventData[key])) {
          updateFields[key] = JSON.stringify(eventData[key]);
          servicesUpdated = true;
          
          // Recalculate pricing if services are updated
          const pricing = this.calculatePricing(eventData[key]);
          updateFields.total_amount = pricing.total_amount;
          updateFields.advance_amount = pricing.advance_amount;
          updateFields.remaining_amount = pricing.remaining_amount;
          updateFields.advance_percentage = pricing.advance_percentage;
        } else {
          updateFields[key] = eventData[key];
        }
      }
    });

    if (Object.keys(updateFields).length === 0) {
      throw new Error('No valid fields to update');
    }

    const fields = Object.keys(updateFields)
      .map(key => `${key} = ?`)
      .join(', ');

    const query = `
      UPDATE events 
      SET ${fields}, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      const values = [...Object.values(updateFields), id];
      const [result] = await pool.execute(query, values);

      if (result.affectedRows === 0) {
        throw new Error('Event not found');
      }

      // Return the updated event data
      const updatedEvent = await this.findById(id);
      return updatedEvent;
    } catch (error) {
      throw new Error(`Error updating event: ${error.message}`);
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM events WHERE id = ?';

    try {
      const [result] = await pool.execute(query, [id]);

      if (result.affectedRows === 0) {
        throw new Error('Event not found');
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting event: ${error.message}`);
    }
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE events 
      SET status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      const [result] = await pool.execute(query, [status, id]);

      if (result.affectedRows === 0) {
        throw new Error('Event not found');
      }

      // Return the updated event data
      const updatedEvent = await this.findById(id);
      return updatedEvent;
    } catch (error) {
      throw new Error(`Error updating event status: ${error.message}`);
    }
  }

  static async updatePaymentStatus(id, paymentStatus, paidAmount = null) {
    let query;
    let params;

    if (paidAmount !== null) {
      query = `
        UPDATE events 
        SET payment_status = ?, paid_amount = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      params = [paymentStatus, paidAmount, id];
    } else {
      query = `
        UPDATE events 
        SET payment_status = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      params = [paymentStatus, id];
    }

    try {
      const [result] = await pool.execute(query, params);

      if (result.affectedRows === 0) {
        throw new Error('Event not found');
      }

      // Return the updated event data
      const updatedEvent = await this.findById(id);
      return updatedEvent;
    } catch (error) {
      throw new Error(`Error updating payment status: ${error.message}`);
    }
  }

  // Update team members for an event
  static async updateTeamMembers(id, teamMembersJson) {
    const query = `
      UPDATE events 
      SET team_members = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      const [result] = await pool.execute(query, [teamMembersJson, id]);

      if (result.affectedRows === 0) {
        throw new Error('Event not found');
      }

      // Return the updated event data
      const updatedEvent = await this.findById(id);
      return updatedEvent;
    } catch (error) {
      throw new Error(`Error updating event team members: ${error.message}`);
    }
  }
}

module.exports = Event;

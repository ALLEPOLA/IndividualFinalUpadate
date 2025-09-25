const { pool } = require('./src/config/db');
const TeamMember = require('./src/models/TeamMember');
const Event = require('./src/models/Event');

async function testTeamAssignment() {
  try {
    console.log('🧪 Testing team member assignment...');
    
    // Test 1: Check if we can find team members
    console.log('\n1. Testing TeamMember.findByVendor...');
    const teamMembers = await TeamMember.findByVendor(1);
    console.log(`✅ Found ${teamMembers.length} team members for vendor 1`);
    
    if (teamMembers.length > 0) {
      console.log('Sample team member:', {
        id: teamMembers[0].id,
        name: teamMembers[0].name,
        role: teamMembers[0].role
      });
    }
    
    // Test 2: Check if we can find an event
    console.log('\n2. Testing Event.findById...');
    const events = await pool.execute('SELECT * FROM events LIMIT 1');
    if (events[0].length > 0) {
      const event = events[0][0];
      console.log(`✅ Found event: ${event.name} (ID: ${event.id})`);
      
      // Test 3: Test team member assignment
      console.log('\n3. Testing Event.updateTeamMembers...');
      const teamMembersData = teamMembers.slice(0, 2).map(member => ({
        id: member.id,
        name: member.name,
        role: member.role
      }));
      
      const teamMembersJson = JSON.stringify(teamMembersData);
      console.log('Assigning team members:', teamMembersData);
      
      await Event.updateTeamMembers(event.id, teamMembersJson);
      console.log('✅ Successfully assigned team members to event');
      
      // Test 4: Verify the assignment
      console.log('\n4. Verifying assignment...');
      const updatedEvent = await pool.execute(
        'SELECT team_members FROM events WHERE id = ?', 
        [event.id]
      );
      
      const teamMembersData = updatedEvent[0][0].team_members;
      console.log('Raw team_members data:', teamMembersData);
      
      if (teamMembersData && teamMembersData !== 'null' && teamMembersData.trim() !== '') {
        try {
          const assignedMembers = JSON.parse(teamMembersData);
          console.log(`✅ Verified: ${assignedMembers.length} team members assigned`);
          console.log('Assigned members:', assignedMembers);
        } catch (parseError) {
          console.log('❌ Error parsing team members JSON:', parseError.message);
          console.log('Raw data:', teamMembersData);
        }
      } else {
        console.log('ℹ️ No team members assigned (empty or null)');
      }
      
    } else {
      console.log('❌ No events found to test with');
    }
    
    console.log('\n🎉 Team assignment test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during team assignment test:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await pool.end();
  }
}

testTeamAssignment();

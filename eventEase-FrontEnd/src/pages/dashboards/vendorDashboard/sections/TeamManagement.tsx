import { useState, useEffect } from 'react';
import { TeamMemberCard } from '../../../../components/dashboards/vendorDashboard/TeamMemberCard';
import { TeamMemberFormModal } from '../../../../components/dashboards/vendorDashboard/TeamMemberFormModal';
import { TeamMemberDetailModal } from '../../../../components/dashboards/vendorDashboard/TeamMemberDetailModal';
import { useVendor } from '../../../../stores/userStore';
import {
  type TeamMember,
  type CreateTeamMemberData,
  type UpdateTeamMemberData,
  getTeamMembersByVendor,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../../../../services/teamMemberService';

export const TeamManagement = () => {
  const vendor = useVendor();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch team members
  const fetchTeamMembers = async () => {
    if (!vendor?.id) return;

    try {
      setIsLoading(true);
      setError('');
      const response = await getTeamMembersByVendor(vendor.id);
      
      if (response.success && Array.isArray(response.data)) {
        setTeamMembers(response.data);
      } else {
        setTeamMembers([]);
      }
    } catch (err: any) {
      console.error('Error fetching team members:', err);
      setError(err.message || 'Failed to fetch team members');
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load team members on component mount
  useEffect(() => {
    fetchTeamMembers();
  }, [vendor?.id]);

  // Handle create or update team member
  const handleSubmitTeamMember = async (teamMemberData: any) => {
    try {
      let response;
      if (teamMemberData.id) {
        // It's an update
        response = await updateTeamMember(teamMemberData as UpdateTeamMemberData);
      } else {
        // It's a create
        response = await createTeamMember(teamMemberData as CreateTeamMemberData);
      }
      
      if (response.success) {
        await fetchTeamMembers(); // Refresh the team members list
        alert(teamMemberData.id ? 'Team member updated successfully!' : 'Team member added successfully!');
      }
    } catch (err: any) {
      console.error('Error submitting team member:', err);
      alert(err.message || 'Failed to submit team member');
      throw err;
    }
  };

  // Handle delete team member
  const handleDeleteTeamMember = async (teamMember: TeamMember) => {
    try {
      const response = await deleteTeamMember(teamMember.id);
      if (response.success) {
        await fetchTeamMembers(); // Refresh the team members list
        alert('Team member removed successfully!');
      }
    } catch (err: any) {
      console.error('Error deleting team member:', err);
      alert(err.message || 'Failed to remove team member');
    }
  };


  // Handle view team member details
  const handleViewTeamMember = (teamMember: TeamMember) => {
    setSelectedTeamMember(teamMember);
    setIsDetailModalOpen(true);
  };

  // Handle edit team member
  const handleEditTeamMember = (teamMember: TeamMember) => {
    setSelectedTeamMember(teamMember);
    setIsEditMode(true);
    setIsFormModalOpen(true);
  };

  // Handle create new team member
  const handleCreateNew = () => {
    setSelectedTeamMember(null);
    setIsEditMode(false);
    setIsFormModalOpen(true);
  };

  // Close modals
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedTeamMember(null);
    setIsEditMode(false);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTeamMember(null);
  };

  if (!vendor) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Please complete your vendor profile to manage team members.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600 mt-1">
            Manage your team members, assign roles, and coordinate your workforce effectively.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.filter(member => member.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Hourly Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(() => {
                  const membersWithRate = teamMembers.filter(member => member.hourly_rate && !isNaN(Number(member.hourly_rate)));
                  if (membersWithRate.length === 0) return '0.00';
                  const avg = membersWithRate.reduce((sum, member) => sum + Number(member.hourly_rate || 0), 0) / membersWithRate.length;
                  return isNaN(avg) ? '0.00' : avg.toFixed(2);
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading team members...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <div className="flex">
            <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium">Error loading team members</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchTeamMembers}
            className="mt-3 text-sm font-medium text-red-700 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Team Members Grid */}
      {!isLoading && !error && (
        <>
          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No team members yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first team member.</p>
              <div className="mt-6">
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Team Member
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((teamMember) => (
                <TeamMemberCard
                  key={teamMember.id}
                  teamMember={teamMember}
                  onView={handleViewTeamMember}
                  onEdit={handleEditTeamMember}
                  onDelete={handleDeleteTeamMember}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <TeamMemberFormModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        onSubmit={handleSubmitTeamMember}
        initialData={selectedTeamMember}
        isEdit={isEditMode}
      />

      <TeamMemberDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        teamMember={selectedTeamMember}
      />
    </div>
  );
};
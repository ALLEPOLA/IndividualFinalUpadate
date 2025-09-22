import React, { useState, useEffect } from 'react';
import { eventTeamMemberService, type AvailableTeamMember } from '../../../services/eventTeamMemberService';
import { type EventTeamMember } from '../../../services/eventService';

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  eventName: string;
  currentTeamMembers: EventTeamMember[];
  onTeamMembersUpdated: (teamMembers: EventTeamMember[]) => void;
}

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventName,
  currentTeamMembers,
  onTeamMembersUpdated
}) => {
  const [availableMembers, setAvailableMembers] = useState<AvailableTeamMember[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableMembers();
      // Set currently assigned members as selected
      setSelectedMemberIds(currentTeamMembers.map(member => member.id));
    }
  }, [isOpen, currentTeamMembers]);

  const fetchAvailableMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const members = await eventTeamMemberService.getAvailableTeamMembers();
      setAvailableMembers(members);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberToggle = (memberId: number) => {
    setSelectedMemberIds(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const result = await eventTeamMemberService.assignTeamMembersToEvent(
        eventId,
        selectedMemberIds
      );
      
      onTeamMembersUpdated(result.teamMembers);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAll = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const result = await eventTeamMemberService.removeTeamMembersFromEvent(eventId);
      
      onTeamMembersUpdated(result.teamMembers);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Assign Team Members</h3>
              <p className="text-sm text-gray-600 mt-1">{eventName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">Loading team members...</span>
            </div>
          ) : (
            <>
              {availableMembers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No team members available</p>
                  <p className="text-gray-400 text-sm mt-1">Add team members to your vendor profile first</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      Select team members to assign to this event ({selectedMemberIds.length} selected)
                    </p>
                    {currentTeamMembers.length > 0 && (
                      <button
                        onClick={handleRemoveAll}
                        disabled={saving}
                        className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Remove All
                      </button>
                    )}
                  </div>

                  {availableMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMemberIds.includes(member.id)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleMemberToggle(member.id)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`w-4 h-4 border-2 rounded ${
                            selectedMemberIds.includes(member.id)
                              ? 'bg-purple-600 border-purple-600'
                              : 'border-gray-300'
                          } flex items-center justify-center`}>
                            {selectedMemberIds.includes(member.id) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                              <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">{member.email}</p>
                              {member.hourly_rate && (
                                <p className="text-sm text-gray-500">${member.hourly_rate}/hr</p>
                              )}
                            </div>
                          </div>
                          {!member.is_active && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 mt-1">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading || availableMembers.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

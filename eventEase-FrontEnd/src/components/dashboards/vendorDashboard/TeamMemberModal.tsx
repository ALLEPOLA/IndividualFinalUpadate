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
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/60 via-pink-900/50 to-purple-800/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-20 right-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '1.5s' }}>🌟</div>
      <div className="absolute bottom-32 left-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '2s' }}>💫</div>
      <div className="absolute bottom-20 right-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '2.5s' }}>⭐</div>
      <div className="absolute top-1/2 left-8 text-lg animate-bounce opacity-20" style={{ animationDelay: '3s' }}>👥</div>
      <div className="absolute top-1/3 right-8 text-lg animate-bounce opacity-20" style={{ animationDelay: '3.5s' }}>🎭</div>
      
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-200/50 transform transition-all duration-300 animate-slideInUp hover:shadow-3xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-800">Assign Team Members</h3>
              <p className="text-sm text-purple-600 mt-1">{eventName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-purple-400 hover:text-purple-600 transition-colors duration-300"
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
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-purple-700 font-medium">Loading team members...</span>
            </div>
          ) : (
            <>
              {availableMembers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-purple-300 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-purple-600 font-medium">No team members available</p>
                  <p className="text-purple-400 text-sm mt-1">Add team members to your vendor profile first</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-purple-700 font-medium">
                      Select team members to assign to this event ({selectedMemberIds.length} selected)
                    </p>
                    {currentTeamMembers.length > 0 && (
                      <button
                        onClick={handleRemoveAll}
                        disabled={saving}
                        className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors duration-300 font-medium"
                      >
                        Remove All
                      </button>
                    )}
                  </div>

                  {availableMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                        selectedMemberIds.includes(member.id)
                          ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md'
                          : 'border-purple-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-25 hover:to-pink-25'
                      }`}
                      onClick={() => handleMemberToggle(member.id)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`w-4 h-4 border-2 rounded transition-all duration-300 ${
                            selectedMemberIds.includes(member.id)
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-600'
                              : 'border-purple-300 hover:border-purple-400'
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
                              <h4 className="text-sm font-medium text-purple-800">{member.name}</h4>
                              <p className="text-sm text-purple-600 font-medium">{member.role}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-purple-700">{member.email}</p>
                              {member.hourly_rate && (
                                <p className="text-sm text-purple-600 font-semibold">${member.hourly_rate}/hr</p>
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
        <div className="px-6 py-4 border-t border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2 text-sm font-medium text-purple-700 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading || availableMembers.length === 0}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 border border-transparent rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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

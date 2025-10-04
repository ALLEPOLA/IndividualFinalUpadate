import type { Event } from '../../../services/eventService';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import chatService from '../../../services/chatService';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: number) => void;
  onPay?: (event: Event) => void;
}

export const EventCard = ({ event, onViewDetails, onEdit, onDelete, onPay }: EventCardProps) => {
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChatWithVendor = async () => {
    if (!event.vendor_id || !event.id) {
      alert('Unable to start chat. Missing vendor or event information.');
      return;
    }

    try {
      setIsChatLoading(true);
      
      console.log('Creating chat for:', { vendor_id: event.vendor_id, event_id: event.id });
      
      // Get or create chat for this event
      const chat = await chatService.getOrCreateChat({
        vendor_id: event.vendor_id,
        event_id: event.id
      });

      console.log('Chat created/found:', chat);

      // Open the chat window by dispatching a custom event
      window.dispatchEvent(new CustomEvent('openChat', { 
        detail: { chatId: chat.id, vendorName: event.vendor_name } 
      }));

    } catch (error: any) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setIsChatLoading(false);
    }
  };
  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const canEdit = event.status !== 'confirmed';
  const canDelete = event.status === 'pending';
  const canPay = event.status === 'confirmed' && (event.payment_status === 'pending' || event.payment_status === 'advance_paid');

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(event.date)}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {event.type}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {event.vendor_name}
              </span>
            </div>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Services:</p>
          <div className="flex flex-wrap gap-2">
            {event.services && Array.isArray(event.services) && event.services.length > 0 ? (
              <>
                {event.services.slice(0, 3).map((service) => (
                  <span
                    key={service.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {service.name}
                  </span>
                ))}
                {event.services.length > 3 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{event.services.length - 3} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-500">No services selected</span>
            )}
          </div>
        </div>

        {/* Pricing Information */}
        {event.total_amount && (
          <div className="mb-4 bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Total:</span>
                <p className="font-medium text-gray-900">${event.total_amount}</p>
              </div>
              <div>
                <span className="text-gray-600">Advance:</span>
                <p className="font-medium text-orange-600">${event.advance_amount}</p>
              </div>
            </div>
            {event.payment_status && (
              <div className="mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  event.payment_status === 'pending' ? 'bg-red-100 text-red-800' :
                  event.payment_status === 'advance_paid' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {event.payment_status === 'pending' ? 'Payment Pending' :
                   event.payment_status === 'advance_paid' ? 'Advance Paid' :
                   'Fully Paid'}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => onViewDetails(event)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </button>
          
          <div className="flex space-x-2">
            {/* Chat Button */}
            <button
              onClick={handleChatWithVendor}
              disabled={isChatLoading}
              className="inline-flex items-center px-3 py-1.5 border border-blue-300 shadow-sm text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              title={`Chat with ${event.vendor_name}`}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              {isChatLoading ? 'Opening...' : 'Chat'}
            </button>

            {canPay && onPay && (
              <button
                onClick={() => onPay(event)}
                className="inline-flex items-center px-3 py-1.5 border border-green-300 shadow-sm text-xs font-medium rounded text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pay
              </button>
            )}
            
            {canEdit && (
              <button
                onClick={() => onEdit(event)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
            
            {canDelete && (
              <button
                onClick={() => onDelete(event.id!)}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

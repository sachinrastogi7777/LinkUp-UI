import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageStatus = ({ status }) => {
    if (status === 'sent') {
        return <Check className="w-4 h-4 text-gray-400" />;
    }

    if (status === 'delivered') {
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
    }

    if (status === 'seen') {
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
    }

    return null;
};

export default MessageStatus;
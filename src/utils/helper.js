import axios from "axios";
import { BASE_URL } from "./constants";

const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const istTime = new Date(past.getTime());

    const diffMs = now.getTime() - istTime.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffMonth / 12);

    if (diffSec < 60) return `${diffSec} sec ago`;
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr} hr ago`;
    if (diffDay === 1) return `Yesterday`;
    if (diffDay < 30) return `${diffDay} days ago`;
    if (diffMonth < 12) return `${diffMonth} months ago`;
    return `${diffYear} years ago`;
}

const formattedDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Upload Image to Server
const uploadImageToServer = async (file, type) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    const response = await axios.post(`${BASE_URL}/upload-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    });
    return response.data.imageUrl;
}

const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const getLastSeen = (timestamp) => {
    const now = new Date();
    const lastSeenDate = new Date(timestamp);
    const diffInMs = now - lastSeenDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
        return 'Last seen just now';
    }
    if (diffInMinutes < 60) {
        return `Last seen ${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    if (diffInHours < 24) {
        return `Last seen ${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastSeenDate.toDateString() === yesterday.toDateString()) {
        return `Last seen yesterday`;
    }

    if (diffInDays < 7) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[lastSeenDate.getDay()];
        return `Last seen ${dayName}`;
    }

    const day = lastSeenDate.getDate().toString().padStart(2, '0');
    const month = (lastSeenDate.getMonth() + 1).toString().padStart(2, '0');
    const year = lastSeenDate.getFullYear();

    return `Last seen ${day}/${month}/${year}`;
};

const groupMessagesByDate = (messages) => {
    const groups = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    messages.forEach((message) => {
        const messageDate = new Date(message.createdAt || message.timeStamp);
        messageDate.setHours(0, 0, 0, 0);

        let dateLabel;

        if (messageDate.getTime() === today.getTime()) {
            dateLabel = 'Today';
        } else if (messageDate.getTime() === yesterday.getTime()) {
            dateLabel = 'Yesterday';
        } else {
            const day = messageDate.getDate().toString().padStart(2, '0');
            const month = (messageDate.getMonth() + 1).toString().padStart(2, '0');
            const year = messageDate.getFullYear();
            dateLabel = `${day}/${month}/${year}`;
        }

        if (!groups[dateLabel]) {
            groups[dateLabel] = [];
        }
        groups[dateLabel].push(message);
    });

    return groups;
};

export { getTimeAgo, formattedDate, uploadImageToServer, calculateAge, getLastSeen, groupMessagesByDate };
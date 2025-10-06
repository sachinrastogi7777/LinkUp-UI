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

export { getTimeAgo, formattedDate, uploadImageToServer };
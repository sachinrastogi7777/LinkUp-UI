import axios from "axios";
import { BASE_URL } from "./constants";

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

export { formattedDate, uploadImageToServer };
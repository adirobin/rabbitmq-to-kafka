
import axios from 'axios';

const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const getVesselData = async () => {
    try {
        const apiURL = `${backendUrl}/api/vessels`;
        console.log(apiURL);
        const response = await axios.get(apiURL);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const addVesselData = async (vesselData) => {
    const apiURL = `${backendUrl}/api/add-message-to-queue`;
    const response = await axios.post(apiURL, vesselData);
    console.log(response.data); // Log the server response
};

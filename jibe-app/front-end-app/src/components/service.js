import axios from 'axios';


const rootURL = process.env.ROOT_API_URL || 'http://localhost:3001/api';

export const getVesselData = async () => {
    try {
        const apiURL = `${rootURL}/vessels`;
        console.log(apiURL);
        const response = await axios.get(apiURL);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const addVesselData = async (vesselData) => {
    const apiURL = `${rootURL}/add-message-to-queue`;
    const response = await axios.post(apiURL, vesselData);
    console.log(response.data); // Log the server response
};

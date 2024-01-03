// AddVessel.js
import React, { useState } from 'react';
import axios from 'axios';
import {addVesselData} from "./service";

const AddVessel = () => {
    const [vesselData, setVesselData] = useState({
        name: '',
        type: '',
        length_meters: '',
        max_speed_knots: '',
        owner: '',
        flag: '',
        IMO_number: '',
        MMSI_number: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVesselData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send the vessel data to the server
            await addVesselData(vesselData);

            // Clear the form after successful submission
            setVesselData({
                name: '',
                type: '',
                length_meters: '',
                max_speed_knots: '',
                owner: '',
                flag: '',
                IMO_number: '',
                MMSI_number: '',
            });
        } catch (error) {
            console.error('Error submitting vessel data:', error);
        }
    };

    return (
        <div className="form-container">
            <h2>Add Vessel Record</h2>
            <form onSubmit={handleSubmit} className="form-component">
                <div className="form-group" >
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={vesselData.name} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="type">Type:</label>
                    <input type="text" id="type" name="type" value={vesselData.type} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="max_speed_knots">Max Speed (knots):</label>
                    <input type="text" id="max_speed_knots" name="max_speed_knots" value={vesselData.max_speed_knots} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="owner">Owner:</label>
                    <input type="text" id="owner" name="owner" value={vesselData.owner} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="flag">Flag:</label>
                    <input type="text" id="flag" name="flag" value={vesselData.flag} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="IMO_number">IMO Number:</label>
                    <input type="text" id="IMO_number" name="IMO_number" value={vesselData.IMO_number} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="MMSI_number">MMSI Number:</label>
                    <input type="text" id="MMSI_number" name="MMSI_number" value={vesselData.MMSI_number} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="length_meters">Length (meters):</label>
                    <input
                        type="text"
                        id="length_meters"
                        name="length_meters"
                        value={vesselData.length_meters}
                        onChange={handleChange}
                    />
                </div>

                {/* ... Repeat the above structure for the remaining form fields */}

                <button type="submit">Add Vessel</button>
            </form>
        </div>
    );
};

export default AddVessel;

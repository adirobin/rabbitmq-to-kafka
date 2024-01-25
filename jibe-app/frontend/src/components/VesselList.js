// VesselList.js
import React, { useState, useEffect } from 'react';
import { getVesselData } from "./service";

const VesselList = () => {
    const [vessels, setVessels] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getVesselData();
            setVessels(result);
        }
        fetchData();

    }, []); // Empty dependency array ensures that the effect runs only once on component mount

    const handleRefresh = () => {
        getVesselData().then((response) => {
            console.log(response);
            setVessels(response);
        }).catch((error) => {
            console.log(error);
        });

    };

    return (
        <div>
            <h2>Vessel List</h2>
            <button onClick={handleRefresh}>Refresh</button>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Length Meters</th>
                    <th>Max Speed Knots</th>
                    <th>Owner</th>
                    <th>Flag</th>
                    <th>IMO Number</th>
                    <th>MMSI Number</th>
                </tr>
                </thead>
                <tbody>
                {vessels && vessels.map((vessel) => (
                    <tr key={vessel.id}>
                        <td>{vessel.name}</td>
                        <td>{vessel.type}</td>
                        <td>{vessel.length_meters}</td>
                        <td>{vessel.max_speed_knots}</td>
                        <td>{vessel.owner}</td>
                        <td>{vessel.flag}</td>
                        <td>{vessel.imo_number}</td>
                        <td>{vessel.mmsi_number}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default VesselList;

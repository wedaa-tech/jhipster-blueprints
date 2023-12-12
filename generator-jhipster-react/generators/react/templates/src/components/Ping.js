import React, { useState } from 'react';
<%_ if (oauth2) { _%>
import { useAuth } from "react-oidc-context";
<%_ } _%>

const PingDropdown = ({ onDropdownChange }) => {
    const [selectedValue, setSelectedValue] = useState('');

    const handleDropdownChange = (event) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
        onDropdownChange(newValue);
    };

    return (
        <div className="dropdownContainer">
            <select
                id="pingDropdown"
                value={selectedValue}
                onChange={handleDropdownChange}
                className="pingDropdown"
            >
                <option value="" className="dropdownOption">Select an option</option>
            <%_ for (let i = 0; i < servicesWithOutDB.length ; i++) { _%>
                <option value="<%= servicesWithOutDB[i].toLowerCase() %>" className="dropdownOption"><%= servicesWithOutDB[i].toLowerCase() %></option>
            <%_ } _%>
            </select>
        </div>
    );
};

const Ping = () => {
    const [selectedService, setSelectedService] = useState('');
    const [responseData, setResponseData] = useState(null);
    <%_ if (oauth2) { _%>
    const auth = useAuth();
    <%_ } _%>

    const handleDropdownChange = (value) => {
        setSelectedService(value);
    };

    const handlePing = () => {
        if (selectedService) {
            // Make the API call using fetch
            let envString = "REACT_APP_MICROSERVICE_" + selectedService.toUpperCase();
            fetch( process.env[envString] + `/api/services/${selectedService}`, {
                method: 'GET',
                headers: {
                    <%_ if (oauth2) { _%>
                    'Authorization': `Bearer ${auth.user.access_token}`,
                    <%_ } _%>
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    // Set the response data in state
                    setResponseData(data.server);
                })
                .catch(error => {
                    // Handle errors
                    console.error('API Error:', error);
                });
        } else {
            console.error('Please select a service before pinging.');
            setResponseData("");
        }
    };

    return (
        <div className='container ping'>
            <h2 style={{ color: "black" }}> Ping your service</h2>
            <div className='select-service'>
                <h4 style={{ color: "black" }}>  Select Your service to be pinged</h4>
                <PingDropdown onDropdownChange={ handleDropdownChange } />
                <button className='ping-button' onClick={ handlePing }>
                    Ping
                </button>
                <div>
                    <label style={{ color: 'black' }}>Response body</label>
                    <div className='response-container'>
                        <h6>{responseData ? '{\n\t"server": "' + responseData + '"\n}' : 'No response yet'}</h6>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ping;
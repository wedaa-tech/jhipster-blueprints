'use client';
import {useState} from 'react';
<%_ if(oauth2) { _%>
    import { useSession } from 'next-auth/react';
<%_ } _%>

const Ping = ({servicesNameandUrl}) => {
    const [selectedService, setSelectedService] = useState('');
    const [responseData, setResponseData] = useState(null);
    <%_ if(oauth2) { _%>
        const authData = useSession();
        const {accessToken} = authData.data;
        
    <%_ } _%>

    const handleDropdownChange = (value) => {
        setSelectedService(value);
    };

    const handlePing = () => {
        if (selectedService) {
            // Make the API call using fetch
            let envString = servicesNameandUrl[selectedService];
            fetch( envString + `/api/services/`, {
                method: 'GET',
                headers: {
                    <%_ if(oauth2) { _%>
                        'Authorization':`Bearer ${accessToken}`,
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
                <PingDropdown onDropdownChange={ handleDropdownChange } servicesNameandUrl={servicesNameandUrl} />
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

const PingDropdown = ({ onDropdownChange,servicesNameandUrl }) => {
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
                {
                    Object.keys(servicesNameandUrl).map((serviceName)=>{
                        return <option key={serviceName} value={serviceName} className="dropdownOption"> {serviceName} </option>
                    })
                }
                
    
            </select>
        </div>
    );
};

export default Ping;
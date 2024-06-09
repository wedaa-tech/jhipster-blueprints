import Ping from '../../components/Ping.jsx'

function Page(){

    const servicesNameandUrl = {};
    
    <%_ for (let i = 0; i < servicesWithOutDB.length ; i++) { _%>
       servicesNameandUrl[ '<%= servicesWithOutDB[i].toLowerCase() %>'] = process.env['<%= servicesWithOutDB[i].toUpperCase() %>'];
    <%_ } _%>

    return(
        <Ping servicesNameandUrl={servicesNameandUrl} />
    )
}

export default Page;
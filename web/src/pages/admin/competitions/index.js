import { useEffect, useState } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { withAuthorization } from 'src/hocs/with-authorization';

import { Layout as EventsLayout } from 'src/layouts/play/layout';
import { EventsTable } from 'src/sections/admin/events/events-table';
import { EventsFilters } from 'src/sections/admin/events/events-filters';


const Page = () => {
    const [items, setItems] = useState([]);
    const [numberOfResults, setNumberOfResults] = useState(0);
    const [pagina, setPagina] = useState(0);

    useEffect(() => {
        const getEvents = async () => {
            const res = await axiosAuth.get('/api/events', {
                params: {
                    page: pagina + 1
                }
            }).then(res => res.data);
            setItems(res.results);
            setNumberOfResults(res.count);
        };
        getEvents();
    }, [pagina]);

    return (
        <EventsLayout
            buttonText="Crear competición"
            creationLink='/admin/competitions/create'
            title="Competiciones"
        >
            <EventsFilters setNumberOfResults={setNumberOfResults} setPreguntas={setItems} setPagina={setPagina} />
            <EventsTable
                setPagina={setPagina}
                pagina={pagina}
                numberOfResults={numberOfResults}
                eventos={items}
            />
        </EventsLayout>
    );
};

export default withAuthorization(Page, true);


import { useState, useEffect } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { withAuthorization } from 'src/hocs/with-authorization';
import { Layout as StatsLayout } from 'src/layouts/stats/layout';
import { ParticipationsTable } from 'src/sections/play/participaciones/participations-table'


const Page = () => {
    const [items, setItems] = useState([]);
    const [pagina, setPagina] = useState(0);
    const [numberOfResults, setNumberOfResults] = useState(0);

    useEffect(() => {
        const getBattles = async () => {
            const res = await axiosAuth.get('/api/stats/competitions/', {
                params: {
                    page: pagina + 1
                }
            }).then(res => res.data);
            setItems(res.results);
            setNumberOfResults(res.count);
        };
        getBattles();
    }, [pagina]);


    return (
        <StatsLayout
            title="Competiciones"
        >
            <ParticipationsTable
                setPagina={setPagina}
                pagina={pagina}
                numberOfResults={numberOfResults}
                participations={items}
            />
        </StatsLayout>
    );
};


export default withAuthorization(Page, true);


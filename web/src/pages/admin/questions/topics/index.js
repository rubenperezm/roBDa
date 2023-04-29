import { useState, useEffect } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { withAuthorization } from 'src/hocs/with-authorization';

import { Layout as QuestionsLayout } from 'src/layouts/questions/layout';
import { TopicsTable } from 'src/sections/admin/questions/topics/topics-table';
// import { TopicsFilters } from 'src/sections/admin/questions/topics/topics-filters';


const Page = () => {
    const [items, setItems] = useState([]);
    const [numberOfResults, setNumberOfResults] = useState(0);
    const [pagina, setPagina] = useState(0);

    useEffect(() => {
        const getTopics = async () => {
            const res = await axiosAuth.get('/api/questions/topics', {
                params: {
                    page: pagina + 1
                }
            }).then(res => res.data);
            setItems(res.results);
            setNumberOfResults(res.count);
        };

        getTopics();
    }, [pagina]);

    return (
        <QuestionsLayout
            buttonText="Crear tema"
            creationLink="/admin/questions/topics/create"
            title="Temas"
        >
            {/*<TopicsFilters setNumberOfResults={setNumberOfResults} setTemas={setItems} setPagina={setPagina} /> */}
            <TopicsTable
                setPagina={setPagina}
                pagina={pagina}
                numberOfResults={numberOfResults}
                temas={items}
            />
        </QuestionsLayout>
    );
};

export default withAuthorization(Page, true);


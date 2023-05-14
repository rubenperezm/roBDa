import { useEffect, useState } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { withAuthorization } from 'src/hocs/with-authorization';

import { Layout as QuestionsLayout } from 'src/layouts/questions/layout';
import { QuestionsTable } from 'src/sections/admin/questions/questions-table';
import { QuestionsFilters } from 'src/sections/admin/questions/questions-filters';


const Page = () => {
    const [items, setItems] = useState([]);
    const [numberOfResults, setNumberOfResults] = useState(0);
    const [pagina, setPagina] = useState(0);

    useEffect(() => {
        const getQuestions = async () => {
            const res = await axiosAuth.get('/api/questions', {
                params: {
                    page: pagina + 1
                }
            }).then(res => res.data);
            setItems(res.results);
            setNumberOfResults(res.count);
        };
        getQuestions();
    }, [pagina]);

    return (
        <QuestionsLayout
            buttonText="Crear pregunta"
            creationLink="/admin/questions/create"
            title="Preguntas"
        >
            <QuestionsFilters setNumberOfResults={setNumberOfResults} setPreguntas={setItems} setPagina={setPagina} />
            <QuestionsTable
                setPagina={setPagina}
                pagina={pagina}
                numberOfResults={numberOfResults}
                preguntas={items}
            />
        </QuestionsLayout>
    );
};


export default withAuthorization(Page, true);


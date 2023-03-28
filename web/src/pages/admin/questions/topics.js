import { useEffect, useState } from 'react';
import axiosAuth from 'src/utils/axiosAuth';

import { Layout as QuestionsLayout } from 'src/layouts/questions/layout';
import { TopicsTable } from 'src/sections/admin/questions/topics/topics-table';
// import { TopicsFilters } from 'src/sections/admin/questions/topics/topics-filters';


const Page = () => {
    const [items, setItems] = useState([]);
    const [numberOfResults, setNumberOfResults] = useState(0);
    const [pagina, setPagina] = useState(0);

    const getTopics = async () => {
        const res = await axiosAuth.get('/api/questions/topics', {
            params: {
                page: pagina + 1
            }
        }).then(res => res.data);
        setItems(res.results);
        setNumberOfResults(res.count);
        console.log(res)
    };

    // useEffect(() => {
    //     getTopics();
    // }, [pagina]);

    return (
        <>
            {/*<TopicsFilters setNumberOfResults={setNumberOfResults} setTemas={setItems} setPagina={setPagina} /> */}
            <TopicsTable
                setPagina={setPagina}
                pagina={pagina}
                numberOfResults={numberOfResults}
                temas={items}
                getTopics={getTopics}
            />
        </>
    );
};

Page.getLayout = (page) => (
    <QuestionsLayout
        buttonText="Crear tema"
        buttonOnClick={() => { /* TODO */ }}
    >
        {page}
    </QuestionsLayout>
);

export default Page;


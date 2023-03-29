import { useState } from 'react';
import axiosAuth from 'src/utils/axiosAuth';

import { Layout as QuestionsLayout } from 'src/layouts/questions/layout';
import { TopicsTable } from 'src/sections/admin/questions/topics/topics-table';
// import { TopicsFilters } from 'src/sections/admin/questions/topics/topics-filters';


const Page = () => {
    const [items, setItems] = useState([]);
    const [numberOfResults, setNumberOfResults] = useState(0);
    const [pagina, setPagina] = useState(0);
    const [openDialogCreate, setOpenDialogCreate] = useState(false);

    const getTopics = async () => {
        const res = await axiosAuth.get('/api/questions/topics', {
            params: {
                page: pagina + 1
            }
        }).then(res => res.data);
        setItems(res.results);
        setNumberOfResults(res.count);
    };

    // useEffect(() => {
    //     getTopics();
    // }, [pagina]);

    return (
        <QuestionsLayout
            buttonText="Crear tema"
            buttonOnClick={() => setOpenDialogCreate(true)}
        >
            {/*<TopicsFilters setNumberOfResults={setNumberOfResults} setTemas={setItems} setPagina={setPagina} /> */}
            <TopicsTable
                setPagina={setPagina}
                pagina={pagina}
                numberOfResults={numberOfResults}
                temas={items}
                getTopics={getTopics}
                openDialogCreate={openDialogCreate}
                setOpenDialogCreate={setOpenDialogCreate}
            />
        </QuestionsLayout>
    );
};

export default Page;


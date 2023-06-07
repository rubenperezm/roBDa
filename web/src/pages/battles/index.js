import { useState, useEffect } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { withAuthorization } from 'src/hocs/with-authorization';
import { Layout as BattlesLayout } from 'src/layouts/play/layout';
import { BattlesTable } from 'src/sections/play/battles/battles-table';


const Page = () => {
    const [items, setItems] = useState([]);
    const [pagina, setPagina] = useState(0);
    const [numberOfResults, setNumberOfResults] = useState(0);

    useEffect(() => {
        const getBattles = async () => {
            const res = await axiosAuth.get('/api/play/battles/', {
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
        <BattlesLayout
            buttonText="Crear duelo"
            creationLink="/battles/create"
            title="Duelos"
        >
            <BattlesTable
                setPagina={setPagina}
                pagina={pagina}
                numberOfResults={numberOfResults}
                battles={items}
            />
        </BattlesLayout>
    );
};


export default withAuthorization(Page, false);

